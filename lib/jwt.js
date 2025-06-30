export default class JWT {
	constructor() {
		this.secret = 'good_attempt_but_this_isnt_my_final_secret_dummy';
	}

	generateHeader() {
		let header = {
			"alg": "vulbyte1",
			"typ": "JWT"
		}

		return header;
	}

	//returns 1 string
	XorIntArr(string_a, key) {
		console.log('xoring: ', string_a, key = this.secret);

		if (Array.isArray(string_a) == false) {
			string_a = this.StrToIntArr(string_a);
		}
		if (Array.isArray(key) == false) {
			key = this.StrToIntArr(key);
		}

		let new_arr = [];
		for (let i = 0; i < string_a.length; ++i) {
			new_arr.push(string_a[i] ^ (key[i % key.length]));
		}

		for (let i = 0; i < new_arr.length; ++i) {
			new_arr[i] = String.fromCharCode(new_arr[i]);
		}

		console.log('returning: ', new_arr);
		return new_arr;
	}

	//returns array of of numbers from char. if only numbers will be converted to char before converting. ie: 123 -> 1, 2, 3
	StrToIntArr(str) {
		console.log('converting string to int arr');
		let new_arr = [];
		for (let i = 0; i < str.length; ++i) {
			new_arr.push(str.charCodeAt(i));
		}

		console.log('string: ', str, 'new arr: ', new_arr);
		return (new_arr);
	}

	//take array of nums, returns string
	IntArrToString(arr, options = {utf8: true}) {
		let new_arr = [];
		if (utf8 = true) {

		}

	}
}
