// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import YoutubeStuff from "./youtubeStuff.js";



//magic values

export default class MonitorMessages {
	//tldr: this is largely ment to live as state, with functions used to monitor state
	// VARS private messages should be treated as static.
	#bannedAtTemplate = {
		datetime: "",
		unbannedAt: [],
		bannAppeals: [],
	}
	#usersTemplate = {
		authorName: "",
		authorId: "",
		bannedFromTtsAt: "", // when first interation with the stream
		banHistory: [], // when the user was banned, not banned if null
		firstSeen: "", // when first interation wit hthe stream
		points: 0,
	};
	#serviceHandlers = {
		//loose to be extensiable
		youtube: new YoutubeStuff(),
	}
	#users = [];
	/*
		#unprocessed_queue = []; // messages returned from yt fetch
		#messages_queue = []; // messages processed
		#clip_queue = [];
	*/
	#trigrams = async () => {
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => {
				console.log("Could not load trigrams (Timeout)");
				reject(new Error("Timeout: Failed to load trigrams."));
			}, 8000);
		});

		const fetchPromise = fetch("./tib_stuff/trigrams.json")
			.then(res => {
				if (!res.ok) {
					// Throwing an error here triggers the catch block in the race
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				// Use await or return the inner promise, or simply return the JSON promise
				return res.json();
			});

		try {
			// Race the fetch operation against the 8-second timeout
			const trigramsData = await Promise.race([fetchPromise, timeoutPromise]);

			// This line now logs the actual data, not the promise object
			console.log("✅ TRIGRAMS LOADED! Data sample:", JSON.stringify(trigramsData).substring(0, 50) + '...');

			return trigramsData;
		} catch (error) {
			// This catches the timeout OR the fetch/HTTP error
			console.error("🛑 Trigrams loading failed:", error.message);
			// The method will reject/throw here, allowing the caller to handle the failure
			throw error;
		}
	}

	config = {
		monitorMessages: {
			debug: true,
		},
		flag: {
			description: "used to define the token used to trigger the tts,",
			token: "!",
			positionOptions: [
				"start",
				"end",
				"anything_after",
			],
			positionSelected: "start", //
		},
		commands: { //comes after the token ie: !clip
			clip: {
				description: "used to timestamp the current moment for vulbyte",
				function: this.clipHandler,
			},
			help: {
				description: "used to send the help instructions",
				function: this.helpHandler,
			},
			tts: {
				description: "used to add a tts message to the queue",
				function: this.textToSpeechHandler
			},
		}
	}
	async clipHandler() {
	}
	async helpHandler() {
	}
	async textToSpeechHandler() {
	}

	async GetMessages() {
		this.serviceHandlers.yt.GetMessages
	}

	async ParseMessageAndAddToTable(rawMessageObject) {
		if (rawMessage == undefiend) {
			throw new Error("rawMessage passed into EvalForCommands is undefined");
		}

		let parsedMessage = {
			authorName: "", // @vulbyte
			authorId: "", // asdf1234hjkl6789
			date: "",
			flags: "",
			message: "",
			platform: "", //youtube, twitch, etc
			score: "",
		};
	}

	// PRIVATE FUNCTIONS
	#LSGI(id) {
		return localStorage.getItem(String(id));
	}
	#GEBI(id) {
		return document.getElementById(id);
	}
	#messageDisbatch(message) { }
	// PUBLIC (laid out by general flow)
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

			const parsed = await this.parseTTSMessage(msg.message);
			const isTtsTrigger = !!parsed;
			let messageColor = "inherit";
			if (isTtsTrigger) {
				messageColor = "#00E5FF";
			}

			let flags = {};
			let flagsColor = "inherit";
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

			// colors to help readiblity
			let score = await this.EvaluateMessageScore(safeMessage);
			let scoreColor = "inherit";
			//highest to lowest
			if (score > 1000) { scoreColor = "#E62117" }
			else if (score > 500) { scoreColor = "#E91E63" }
			else if (score > 200) { scoreColor = "#F57C00" }
			else if (score > 100) { scoreColor = "#FFCA28" }
			else if (score > 50) { scoreColor = "#1DE9B6" }
			else if (score > 20) { scoreColor = "#00E5FF" }
			else if (score > 0) { scoreColor = "#1E88E5" }
			else if (score < 0) { scoreColor = "#0000E5" }


			const tr = document.createElement("tr");
			tr.setAttribute("data-author", safeAuthor);
			tr.setAttribute("data-published", safePublished);
			tr.innerHTML = `
				<td>${idx}</td>
				<td>${safeAuthor}</td>
				<td>${safePublished}</td>
				<td style="color:${flagsColor};">${JSON.stringify(flags)}</td>
				<td style="color:${scoreColor}">${score}</td>
				<td style="color:${messageColor}">${safeMessage}</td>
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

	async ScoreMessage(message) {
		function CheckPunctuation(message) {
			let score = 0;

			if (message.length > 75) {
				if (message.includes(",") || message.includes(".") || message.includes("?") || message.includes("!")) {
				} else {
					score -= 150;
				}
			}

			for (let i = 0; i < message.length; ++i) {
				let char = message[i];
				if (
					char == "."
					|| char == "?"
					|| char == "!"
				) {
					if (
						message[i + 1] == " "
						|| message[i + 2] == " "
						|| message[i + 3] == " "
					) {
						score += 30;
					}
				}
			}

			console.log(`score check CheckPunctuation(): ${score}`);

			return score;
		}
		function CheckTrigrams(message) {
			let score = 0;
			try {
				const words = message.trim().toLowerCase().split(/\s+/);

				for (const word of words) {
					if (word.length >= 3) {
						const currentTrigram = word.slice(0, 3);
						let validTrigramFound = false;
						if (trigrams.includes(currentTrigram)) {
							//console.log(`valid trigram! (${currentTrigram})`);
							score += 50;
							validTrigramFound = true;
						}
						if (!validTrigramFound) {
							score -= 50;
						}
					}
					// Words shorter than 3 letters are implicitly ignored for scoring
				}
				console.log(`score CheckTrigrams(): ${score}`);
				return score;
			}
			catch (err) {
				console.error("err with CheckTrigrams(): ", err);
				throw new Error("Error processing message logic.");
			}
			return 0;
		}
		function CheckForRepeats(message) {
			let score = 0;
			for (let i = 0; i < message.length; ++i) {
				let char = message[i];
				if (message[i + 1] == char && message[i + 2] == char) {
					score -= 50;
				}
			}
			console.log(`score CheckForRepeats(): ${score}`);
			return score;
		}
		function CheckForCaps(message) {
			let score = 0;
			if (message[0] == message.charAt(0).toUpperCase()) {
				score += 20;
			} else {
				score -= 10;
			}
			console.log(`score CheckForCaps(): ${score}`);
			return score;
		}
		function CheckForSpaces(message) {
			let score = 0;
			let spaceCount = 0;
			for (let i = 0; i < message.length; ++i) {
				if (message[i] == " ") {
					spaceCount += 1;
				}
			}
			if ((spaceCount * 100) / (message.length - spaceCount) < 20) {
				score -= 20;
			} else {
				score += 20;
			}
			console.log(`score CheckForSpaces(): ${score}`);
			return score;
		}
		function CheckForSpaceInChunk(message) {
			let score = 0;
			for (let i = 0; i < message.length; i += 32) {
				let chunk = message.slice(i, i + 32);
				if (!chunk.includes(" ")) {
					score -= 20;
				} else {
				}
			}
			console.log(`score CheckForSpaceInChunk: ${score}`);
			return score;
		}
		let score = 0;

		const functions = [
			CheckPunctuation,
			CheckTrigrams,
			CheckForRepeats,
			CheckForCaps,
			CheckForSpaces,
			CheckForSpacesInChunk,
		];

		for (let i = 0; i < functions.length; ++i) {
			score += functions[i](message);
			if (this.config.monitorMessages.debug == true) {
				console.log(`score eval at step_${i}: ${score}`);
			}
		}

		return score;
	}


	async EvaluateMessageScore(message) {
		if (this.config.monitorMessages.debug === true) {
			console.log("checking message score");
		}

		const scoreFunctions = [
			this.CheckPunctuation,
			this.CheckTrigrams,
			this.CheckForRepeats,
			this.CheckForCaps,
			this.CheckForSpaces,
			this.CheckForSpaceInChunk,

		]
		let score = 0;

		for (let i = 0; i < scoreFunctions.length; ++i) {
			score += await scoreFunctions[i](message);
			console.log("score: ", score);
		}


		// 5. Check space ratio

		// 6. Check long messages for punctuation

		// 7. Check 32-character chunks for spaces
		if (this.config.monitorMessages.debug === true) {
			console.log(`score of message is: ${score}`);
		}
		return score;
	}
	// RUN
	constructor(args = {}) {
		this.args = args;
		this.firstStart = true;

		const apiKey = this.#GEBI("youtube_apiKey")?.value;
		const broadcastId = this.#GEBI("youtube_broadcastId")?.value;

		this.yt = new YoutubeStuff({
			apiKey: apiKey,
			broadcastId: broadcastId
		});

		this.monitorInterval = null;
		this.messageIndex = 0;

		// IMPORTANT: Store the nextPageToken to get new messages
		this.nextPageToken = null;

	}
}

/*
async StartMonitoring() {
	if (this.firstStart === true) {
		if (!this.yt.args.apiKey) {
			this.yt.args.apiKey = this.#GEBI("youtube_apiKey")?.value;
		}
		if (!this.yt.args.broadcastId) {
			this.yt.args.broadcastId = this.#GEBI("youtube_broadcastId")?.value;
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
};

StopMonitoring() {
	console.log("Stopping monitoring");
	if (this.monitorInterval) {
		clearInterval(this.monitorInterval);
		this.monitorInterval = null;
	}
}

evalTTS() {

}

parseTTSMessage(raw) {
	if (raw[0] != '!') {
		//not a cmd, exiting	
		return { message: raw };
	}

	//check for help
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
		p: flagsIn.p || this.#GEBI("ttsPitch")?.value || this.#LSGI("ttsPitch") || "1",
		r: flagsIn.r || this.#GEBI("ttsRate")?.value || this.#LSGI("ttsRate") || "1",
		v: flagsIn.v || this.#GEBI("ttsVoice")?.value || this.#LSGI("ttsVoice") || 51,
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
*/
