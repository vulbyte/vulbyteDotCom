function LSGI(id) {
	try {
		return localStorage.getItem(id)
	}
	catch (err) {
		throw new Error(err);
	}
}

// ===================== networking.js =====================
export default class Networking {
	constructor() {
		this.urls = {
			signIn: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-credentials",
			verifyAuthCode: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-auth-code",
			dbCommunication: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-jwt-and-proxy",
		};
		this.params = {
			username: LSGI("username") || undefined,
			password: LSGI("password") || undefined,
			serverJWT: LSGI("serverJWT") || undefined,
		};
	}

	// helper for saving to local storage securely (assuming you have your own LSSI)
	SaveParam(key, value) {
		try {
			if (value !== undefined && value !== null) LSSI(key, value);
		} catch (err) {
			console.error("Error saving param:", key, err);
		}
	}

	// ================= SIGN IN =================
	async SignIn(username = this.params.username, password = this.params.password) {
		if (!username || !password) throw new Error("Missing credentials");

		const payload = { username, password };
		const response = await this.#SecureFetch(this.urls.signIn, payload);
		if (!response.ok) throw new Error("Sign-in request failed");

		const data = await response.json();

		// Expecting server to send something like { auth_required: true } or { serverJWT: "..." }
		if (data.serverJWT) {
			this.SaveParam("serverJWT", data.serverJWT);
			return { success: true, jwt: data.serverJWT };
		}

		return data;
	}

	// ================= VERIFY AUTH CODE =================
	async EnterAuthCode(authCode, username = this.params.username, password = this.params.password) {
		if (!authCode || !username || !password) throw new Error("Missing auth data");

		const payload = { username, password, authCode };
		const response = await this.#SecureFetch(this.urls.verifyAuthCode, payload);
		if (!response.ok) throw new Error("Auth code verification failed");

		const data = await response.json();
		if (data.serverJWT) {
			this.SaveParam("serverJWT", data.serverJWT);
			return { success: true, jwt: data.serverJWT };
		}

		return data;
	}

	// ================= GENERIC REQUEST =================
	async Request(endpoint = this.urls.dbCommunication, body = {}, serverJWT = this.params.serverJWT) {
		if (!serverJWT) throw new Error("Missing server JWT — not authenticated");

		const headers = {
			"Authorization": `Bearer ${serverJWT}`,
			"Content-Type": "application/json",
		};

		const response = await fetch(endpoint, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new Error(`Request failed: ${response.status} - ${errText}`);
		}

		const data = await response.json();
		return data;
	}

	// ================= DECODE JWT =================
	Decode(jwt = this.params.serverJWT) {
		if (!jwt) throw new Error("No JWT provided");
		const parts = jwt.split(".");
		if (parts.length !== 3) throw new Error("Invalid JWT");

		const payload = atob(parts[1]);
		try {
			return JSON.parse(payload);
		} catch (err) {
			console.error("Failed to parse JWT payload:", err);
			return null;
		}
	}

	// ================= PRIVATE HELPERS =================
	async #SecureFetch(url, payload, headers = {}) {
		const defaultHeaders = {
			"Content-Type": "application/json",
		};

		const mergedHeaders = { ...defaultHeaders, ...headers };

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: mergedHeaders,
				body: JSON.stringify(payload),
			});
			return response;
		} catch (err) {
			console.error("Network error:", err);
			throw new Error("Failed to reach server");
		}
	}
}
