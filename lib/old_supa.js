//create a deno response based on code + message. 
//not meant to be super extensible, meant to be a cute little thing to make code a bit more readable
export default class HttpCode {
	constructor() { }
	Respond(code, payload) {
		//quick check
		if (code == undefined) {
			return new Response("<html> Hello </html>", {
				status: 200,
				headers: {
					"content-type": "text/html"
				}
			});
		}
		if (payload == undefined) {
			payload = '';
		}
		//send the response
		cors = {
			"content-type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "POST, GET, OPTIONS"
		};

		let body;

		switch (code) {
      /* ------------------------------------------------------------------ */ /* 100‑series -------------------------------------------------------- */ case 100:
        /* Continue */ body = JSON.stringify({
			text: 'Continue',
			payload
		});
				return new Response(body, {
					status: 100,
					headers: {
						cors
					}
				});
			case 101:
        /* Switching Protocols */ body = JSON.stringify({
				text: 'Switching Protocols',
				payload
			});
				return new Response(body, {
					status: 101,
					headers: {
						cors
					}
				});
			case 102:
        /* Processing */ body = JSON.stringify({
				text: 'Processing',
				payload
			});
				return new Response(body, {
					status: 102,
					headers: {
						cors
					}
				});
			case 103:
        /* Early Hints */ body = JSON.stringify({
				text: 'Early Hints',
				payload
			});
				return new Response(body, {
					status: 103,
					headers: {
						cors
					}
				});
			case 104:
        /* Checkpoint */ body = JSON.stringify({
				text: 'Checkpoint',
				payload
			});
				return new Response(body, {
					status: 104,
					headers: {
						cors
					}
				});
			case 105:
        /* Retry With */ body = JSON.stringify({
				text: 'Retry With',
				payload
			});
				return new Response(body, {
					status: 105,
					headers: {
						cors
					}
				});
			case 106:
        /* Partial Content */ body = JSON.stringify({
				text: 'Partial Content',
				payload
			});
				return new Response(body, {
					status: 106,
					headers: {
						cors
					}
				});
      /* … add the rest of the 100‑series here … */ case 107:
        /* Multi Status */ body = JSON.stringify({
					text: 'Multi Status',
					payload
				});
				return new Response(body, {
					status: 107,
					headers: {
						cors
					}
				});
			case 108:
        /* Already Reported */ body = JSON.stringify({
				text: 'Already Reported',
				payload
			});
				return new Response(body, {
					status: 108,
					headers: {
						cors
					}
				});
			case 109:
        /* IM Used */ body = JSON.stringify({
				text: 'IM Used',
				payload
			});
				return new Response(body, {
					status: 109,
					headers: {
						cors
					}
				});
      /* ------------------------------------------------------------------ */ /* 200‑series -------------------------------------------------------- */ case 200:
        /* OK */ body = JSON.stringify({
					text: 'OK',
					payload
				});
				return new Response(body, {
					status: 200,
					headers: {
						cors
					}
				});
			case 201:
        /* Created */ body = JSON.stringify({
				text: 'Created',
				payload
			});
				return new Response(body, {
					status: 201,
					headers: {
						cors
					}
				});
			case 202:
        /* Accepted */ body = JSON.stringify({
				text: 'Accepted',
				payload
			});
				return new Response(body, {
					status: 202,
					headers: {
						cors
					}
				});
			case 203:
        /* Non‑Authoritative Information */ body = JSON.stringify({
				text: 'Non-Authoritative Information',
				payload
			});
				return new Response(body, {
					status: 203,
					headers: {
						cors
					}
				});
			case 204:
        /* No Content */ body = JSON.stringify({
				text: 'No Content',
				payload
			});
				return new Response(body, {
					status: 204,
					headers: {
						cors
					}
				});
			case 205:
        /* Reset Content */ body = JSON.stringify({
				text: 'Reset Content',
				payload
			});
				return new Response(body, {
					status: 205,
					headers: {
						cors
					}
				});
      /* … add the rest of the 200‑series here … */ case 206:
        /* Partial Content (again) */ body = JSON.stringify({
					text: 'Partial Content',
					payload
				});
				return new Response(body, {
					status: 206,
					headers: {
						cors
					}
				});
			case 207:
        /* Multi Status (RFC 4911) */ body = JSON.stringify({
				text: 'Multi Status',
				payload
			});
				return new Response(body, {
					status: 207,
					headers: {
						cors
					}
				});
			case 208:
        /* Already Reported (again) */ body = JSON.stringify({
				text: 'Already Reported',
				payload
			});
				return new Response(body, {
					status: 208,
					headers: {
						cors
					}
				});
      /* ------------------------------------------------------------------ */ /* 300‑series -------------------------------------------------------- */ case 300:
        /* Multiple Choices */ body = JSON.stringify({
					text: 'Multiple Choices',
					payload
				});
				return new Response(body, {
					status: 300,
					headers: {
						cors
					}
				});
			case 301:
        /* Moved Permanently */ body = JSON.stringify({
				text: 'Moved Permanently',
				payload
			});
				return new Response(body, {
					status: 301,
					headers: {
						cors
					}
				});
      /* … add the rest of the 300‑series here … */ case 302:
        /* Found */ body = JSON.stringify({
					text: 'Found',
					payload
				});
				return new Response(body, {
					status: 302,
					headers: {
						cors
					}
				});
			case 303:
        /* See Other */ body = JSON.stringify({
				text: 'See Other',
				payload
			});
				return new Response(body, {
					status: 303,
					headers: {
						cors
					}
				});
      /* ------------------------------------------------------------------ */ /* 400‑series -------------------------------------------------------- */ case 400:
        /* Bad Request */ body = JSON.stringify({
					text: 'Bad Request',
					payload
				});
				return new Response(body, {
					status: 400,
					headers: {
						cors
					}
				});
			case 401:
        /* Unauthorized */ body = JSON.stringify({
				text: 'Unauthorized',
				payload
			});
				return new Response(body, {
					status: 401,
					headers: {
						cors
					}
				});
      /* … add the rest of the 400‑series here … */ case 402:
        /* Accepted (again) */ body = JSON.stringify({
					text: 'Accepted',
					payload
				});
				return new Response(body, {
					status: 402,
					headers: {
						cors
					}
				});
			case 403:
        /* Forbidden */ body = JSON.stringify({
				text: 'Forbidden',
				payload
			});
				return new Response(body, {
					status: 403,
					headers: {
						cors
					}
				});
      /* ------------------------------------------------------------------ */ /* 500‑series -------------------------------------------------------- */ case 500:
        /* Internal Server Error */ body = JSON.stringify({
					text: 'Internal Server Error',
					payload
				});
				return new Response(body, {
					status: 500,
					headers: {
						cors
					}
				});
			case 501:
        /* Not Implemented */ body = JSON.stringify({
				text: 'Not Implemented',
				payload
			});
				return new Response(body, {
					status: 501,
					headers: {
						cors
					}
				});
      /* … add the rest of the 500‑series here … */ case 502:
        /* Bad Gateway */ body = JSON.stringify({
					text: 'Bad Gateway',
					payload
				});
				return new Response(body, {
					status: 502,
					headers: {
						cors
					}
				});
			case 503:
        /* Service Unavailable */ body = JSON.stringify({
				text: 'Service Unavailable',
				payload
			});
				return new Response(body, {
					status: 503,
					headers: {
						cors
					}
				});
      /* ------------------------------------------------------------------ */ /* default case ----------------------------------------------------- */ default:
				// If the caller passed a code that isn’t explicitly handled,
				// we fall back to an “Unknown” response.
				body = JSON.stringify({
					text: `Unknown status ${code}`,
					payload
				});
				return new Response(body, {
					status: code,
					headers: {
						cors
					}
				});
		}
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

class RSAJWT {
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


//=============================================================================================================================================
//============================================                       START                      ===============================================
//=============================================================================================================================================
//keys for testing:
const priv = {
	"alg": "RSA-OAEP-256",
	"d": "BRwCBwU1BW1FDlmDdql2pCvvic88W1o3XuPDBiHXLO4BiZKtypEWlllneMl_16MglPxzI0HGC5cHm1FkAHSqNyef7gO94qL1_eL6yZnfZbyL1iv-d7XexPY05SMlTPmeySF5rajk9NjZvmANy6RrPKBsXw-drtqlwg-sEVSluASsLudIkE_TJwqC46dTsvzGWN6jq5vigFGQkcAQOgAuXbvH8T8EUa1tQwSZDH7VLeRAdoEcwjfVPvnV_g6ocAqPhFEA8YqQGxc1EiMfsRkZffDDMakLcw0whTZpEBKNrJ0RgdcCtAHPCnjGccFYYt9eWIEkDk9L3-nuXakqvjFwLQ",
	"dp": "b9gFraKnfJ_WWCfSZ5a82MX3YcdpZhsT_83YDzo1AGBuvCV2QUkQSGowVIr4c97XWmxHBaeDhh1I-Dfl2XMqINZj1Qwxm-9KK2-8qSAJNILv7WsaOVztHfTvmyzsePZ8zkc8U9Z448kg9CtG83JZnsqof2xqdSFjugDjYNu5lSU",
	"dq": "lafFNtoipmJHzrp3z3QR4X_Ed6jJuaRrPb4-KmTuCpfcukXnpqYxFmqADAPlSoBJwamHGxcddxuUvl-HON06kuKFZpUOogutg5tbwSHchw67WqxZVOuXL-NblXvx4rzCXUh3Vijeobw6FpIBFjcsk7IkNIG2WVOuTM3LsoYze30",
	"e": "AQAB",
	"ext": true,
	"key_ops": [
		"decrypt"
	],
	"kty": "RSA",
	"n": "0xZmX04PYSSabnmKpwPQfu_C9TR5jyCpTZcymhgz33wRXGWsZE3c8aLNTeMpOjLsYkja_zuLKrk9ipHiSBUWZwqOma_VImcPk0e0_7rgQMHocnGbJQKbDrxAcgweyfqwj8bJlV4TUt0Tgmo27V5VRNqPVBN8SJDotulENbFqq8bkse8EpSsExSVO33Yt-U4adSpvm4EJz3XwIzRa530ZEmC5NL-h_Fl2ZcYDfWV-QYVNzpxdru49SrePkoYmODQnk_px6f-9yndypr99bahY25JLcHBZz0-7wDST-NZpJXJ_5sQIsrQqzbZXwkFxzw9MIj9m3WM6b7VKquOtRGPTHQ",
	"p": "8pFSGwLFdDXFI1h74t3ldlcxWrjy4bEpnu3aMOsToCVErVWIzvn_km4a_0yk4n7MhO-YDQAPkWY_HEk_XQL-1Law4sXJnMCZH_0WJws4LCf041cajfIglwSsNxItbLfI30hJSjgw4mIB-fhVhSua0qT9fjhewurPlk-20ZWDeOs",
	"q": "3sbPq-RIten2lgKqkb12vA73isI-awD4ayO2sP7f3WzKOdxDGvrA6d3ewRiCzJhfAENotDNEGoV1jPZwLiv0yjJbe-c8etIkcVKlp0DMLDYFeVod8RK2ZNetb307_SeO7Twdz13dwTGxGTmTW8sIQxJK6Ml8ZSRRFWkTS5FeYhc",
	"qi": "FTqIuOKMrZ-zB5oJoqVzWxBhmHtqLxbWSxFJDsdcZIwPNShFUhSdqzsAEOzPz_jMRchg8WF6QuGlksltMKSU0gvksCqeCxO7Yv_e0GV3z1Rsg99hqgS7vj2YOe1G6eGz_A5eb2UsrrFTt_i1t8RbZVC59RwcmzbjAccr3eHf7q8"
}

const pub = {
	"alg": "RSA-OAEP-256",
	"e": "AQAB",
	"ext": true,
	"key_ops": [
		"encrypt"
	],
	"kty": "RSA",
	"n": "0xZmX04PYSSabnmKpwPQfu_C9TR5jyCpTZcymhgz33wRXGWsZE3c8aLNTeMpOjLsYkja_zuLKrk9ipHiSBUWZwqOma_VImcPk0e0_7rgQMHocnGbJQKbDrxAcgweyfqwj8bJlV4TUt0Tgmo27V5VRNqPVBN8SJDotulENbFqq8bkse8EpSsExSVO33Yt-U4adSpvm4EJz3XwIzRa530ZEmC5NL-h_Fl2ZcYDfWV-QYVNzpxdru49SrePkoYmODQnk_px6f-9yndypr99bahY25JLcHBZz0-7wDST-NZpJXJ_5sQIsrQqzbZXwkFxzw9MIj9m3WM6b7VKquOtRGPTHQ"
}

const http = new HttpCode;
const rsajwt = new RSAJWT;
Deno.serve(async (req) => {
	headers.set("Access-Control-Allow-Origin", "*");

	let body;
	try {
		body = await req.json();  // wait for JSON body
	} catch (err) {
		console.error("ERROR PARSING BODY", err);
		return http.Respond(400, {
			message: "encryption needed for processing",
			key: pub
		});
	}

	let payload;
	try {
		// assume client sends { jwt: "..." }
		payload = await rsajwt.decode(body.jwt, priv);
	}
	catch (err) {
		console.error("MALFORMED REQUEST", err);
		return http.Respond(400, { message: "malformed request", error: err.message });
	}

	return http.Respond(200, {
		message: "successful call!",
		payload
	});
});
