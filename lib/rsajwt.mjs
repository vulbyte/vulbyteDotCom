export default class RSAJWT {
	constructor() { }
	/*
	  // ===== Example Usage =====
	  // 1) Generate
	  const { publicJwk, privateJwk } = await RSAJWT.generateKeys();
	
	  // 2) Encode (creates signed JWT)
	  const payload = { some_json_data };
	  const token = await RSAJWT.encode(payload, privateJwk);
	  console.log("JWT token:", token);
	
	  // 3) Decode (verifies JWT signature)
	  const decoded = await RSAJWT.decode(token, publicJwk);
	*/
	// ---- Generate RSA key pair for JWT signing ----
	static async generateKeys() {
		const { pubKey, privKey } = await crypto.subtle.generateKey(
			{
				name: "RSASSA-PKCS1-v1_5",
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["sign", "verify"]
		);

		const publicJwk = await crypto.subtle.exportKey("jwk", pubKey);
		const privateJwk = await crypto.subtle.exportKey("jwk", privKey);

		// annotate for JWT
		publicJwk.alg = "RS256";
		publicJwk.use = "sig";
		publicJwk.key_ops = ["verify"];
		privateJwk.alg = "RS256";
		privateJwk.use = "sig";
		privateJwk.key_ops = ["sign"];

		return { publicJwk, privateJwk };
	}

	// ---- Encode payload into signed JWT ----
	static async encode(payload, pubKey, expirationDays = 90) {
		// Create JWT header
		const header = {
			alg: "RS256",
			typ: "JWT"
		};

		// Add standard JWT claims
		const now = Math.floor(Date.now() / 1000);
		const jwtPayload = {
			...payload,
			iat: now,
			exp: now + (expirationDays * 24 * 60 * 60),
			// Add a random jti (JWT ID) for uniqueness
			jti: crypto.randomUUID()
		};

		// Base64url encode header and payload
		const encodedHeader = this.#b64urlFromString(JSON.stringify(header));
		const encodedPayload = this.#b64urlFromString(JSON.stringify(jwtPayload));

		// Create signature input
		const signingInput = `${encodedHeader}.${encodedPayload}`;
		const signingInputBytes = this.#toUint8(signingInput);

		// Import private key for signing
		const privateKey = await crypto.subtle.importKey(
			"jwk",
			privateJwk,
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: "SHA-256",
			},
			false,
			["sign"]
		);

		// Sign the input
		const signatureBuffer = await crypto.subtle.sign(
			"RSASSA-PKCS1-v1_5",
			privateKey,
			signingInputBytes
		);

		// Base64url encode signature
		const signature = this.#b64urlFromBytes(new Uint8Array(signatureBuffer));

		// Return complete JWT
		return `${signingInput}.${signature}`;
	}

	// ---- Decode and verify JWT ----
	static async decode(token, privKey) {
		// Split JWT into parts
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new Error("Invalid JWT format");
		}

		const [encodedHeader, encodedPayload, encodedSignature] = parts;

		// Decode header and payload
		let header, payload;
		try {
			header = JSON.parse(this.#stringFromB64url(encodedHeader));
			payload = JSON.parse(this.#stringFromB64url(encodedPayload));
		} catch (err) {
			throw new Error("Invalid JWT encoding");
		}

		// Verify header algorithm
		if (header.alg !== "RS256" || header.typ !== "JWT") {
			throw new Error("Unsupported JWT algorithm or type");
		}

		// Check expiration
		const now = Math.floor(Date.now() / 1000);
		if (payload.exp && now > payload.exp) {
			throw new Error("JWT expired");
		}

		// Import public key for verification
		const publicKey = await crypto.subtle.importKey(
			"jwk",
			publicJwk,
			{
				name: "RSASSA-PKCS1-v1_5",
				hash: "SHA-256",
			},
			false,
			["verify"]
		);

		// Verify signature
		const signingInput = `${encodedHeader}.${encodedPayload}`;
		const signingInputBytes = this.#toUint8(signingInput);
		const signatureBytes = this.#b64urlToBytes(encodedSignature);

		const isValid = await crypto.subtle.verify(
			"RSASSA-PKCS1-v1_5",
			publicKey,
			signatureBytes,
			signingInputBytes
		);

		if (!isValid) {
			throw new Error("JWT signature verification failed");
		}

		// Return the payload (without JWT-specific claims if desired)
		return payload;
	}

	// ---- Helper methods ----
	static #toUint8(str) {
		return new TextEncoder().encode(str);
	}

	static #b64urlFromString(str) {
		return this.#b64urlFromBytes(this.#toUint8(str));
	}

	static #b64urlFromBytes(bytes) {
		let bin = "";
		for (let b of bytes) bin += String.fromCharCode(b);
		return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	}

	static #b64urlToBytes(b64url) {
		const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
		const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
		const bin = atob(b64 + "=".repeat(pad));
		return Uint8Array.from(bin, c => c.charCodeAt(0));
	}

	static #stringFromB64url(b64url) {
		const bytes = this.#b64urlToBytes(b64url);
		return new TextDecoder().decode(bytes);
	}
}
