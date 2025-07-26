export default class RSAish {
	constructor() { }
	async encryptData(plainText) {
		// Generate a key pair
		const keyPair = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		);
		// Convert the plain text to an ArrayBuffer
		const encoder = new TextEncoder();
		const data = encoder.encode(plainText);
		// Encrypt the data
		const encryptedData = await window.crypto.subtle.encrypt(
			{
				name: "RSA-OAEP",
			},
			keyPair.publicKey, // Use the public key for encryption
			data // Data to encrypt
		);
		return encryptedData; // Return the encrypted data
	}
	async decryptData(encryptedData, privateKey) {
		// Decrypt the data using the private key
		const decryptedData = await window.crypto.subtle.decrypt(
			{
				name: "RSA-OAEP",
			},
			privateKey, // Use the private key for decryption
			encryptedData // Data to decrypt
		);
		// Convert the decrypted ArrayBuffer back to a string
		const decoder = new TextDecoder();
		return decoder.decode(decryptedData);
	}
}
