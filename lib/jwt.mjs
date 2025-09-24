class JWT {
	GenerateKeys() {
		window.crypto.subtle.sign({
			name: "RSASSA-PKCS11-v1_5",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]), //65537
			hash: { name: "SHA-256" },
		},
			true, //allow export
			["sign", "verify"]
		)
	}

	CreateJWT(privateKey) {
		const header = {
			alg: "RS256", // RSASSA-PKCS1-v1_5 with SHA-256
			typ: "JWT",
		};

		const payload = {
			action: "",
			username: "",
			iat: Math.floor(Date.now() / 1000), // issued at
		};

		const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
		const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

		const dataToSign = `${encodedHeader}.${encodedPayload}`;

		return;
	}
}
