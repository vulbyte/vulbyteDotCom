export function Navbar() {
	try {
		console.log("adding navbar styling");
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
	try {
		console.log("adding navbar");
		let spacer = document.createElement('div');
		spacer.id = "spacer"
		//spacer.style.height = '0px';
		//let spacer_height_target = "120px";
		//let spacer_height_increment = 10;

		/*async function add_to_spacer_height() {
			while (parseInt(spacer.style.height, 10) < spacer_height_target) {
				// Use a promise to delay the loop
				await new Promise(resolve => setTimeout(resolve, 200));

				// Increase the spacer height
				let currentHeight = parseInt(spacer.style.height, 10); // Convert "50px" to 50
				spacer.style.height = currentHeight + spacer_height_increment + "px";

				console.log("Adding height to spacer: ", spacer.style.height);
			}
		}*/


		window.addEventListener('load', function() { })
		//navbar Element
		let navbar = document.createElement('navbar');
		//navbar.textContent = "⑤navbar navbar navbar";
		navbar.classList += "navbar";

		let home_anchor = document.createElement('a');
		home_anchor.id = "home_anchor";

		home_anchor.href = "/";
		home_anchor.target = "";
		navbar.appendChild(home_anchor);

		let home_logo = document.createElement('img');
		home_logo.id = "home_logo";
		home_logo.height = "256";
		home_logo.width = "256";
		//the link here is relivant to the html file or the project core, NOT this file
		//console.log("navbar ROOT_DIR: ", localStorage.getItem("ROOT_DIR"));

		if (String(window.location).includes('vulbyte.com')) {
			home_logo.src = `https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/0b0fcb64b46a2665d622ce094517332ab6b6cb7f/assets/icon.svg`;
		}
		else if (String(window.location).includes('pages.dev')) {
			home_logo.src = `https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/209022ef5f7b1dd9f61e0892cd3555a1a27f47a3/assets/preview_icon.svg`;
		}
		else {
			console.log('non-pub environment detected');
			home_logo.src = `https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/0b0fcb64b46a2665d622ce094517332ab6b6cb7f/assets/dev_icon.svg`;
		}

		home_anchor.appendChild(home_logo);

		let random_strings = [
			'fuck you, you got an rng of 0', //make something special
			'hey, joey salads here',
			`what you lookin' at?`,
			'yip yap yop',
			'peanut jelly',
			'made you look',
			':3',
			'you look nice today :)',
			`this isn't a minecraft reference`,
			'¡¿por que maria?!',
			'sushi!',
			'tacos!',
			'hashbrowns!',
			`>vulbyte_was_here<`,
			`rush 2049`,
			`i didn't slap you`,
			`sonic for hire`,
			`dead men tell some tales`,
			`~wiggle wiggle~`,
			`*shits pants*`,
			`gotta go fast!`,
			`now blasingly fast!`,
			`no longer using hamsters!`,
			"buy spotify premium",
			"linus said the hard R",
			"shout out to @bubbshalub",
			"subscribe to youtube",
			"incredibles 2 sucked",
			"192.168.0.1",
			"sonadow",
			"markiplier's #1 fan",
			"drink milk",
			"jesus loves tacos",
			"its called twitter",
			"mike tyson won",
			"dont refresh the page",
			"DONT LOOK BEHIND YOU",
			"i shid pant",
			`your ip is: 192.169.0.9`,
			`console.log('installing virus')`,
			`9+10=21`,
			`4x4=12`,
			`while(1<2)`,
			'some_title',
			`random_website_title`,
			'now with 100% more ai!',
			`shutup i'm listening to cheerleeder`,
			`eat the soap :3 (don't)`,
			`currently chasing a dog down the road`,
			`macbook in da carr`,
			`The Boy Bands Have Won, and All the Copyists and the Tribute Bands and the TV Talent Show Producers Have Won, If We Allow Our Culture to Be Shaped by Mimicry, Whether from Lack of Ideas or from Exaggerated Respect. You Should Never Try to Freeze Culture. What You Can Do Is Recycle That Culture. Take Your Older Brother's Hand - Me - Down Jacket and Re - Style It, Re - Fashion It to the Point Where It Becomes Your Own.But Don't Just Regurgitate Creative History, or Hold Art and Music and Literature as Fixed, Untouchable and Kept Under Glass. The People Who Try to 'Guard' Any Particular Form of Music Are, Like the Copyists and Manufactured Bands, Doing It the Worst Disservice, Because the Only Thing That You Can Do to Music That Will Damage It Is Not Change It, Not Make It Your Own. Because Then It Dies, Then It's Over, Then It's Done, and the Boy Bands Have Won`,
		]

		let home_string = document.createElement('span');
		home_string.id = "home_string";
		home_string.innerText = random_strings[Math.floor(Math.random() * random_strings.length)];
		// below is for testing the worst case scenerio
		//home_string.innerText = random_strings[random_strings.length - 1];
		let len = home_string.innerText.length;
		//console.log("🏠:", len);
		let default_font_size = 16;
		home_string.style.fontSize = ((Math.abs((len / 900) - 1)) * 12) + 4 + "px";

		home_anchor.appendChild(home_string);


		// TODO:ADD LOGIC FOR HOMETEXT WITH MOBILE SCREENS
		//let home_text = document.createElement('p');
		//home_text.innerText = "VULBYTE"
		//navbar.appendChild(home_text);gt
		//home_anchor.appendChild(home_text);

		// TODO: add: HOME, LINKS, PROJECTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 
		let locations = {
			"content": '/content/content.html',
			"links": '/links/links.html',
		};

		Object.keys(locations).forEach((l) => {
			let newElem = document.createElement('a');
			newElem.id = "navbar_dropdown_link"

			newElem.innerText = l;
			newElem.href = "/" + l + "/" + l + ".html";

			// switch for different specalties
			switch (l) {
				case ("content"):
					console.log("creating content dropdown");
					let content_dropdown = document.createElement("ul");
					content_dropdown.id = "content_dropdown";

					let content_dirs = [
						"code_stuff",
						"video_scripts",
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

		spacer.style.height = navbar.getBoundingClientRect().height + "px";

		console.log("navbar added");

	}
	catch (err) {
		console.error('cannot add navbar:', err);
	}
}
