export default class JWT {
	// PRIVATE (assist functions)
	// NOTE: will throw errors
	#LEGI(id) {
		let item = localStorage.getItem(id);
		if (item = undefined) {
			throw new Error("item is undefined")
		}
	}

	// PUBLIC (take a guess) 
	// NOTE: should catch errors, only error if critical state failure
	constructor() { // check local storage
		const jwt = import("https://cdn.jsdelivr.net/npm/jsonwebtoken-esm@1.0.3/+esm");
	}

	create(payload) {
		if (typeof (payload) != Object) {
			throw new Error("paylaod is not a map");
		}

		const token = jwt.sign(payload, "secret", { expiresIn: "1h" });
	}
}
