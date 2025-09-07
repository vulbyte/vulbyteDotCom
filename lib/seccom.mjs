import JWT from '/lib/jwt.mjs';

export default class Seccom {
	constructor(
		dbUrl = "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/secure_connection_test",
		privKey = localStorage.getItem("privKey"),
		pubKey = localStorage.getItem("pubKey"),
	) {
		this.dbUrl = dbUrl;

		// default fetch to get info
		if (!pubKey) {
			fetch(this.dbUrl, {
				method: "GET",
				action: "get_pub_key"
			})
		}
		if (!privKey) { }
	}
	static async send(data, secret) {
		const clientPrivateKey = JSON.parse(localStorage.getItem('clientPrivateKey') || 'null');
		if (!clientPrivateKey) {
			throw new Error('Client private key not found');
		}

		let jwt = await JWT.encode(clientPrivateKey, data, secret);

		return receive(fetch(this.dbUrl, { jwt }));
	}

	static async receive(token, secret) {
		const serverPublicKey = JSON.parse(localStorage.getItem('serverPublicKey') || 'null');
		if (!serverPublicKey) {
			throw new Error('Server public key not found');
		}

		return await JWT.decode(serverPublicKey, token, secret);
	}
}

