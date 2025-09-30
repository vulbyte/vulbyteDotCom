// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import YoutubeStuff from "./youtubeStuff.js";

function LSGI(id) {
	return localStorage.getItem(String(id));
}
function GEBI(id) {
	return document.getElementById(id);
}

export default class MonitorMessages {
	constructor(args = {}) {
		this.args = args;
		this.firstStart = true;

		// FIX: Pass apiKey to YoutubeStuff
		const apiKey = GEBI("youtube_apiKey")?.value;
		const broadcastId = GEBI("youtube_broadcastId")?.value;

		this.yt = new YoutubeStuff({
			apiKey: apiKey,
			broadcastId: broadcastId
		});

		// Store the interval ID for cleanup
		this.monitorInterval = null;
		this.messageIndex = 0;
	}

	async StartMonitoring() {
		// Initial setup
		if (this.firstStart === true) {
			// Re-read values in case they changed
			if (!this.yt.args.apiKey) {
				this.yt.args.apiKey = GEBI("youtube_apiKey")?.value;
			}
			if (!this.yt.args.broadcastId) {
				this.yt.args.broadcastId = GEBI("youtube_broadcastId")?.value;
			}

			this.firstStart = false;
			console.log(`Loading complete chat history for broadcast: ${this.yt.args.broadcastId}`);

			// Get initial messages
			try {
				await this.GetMessages();
			} catch (error) {
				console.error("Error getting initial messages:", error);
			}
		}

		// FIX: Use ONLY setInterval, not both IntTimer and setInterval
		// Clear any existing interval first
		if (this.monitorInterval) {
			clearInterval(this.monitorInterval);
		}

		// Set up periodic updates
		const updateFreqMs = (this.args.updateFreq || 30) * 1000;
		console.log(`Starting monitoring with update frequency: ${updateFreqMs}ms`);

		this.monitorInterval = setInterval(async () => {
			try {
				console.log(`Fetching messages at ${new Date().toISOString()}`);
				await this.yt.GetMessages(); // WARN: THIS ERRORS FOR SOME REASON AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
			} catch (error) {
				console.error("Error during monitoring update:", error);
			}
		}, updateFreqMs);
	}

	StopMonitoring() {
		console.log("Stopping monitoring");
		if (this.monitorInterval) {
			clearInterval(this.monitorInterval);
			this.monitorInterval = null;
		}
	}

	// --- helper: parse TTS command flags ---
	parseTTSMessage(raw) {
		const regex = /^!(TTS|TIB|BOT)\s+(.*)$/i;
		const match = raw.match(regex);
		if (!match) return null;

		const argsStr = match[2];
		const parts = argsStr.trim().split(/\s+/);

		let flags = {
			p: "",
			r: "",
			v: "",
		};

		let msgParts = [];
		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === "-r" && parts[i + 1]) {
				flags.r = parts[i + 1];
				i++;
			} else if (parts[i] === "-v" && parts[i + 1]) {
				flags.v = parts[i + 1];
				i++;
			} else if (parts[i] === "-p" && parts[i + 1]) {
				flags.p = parts[i + 1];
				i++;
			} else {
				msgParts.push(parts[i]);
			}
		}

		return { flags, message: msgParts.join(" ") };
	}

	async CallTts(input = {}) {
		const flagsIn = input.flags || {};
		const flags = {
			p: flagsIn.p || GEBI("ttsPitch")?.value || LSGI("ttsPitch") || "1",
			r: flagsIn.r || GEBI("ttsRate")?.value || LSGI("ttsRate") || "1",
			v: flagsIn.v || GEBI("ttsVoice")?.value || LSGI("ttsVoice") || 51,
		};

		const message = input.message || input.messages || "";
		if (!message) {
			console.error("could not call tts, message is empty");
			return;
		}

		const getVoices = () => new Promise((resolve) => {
			let v = window.speechSynthesis.getVoices();
			if (v && v.length) return resolve(v);
			const onChange = () => {
				window.speechSynthesis.removeEventListener('voiceschanged', onChange);
				resolve(window.speechSynthesis.getVoices());
			};
			window.speechSynthesis.addEventListener('voiceschanged', onChange);
			setTimeout(() => resolve(window.speechSynthesis.getVoices()), 250);
		});

		const voices = await getVoices();
		const utter = new SpeechSynthesisUtterance(message);

		let desiredVoice = null;
		if (flags.v) {
			const maybeIdx = Number(flags.v);
			if (!Number.isNaN(maybeIdx) && voices[maybeIdx]) {
				desiredVoice = voices[maybeIdx];
			} else {
				desiredVoice = voices.find(v => v.name === flags.v || v.lang === flags.v);
			}
		}
		if (desiredVoice) utter.voice = desiredVoice;

		utter.rate = Number(flags.r) || 1;
		utter.pitch = Number(flags.p) || 1;

		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utter);
	}

	async GetMessages() {
		let resp;
		try {
			resp = await this.yt.GetMessages();
		}
		catch (err) {
			console.warn("error getting messages, might be becasue of page index, lowering by one then trying again next update :3");
			this.yt.args.pageCount -= 1;
			if (this.yt.args.pageCount < 0) { this.yt.args.pageCount = 0; }
		}
		const yt_messages = resp?.items || [];

		if (!yt_messages.length) {
			console.log("No messages returned");
			return;
		}

		const table = document.getElementById("messagesTable");
		if (!table) throw new Error("no message table found");

		const esc = (s) => String(s ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");

		let newMessages = false;
		for (let i = 0; i < yt_messages.length; ++i) {
			const item = yt_messages[i];
			const msg = {
				author: item.authorDetails?.displayName ?? "Unknown",
				message: item.snippet?.displayMessage ?? "",
				publishedAt: item.snippet?.publishedAt ?? "",
			};

			// Deduplication check
			const existing = table.querySelector(
				`tr[data-author="${esc(msg.author)}"][data-published="${esc(msg.publishedAt)}"]`
			);
			if (existing) { continue };
			newMessages = true // NOTE: if this is not reached, incr page count

			this.messageIndex++;
			const idx = this.messageIndex;

			const parsed = this.parseTTSMessage(msg.message);
			const isTtsTrigger = !!parsed;

			let flags = {};
			if (parsed) {
				flags = {
					p: parsed.flags?.p || "",
					r: parsed.flags?.r || "",
					v: parsed.flags?.v || "",
				};
			}

			const safeAuthor = esc(msg.author);
			const safePublished = esc(msg.publishedAt);
			const safeMessage = esc(parsed ? parsed.message : msg.message);

			const tr = document.createElement("tr");
			tr.setAttribute("data-author", safeAuthor);
			tr.setAttribute("data-published", safePublished);
			tr.innerHTML = `
				<td>${idx}</td>
				<td>${safeAuthor}</td>
				<td>${safePublished}</td>
				<td>${JSON.stringify(flags)}</td>
				<td>${safeMessage}</td>
				<td><button id="btnPlay_${idx}">Play</button></td>
				<td><input id="tts_${idx}" type="checkbox" ${isTtsTrigger ? "checked" : ""}></td>
				<td id="tdTimeout_${idx}"></td>
				<td id="tdBlock_${idx}"></td>
				<td id="tdBan_${idx}"></td>
			`;

			// Timeout button
			const btnTimeout = document.createElement("button");
			btnTimeout.textContent = "Timeout";
			tr.querySelector(`#tdTimeout_${idx}`).appendChild(btnTimeout);

			// Block checkbox
			const cbBlock = document.createElement("input");
			cbBlock.type = "checkbox";
			tr.querySelector(`#tdBlock_${idx}`).appendChild(cbBlock);

			// Ban button
			const btnBan = document.createElement("button");
			btnBan.textContent = "Ban";
			btnBan.addEventListener("click", () => {
				const pin = prompt("Enter 6-digit PIN to ban user:");
				if (pin === "123456") {
					alert(`Banned user ${msg.author}`);
				} else {
					alert("Invalid PIN. Ban cancelled.");
				}
			});
			tr.querySelector(`#tdBan_${idx}`).appendChild(btnBan);

			// Play button
			const playBtn = tr.querySelector(`#btnPlay_${idx}`);
			if (playBtn) {
				playBtn.addEventListener("click", () => {
					const messageText = parsed ? parsed.message : msg.message;
					this.CallTts({ flags, message: messageText });
				});
			}

			table.appendChild(tr);
		}

		if (newMessages == false) {
			this.yt.args.pageCount += 1;
			console.log("no new messages found, waiting one second then trying again");
			await setTimeout(1000);
			GetMessages();
		}

		return yt_messages;
	}
}
