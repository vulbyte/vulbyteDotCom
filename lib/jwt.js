export default class RSAJWT {
	// ---- Generate and export keys once (store them) ----
	static async generateKeys() {
		const { publicKey, privateKey } = await crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		);

		const publicJwk = await crypto.subtle.exportKey("jwk", publicKey);
		const privateJwk = await crypto.subtle.exportKey("jwk", privateKey);

		// annotate
		publicJwk.alg = "RSA-OAEP-256";
		publicJwk.key_ops = ["encrypt"];
		privateJwk.alg = "RSA-OAEP-256";
		privateJwk.key_ops = ["decrypt"];

		return { publicJwk, privateJwk };
	}

	// ---- Encode a payload into JWE compact string ----
	static async encode(payload, publicJwk) {
		// import public
		const publicKey = await crypto.subtle.importKey(
			"jwk",
			publicJwk,
			{ name: "RSA-OAEP", hash: "SHA-256" },
			false,
			["encrypt"]
		);

		const header = { alg: "RSA-OAEP-256", enc: "A256GCM", typ: "JWT" };
		const protectedHeaderB64 = this.#b64urlFromString(JSON.stringify(header));

		// random CEK + IV
		const cek = crypto.getRandomValues(new Uint8Array(32));
		const iv = crypto.getRandomValues(new Uint8Array(12));

		// encrypt CEK with RSA
		const encryptedKeyBuf = await crypto.subtle.encrypt(
			{ name: "RSA-OAEP" },
			publicKey,
			cek
		);
		const encryptedKeyB64 = this.#b64urlFromBytes(new Uint8Array(encryptedKeyBuf));

		// AES-GCM encrypt payload
		const aesKey = await crypto.subtle.importKey(
			"raw",
			cek,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt"]
		);

		const aad = this.#utf8(protectedHeaderB64);
		const plaintext = this.#toUint8(JSON.stringify(payload));

		const cipherBuf = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
			aesKey,
			plaintext
		);

		const ctTag = new Uint8Array(cipherBuf);
		const tag = ctTag.slice(ctTag.length - 16);
		const ciphertext = ctTag.slice(0, ctTag.length - 16);

		return [
			protectedHeaderB64,
			encryptedKeyB64,
			this.#b64urlFromBytes(iv),
			this.#b64urlFromBytes(ciphertext),
			this.#b64urlFromBytes(tag),
		].join(".");
	}

	// ---- Decode back to payload ----
	static async decode(token, privateJwk) {
		const [protectedHeaderB64, encryptedKeyB64, ivB64, ciphertextB64, tagB64] = token.split(".");

		const privateKey = await crypto.subtle.importKey(
			"jwk",
			privateJwk,
			{ name: "RSA-OAEP", hash: "SHA-256" },
			false,
			["decrypt"]
		);

		const cekBuf = await crypto.subtle.decrypt(
			{ name: "RSA-OAEP" },
			privateKey,
			this.#b64urlToBytes(encryptedKeyB64)
		);

		const aesKey = await crypto.subtle.importKey(
			"raw",
			new Uint8Array(cekBuf),
			{ name: "AES-GCM", length: 256 },
			false,
			["decrypt"]
		);

		const ctWithTag = this.#concatBytes(
			this.#b64urlToBytes(ciphertextB64),
			this.#b64urlToBytes(tagB64)
		);

		const plainBuf = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: this.#b64urlToBytes(ivB64), additionalData: this.#utf8(protectedHeaderB64), tagLength: 128 },
			aesKey,
			ctWithTag
		);

		return JSON.parse(new TextDecoder().decode(plainBuf));
	}

	// ---- helpers ----
	static #toUint8(str) { return new TextEncoder().encode(str); }
	static #utf8(str) { return new TextEncoder().encode(str); }
	static #b64urlFromString(str) { return this.#b64urlFromBytes(this.#toUint8(str)); }
	static #b64urlFromBytes(bytes) {
		let bin = ""; for (let b of bytes) bin += String.fromCharCode(b);
		return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	}
	static #b64urlToBytes(b64url) {
		const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
		const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
		const bin = atob(b64 + "=".repeat(pad));
		return Uint8Array.from(bin, c => c.charCodeAt(0));
	}
	static #concatBytes(a, b) {
		const out = new Uint8Array(a.length + b.length);
		out.set(a, 0); out.set(b, a.length);
		return out;
	}
}


/* 
// ===== Example Usage =====
import RSAJWE from './RSA-JWE.js';

(async () => {
  // 1) Generate JWT keypair (persist to storage if desired)
  const { publicKey, privateKey } = await RSAJWE.generateKeys();

  // 2) Encode (JWT compact token)
  const payload = { sub: "123", name: "Alice", iat: Math.floor(Date.now()/1000) };
  const token = await RSAJWE.encode(payload, publicKey);
  console.log("JWT token:", token);

  // 3) Decode
  const decoded = await RSAJWE.decode(token, privateKey);
  console.log("Decoded payload:", decoded);
})();
*/

/*
export default class RSAJWT {
	// ====== PUBLIC API ======
	static async generateKeys() {
		const { publicKey, privateKey } = await crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		);

		const publicJwk = await crypto.subtle.exportKey("jwk", publicKey);
		const privateJwk = await crypto.subtle.exportKey("jwk", privateKey);

		// Annotate alg/use for clarity when persisted
		publicJwk.alg = "RSA-OAEP-256";
		publicJwk.key_ops = ["encrypt"];
		privateJwk.alg = "RSA-OAEP-256";
		privateJwk.key_ops = ["decrypt"];

		console.log(`PUB: \n`, publicJwk);
		console.log(`PRIV: \n`, privateJwk);

		return { publicKey: publicJwk, privateKey: privateJwk };
	}

	static async encode(payload, publicJwk) {
		// 1) Import recipient public key for RSA-OAEP-256
		const publicKey = await crypto.subtle.importKey(
			"jwk",
			publicJwk,
			{ name: "RSA-OAEP", hash: "SHA-256" },
			false,
			["encrypt"]
		);

		// 2) Create protected header (typ is informational for JWT-style payloads)
		const header = { alg: "RSA-OAEP-256", enc: "A256GCM", typ: "JWT" };
		const protectedHeaderB64 = this.#b64urlFromString(JSON.stringify(header));

		// 3) Create CEK (content encryption key) and IV
		const cek = crypto.getRandomValues(new Uint8Array(32)); // 256-bit for A256GCM
		const iv = crypto.getRandomValues(new Uint8Array(12));  // 96-bit nonce for GCM

		// 4) Encrypt CEK with RSA-OAEP-256 -> encryptedKey
		const encryptedKeyBuf = await crypto.subtle.encrypt(
			{ name: "RSA-OAEP" },
			publicKey,
			cek
		);
		const encryptedKeyB64 = this.#b64urlFromBytes(new Uint8Array(encryptedKeyBuf));

		// 5) AES-GCM encrypt payload with CEK & IV -> ciphertext + tag
		const aesKey = await crypto.subtle.importKey(
			"raw",
			cek,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt"]
		);

		const aad = this.#utf8(protectedHeaderB64); // per JWE, AAD = ASCII of protected header (base64url)
		const plaintext = this.#toUint8(
			typeof payload === "string" ? payload : JSON.stringify(payload)
		);

		const cipherBuf = await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
			aesKey,
			plaintext
		);

		// WebCrypto returns ciphertext||tag; split last 16 bytes for tag
		const ctTag = new Uint8Array(cipherBuf);
		const tag = ctTag.slice(ctTag.length - 16);
		const ciphertext = ctTag.slice(0, ctTag.length - 16);

		const ivB64 = this.#b64urlFromBytes(iv);
		const ciphertextB64 = this.#b64urlFromBytes(ciphertext);
		const tagB64 = this.#b64urlFromBytes(tag);

		// 6) Compact serialization: header.encryptedKey.iv.ciphertext.tag
		return `${protectedHeaderB64}.${encryptedKeyB64}.${ivB64}.${ciphertextB64}.${tagB64}`;
	}

	static async decode(token, privateJwk) {
		const parts = token.split(".");
		if (parts.length !== 5) throw new Error("Invalid JWE compact token");

		const [protectedHeaderB64, encryptedKeyB64, ivB64, ciphertextB64, tagB64] = parts;

		const headerJson = this.#stringFromB64url(protectedHeaderB64);
		let header;
		try { header = JSON.parse(headerJson); } catch { throw new Error("Invalid JWE header JSON"); }

		if (header.alg !== "RSA-OAEP-256" || header.enc !== "A256GCM") {
			throw new Error(`Unsupported alg/enc: ${header.alg}/${header.enc}`);
		}

		// 1) Import recipient private key
		const privateKey = await crypto.subtle.importKey(
			"jwk",
			privateJwk,
			{ name: "RSA-OAEP", hash: "SHA-256" },
			false,
			["decrypt"]
		);

		// 2) Decrypt CEK
		const encryptedKey = this.#b64urlToBytes(encryptedKeyB64);
		const cekBuf = await crypto.subtle.decrypt(
			{ name: "RSA-OAEP" },
			privateKey,
			encryptedKey
		);
		const cek = new Uint8Array(cekBuf);

		// 3) AES-GCM decrypt ciphertext
		const aesKey = await crypto.subtle.importKey(
			"raw",
			cek,
			{ name: "AES-GCM", length: 256 },
			false,
			["decrypt"]
		);

		const iv = this.#b64urlToBytes(ivB64);
		const ciphertext = this.#b64urlToBytes(ciphertextB64);
		const tag = this.#b64urlToBytes(tagB64);

		// Concatenate ciphertext||tag for WebCrypto
		const ctWithTag = this.#concatBytes(ciphertext, tag);

		const aad = this.#utf8(protectedHeaderB64);

		const plainBuf = await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
			aesKey,
			ctWithTag
		);

		const text = this.#stringFromBytes(new Uint8Array(plainBuf));

		// Try JSON parse, otherwise return raw string
		try {
			return JSON.parse(text);
		} catch (_) {
			return text;
		}
	}

	// ====== PRIVATE HELPERS ======
	static #toUint8(str) { return new TextEncoder().encode(str); }
	static #utf8(str) { return new TextEncoder().encode(str); }
	static #stringFromBytes(bytes) { return new TextDecoder().decode(bytes); }

	static #b64urlFromString(str) { return this.#b64urlFromBytes(this.#toUint8(str)); }

	static #b64urlFromBytes(bytes) {
		// Use btoa when available; fallback to Buffer for Node
		let bin = "";
		for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
		const base64 = (typeof btoa === "function")
			? btoa(bin)
			: Buffer.from(bytes).toString("base64");
		return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	}

	static #stringFromB64url(b64url) {
		const bytes = this.#b64urlToBytes(b64url);
		return this.#stringFromBytes(bytes);
	}

	static #b64urlToBytes(b64url) {
		const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
		const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
		const base64 = b64 + "=".repeat(pad);
		if (typeof atob === "function") {
			const bin = atob(base64);
			const out = new Uint8Array(bin.length);
			for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
			return out;
		} else {
			return new Uint8Array(Buffer.from(base64, "base64"));
		}
	}

	static #concatBytes(a, b) {
		const out = new Uint8Array(a.length + b.length);
		out.set(a, 0);
		out.set(b, a.length);
		return out;
	}
}
*/

/* copied from supabase, here incase:
 * class RSAJWT {
  // ---- Generate and export keys once (store them) ----
  static async generateKeys() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
	name: "RSA-OAEP",
	modulusLength: 2048,
	publicExponent: new Uint8Array([1, 0, 1]),
	hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicJwk = await crypto.subtle.exportKey("jwk", publicKey);
    const privateJwk = await crypto.subtle.exportKey("jwk", privateKey);

    // annotate
    publicJwk.alg = "RSA-OAEP-256";
    publicJwk.key_ops = ["encrypt"];
    privateJwk.alg = "RSA-OAEP-256";
    privateJwk.key_ops = ["decrypt"];

    return { publicJwk, privateJwk };
  }

  // ---- Encode a payload into JWE compact string ----
  static async encode(payload, publicJwk) {
    // import public
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      publicJwk,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const header = { alg: "RSA-OAEP-256", enc: "A256GCM", typ: "JWT" };
    const protectedHeaderB64 = this.#b64urlFromString(JSON.stringify(header));

    // random CEK + IV
    const cek = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // encrypt CEK with RSA
    const encryptedKeyBuf = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      cek
    );
    const encryptedKeyB64 = this.#b64urlFromBytes(new Uint8Array(encryptedKeyBuf));

    // AES-GCM encrypt payload
    const aesKey = await crypto.subtle.importKey(
      "raw",
      cek,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const aad = this.#utf8(protectedHeaderB64);
    const plaintext = this.#toUint8(JSON.stringify(payload));

    const cipherBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: aad, tagLength: 128 },
      aesKey,
      plaintext
    );

    const ctTag = new Uint8Array(cipherBuf);
    const tag = ctTag.slice(ctTag.length - 16);
    const ciphertext = ctTag.slice(0, ctTag.length - 16);

    return [
      protectedHeaderB64,
      encryptedKeyB64,
      this.#b64urlFromBytes(iv),
      this.#b64urlFromBytes(ciphertext),
      this.#b64urlFromBytes(tag),
    ].join(".");
  }

  // ---- Decode back to payload ----
  static async decode(token, privateJwk) {
    const [protectedHeaderB64, encryptedKeyB64, ivB64, ciphertextB64, tagB64] = token.split(".");

    const privateKey = await crypto.subtle.importKey(
      "jwk",
      privateJwk,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["decrypt"]
    );

    const cekBuf = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      this.#b64urlToBytes(encryptedKeyB64)
    );

    const aesKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(cekBuf),
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const ctWithTag = this.#concatBytes(
      this.#b64urlToBytes(ciphertextB64),
      this.#b64urlToBytes(tagB64)
    );

    const plainBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: this.#b64urlToBytes(ivB64), additionalData: this.#utf8(protectedHeaderB64), tagLength: 128 },
      aesKey,
      ctWithTag
    );

    return JSON.parse(new TextDecoder().decode(plainBuf));
  }

  // ---- helpers ----
  static #toUint8(str) { return new TextEncoder().encode(str); }
  static #utf8(str) { return new TextEncoder().encode(str); }
  static #b64urlFromString(str) { return this.#b64urlFromBytes(this.#toUint8(str)); }
  static #b64urlFromBytes(bytes) {
    let bin = ""; for (let b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  static #b64urlToBytes(b64url) {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
    const bin = atob(b64 + "=".repeat(pad));
    return Uint8Array.from(bin, c => c.charCodeAt(0));
  }
  static #concatBytes(a, b) {
    const out = new Uint8Array(a.length + b.length);
    out.set(a, 0); out.set(b, a.length);
    return out;
  }
}*/
