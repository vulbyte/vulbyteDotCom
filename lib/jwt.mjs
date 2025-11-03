/**
 * Browser-based Cryptography Utility (Requires a modern browser)
 * Uses the Web Crypto API (window.crypto.subtle) for secure operations.
 */

// --- 1. Utility Functions ---

/**
 * Converts a Base64URL string to an ArrayBuffer.
 * @param {string} base64UrlString
 * @returns {ArrayBuffer}
 */
function base64UrlToBuffer(base64UrlString) {
	let base64 = base64UrlString.replace(/-/g, '+').replace(/_/g, '/');
	while (base64.length % 4) {
		base64 += '=';
	}
	const raw = atob(base64);
	const rawLength = raw.length;
	const array = new Uint8Array(new ArrayBuffer(rawLength));
	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	return array.buffer;
}

/**
 * Converts an ArrayBuffer to a Base64URL string.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToBase64Url(buffer) {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

/**
 * Encodes a JSON object to a Base64URL string.
 * @param {object} obj
 * @returns {string}
 */
function jsonToBase64Url(obj) {
	const json = JSON.stringify(obj);
	const encoder = new TextEncoder();
	const buffer = encoder.encode(json);
	return bufferToBase64Url(buffer);
}

/**
 * Decodes a Base64URL string to a JSON object.
 * @param {string} base64UrlString
 * @returns {object}
 */
function base64UrlToJson(base64UrlString) {
	const buffer = base64UrlToBuffer(base64UrlString);
	const decoder = new TextDecoder();
	const json = decoder.decode(buffer);
	return JSON.parse(json);
}


// --- 2. Core Cryptographic Functions ---

/**
 * Generates a cryptographically strong secret phrase (Symmetric Key).
 * @param {number} bytes - The number of bytes of randomness (e.g., 32 for HS256).
 * @returns {string} - The secret as a Base64URL string.
 */
async function generateSecretPhrase(bytes = 32) {
	if (!window.crypto || !window.crypto.getRandomValues) {
		throw new Error('Web Crypto API not available.');
	}
	const randomBytes = new Uint8Array(bytes);
	window.crypto.getRandomValues(randomBytes);
	return bufferToBase64Url(randomBytes.buffer);
}

/**
 * Generates an Asymmetric Key Pair (RSA-PSS) for JWT signing.
 * @returns {Promise<{publicKey: CryptoKey, privateKey: CryptoKey}>}
 */
async function generateKeypair() {
	return window.crypto.subtle.generateKey(
		{
			name: 'RSASSA-PKCS1-V1_5',
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: 'SHA-256'
		},
		true, // Extractable
		['sign', 'verify']
	);
}

/**
 * Encodes and signs a JWT using HMAC-SHA256 (HS256).
 * @param {object} payload - The JWT claims.
 * @param {string} secretBase64Url - The secret phrase (Base64URL encoded).
 * @returns {Promise<string>} - The complete JWT string.
 */
async function encodeJwt(payload, secretBase64Url) {
	const header = { alg: 'HS256', typ: 'JWT' };
	const encodedHeader = jsonToBase64Url(header);
	const encodedPayload = jsonToBase64Url(payload);
	const unsignedToken = `${encodedHeader}.${encodedPayload}`;

	const secretBuffer = base64UrlToBuffer(secretBase64Url);
	const key = await window.crypto.subtle.importKey(
		'raw',
		secretBuffer,
		{ name: 'HMAC', hash: 'SHA-256' },
		false, // Not extractable
		['sign']
	);

	const encoder = new TextEncoder();
	const signature = await window.crypto.subtle.sign(
		'HMAC',
		key,
		encoder.encode(unsignedToken)
	);

	const encodedSignature = bufferToBase64Url(signature);
	return `${unsignedToken}.${encodedSignature}`;
}

/**
 * Decodes and verifies a JWT signed with HMAC-SHA256 (HS256).
 * @param {string} token - The complete JWT string.
 * @param {string} secretBase64Url - The secret phrase (Base64URL encoded).
 * @returns {Promise<object|null>} - The decoded payload object or null if verification fails.
 */
async function decodeJwt(token, secretBase64Url) {
	const parts = token.split('.');
	if (parts.length !== 3) return null;

	const [encodedHeader, encodedPayload, encodedSignature] = parts;
	const unsignedToken = `${encodedHeader}.${encodedPayload}`;

	const secretBuffer = base64UrlToBuffer(secretBase64Url);
	const key = await window.crypto.subtle.importKey(
		'raw',
		secretBuffer,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['verify']
	);

	const encoder = new TextEncoder();
	const signatureBuffer = base64UrlToBuffer(encodedSignature);

	const isValid = await window.crypto.subtle.verify(
		'HMAC',
		key,
		signatureBuffer,
		encoder.encode(unsignedToken)
	);

	if (isValid) {
		return base64UrlToJson(encodedPayload);
	} else {
		return null;
	}
}

// --- 3. Example Usage (for demonstration only, remove for production file) ---
/*
(async () => {
    try {
	console.log('--- 🔑 Generating Secret Phrase ---');
	const secret = await generateSecretPhrase();
	console.log('Secret Phrase (Base64URL):', secret);

	console.log('\n--- ✍️ Encoding JWT ---');
	const payload = { userId: 123, role: 'admin', iat: Date.now() / 1000 };
	const jwt = await encodeJwt(payload, secret);
	console.log('Generated JWT:', jwt);

	console.log('\n--- ✅ Decoding and Verifying JWT ---');
	const decodedPayload = await decodeJwt(jwt, secret);
	if (decodedPayload) {
	    console.log('Verification Successful! Decoded Payload:', decodedPayload);
	} else {
	    console.error('Verification Failed!');
	}
        
	console.log('\n--- 🔑 Generating Keypair (RSA-PSS) ---');
	const keyPair = await generateKeypair();
	console.log('Keypair generated successfully.');
	console.log('Public Key (Web Crypto Object):', keyPair.publicKey);
        
    } catch (error) {
	console.error('An error occurred:', error.message);
    }
})();
*/
