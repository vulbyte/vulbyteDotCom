export function CHE(args = { //returns HTML element
	"class": undefined,
	"id": undefined,
	"innerHTML": undefined,
	"innerText": undefined,
	"style": undefined,
	"type": undefined,
	"onClick": undefined,
}) {
	try {
		if (args.type == undefined) args.type == "div";
		let elem = document.createElement(args.type);

		if (args.class != undefined) elem.className = args.class;
		if (args.id != undefined) elem.id = args.id;
		if (args.innerHTML != undefined) elem.innerHTML = args.innerHTML;
		if (args.innerText != undefined) elem.innerText = args.innerText;
		if (args.style != undefined) elem.style = args.style;
		if (args.onClick != undefined) {
			elem.addEventListener(
				"click",
				args.onClick
			)
		}

		return (elem);
	}
	catch (err) {
		console.warn(err);
	}
};
