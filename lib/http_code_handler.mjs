export default class HttpCode {
	constructor() { }

	Respond(code, payload) {
		if (code === undefined) {
			return new Response("<html> Hello </html>", {
				status: 200,
				headers: { "content-type": "text/html" }
			});
		}
		if (payload === undefined) payload = "";

		const cors = {
			"content-type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS" //get, post, options, etc
		};

		let body = JSON.stringify({
			text: HttpCode.#statusText(code),
			payload
		});

		return new Response(body, {
			status: code,
			headers: cors
		});
	}

	static #statusText(code) {
		const map = {
			200: "OK",
			201: "Created",
			400: "Bad Request",
			401: "Unauthorized",
			403: "Forbidden",
			500: "Internal Server Error",
			503: "Service Unavailable"
		};
		return map[code] ?? `Unknown status ${code}`;
	}
}
