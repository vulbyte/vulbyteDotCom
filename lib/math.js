// WARN: importing script needs to be a module

export default class Vath { //Vath = vulbyte math
	Lerp(a = "no_value_set", b = "no_value_set", t = 0.5) {
		if (isNaN(a) || isNaN(b) || isNaN()) {
			throw new Error(`WHY ARE YOU NOT PASSING NUMBERS TO LERP?!?!?!? values of a, b, and t are: ${a}, ${b}, ${t}`);
		}

		return a + (b - a) * t;
	}
}
