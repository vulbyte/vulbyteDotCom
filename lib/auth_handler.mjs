
// authish is a service used to handle hand shaking with a server, and verifying users.
import Popup2 from "/lib/popup2.mjs";
export default class AuthHandler {
	constructor() {
		try {
			if (
				this.CheckPubKey() == false
				|| this.CheckPrivKey() == false
			) {
				this.AuthenticateUser();
			}
			if (
				this.CheckPubKey() == false
				|| this.CheckPrivKey() == false
			) {
				throw new Error("keys could not be verified after authentication on 2nd attempt");
			}

		}
		catch (err) {
			let message = `Cannot get or verify keys for security.\n refresh the page to try again and if it happens again please message support@vulbyte.com: \n${err}`;
			console.error(message);

		}
	}

	/**
	* @param {Object | String} privKey - priv key (locally generated key), takes in key or str with path to key
	* @param {Object | String} pubKey - public key (server generated key), takes in key or str with path to key
	* @return {boolean}
	*/
	VerifyKeys(
		privKey = localStorage.getItem("privKey"),
		pubKey = localStorage.getItem("pubKey")
	) {
	}

	/**
	 * @param {Object | String} pubKey - key or location to key. if string check locStorage, then fetch. if fetch returns will overwrite storage
	 * @return {boolean}
	 */
	CheckPubKey(pubKey = localStorage.getItem("pubKey")) {
		if (typeof (pubKey) == "string") {
			try {
				if (localStorage.getItem(pubKey) != null) {
					return true;
				}
			}
			catch (err) {
				throw new Error(`could not check localStorage for pubKey from string: ${pubKey}`);
			}
			try {
				setTimeout(async () => {
					let netreq = await fetch(pubKey)
						.then((res) => { localStorage.setItem("pubKey", res.json()) });
					return true
				}, 5000);
				return false;
			}
			catch (err) {
				throw new Error(`fetch failed for getting key from string: ${pubKey}`);
			}
		}
		else if (typeof (pubKey) == "object") {
			return true;
		}

		return false;
	}

	/**
	 * @param {Object | String} pubKey - key or location to key. if string check locStorage, then fetch. if fetch returns will overwrite storage
	 * @return {boolean}
	 */
	CheckPrivKey(privKey = localStorage.getItem("privKey")) {
		if (typeof (privKey) == "string") {
			try {
				if (localStorage.getItem(privKey) != null) {
					return true;
				}
			}
			catch (err) {
				throw new Error(`could not check localStorage for pubKey from string: ${privKey}`);
			}
			try {
				setTimeout(async () => {
					let netreq = await fetch(privKey)
						.then((res) => { localStorage.setItem("pubKey", res.json()) });
					return true
				}, 5000);
				return false;
			}
			catch (err) {
				throw new Error(`fetch failed for getting key from string: ${privKey}`);
			}
		}
		else if (privKey.constructor() == Object) {
			return true;
		}

		return false;
	}

	AuthenticateUser() {
		const nameInput = document.createElement("input");
		nameInput.name = "username";
		nameInput.id = "un";
		nameInput.placeholder = "Enter your name";

		const pwContainer = document.createElement("div");

		const pwInput = document.createElement("input");
		pwInput.name = "password";
		pwInput.id = "pw";
		pwInput.type = "password";
		pwInput.placeholder = "Enter your password";
		pwContainer.appendChild(pwInput);

		const showPw = document.createElement("div");
		showPw.innerText = "👁️";
		showPw.addEventListener('click', (event) => {
			pwInput.type = "text";
			showPw.innerText = "👀";
		})
		showPw.addEventListener('mouseleave', (event) => {
			pwInput.type = "password";
			showPw.innerText = "👁️";
		});
		showPw.style.cssText = `
				height: 1em;
				width: 1em;
				padding: 0px;
				margin: 0px;
				position: relative;
				right: 0px;
				display: inline-block;
			`;
		pwContainer.appendChild(showPw);


		LoginPrompt();


		function LoginPrompt(msg = "no login info detected on your machine, so for the security of you and everyone else i need you to log back in again") {
			Popup2({
				title: "we need to to log in real quick!",
				message: msg,
				note: "sorry, i know it's a bother",
				form: [nameInput, pwContainer],
				onConfirm: (formData) => {
					//send data 
					try {
						let data = { formData };
						for (const input of formEl.elements) {
							if (input.id) {
								data[input.id] = input.value;
							}
						}
						if (data.un == "" || data.pw == "") {
							//does not work
							LoginPrompt("inputs can't be null");
						}
						let res = fetch("", data) //BUG: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--------- this will always error
						if (res.ok) {
							Popup2({
								title: "request received!",
								message: "you should see an email with your 6 digit code, please enter it blow one you see it!",
								note: "code will expire in 15 minutes",
								form: [document.createElement(input)],
								onConfirm: (formData) => {/*do things*/ },
							});
						}
					}
					catch (error) {
						console.error(err);
						//doesn't trigger
						ErrorPopup();
					}
				},
				confirmPrompt: "submit info",
			});
		}

		async function ErrorPopup() {
			Popup2({
				title: "failed to send info to the server! for some reason...",
				message: "please check your internet, then refresh the page!",
				note: "if the error persists, please email <a href='mailto:support@vulbyte.com'>support@vulbyte.com</a>",
				confirmPrompt: "click here to refresh the page",
				onConfirm: (event) => { window.location.reload(); },
			});
		}
	}
}
