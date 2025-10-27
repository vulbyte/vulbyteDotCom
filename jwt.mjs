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

	}
	send() { }
	receive() { }
}
