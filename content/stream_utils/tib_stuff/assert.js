//i'm just really lazy and don't want to keep typing this
export function assert(condition, message = 'Assertion failed') {
	if (!condition) throw new Error(message);
}
