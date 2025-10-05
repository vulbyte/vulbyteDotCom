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

		const apiKey = GEBI("youtube_apiKey")?.value;
		const broadcastId = GEBI("youtube_broadcastId")?.value;

		this.yt = new YoutubeStuff({
			apiKey: apiKey,
			broadcastId: broadcastId
		});

		this.monitorInterval = null;
		this.messageIndex = 0;

		// IMPORTANT: Store the nextPageToken to get new messages
		this.nextPageToken = null;
	}

	async StartMonitoring() {
		if (this.firstStart === true) {
			if (!this.yt.args.apiKey) {
				this.yt.args.apiKey = GEBI("youtube_apiKey")?.value;
			}
			if (!this.yt.args.broadcastId) {
				this.yt.args.broadcastId = GEBI("youtube_broadcastId")?.value;
			}

			this.firstStart = false;
			console.log(`Loading complete chat history for broadcast: ${this.yt.args.broadcastId}`);

			try {
				await this.GetMessages();
			} catch (error) {
				console.error("Error getting initial messages:", error);
				throw error; // Propagate error so UI can show it
			}
		}

		if (this.monitorInterval) {
			clearInterval(this.monitorInterval);
		}

		const updateFreqMs = (this.args.updateFreq || 30) * 1000;
		console.log(`Starting monitoring with update frequency: ${updateFreqMs}ms`);

		this.monitorInterval = setInterval(async () => {
			try {
				console.log(`Fetching messages at ${new Date().toISOString()}`);
				// Pass the nextPageToken to get new messages
				await this.GetMessages(this.nextPageToken);
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

	async GetMessages(pageToken = undefined) {
		let resp;
		try {
			// Pass the pageToken to get the next batch of messages
			resp = await this.yt.GetMessages(pageToken);
		}
		catch (err) {
			console.error("Error getting messages:", err);
			throw err;
		}

		// IMPORTANT: Store the nextPageToken for the next request
		if (resp.nextPageToken) {
			this.nextPageToken = resp.nextPageToken;
			console.log(`Got nextPageToken: ${this.nextPageToken}`);
		}

		// Also respect the pollingIntervalMillis if provided
		if (resp.pollingIntervalMillis) {
			console.log(`YouTube recommends polling every ${resp.pollingIntervalMillis}ms`);
		}

		const yt_messages = resp?.items || [];

		if (!yt_messages.length) {
			console.log("No messages returned");
			return;
		}

		console.log(`Processing ${yt_messages.length} messages`);

		const table = document.getElementById("messagesTable");
		if (!table) throw new Error("no message table found");

		const esc = (s) => String(s ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");

		let newMessagesCount = 0;
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
			if (existing) {
				console.log(`Skipping duplicate message from ${msg.author}: "${msg.message}"`);
				continue;
			}

			console.log(`Adding NEW message from ${msg.author}: "${msg.message}"`);

			newMessagesCount++;
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

		console.log(`Added ${newMessagesCount} new messages to table`);
		return yt_messages;
	}

	async ValidateTTSMessage(message) {
		// TODO: Implement validation
	}

	async EvaluateMessageScore(message, debug = false) {
		if (debug === true) {
			console.log("checking message score");
		}

		let checks = [0, 0, 0, 0, 0, 0, 0];
		let score = 0;

		// 1. Check punctuation and capitalization
		for (let i = 0; i < message.length; ++i) {
			let char = message[i];
			if (char == "." || char == "?" || char == "!") {
				if (message[i + 1] == " " || message[i + 2] == " " || message[i + 3] == " ") {
					score += 30;
					checks[0] = 1;
				}
			}
		}

		// 2. Check trigrams
		let trigramScore = 0;
		let trigramIndexs = [];
		for (let i = 0; i < message.length; ++i) {
			if (message[i] == " ") {
				trigramIndexs.push(i + 1);
			}
		}
		for (let i = 0; i < trigramIndexs.length; ++i) {
			for (let j = 0; j < trigrams.length; ++j) {
				if (message.slice(trigramIndexs[i], trigramIndexs[i] + 3) == trigrams[j]) {
					trigramScore += 1;
					checks[1] = 1;
				}
			}
		}

		// 3. Check if first letter is capital
		let isFirstLetterCapital = false;
		for (let i = 0; i < capitals.length; ++i) {
			if (message[0] == capitals[i]) {
				isFirstLetterCapital = true;
				break;
			}
		}
		if (isFirstLetterCapital) {
			score += 20;
			checks[2] = 1;
		} else {
			score -= 10;
		}

		// 4. Check for repeated letters
		for (let i = 0; i < message.length; ++i) {
			let char = message[i];
			if (message[i + 1] == char && message[i + 2] == char) {
				score -= 50;
				checks[3] = 0;
			} else {
				checks[3] = 1;
			}
		}

		// 5. Check space ratio
		let spaceCount = 0;
		for (let i = 0; i < message.length; ++i) {
			if (message[i] == " ") {
				spaceCount += 1;
				checks[4] = 1;
			}
		}
		if ((spaceCount * 100) / (message.length - spaceCount) < 20) {
			score -= 20;
		} else {
			score += 20;
		}

		// 6. Check long messages for punctuation
		if (message.length > 75) {
			if (message.includes(",") || message.includes(".") || message.includes("?") || message.includes("!")) {
				checks[5] = 1;
			} else {
				score -= 150;
			}
		} else {
			checks[5] = 1;
		}

		// 7. Check 32-character chunks for spaces
		for (let i = 0; i < message.length; i += 32) {
			let chunk = message.slice(i, i + 32);
			if (!chunk.includes(" ")) {
				score -= 20;
				checks[6] = 0;
			} else {
				checks[6] = 1;
			}
		}

		if (debug === true) {
			console.log(`score of message is: ${score}`);
		}
		return score;
	}
}

const capitals = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const minuscules = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const validSpecials = [
	',', '.', '?', '/', '!', '#', '$', '%', '^', '&', '"', "'", ";", ":", "-", "_", "~", '+', '=', '⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹',
];

const trigrams = ['aaa', 'bbb'];
