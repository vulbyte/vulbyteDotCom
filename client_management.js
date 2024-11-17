//############################################################ 
//	imports
//############################################################ imports {{{1
console.info("url:", document.location.href);
import { Navbar } from '../elements/navbar.js';
// http://127.0.0.1:9999/tests/styles_proper


//############################################################ 
//	var(s)
//############################################################ global_vars {{{1
let timeout = 0;
let favicon_link = '/assets/icon.svg';

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
	console.log(`d.gebcn("nb"): `, document.getElementsByClassName('navbar').length);
	if (document.getElementsByClassName('navbar').length <= 1) {
		Navbar();
	}
	else {
		console.warn("navbar detected, not adding");
	}
}
catch (err) {
	console.error(err);
	await ErrPopUp("error adding navbar", err);

}
//}}}2
//{{{2 add darkreader disable
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
//{{{2 edit_favicon
try {
	console.log('editing favicon');
	let favicon_link = document.querySelector(`link[rel~='icon']`);

	if (!favicon_link) {
		favicon_link = document.createElement('link');
		favicon_link.rel = 'icon'
		favicon_link = document.head.appendChild(favicon_link);
	}

	if (String(window.location).includes('vulbyte.com')) {
		favicon_link.href = 'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/87f720d5b632e48df864177af9337aca4a8fae50/assets/icon.svg';
	}
	else if (String(window.location).includes('pages.dev')) {
		favicon_link.href = `https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/209022ef5f7b1dd9f61e0892cd3555a1a27f47a3/assets/preview_icon.svg`;
	}
	else {
		console.log('non-pup environment detected');
		favicon_link.href = 'https://raw.githubusercontent.com/vulbyte/vulbyteDotCom/448122708492d8ef4ca957826b73a4e532fde45f/assets/dev_icon.svg';
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
//}}}1
