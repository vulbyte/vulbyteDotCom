// ================== popup.js ==================
export default class POPUP {
	new({ title = '', message = '', prompt = '', onAccept = null, timeout = 0, details = '' } = {}) {
		const popup = document.createElement('div');
		popup.id = 'popup';
		popup.style.position = 'fixed';
		popup.style.top = '50%';
		popup.style.left = '50%';
		popup.style.transform = 'translate(-50%, -50%)';
		popup.style.background = '#333';
		popup.style.color = '#fff';
		popup.style.padding = '20px';
		popup.style.borderRadius = '10px';
		popup.style.zIndex = 10000;
		popup.style.maxWidth = '400px';
		popup.innerHTML = `<h2>${title}</h2><p>${message}</p>`;


		if (details) {
			const detailsEl = document.createElement('pre');
			detailsEl.textContent = details;
			detailsEl.style.whiteSpace = 'pre-wrap';
			popup.appendChild(detailsEl);
		}


		if (prompt && onAccept) {
			const btn = document.createElement('button');
			btn.textContent = prompt;
			btn.onclick = () => {
				onAccept();
				popup.remove();
			};
			popup.appendChild(btn);
		}


		document.body.appendChild(popup);
		if (timeout > 0) setTimeout(() => popup.remove(), timeout);
		return popup;
	}
}
