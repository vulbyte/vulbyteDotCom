// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import { YoutubeStuff } from "./youtubeStuff.js";

function LSGI(id) {
	return localStorage.getItem(String(id));
}
function GEBI(id) {
	const el = document.getElementById(id);
	return el ? el.value : undefined;
}

export default class MonitorMessages {
	constructor(args = {}) {
		this.args = args; // ✅ keep args for later access

		// only YouTube supported for now
		this.yt = new YoutubeStuff({
			updateYoutube: document.getElementById("youtube_enabled").getAttribute('checked'),
			apiKey: LSGI("youtube_apiKey") || GEBI("youtube_apiKey") || undefined,
			channelName: LSGI("youtube_channelName") || GEBI("youtube_channelName") || undefined,
		});

		this.timer = new IntTimer({
			name: `youtubeStuffTimer`,
			debugMode: true,
			printNormalizedTick: false,

			emitOnStart: false,
			tickAndTimeout: args.tickAndTimeout ?? true,

			timeoutListeners: [this.GetMessages.bind(this)],
			timeoutDuration: args.updateFreq ?? 30,
			killOnTimeout: args.timeout ?? true,
		});

		this.messageIndex = 0;
	}

	StartMonitoring() {
		this.timer.Start();
	}

	StopMonitoring() {
		this.timer.Stop();
	}

	// --- helper: parse TTS command flags ---
	parseTTSMessage(raw) {
		let parsed;
		const regex = /^!(TTS|TIB|BOT)\s+(.*)$/i;
		const match = raw.match(regex);
		if (!match) return null;

		const argsStr = match[2];
		const parts = argsStr.trim().split(/\s+/);

		let flags = {};

		if (parsed) {
			flags = {
				p: parsed.flags.p || "",
				r: parsed.flags.r || "",
				v: parsed.flags.v || "",
			};
		}
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

		return {
			flags,
			message: msgParts.join(" "),
		};
	}

	async CallTts(input = {}) {
		// Normalize flags and message
		const flagsIn = input.flags || {};
		const flags = {
			p: flagsIn.p ?? (() => { try { return GEBI("ttsPitch"); } catch (e) { return undefined; } })() ?? LSGI("ttsPitch") ?? "1",
			r: flagsIn.r ?? (() => { try { return GEBI("ttsRate"); } catch (e) { return undefined; } })() ?? LSGI("ttsRate") ?? "1",
			v: flagsIn.v ?? (() => { try { return GEBI("ttsVoice"); } catch (e) { return undefined; } })() ?? LSGI("ttsVoice") ?? "",
		};

		const message = input.message ?? input.messages ?? "";
		if (!message) {
			console.error("could not call tts, message is empty");
			return;
		}

		// helper: wait for voices if not loaded yet
		const getVoices = () => new Promise((resolve) => {
			let v = window.speechSynthesis.getVoices();
			if (v && v.length) return resolve(v);
			const onChange = () => {
				window.speechSynthesis.removeEventListener('voiceschanged', onChange);
				resolve(window.speechSynthesis.getVoices());
			};
			window.speechSynthesis.addEventListener('voiceschanged', onChange);
			// fallback after a short delay
			setTimeout(() => resolve(window.speechSynthesis.getVoices()), 250);
		});

		const voices = await getVoices();

		const utter = new SpeechSynthesisUtterance(message);

		// choose voice: support numeric index or name/lang match
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
		// ensure numbers
		utter.rate = Number(flags.r) || 1;
		utter.pitch = Number(flags.p) || 1;

		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utter);
	}

	async GetMessages() {
		let yt_messages = await this.yt.GetMessages();
		//if (!yt_messages?.messages?.length) return;

		const table = document.getElementById("messagesTable");
		if (!table) {
			console.warn("No #messagesTable element found in DOM");
			return;
		}

		// tiny helper to escape HTML so messages/authors do not break the row HTML
		const esc = (s) => String(s ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");

		yt_messages.messages.forEach((msg) => {
			// ✅ Deduplication check: look for an existing row with same author+timestamp
			const existing = table.querySelector(
				`tr[data-author="${esc(msg.author)}"][data-published="${esc(msg.publishedAt)}"]`
			);
			if (existing) {
				// Already in the table, skip adding
				return;
			}

			this.messageIndex++;
			const idx = this.messageIndex;

			// Try parsing TTS message
			const parsed = this.parseTTSMessage(msg.message);
			const isTtsTrigger = !!parsed;

			// build flags object
			let flags = {};
			if (parsed) {
				flags = {
					p: parsed.flags?.p || "",
					r: parsed.flags?.r || "",
					v: parsed.flags?.v || "",
				};
			}

			// safe values for inserting into innerHTML
			const safeAuthor = esc(msg.author);
			const safePublished = esc(msg.publishedAt);
			const safeMessage = esc(parsed ? parsed.message : msg.message);

			// create row with placeholders for complex DOM nodes
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

			// Create and append the real DOM nodes into the placeholder cells

			// Timeout button
			const btnTimeout = document.createElement("button");
			btnTimeout.textContent = "Timeout";
			//btnTimeout.addEventListener("click", () => {
			//alert(`Timeout user ${msg.author} for 10 minutes`);
			//});
			tr.querySelector(`#tdTimeout_${idx}`).appendChild(btnTimeout);

			// Block TTS checkbox (fresh element)
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

			// Hook up the Play button from the innerHTML row
			const playBtn = tr.querySelector(`#btnPlay_${idx}`);
			if (playBtn) {
				playBtn.addEventListener("click", () => {
					const messageText = parsed ? parsed.message : msg.message;
					const normalizedFlags = (typeof flags === "string") ? {} : flags;
					console.log("Play TTS:", messageText);
					this.CallTts({ flags: normalizedFlags, message: messageText });
				});
			}

			// Append the completed row to the table
			table.appendChild(tr);
		});

		return yt_messages;
	}
}

