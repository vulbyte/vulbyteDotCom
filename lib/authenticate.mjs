import Seccom from "./seccom.mjs";

export default function Authenticate() {
	return new Promise((resolve, reject) => {
		const d = document;

		let overlay = d.createElement("div");
		overlay.style.cssText = `
			position: fixed; top: 0; left: 0;
			width: 100vw; height: 100vh;
			background: rgba(0,0,0,0.8);
			backdrop-filter: blur(6px);
			display: flex; align-items: center; justify-content: center;
			z-index: 10000;
		`;

		let authForm = d.createElement("div");
		authForm.style.cssText = `
			background: white; padding: 30px; border-radius: 15px;
			box-shadow: 0 20px 40px rgba(0,0,0,0.3);
			max-width: 400px; width: 90%; text-align: center;
		`;

		let email = d.createElement("input");
		email.type = "email";
		email.placeholder = 'user@secdomain.tld';
		authForm.appendChild(email);

		let emailSubmit = d.createElement("input");
		emailSubmit.innerText = "submit email";
		emailSubmit.onclick(async (event) => {

			fetch("https://mxlnbnqnwyotgobsuaet.supabase.co/functions/v1/secure_connection_test", {
				body: {
					action: "",

				}
			});
		});

		let code = d.createElement("input");
		code.placeholder = "123 456";
		code.disabled = true;
		authForm.appendChild(code);
	});
}
