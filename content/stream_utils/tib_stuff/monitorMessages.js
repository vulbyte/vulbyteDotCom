// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import { YoutubeStuff } from "./youtubeStuff.js";

function LSGI(id) {
	return localStorage.getItem(String(id));
}
function GEBI(id) {
	return document.getElementById(id).value; // fetch value from input if DOM element
}
export default class MonitorMessages {
	constructor(args = {}) {

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
		const regex = /^!(TTS|TIB|BOT)\s+(.*)$/i;
		const match = raw.match(regex);
		if (!match) return null;

		const argsStr = match[2];
		const parts = argsStr.trim().split(/\s+/);

		let flags = { r: null, v: null, p: null };
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

	async GetMessages() {
		let yt_messages = await this.yt.GetMessages(); // BUG: UNDEFINED SOMEHOW???
		if (!yt_messages?.messages?.length) return;

		const table = document.getElementById("messagesTable");
		if (!table) {
			console.warn("No #messagesTable element found in DOM");
			return;
		}

		yt_messages.messages.forEach((msg) => {
			this.messageIndex++;

			// Try parsing TTS message
			const parsed = this.parseTTSMessage(msg.message);
			const isTtsTrigger = !!parsed;

			const row = document.createElement("tr");

			// Index
			const tdIndex = document.createElement("td");
			tdIndex.textContent = this.messageIndex;

			// User
			const tdUser = document.createElement("td");
			tdUser.textContent = msg.author;

			// Date
			const tdDate = document.createElement("td");
			tdDate.textContent = new Date(msg.publishedAt).toLocaleString();

			// ttsFlags
			const tdFlags = document.createElement("td");
			if (parsed) {
				let flagsOut = [];
				if (parsed.flags.r) flagsOut.push(`-r ${parsed.flags.r}`);
				if (parsed.flags.v) flagsOut.push(`-v ${parsed.flags.v}`);
				if (parsed.flags.p) flagsOut.push(`-p ${parsed.flags.p}`);
				tdFlags.textContent = flagsOut.join(" ");
			} else {
				tdFlags.textContent = "";
			}

			// Message (only cleaned text if parsed, otherwise raw)
			const tdMessage = document.createElement("td");
			tdMessage.textContent = parsed ? parsed.message : msg.message;

			// isInTtsQue (checkbox, auto-checked if parsed ok)
			const tdTtsQue = document.createElement("td");
			const cbTts = document.createElement("input");
			cbTts.type = "checkbox";
			cbTts.checked = isTtsTrigger;
			tdTtsQue.appendChild(cbTts);

			// timeUserOut (button)
			const tdTimeout = document.createElement("td");
			const btnTimeout = document.createElement("button");
			btnTimeout.textContent = "Timeout";
			btnTimeout.onclick = () => {
				alert(`Timeout user ${msg.author} for 10 minutes`);
			};
			tdTimeout.appendChild(btnTimeout);

			// block user from tts (checkbox)
			const tdBlockTts = document.createElement("td");
			const cbBlock = document.createElement("input");
			cbBlock.type = "checkbox";
			tdBlockTts.appendChild(cbBlock);

			// ban user (button with PIN)
			const tdBan = document.createElement("td");
			const btnBan = document.createElement("button");
			btnBan.textContent = "Ban";
			btnBan.onclick = () => {
				const pin = prompt("Enter 6-digit PIN to ban user:");
				if (pin === "123456") { // TODO: IMPL THIS
					alert(`Banned user ${msg.author}`);
				} else {
					alert("Invalid PIN. Ban cancelled.");
				}
			};
			tdBan.appendChild(btnBan);

			// Append cells to row
			row.appendChild(tdIndex);
			row.appendChild(tdUser);
			row.appendChild(tdDate);
			row.appendChild(tdFlags);
			row.appendChild(tdMessage);
			row.appendChild(tdTtsQue);
			row.appendChild(tdTimeout);
			row.appendChild(tdBlockTts);
			row.appendChild(tdBan);

			// Add row to table
			table.appendChild(row);
		});

		return yt_messages;
	}
}

