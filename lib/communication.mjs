import RSAJWT from "/lib/rsajwt.mjs";
import Authenticate from "/lib/authenticate.mjs";

export default class SecCom {
	constructor(
		serverUrl = "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/secure_connection_test",
		keyConfig = {}
	) {
		this.serverUrl = serverUrl;
		this.keyConfig = {
			serverPublicKey: keyConfig.serverPublicKey || "seccom_serverPublicKey",
			clientPrivateKey: keyConfig.clientPrivateKey || "seccom_clientPrivateKey",
			clientPublicKey: keyConfig.clientPublicKey || "seccom_clientPublicKey",
			storage: keyConfig.storage || localStorage
		};

		this.serverPublicKey = null;
		this.clientPrivateKey = null;
		this.clientPublicKey = null;
		this.isReady = false;

		this.init();
	}

	async init() {
		try {
			// 1. Check for local keys
			const hasKeys = this.loadKeysFromStorage();

			if (hasKeys) {
				// 2. Verify existing keys with server
				const isValid = await this.verifyKeysWithServer();
				if (isValid) {
					this.isReady = true;
					return;
				}
			}

			// 3. No keys or invalid keys - wait for authentication
			await Authenticate();

			// 4. After authentication, try to verify keys again
			const hasKeysAfterAuth = this.loadKeysFromStorage();
			if (!hasKeysAfterAuth) {
				throw new Error("Authentication did not provide keys");
			}

			const isValidAfterAuth = await this.verifyKeysWithServer();
			if (!isValidAfterAuth) {
				throw new Error("Keys still invalid after authentication");
			}

			this.isReady = true;

		} catch (err) {
			throw new Error(`SecCom initialization failed: ${err.message}`);
		}
	}

	loadKeysFromStorage() {
		try {
			const serverKey = this.keyConfig.storage.getItem(this.keyConfig.serverPublicKey);
			const clientPriv = this.keyConfig.storage.getItem(this.keyConfig.clientPrivateKey);
			const clientPub = this.keyConfig.storage.getItem(this.keyConfig.clientPublicKey);

			if (serverKey && clientPriv && clientPub) {
				this.serverPublicKey = JSON.parse(serverKey);
				this.clientPrivateKey = JSON.parse(clientPriv);
				this.clientPublicKey = JSON.parse(clientPub);
				return true;
			}

			return false;
		} catch (err) {
			return false;
		}
	}

	async verifyKeysWithServer() {
		try {
			// Create test payload
			const testPayload = { action: "test_keys" };
			const jwt = await RSAJWT.encode(testPayload, this.clientPrivateKey);

			// Send to server
			const response = await fetch(this.serverUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(jwt)
			});

			return response.ok;

		} catch (err) {
			return false;
		}
	}

	async send(data) {
		if (!this.isReady) {
			throw new Error("SecCom not ready. Initialization may have failed.");
		}

		try {
			// Create JWT with data
			const jwt = await RSAJWT.encode(data, this.clientPrivateKey);

			// Send to server
			const response = await fetch(this.serverUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(jwt)
			});

			if (!response.ok) {
				throw new Error(`Server request failed: ${response.status}`);
			}

			const responseData = await response.json();

			// Return JWT response for local decoding
			return responseData.data || responseData;

		} catch (err) {
			throw new Error(`Send failed: ${err.message}`);
		}
	}
}
