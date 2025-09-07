export default function Authenticate() {
	const d = document;
	let blur_block = d.createElement("div");
	blur_block.style.filter = "blur(6px)";
	blur_block.style.width = "100vw";
	blur_block.style.height = "100vh";
	blur_block.style.position = "absolute";
	blur_block.style.left = "0px";
	blur_block.style.top = "0px";

	try {
		// Create an overlay to capture clicks and prevent interaction
		const overlay = d.createElement("div");
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100%";
		overlay.style.height = "100%";
		overlay.style.zIndex = "1000"; // A high z-index to be on top
		d.body.appendChild(overlay);

		// Children block for entering user name and submit button
		const auth_modal = d.createElement("div");
		auth_modal.innerHTML = `
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                <h3>Please authenticate</h3>
                <input type="text" id="username_input" placeholder="Enter username" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">
                <button id="submit_auth" style="padding: 8px 16px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
            </div>
        `;
		auth_modal.style.position = "fixed";
		auth_modal.style.top = "50%";
		auth_modal.style.left = "50%";
		auth_modal.style.transform = "translate(-50%, -50%)";
		auth_modal.style.zIndex = "1001"; // Higher z-index than the overlay

		d.body.appendChild(auth_modal);

		// Return a promise that resolves on successful authentication
		return new Promise((resolve, reject) => {
			const submitBtn = d.getElementById("submit_auth");
			submitBtn.addEventListener("click", () => {
				const username = d.getElementById("username_input").value;
				// Add your actual authentication logic here
				if (username) {
					// Remove the authentication UI
					overlay.remove();
					auth_modal.remove();
					resolve(true); // Resolve the promise with true on success
				} else {
					alert("Please enter a username.");
					reject(new Error("Authentication failed")); // Reject on failure
				}
			});
		});

	} catch (err) {
		console.error("Authentication error:", err);
		return Promise.reject(err);
	}
}

