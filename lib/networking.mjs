export default class Networking {
	// NOTE: should catch errors, only error if critical state failure
	// PRIVATE (assist functions)
	#LSGI(id) {
		let item = localStorage.getItem(id);
		if (item = undefined) {
			throw new Error("item is undefined")
		}
	}

	/**
	* throws error, or returns payload from response as json
	*/
	async #SendProtectedPayload(endpointUrl, dataPayload, accessToken) {
		if (endpointUrl == undefined) {
			throw new Error("endpointUrl for payload is undefined");
		}
		if (dataPayload == undefined) {
			throw new Error("dataPayload for payload is undefined");
		}
		if (accessToken == undefined) {
			throw new Error("accessToken for payload is undefined");
		}

		try {
			const response = await fetch(endpointUrl, {
				method: 'POST',
				headers: {
					// 1. Tell the server the body is JSON
					'Content-Type': 'application/json',
					// 2. Authorize the request with the JWT
					'Authorization': `Bearer ${accessToken}`,
				},
				// 3. The payload is simply stringified JSON
				body: JSON.stringify(dataPayload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Request failed with status: ${response.status}`);
			}

			console.log("Payload sent and processed successfully.");
			return response.json();

		} catch (error) {
			console.error("Error sending protected payload:", error.message);
		}
	}
	// PUBLIC (take a guess) 
	constructor() { // check local storage

	}
	URLS = {
		userAuth: "https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/user_auth",
		codeAuth: "",
	}
	Send(url, data) {
		if (url)
	}

	Receive() { }

	UserAuth(username, password) {
		//quick check
		if (username == undefined || password == undefined) {
			throw new Error("username is undefined!");
		}
		if (password == undefined) {
			throw new Error("password is undefined!");
		}

		fetch(URLS.userAuth, {
			method: 'POST', // 1. Tell the server it's a POST request
			headers: {
				// 2. Tell the server the body is JSON
				'Content-Type': 'application/json',
			},
			// 3. Stringify the data and assign it to the 'body' property
			body: JSON.stringify({
				username: username,
				password: password
			}),
		})
			.then((res) => {
				// 4. IMPORTANT: Call .json() on the response, don't use JSON.parse()
				return res.json();
			})
			.then((data) => {
				console.log(data); // This logs the parsed JSON object
			})
			.catch((error) => {
				console.error("Fetch Error:", error);
			});
	}
}
