window.addEventListener('load', function() {
	console.log("load complete");

	//check for any depreciated tags and add the depreciated class to them

	//const d = document;

	//using a blacklist instead of a whitelist because custom tags can be added
	const bad_tags = [
		"acronym",
		"applet",
		"basefont",
		"big",
		"center",
		"dir",
		"font",
		"frame",
		"frameset",
		"noframes",
		"strike",
		"tt",
	];

	let elems;

	for (let i = 0; i < bad_tags.length; ++i) {
		elems = document.getElementsByTagName(bad_tags[i])

		for (
			let j = 0;
			j < elems.length;
			++j
		) {
			console.log("found " + document.getElementsByTagName(bad_tags[i]) + "elems");
			document.getElementsByTagName(bad_tags[i])[j].className = "DEPRECIATED";
		}
	}
});
