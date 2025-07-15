class RSACrypto {
	constructor() {
		this.publicKey = null;
		this.privateKey = null;
	}

	/**
	 * Generate a new RSA key pair
	 * @param {number} keySize - Key size in bits (default: 2048)
	 * @returns {Promise<{publicKey: CryptoKey, privateKey: CryptoKey}>}
	 */
	async generateKeyPair(keySize = 2048) {
		try {
			const keyPair = await window.crypto.subtle.generateKey(
				{
					name: "RSA-OAEP",
					modulusLength: keySize,
					publicExponent: new Uint8Array([1, 0, 1]),
					hash: "SHA-256"
				},
				true, // extractable
				["encrypt", "decrypt"]
			);

			this.publicKey = keyPair.publicKey;
			this.privateKey = keyPair.privateKey;

			return keyPair;
		} catch (error) {
			throw new Error(`Failed to generate key pair: ${error.message}`);
		}
	}

	/**
	 * Import a public key from PEM format
	 * @param {string} pemKey - PEM formatted public key
	 */
	async importPublicKey(pemKey) {
		try {
			const keyData = this.pemToArrayBuffer(pemKey, 'PUBLIC KEY');
			this.publicKey = await window.crypto.subtle.importKey(
				"spki",
				keyData,
				{
					name: "RSA-OAEP",
					hash: "SHA-256"
				},
				true,
				["encrypt"]
			);
		} catch (error) {
			throw new Error(`Failed to import public key: ${error.message}`);
		}
	}

	/**
	 * Import a private key from PEM format
	 * @param {string} pemKey - PEM formatted private key
	 */
	async importPrivateKey(pemKey) {
		try {
			const keyData = this.pemToArrayBuffer(pemKey, 'PRIVATE KEY');
			this.privateKey = await window.crypto.subtle.importKey(
				"pkcs8",
				keyData,
				{
					name: "RSA-OAEP",
					hash: "SHA-256"
				},
				true,
				["decrypt"]
			);
		} catch (error) {
			throw new Error(`Failed to import private key: ${error.message}`);
		}
	}

	/**
	 * Export public key to PEM format
	 * @returns {Promise<string>}
	 */
	async exportPublicKey() {
		if (!this.publicKey) {
			throw new Error("No public key available");
		}

		try {
			const exported = await window.crypto.subtle.exportKey("spki", this.publicKey);
			return this.arrayBufferToPem(exported, 'PUBLIC KEY');
		} catch (error) {
			throw new Error(`Failed to export public key: ${error.message}`);
		}
	}

	/**
	 * Export private key to PEM format
	 * @returns {Promise<string>}
	 */
	async exportPrivateKey() {
		if (!this.privateKey) {
			throw new Error("No private key available");
		}

		try {
			const exported = await window.crypto.subtle.exportKey("pkcs8", this.privateKey);
			return this.arrayBufferToPem(exported, 'PRIVATE KEY');
		} catch (error) {
			throw new Error(`Failed to export private key: ${error.message}`);
		}
	}

	/**
	 * Encrypt data using the public key
	 * @param {string} data - Data to encrypt
	 * @param {string} [customPublicKey] - Optional PEM public key to use instead of stored key
	 * @returns {Promise<string>} - Base64 encoded encrypted data
	 */
	async encrypt(data, customPublicKey = null) {
		let keyToUse = this.publicKey;

		if (customPublicKey) {
			await this.importPublicKey(customPublicKey);
			keyToUse = this.publicKey;
		}

		if (!keyToUse) {
			throw new Error("No public key available for encryption");
		}

		try {
			const encodedData = new TextEncoder().encode(data);
			const encrypted = await window.crypto.subtle.encrypt(
				{
					name: "RSA-OAEP"
				},
				keyToUse,
				encodedData
			);

			return this.arrayBufferToBase64(encrypted);
		} catch (error) {
			throw new Error(`Encryption failed: ${error.message}`);
		}
	}

	/**
	 * Decrypt data using the private key
	 * @param {string} encryptedData - Base64 encoded encrypted data
	 * @param {string} [customPrivateKey] - Optional PEM private key to use instead of stored key
	 * @returns {Promise<string>} - Decrypted plaintext
	 */
	async decrypt(encryptedData, customPrivateKey = null) {
		let keyToUse = this.privateKey;

		if (customPrivateKey) {
			await this.importPrivateKey(customPrivateKey);
			keyToUse = this.privateKey;
		}

		if (!keyToUse) {
			throw new Error("No private key available for decryption");
		}

		try {
			const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
			const decrypted = await window.crypto.subtle.decrypt(
				{
					name: "RSA-OAEP"
				},
				keyToUse,
				encryptedBuffer
			);

			return new TextDecoder().decode(decrypted);
		} catch (error) {
			throw new Error(`Decryption failed: ${error.message}`);
		}
	}

	// Helper methods
	pemToArrayBuffer(pem, label) {
		const pemHeader = `-----BEGIN ${label}-----`;
		const pemFooter = `-----END ${label}-----`;
		const pemContents = pem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
		return this.base64ToArrayBuffer(pemContents);
	}

	arrayBufferToPem(buffer, label) {
		const base64 = this.arrayBufferToBase64(buffer);
		const pemHeader = `-----BEGIN ${label}-----`;
		const pemFooter = `-----END ${label}-----`;
		const pemContents = base64.match(/.{1,64}/g).join('\n');
		return `${pemHeader}\n${pemContents}\n${pemFooter}`;
	}

	base64ToArrayBuffer(base64) {
		const binaryString = window.atob(base64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	arrayBufferToBase64(buffer) {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}
}
