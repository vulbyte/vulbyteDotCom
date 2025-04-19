/**
 * this is a simple popup for confirm/deny dialog,
 * this is not meant for anything past a binary option
 * this has support for function passing so you can do a thing on confirm
 *
 * @constructor 
 * @param {string} title - title of element, in an "h2" tag.
 * @param {string} message - layman info relating to popup, in a "p" element.
 * @param {string} error - technical information relating to popup, in a "code" element.
 * @param {string} promt - the option that will appear in the confirm "button".
 * @param {string} promt_function - the fn that will run after clicking on the confirm button.
 */
export default function PopUp(args = {
	"title": undefined,
	"message": undefined,
	"error": undefined,
	"prompt": undefined,
	"prompt_function": undefined,
}) {
	const d = document;
	function CE(args = { //returns HTML element
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
				//if (typeof args.onConfirm == 'function') {
				elem.addEventListener(
					"click",
					args.onClick
				)
				//}
				//else {
				//console.warn("onclick is NOT a function, cannot bind!");;
				//}
			}

			return (elem);
		}
		catch (err) {
			console.warn(err);
		}
	};

	let rng_num = String(Math.random());
	let popup_id = rng_num.slice(2, rng_num.length);

	let container = CE({
		"class": "popup_container",
		"type": "div",
		"id": `popup_${popup_id}`,
	});
	container.style.position = "absolute";
	container.style.backgroundColor = "purple";
	container.style.color = "white";
	container.style.fontFamily = "sans-serif";
	container.style.height = "60vh";
	container.style.width = "60vw";
	container.style.padding = "1em";
	container.style.boxShadow = "0px 0px 30em black";

	requestAnimationFrame(() => {
		console.warn("DOING THINGS AFTER APPEND");

		const rect = container.getBoundingClientRect();

		container.style.position = "absolute"; // Ensure positioning works
		container.style.left = `${(window.innerWidth - rect.width) / 2}px`;
		container.style.top = `${(window.innerHeight - rect.height) / 2}px`;
	});


	//{{{2 // the bulk of the execution
	if (args.title != undefined) {
		container.appendChild(
			CE({
				"class": "popup_title",
				"type": "h2",
				"innerText": args.title,
				"style": "font- family: sans-serif; font-weight: bold; margin:auto;"
			})
		);
	}
	if (args.message != undefined) {
		container.appendChild(
			CE({
				"class": "popup_message",
				"type": "p",
				"innerText": args.message,
				"style": ""
			})
		);
	}
	//err
	if (args.error != undefined) {
		container.appendChild(
			CE({
				"class": "popup_error",
				"type": "code",
				"innerText": args.error,
			})
		);
	}
	//promt
	let popup_container = CE({
		"class": "popup_prompt_container",
		"type": "div",
		"style": "diplay: flex;	flex-direction:row; justify-content:space-evenly;"
	});
	if (args.prompt != undefined) {
		if (args.prompt_function != undefined) { //confirm/deny
			console.log("creating confirm/deny for popup");
			let deny = CE({
				"class": "popup_deny",
				"type": "button",
				"innerText": "cancel",
				"onClick": (function(e) {
					deny.parentNode.parentNode.remove();
				})
			});
			let confirm = CE({
				"class": "popup_confirm",
				"type": "button",
				"innerText": args.prompt,
				"onClick": (function(e) {
					//do function
					args.prompt_function();
					confirm.parentNode.parentNode.remove();
				})
			});
			popup_container.appendChild(deny);
			popup_container.appendChild(confirm);

		}
		else {//confirm no deny
			console.log("creating confirm NO DENY for popup");
			let confirm = CE({
				"class": "popup_confirm",
				"type": "button",
				"innerText": args.prompt,
				"onClick": ((e) => {
					confirm.parentNode.parentNode.remove();
				}),
			});
			popup_container.appendChild(confirm);
		}
	}
	else {//close no function
		console.log("creating close for popup");
		let close = CE({
			"class": "popup_confirm",
			"innerHTML": "close",
			"type": "button",
			"innerText": args.prompt,
			"onClick": ((e) => {
				close.parentNode.parentNode.remove();
			}),
		});
		popup_container.appendChild(close);
	}
	container.appendChild(popup_container);
	// }}} 2
	d.body.appendChild(container);
}

