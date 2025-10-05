class Networking {
	constructor() { // should take in no state
		this.urls = {
			signIn: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-credentials",
			verifyAuthCode: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-auth-code",
			dbCommunication: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/verify-jwt-and-proxy"
		}
		this.params = {
			username: LSGI("username") || undefined,
			password: LSGI("password") || undefined,
			server_token: LSGI("server_jwt") || undefined,
		};
	}

	SignIn(username = this.params.username, password = this.params.password) {
		if (username == undefined || password == undefined) {
			throw new Error(`username(${username} or password(${password}) is undefined`);
		}

		//update local if changed
		localStorage.setItem("username", username);
		localStorage.setItem("password", password);

		try {
			const url = this.urls.signIn;
			url.search = new URLSearchParams(params).toString();

			let data = await fetch(url).json();

			if (data.status != 200) {
				throw new Error(data.message);
			};

			return;
		}
		catch (err) {
			console.error(err);
		}
	}

	EnterAuthCode() {

	}

	SendClientJWT() {

	}
}
