//############################################################
//	imports
//############################################################ imports {{{1
console.info("url:", document.location.href);
//`import { Navbar } from './elements/navbar.js';
// http://127.0.0.1:9999/tests/styles_proper


//############################################################ 
//	var(s)
//############################################################ global_vars {{{1
let timeout = 0;

//############################################################ 
//	funciton(s)
//############################################################ functions {{{1
async function ErrPopUp(txt = "there was an error!", err = "hey dipshit, your site is broken") {
	try {
		let myPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				let errPopUp = document.createElement('div');
				errPopUp.innerText = txt;

				//position && styling
				errPopUp.style.width = "20em";
				errPopUp.style.height = "auto";
				errPopUp.style.position = "absolute";
				errPopUp.style.left = ((window.innerWidth - errPopUp.getBoundingClientRect().width) / 2 + "px");
				resolve('')
			}, 10000);
			reject();
		}).then((msg) => {
			console.log(msg);
		})
	}
	catch (err) {
		console.warn(err);
	}
}
//{{{2 Navbar
function Navbar() {
	if (document.getElementsByClassName('navbar').length >= 1) {
		console.log('no navbar yet');
		return;
	}

	console.warn("navbar detected, not adding");

	try {
		console.log("adding navbar styling");
		let head = document.getElementsByTagName("head");

		let navbar_style = document.createElement("link");
		navbar_style.rel = "stylesheet";
		navbar_style.href = "/elements/navbar.css"

		head[0].appendChild(navbar_style);

		console.log("added navbar.css");
	}
	catch (err) {
		console.warn("error adding navbar_style: ", err);
	}
	try {
		console.log("adding spacer");
		let spacer = document.createElement('div');
		spacer.id = "spacer"
		spacer.style.height = '0px';
		let spacer_height_target = "120px";
		let spacer_height_increment = 10;

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

		document.getElementsByTagName("body")[0].prepend(spacer);
	} catch (err) {
		console.error('cannot add spacer', err);
	}


	try {
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
		let spacer = document.getElementById("spacer");

		spacer.style.height = navbar.getBoundingClientRect().height + "px";

		console.log("navbar added");

	}
	catch (err) {
		console.error('cannot add navbar:', err);
	}
}
//}}}2


//{{{2 footer
function Footer() {
	try {
		console.log('adding footer');
		if (
			document.getElementById('footer') >= 1 &&
			document.getElementsByTagName('footer') <= 0
		) {
			console.log('footer already added, ignoring');
		}

		let f = document.createElement('footer');
		f.style.backgroundColor = 'var(--color_secondary)';
		f.style.bottom = '0px';
		f.style.display = 'grid';
		f.style.gridTemplateColumns = 'repeat(auto-fit, minmax(256px, 1fr))';
		f.style.height = 'auto';
		f.style.left = '0px';
		f.style.paddingTop = '1.5em';
		f.style.position = 'fixed';
		f.style.width = '100%';

		let f_h = document.createElement('h6');
		f_h.innerText = 'Footer';
		f.appendChild(f_h);

		let about = document.createElement('div');
		//about.innerText = 'about';
		let a_h = document.createElement('h6');
		//a_h.style.backgroundColor = 'transparent';
		//a_h.style.color = 'var(--color_text_primary)';
		a_h.innerText = 'about';
		about.appendChild(a_h);
		let a_text = document.createElement('p');
		a_text.innerText = 'this is a website made by vulbyte to show off projects, network things, and offer some forms of transparency and what not. hope you enjoy :3'
		about.appendChild(a_text);
		f.appendChild(about);

		let n = document.createElement('div');
		//n.innerText = 'navigation';
		let n_h = document.createElement('h6');
		n_h.innerText = 'navigation';
		n.appendChild(n_h);
		let n_l = document.createElement('ul');
		let footer_links = {
			'content': '/content/content.html',
			'links': '/links/links.html',
			'policies': '/policies.html',
			//'': '',
		};
		try {
			console.log('adding nav items for footer');
			for (let i = 0; i < Object.keys(footer_links).length; ++i) {
				console.log('loop');
				let a = document.createElement('a');
				a.style.display = 'block';
				a.innerText = Object.keys(footer_links)[i];
				a.href = Object.values(footer_links)[i];
				a.target = '_blank';
				n_l.appendChild(a);
			}
			console.log('added nav items for footer');
			n.appendChild(n_l);
		}
		catch (err) {
			console.log('error adding nav items to footer: ', err);
		}
		f.appendChild(n);

		document.body.appendChild(f);
		console.log('🦶 footer added');
	}
	catch (err) {
		console.log('error adding footer', err);
	}
}
//}}}2


//############################################################ 
//	runtime
//############################################################ runtime {{{1
//declare self as module
//const self = document.getElementsByTagNameNS('script');
//self.type = "module";

console.log("client_management loaded");

//{{{2 root dir for file mgmt and access

var ROOT_DIR;
try {
	//let loc = document.location.href;
	//loc = loc.slice(0, loc.lastIndexOf("/"));
	ROOT_DIR = localStorage.getItem("ROOT_DIR");
	if (ROOT_DIR == null) {
		throw ("ROOT_DIR is null");
	}
	console.log("ROOT_DIR = ", ROOT_DIR);
}
catch (err) {
	console.warn(err);
	// TODO: this 
	let loc = document.location.href;

	let start, end;

	// TODO: change this to match against instead of hardcoded
	if (loc.indexOf('com') != -1) {
		end = loc.indexOf('com');
		start = loc.lastIndexOf('/', end - 1);
		ROOT_DIR = loc.slice(start, end);
	}
	else if (loc.indexOf(":", 5) != -1) {
		end = loc.indexOf('/', loc.indexOf(':', 5));
		start = loc.lastIndexOf('/', end - 1);
		ROOT_DIR = loc.slice(start, end);
	}
	else {
		console.error("unable to determine local dir");
	}

	localStorage.setItem("ROOT_DIR", ROOT_DIR);

	console.log("ROOT_DIR = ", ROOT_DIR);
}
//}}}2 

//{{{2 style
try {
	var global_style = document.createElement('link');
	global_style.rel = `stylesheet`;
	global_style.href = `/global.css`;

	document.getElementsByTagName('head')[0].appendChild(global_style);
	console.log('style added');
}
catch (err) {
	console.warn(err);
	await ErrPopUp("error adding styling!", err);
}
//}}}2

//{{{2 add navbar
try {
	//navbar if no navbar present
	console.log("trying to load navbar");
	Navbar();
}
catch (err) {
	console.error(err);
	await ErrPopUp("error adding navbar", err);
}
//}}}2
//{{{2
try {
	console.log('trying to add footer');
	Footer();
}
catch (err) {
	console.log('error adding footer');
}
//}}}2
//{{{2 add dark reader disable
try {
	console.log('darkreader disabled');
	//<meta name="darkreader-lock">
	let dr_dis = document.createElement('meta');
	dr_dis.name = 'darkreader-lock';

	document.getElementsByTagName('head')[0].appendChild(dr_dis);
}
catch {

}
//}}}2
//{{{2 see if images in storage, if not then load

let favicon_links = [
	'icon_red',
	'icon_yellow',
	'icon_green',
	'icon_cyan',
	'icon_blue',
	'icon_magenta',
	'icon',
];

(async () => {
	try {
		console.log('attempting to get icons from github');

		for (let i = 0; i < favicon_links.length; ++i) {
			try {
				const url = `https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/${favicon_links[i]}.svg`;

				// Fetch the image
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${url}: ${response.status}`);
				}

				// Convert to Blob and create a URL
				const imageBlob = await response.blob();
				const src = URL.createObjectURL(imageBlob);

				// Set the Blob URL to favicon_links[i]
				favicon_links[i] = src;

				console.log(`Successfully set icon for ${favicon_links[i]}`);
			} catch (err) {
				console.error(`Couldn't get icon for ${favicon_links[i]}:`, err);
			}
		}

		console.log('got icons from github');
	} catch (err) {
		console.error('failed to get icons, setting to default', err);
		favicon_links = ['./assets/icon.svg']; // Reset to default
	}
})();

// favicon_links = [
//	//red
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_red.svg',
//	//yellow
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_yellow.svg',
//	//green
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_green.svg',
//	//cyan
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_cyan.svg',
//	//blue
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_blue.svg',
//	//magenta
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon_magenta.svg',
//	//white
//	'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87deeda52a94496a53f0cbb26e17862dc6548b53/assets/icon.svg',
//];
//}}}2
//{{{2 determine if is animatible
let animatible = true;
try {
	console.log('editing favicon');
	let favicon_link = document.querySelector(`link[rel~='icon']`);

	if (!favicon_link) {
		favicon_link = document.createElement('link');
		favicon_link.rel = 'icon'
		favicon_link = document.head.appendChild(favicon_link);
	}

	favicon_link.id = 'favicon'

	if (String(window.location).includes('vulbyte.com')) {
		animatible = true;
		favicon_link.href = favicon_links[0];
	}
	else if (String(window.location).includes('pages.dev')) {
		favicon_link.href = favicon_links[1];
	}
	else {
		console.log('non-pup environment detected');
		favicon_link.href = favicon_links[3];
	}

	console.log('favicon changed');
}
catch (err) {
	console.warn('failed to change favicon', err);
}
//}}}2
//{{{2 set font
try {

}
catch (err) {
	console.warn(err);
}
//}}}2
if (animatible == true) {
	let icon = 0;

	setInterval(() => {
		if (icon <= 5) {
			icon += 1;
		}
		else {
			icon = 0;
		}

		document.getElementById('favicon').href = favicon_links[icon];
	}, 300);
};
//}}}1
//
//
