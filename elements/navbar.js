export function Navbar() {
	let spacer = document.createElement('div');
	spacer.style.height = '0px';
	let spacer_height_target = "120px";
	let spacer_height_increment = 10;

	async function add_to_spacer_height() {
		while (parseInt(spacer.style.height, 10) < spacer_height_target) {
			// Use a promise to delay the loop
			await new Promise(resolve => setTimeout(resolve, 100));

			// Increase the spacer height
			let currentHeight = parseInt(spacer.style.height, 10); // Convert "50px" to 50
			spacer.style.height = currentHeight + spacer_height_increment + "px";

			console.log("Adding height to spacer: ", spacer.style.height);
		}
	}


	window.addEventListener('load', function() {
		try {
			let head = document.getElementsByTagName("head");

			let navbar_style = document.createElement("link");
			navbar_style.rel = "stylesheet"; //stylesheet?
			navbar_style.href = "/elements/navbar.css"

			head[0].appendChild(navbar_style);

			console.log("added navbar.css");
		}
		catch (err) {
			console.warn("error adding navbar_style: ", err);
		}

		//navbar Element
		let navbar = document.createElement('navbar');
		//navbar.textContent = "⑤navbar navbar navbar";
		navbar.classList += "navbar";
		navbar.style.opacity = "0.0";

		let home_anchor = document.createElement('a');
		home_anchor.href = "/";
		home_anchor.target = "";
		home_anchor.style = "background-color: var(--color_background_primary); padding: 0.2em; text-decoration: none;";
		navbar.appendChild(home_anchor);
		home_anchor.style.borderRight = '6px solid var(--color_secondary)';

		//let home_bg = document.createElement('span');
		//home_bg.style.zIndex = `${(home_anchor.style.zIndex) - 1}`
		//home_bg.style.width = `${(home_anchor.getBoundingClientRect().width)}px`
		//home_bg.style.backgroundColor = `var(--color_secondary)`
		//home_bg.style.width = '5em';
		//home_anchor.appendChild(home_bg);

		let home_logo = document.createElement('img');
		//the link here is relivant to the html file or the project core, NOT this file
		//console.log("navbar ROOT_DIR: ", localStorage.getItem("ROOT_DIR"));

		home_logo.src = `/assets/icon.svg`;
		home_logo.style = 'max-width: 4.2em; max-height: 4.2em;'
		home_anchor.appendChild(home_logo);

		// TODO:ADD LOGIC FOR HOMETEXT WITH MOBILE SCREENS
		//let home_text = document.createElement('p');
		//home_text.innerText = "VULBYTE"
		//navbar.appendChild(home_text);gt
		//home_anchor.appendChild(home_text);

		// TODO: add: HOME, LINKS, PROJECTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
		let locations = [
			"home",
			"content",
			"links",
		];

		locations.forEach((l) => {
			let newElem = document.createElement('a');

			newElem.innerText = l;
			newElem.href = "/" + l + "/" + l + ".html";
			newElem.style.cursor = "pointer";
			newElem.style.alignItems = "center";
			newElem.style.display = "flex";
			newElem.style.height = "6em";
			newElem.style.textAlign = "center";
			newElem.style.justifyContent = "center";

			// switch for different specalties
			switch (l) {
				case ("content"):
					console.log("creating content dropdown");
					let content_dropdown = document.createElement("ul");
					content_dropdown.id = "content_dropdown";

					let content_dirs = [
						"code_stuff",
						"video_scripts", // BUG: bjroked
					];

					content_dirs.forEach((i) => {
						console.log(`creating dropdown item: ${i}`);
						let dd_item = document.createElement("li");

						let dd_link = document.createElement("a");
						dd_link.innerText = `${i}`;
						dd_link.href = `/content/${i}/${i}.html`;

						dd_item.appendChild(dd_link);
						content_dropdown.appendChild(dd_item);
					})

					newElem.appendChild(content_dropdown);

					break;
				default:
					break;
			}

			navbar.appendChild(newElem);
		});

		//let navbar.appendChild4gt


		//add it all to the document
		document.body.insertBefore(navbar, document.body.firstChild);

		//setTimeout((() => {
		//}), 500);
		console.log("navbar height: ", navbar.getBoundingClientRect().height);
		spacer.id = "spacer_for_header";
		spacer_height_target = `${navbar.getBoundingClientRect().height}px`;
		document.getElementsByTagName('body')[0].insertAdjacentElement("afterbegin", spacer);

		console.log("navbar load done, animating in");

		navbar.style.transitionDuration += "2000";
		navbar.style.opacity = "1";


		spacer.style.height = navbar.getBoundingClientRect().height + "px";
	});

}
