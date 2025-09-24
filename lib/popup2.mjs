// popup.mjs
export default function Popup2(options = {}) {
	const {
		blocking = true,
		closeButton = false,
		title,
		message,
		note,
		error,
		form,
		confirmPrompt,
		onConfirm,
		denyPrompt,
		onDeny,
	} = options;

	const d = document;

	// overlay for blocking
	let overlay;
	if (blocking) {
		overlay = d.createElement("div");
		overlay.style.cssText = `
      position: fixed;
      inset: 0;
      backdrop-filter: blur(14px);
     	filter:brightness(0.1);
      z-index: 9999;
    `;
		d.body.appendChild(overlay);
	}

	// container
	const popup = d.createElement("div");
	popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 6em;
    border: 1px solid var(--color_primary);
    width:40rem;
    z-index: 10000;
  `;

	// close button
	if (closeButton) {
		const btn = d.createElement("button");
		btn.textContent = "×";
		btn.addEventListener("click", () => close());
		popup.appendChild(btn);
	}

	// title
	if (title) {
		const h = d.createElement("h2");
		h.textContent = title; // NOTE: never put HTML in the title
		popup.appendChild(h);
	}

	// message (mandatory)
	const msg = d.createElement("p");
	msg.innerHTML = message;
	msg.style.filter = "brightness(0.8)";
	popup.appendChild(msg);

	// note
	if (note) {
		const n = d.createElement("small");
		n.innerHTML = note;
		n.style.filter = "brightness(0.6)";
		n.style.fontSize = "0.8em";
		popup.appendChild(n);
	}

	// error in details
	if (error) {
		const details = d.createElement("details");
		const summary = d.createElement("summary");
		summary.textContent = "More info";
		details.appendChild(summary);

		const err = d.createElement("pre");
		err.textContent = error;
		details.appendChild(err);

		popup.appendChild(details);
	}

	// form
	let formEl;
	if (form && Array.isArray(form)) {
		formEl = d.createElement("form");
		form.forEach(el => {
			formEl.appendChild(el);
		});
		popup.appendChild(formEl);
	}

	// actions
	const actions = d.createElement("div");

	if (confirmPrompt) {
		const confirmBtn = d.createElement("button");
		confirmBtn.textContent = confirmPrompt;
		confirmBtn.type = "button";
		confirmBtn.addEventListener("click", () => {
			let data = null;
			if (formEl) {
				data = new FormData(formEl);
			}
			if (typeof onConfirm === "function") {
				onConfirm(data);
			}
			close();
		});
		actions.appendChild(confirmBtn);
	}

	if (denyPrompt) {
		const denyBtn = d.createElement("button");
		denyBtn.textContent = denyPrompt;
		denyBtn.type = "button";
		denyBtn.addEventListener("click", () => {
			let data = null;
			if (formEl) {
				data = new FormData(formEl);
			}
			if (typeof onDeny === "function") {
				onDeny(data);
			}
			close();
		});
		actions.appendChild(denyBtn);
	}

	popup.appendChild(actions);

	d.body.appendChild(popup);

	// non-blocking outside click closes popup
	if (!blocking) {
		const outsideClickHandler = (e) => {
			if (!popup.contains(e.target)) {
				close();
			}
		};
		setTimeout(() => d.addEventListener("click", outsideClickHandler));
		popup._outsideClickHandler = outsideClickHandler;
	}

	function close() {
		popup.remove();
		if (overlay) overlay.remove();
		if (!blocking && popup._outsideClickHandler) {
			d.removeEventListener("click", popup._outsideClickHandler);
		}
	}

	return { close };
}

