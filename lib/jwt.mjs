export default class JWT {
	static async generateKeys() {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: 'RSA-PSS',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: 'SHA-256'
			},
			true,
			['sign', 'verify']
		);

		const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
		const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);

		return [publicKey, privateKey];
	}

	static async encode(privateKey, data, secret, iat = (90 * 24 * 60 * 60)) {
		const header = { alg: 'RS256', typ: 'JWT' };
		const payload = {
			...data,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + iat,
			ign: crypto.getRandomValues(new Uint8Array(16)).join(''),
			sec: btoa(secret).slice(0, 8)
		};

		const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
		const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');

		const key = await crypto.subtle.importKey(
			'jwk', privateKey,
			{ name: 'RSA-PSS', hash: 'SHA-256' },
			false, ['sign']
		);

		const signature = await crypto.subtle.sign(
			{ name: 'RSA-PSS', saltLength: 32 },
			key,
			new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
		);

		const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');

		return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
	}

	static async decode(publicKey, token, secret) {
		const [header, payload, signature] = token.split('.');

		const key = await crypto.subtle.importKey(
			'jwk', publicKey,
			{ name: 'RSA-PSS', hash: 'SHA-256' },
			false, ['verify']
		);

		const signatureBuffer = new Uint8Array(
			atob(signature).split('').map(c => c.charCodeAt(0))
		);

		const isValid = await crypto.subtle.verify(
			{ name: 'RSA-PSS', saltLength: 32 },
			key,
			signatureBuffer,
			new TextEncoder().encode(`${header}.${payload}`)
		);

		if (!isValid) {
			throw new Error('Invalid signature');
		}

		const data = JSON.parse(atob(payload));

		if (data.sec !== btoa(secret).slice(0, 8)) {
			throw new Error('Invalid secret');
		}

		if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
			throw new Error('Token expired');
		}

		return data;
	}
}
