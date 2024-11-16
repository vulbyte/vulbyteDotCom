// ############################################################ 
// 			init
// ############################################################ 
// {{{1
//console.log('loaded actace');

let style = window.getComputedStyle(document.querySelector('html'));
let color_primary = style.getPropertyValue('--color_primary');
let color_tertiary = style.getPropertyValue('--color_tertiary');

// TODO: add more languages if needed

//}}}2
// }}}1

// ############################################################ 
// 			funcitons
// ############################################################ 
// {{{1
//console.log("declaring fn");
// {{{2 add_copy_elem(txt)
function add_copy_elem(txt) {
	let button = document.createElement('button');
	button.classList.add("copy_button");

	button.addEventListener(`click`, () => {
		navigator.clipboard.writeText(txt)
			.then(console.log("copied text to clipboard"))
			.catch(err => {
				//console.error("error copying text: ", err);
			});
		// BUG: i don't need to request permissions for some fucked reason
		/*navigator.permissions.query({ name: "clipboard-write" })
			.then((result) => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText(txt)
						.then(console.log("copied text to clipboard"))
						.catch(err => {
							console.error("error copying text: ", err);
						});
				}
				else {
					console.warn('clipboard perms denied');
				}
			})
			.catch(err => {
				console.error('perm query failed: ', err);
			});*/
	});

	button.innerText = "📋"
	return button;
};
// }}}2

// {{{2 add_paste_buttons
function add_paste_buttons(code) {
	//console.log("entering loop");
	for (i = 0; i < code.length; ++i) {
		//console.log("adding copy button");
		code[i].appendChild(
			add_copy_elem(code[i].textContent)
		);
	}
}
// }}}2

// TODO: there is 0 error checking here and should be handled
// {{{2 add_styling_to_text(code)

/**
	* takes in an array of code blocks, then apples styling to it using span tags
	* @example
	* // <code> bluh <span>{bluh}</span> bluh </code>
	* <code> bluh {bluh} bluh </code>
	* @param {Array}<HTMLElement> code
	* @returns {void}
*/
function add_styling_to_text(code) {// {{{2 js_tags
	//console.log("addign styling to code");
	// {{{3 js_tags
	let js_tags = {
		// NOTE: sort most to least important
		// code matching
		"console": color_primary,
		"document": color_primary,
		"window": color_primary,
		"navigator": color_primary,
		"then": color_primary,
		"catch": color_primary,
		"return": color_primary,
		"log": color_primary,
		"warn": color_primary,
		"error": color_primary,
		"err": color_primary,
		"function": color_primary,
		"fn": color_primary,
		"func": color_primary,
		"include": color_primary,
		// variable declaration
		"let": color_primary,
		"var": color_primary,
		"const": color_primary,

		"int": color_primary,
		"float": color_primary,
		"bool": color_primary,
		//units

		//special things
		"=>": color_primary,
		// brackets
		"{": color_tertiary,
		"}": color_tertiary,
		"[": color_tertiary,
		"]": color_tertiary,
		"(": color_tertiary,
		")": color_tertiary,
		// comperisons
		"!==": color_primary,
		"===": color_primary,
		"<==": color_primary,
		">==": color_primary,
		"==": color_primary,
		"<=": color_primary,
		">=": color_primary,
		"!=": color_primary,
		"||": color_primary,
		"&&": color_primary,
		"<": color_primary,
		">": color_primary,
		"??": color_primary,
		"?": color_primary,
		">": color_primary,
		//special characters
		"!": color_tertiary,
		"@": color_tertiary,
		"#": color_tertiary,
		"$": color_tertiary,
		"&": color_tertiary,
		";": color_primary,
		":": color_primary,
		",": color_primary,
		".": color_primary,
		"|": color_tertiary,
		"\\": color_tertiary,
		"?": color_tertiary,
		"`": color_tertiary,
		"~": color_tertiary,
		//quotes
		"'": color_tertiary,
		'"': color_tertiary,
		"`": color_tertiary,
		// mathematical operators
		"+": color_primary,
		"-": color_primary,
		"*": color_primary,
		"/": color_primary,
		"=": color_primary,
		"%": color_primary,
		// numerical
		//"1": color_tertiary,
		//"2": color_tertiary,
		//"3": color_tertiary,
		//"4": color_tertiary,
		//"5": color_tertiary,
		//"6": color_tertiary,
		//"7": color_tertiary,
		//"8": color_tertiary,
		//"9": color_tertiary,
		//"0": color_tertiary,
		//"📋": color_primary,
	}
	// }}}3
	//for each elem
	//console.log("code.length: ", code.length);
	//console.log("Object.keys(js_tags).length: ", Object.keys(js_tags).length);

	let beginning, match, end, newElem, newInnerHtml;

	// BUG: > gets turned into %gt and < turns into %lt
	//for each code block
	for (let i = 0; i < code.length; ++i) { // nth code block
		for (let j = 0; j < code[i].innerHTML.length; ++j) { //iter through string
			for (let k = 0; k < Object.keys(js_tags).length; ++k) { //compare against str
				//	console.log(`
				//		${Object.keys(js_tags)[k]} ==
				//		${code[i].innerHTML.slice(j, j + Object.keys(js_tags)[k].length)}
				//	`);

				if (
					Object.keys(js_tags)[k] ==
					(code[i].innerHTML.slice(j, j + Object.keys(js_tags)[k].length))
				) {
					//console.log("match");

					beginning = code[i].innerHTML.slice(0, j);

					// TODO: STRING HIGHLIGHTING PLZ FOR OTHER CHARS AND //
					// TODO: ADD TABBING
					if (code[i].innerHTML[j] == '"') {
						//console.log("MATCH")

						let endex = code[i].innerHTML.indexOf('"', j + 1);
						if (endex == -1) {
							break;
						}

						match = code[i].innerHTML.slice(
							//if()
							j,
							endex + 1
						);
					}
					else if (code[i].innerHTML[j] == ";") {
						match = ";\n"
					}
					else {
						match = Object.keys(js_tags)[k];
					}

					//console.log(match)

					newElem = document.createElement('span');
					newElem.innerText = match;
					newElem.style.color = String(Object.values(js_tags)[k]);

					//console.assert(match == toString(match), match)

					end = code[i].innerHTML.slice(j + match.length, code[i].innerHTML.length);

					newInnerHtml = beginning + newElem.outerHTML + end;
					code[i].innerHTML = newInnerHtml;

					//console.log(newInnerHtml);

					j = (beginning + newElem.outerHTML).length - 1
					break;
				}
			}
		}
	}
}
//}}}2

//{{{2
function replace_lt_and_gt_with_symbol(code) {
	//console.log("combing for lt or gt");
	let beginning, match, end, newStr;
	//{{{3 the loop
	//for (let i = 0; i < code.length; ++i) { // nth code block
	//	for (let j = 0; j < code[i].innerText.length; ++j) { //iter through string
	//		if (
	//			code[i].innerText.slice(j, j + 4) == "&lt;" ||
	//			code[i].innerText.slice(j, j + 4) == "&gt;"
	//		) {
	//			console.warn(
	//				`REPLACING lt or gt @: `, j,
	//				code[i].innerText.slice(j, j + 4)
	//			);
	//			beginning = code[i].innerText.slice(0, j);

	//			//establish match {{{3
	//			if (code[i].innerText.slice(j, j + 4) == "&lt;") {
	//				match = "\<"
	//			}
	//			else if (code[i].innerText.slice(j, j + 4) == "&lt;") {
	//				match = "\>"
	//			}
	//			else {
	//				console.error(
	//					"unexpected condition in ",
	//					"function replace_lt_and_gt_with_symbol(code)",
	//					`with input: ${code[i].innerText}`,
	//					`at index of ${j}`,
	//				)
	//			}
	//			//}}}3

	//			end = code[i].innerText.slice(j + 4, code[i].innerText.length);
	//			console.log(
	//				"beg: " + beginning,
	//				"mat: " + match,
	//				"end: " + end
	//			);
	//			code[i].innerText = beginning + match + end;
	//		}
	//	}
	//}
	//}}}3
}
//}}}2

//{{{2 add_styling_credit()
function add_styling_credit() {
	let code_blocks = document.getElementsByTagName('code');
	let credit_details = document.createElement('details');
	let credit_summary = document.createElement('summary');
	let credit_cite = document.createElement('cite');

	credit_summary.textContent = "click for text highlighting details"

	credit_details.textContent = "text highlighting made by me [vulbyte] :3";
	credit_details.appendChild(credit_summary);

	for (let i = 0; i < code_blocks.length; ++i) {
		code_blocks[i].insertAdjacentElement("afterend", credit_details);
	}
}
// }}}2
// }}}1

// ############################################################ 
// 			run
// ############################################################ 
// {{{1
window.addEventListener('load', function() {
	//console.log("window loaded");

	let code = document.querySelectorAll('code');
	add_styling_to_text(code); // BUG: this causes the paste button to go away
	// replace_lt_and_gt_with_symbol(code); ignore me
	add_styling_credit(); // BUG: this seems to only happen once, should happen per each item
	add_paste_buttons(code);
});
// }}}1
