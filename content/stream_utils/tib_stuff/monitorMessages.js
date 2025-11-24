// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import YoutubeStuff from "./youtubeStuff.js";

//magic values
const trigrams = await fetch('./tib_stuff/trigrams.json').then((res) => { return res.json() });;

export default class MonitorMessages {
	//tldr: this is largely ment to live as state, with functions used to monitor state
	// VARS private messages should be treated as static.
	#bannedAtTemplate = {
		datetime: "",
		unbannedAt: [],
		bannAppeals: [],
	}
	#serviceHandlers = {
		//loose to be extensiable
		youtube: new YoutubeStuff(),
	}
	#channelTemplate = {
		version: 1,
		platform: "",
		channelName: "",
		channelId: ""
	}
	#banAppealTemplate = {
		version: 1,
		message: "",
	}
	#banTemplate = {
		version: 1,
		iat: "",
		eat: "",
		reason: "",
		appeals: []
	}
	#users = [];
	/**
	 * @name usersTemplate
	 * @description - a constant data that is used as a reference for data parsing
	 * @param {number} version - version number of the template
	 * @param {string} authorName - display name of the user
	 * @param {Array<Object>} channels - channels made up of #channelTemplate's
	 * @param {string} uuid - "identifier for the user"
	 * @param {string} ttsBans - tts bans using the #banTemplate 
	 * @param {string} channelBans - channel bans using the #banTemplate
	 * @param {string} firstSeen - unixtime date format
	 * @param {number} points - points user has from channel activities
	 */
	#usersTemplate = {
		version: 1,
		authorName: "",
		channels: [],
		uuid: "",
		ttsBans: [],
		channelBans: [],
		firstSeen: "",
		points: 0,
	};
	/**
	 * @returns {JSON}
	 */
	async GetAndReturnUsers() {
		return this.#users;
	}
	#unprocessed_queue = []; // messages returned from yt fetch
	/**
	 * @name unpressed_queue
	 * @description - template for messages that have not been processed
	 * @param {number} version - version number of the unprocessed message template used
	 * @param {number} apiVersion - version of the api the message was got from
	 * @param {number} data - the data of the individual message
	 * @param {number} dateTime - the value of date.now of when the message was received.
	 * @param {string} platform - teh platform the message came from
	 * @param {string} failedProcessingAt - undefined if not attempted, if attempted will have a value from Date.now()
	 * @return {Array<Object>}
	 */
	#unprocessed_message_template = {
		version: 1,
		apiVersion: 3, //youtube, 
		data: undefined,
		dateTime: undefined,
		platform: undefined,
		failedProcessingAt: undefined,
	}
	/** 
	 * @returns {JSON}
	 */
	async GetAndReturnUnprocessedMessages() {
		return this.#unprocessed_queue;
	}
	#messages_queue = [];
	/** 
	 * @returns {JSON}
	 */
	async GetAndReturnProcessedMessages() {
		return this.#messages_queue;
	}

	/**
	 * @name #flagsTemplate
	 * @param {Array<string>} flag - the flag[s] to trigger the cmd, must be in an array
	 * @param {string} value - value for the flag
	 * @param {string} valueType - type for the input value to modify params
	 * @param {string} description - tldr of what the flag does to the cmd
	 * @param {range} if number, min and max values
	 */
	#flagsTemplate = {
		flag: undefined,
		value: undefined,
		description: undefined,
		range: { min: 0.5, max: 3 }
	}
	/**
	 * @name #commandTemplate
	 * @param {number} template_version - version of the command
	 * @param {string} command - flag to trigger the command
	 * @param {Array} flags - additional params to modify the command
	 * @param {Function} function - what code snippit to trigger when cmd is called
	 */
	#commandTemplate = {
		template_version: 1,
		command: undefined,
		flags: undefined,
		function: undefined, //function to call when triggered
	}
	#commands = [ // only add commands that are implimented
		{
			template_version: 1,
			command: "clip",
			flags: [
				{
					flag: ['p'],
					value: 1,
					description: "modifys the pitch of the tts",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['r', 's'],
					value: 1,
					description: "modifys the speed [rate] of the tts message",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['v'],
					value: 1,
					description: "modifys the voice of the tts message",
					range: { min: 0.5, max: 3 }
				},
			],
			function: '', //function to call when triggered
		},
		{
			template_version: 1,
			command: "help",
			flags: [
				{
					flag: ['p'],
					value: 1,
					description: "modifys the pitch of the tts",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['r', 's'],
					value: 1,
					description: "modifys the speed [rate] of the tts message",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['v'],
					value: 1,
					description: "modifys the voice of the tts message",
					range: { min: 0.5, max: 3 }
				},
			],
			function: '', //function to call when triggered
		},
		{
			template_version: 1,
			command: "tts",
			flags: [
				{
					flag: ['p'],
					value: 1,
					description: "modifys the pitch of the tts",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['r', 's'],
					value: 1,
					description: "modifys the speed [rate] of the tts message",
					range: { min: 0.5, max: 3 }
				},
				{
					flag: ['v'],
					value: 1,
					description: "modifys the voice of the tts message",
					range: { min: 0.5, max: 3 }
				},
			],
			function: this.CallTts, //function to call when triggered
		},
	]

	#message_template = {
		template_version: 1,
		authorName: "",
		authorId: "",
		streamOrigin: "", //what streamid via the platform the message came from
		date: "",
		commands: [],
		procesedMessage: "",
		platform: "",
		rawMessage: "",
		score: "",
	};
	#clip_queue = [];
	// NOTE: Assuming this function is part of a class/module where the '#' private syntax is valid.
	config = {
		monitorMessages: {
			debug: true,
			strictMode: false,
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
	}

	async MonitorLoop() {
		const daLoop = new Promise(async (RESOLVE, REJECT) => {
			let testsForPlatformMessages = [
				testGetYoutubeV3Messages = new Promise(async (RESOLVE, REJECT) => {
					await this.GetYoutubeV3Messages();
					await this.ProcessUnprocessedMessagesQueue();
					console.log()
				}),
			];


			// test everything, and if anything fails throw error
			if (this.config.monitorMessages.strictMode == true) {
				try {
					let testAllPlatforms = Promise.all(testsForPlatformMessages)
						.then(async (values) => {
							console.log("managed to get messages from each platform successfully:\n" + values);
						});
					await testAllPlatforms;
					RESOLVE("Got ALL PLATFORMS SUCCESSFULLY");
				}
				catch (err) {
					REJECT("FAILED TO GET DATA FROM ALL PLATFORMS");
				}
			}
			// test everything, if error log error
			else {
				for (let i = 0; i < testsForPlatforms.length; ++i) {
					try {
						await testsForPlatformsMessages[i]();
					}
					catch (err) {
						console.warn("could not get messages from platform:\n", err);
					}
				}
			}

		});
	}

	GetMessagesTimer = new IntTimer();
	async MonitoringStart() {
		try {
			//test it to see if it works
			await MonitorLoop();
			//if works, then you can start the timer
			this.GetMessagesTimer.AddTimeoutListener(MonitorLoop);
		}
		catch (err) {
			console.log("test loop failed, probably shouldn't continue");
			if (this.config.monitorMessages.strictMode == true) {
				throw new Error("error in MonitorLoop(), failed and threw error");
			}
		}
	}
	async MonitoringStop() {
		this.GetMessagesTimer.RemoveTimeoutListener(MonitorLoop);
	}

	async AutoTtsStart() {

	}
	async AutoTtsStop() {

	}

	async VerifyConfig() {
		try {
			await this.yt.VerifyConfig()
		}
		catch (err) {
			console.log("could not verify config:\n" + err);
		}
	}


	async GetYoutubeV3Messages() {
		try { //youtube
			let resp;
			// Pass the pageToken to get the next batch of messages
			resp = await this.yt.GetMessages(pageToken);
			if (resp.nextPageToken) {
				this.nextPageToken = resp.nextPageToken;
				console.log(`Got nextPageToken: ${this.nextPageToken}`);
			}
			if (resp.pollingIntervalMillis) {
				console.log(`YouTube recommends polling every ${resp.pollingIntervalMillis}ms`);
			}
			const yt_messages = resp?.items || [];
			if (!yt_messages.length) {
				console.log("No messages returned");
				return;
			}
			for (let i = 0; i < yt_messages.length; ++i) {
				this.#unprocessed_queue += this.yt_messages[i] //yt_messages
			}

			const res = await fetch(messagesUrl);
			const data = await res.json();

			let item;
			for (let i = 0; i < data.length; ++i) {
				item = this.#unprocessed_message_template; // reinit

				item.data = data.items[i];
				item.version = 1;
				item.dateTime = Date.now();
				item.platform = "youtube";
				item.apiVersion = 3;

				this.#unprocessed_queue += item;
			}

			if (this.config.monitorMessages.debug == true) {
				console.log("finished adding all the items to the arr");
			}
		}
		catch (err) {
			console.error("Error getting messages from youtube:", err);
			throw err;
		}
	}
	/**
	 * @returns {null}
	 */
	async GetMessages() {
		let messageLists = new Promise.all([GetYoutubeV3Messages()]).then((values) => {

		});
	}

	sanitizeString(strang) {
		if (typeof strang !== 'string') {
			throw new Error("strang is not a string, UNEXPECTED DATA TYPE");
		}

		const miniscules = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		const caps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		const specials = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']', '?', '/', '|', '.', ',', ':', ';'];
		const valid_chars = miniscules + caps + numbers + specials;

		let matchFound = false;
		for (let i = 0; i < strang.length; ++i) {
			for (let j = 0; j < valid_chars.length; ++j) {
				if (strang[i] == valid_chars[j]) {
					matchFound = true
					break;
				}
			}
			if (!matchFound) {
				strang[i] = '';
			}
		}
		return strang
	}

	async dispatchCommand(raw, commandPrefix = this.config.flag.token) {

		//quick exit
		if (raw == '' || raw == undefined || raw == null) { throw new Error("MALFORMED INPUT, raw input is null"); }


		if (!raw.startsWith(commandPrefix)) {
			return { message: raw };
		}
		let message = raw.slice(commandPrefix.length, raw.length);

		let ft = this.#flagsTemplate;
		/*
		ft.flag
		ft.range
		ft.value
		ft.description
		*/
		const cmds = this.#commands;

		for (let i = 0; i < cmds.flags.length; ++i) {
			if (message.startsWith(smds.flags.flag)) {

			}
		}





		// 1. Isolate the message AFTER the token
		const messageAfterToken = raw.substring(commandPrefix.length).trim();

		let commandName = null;
		let argsStr = null;

		// 2. Iterate over the array to find a command match
		for (const command of SUPPORTED_COMMANDS) {
			// Create the full expected command string (e.g., "tts ")
			const commandString = command + ' ';

			// Check if the message starts with the command followed by a space
			if (messageAfterToken.toLowerCase().startsWith(commandString)) {
				commandName = command;
				// The arguments are everything after the command and the first space
				argsStr = messageAfterToken.substring(commandString.length).trim();
				break; // Stop iteration once a command is found
			}

			// Also check for the case where the command is alone (e.g., "!prefixhelp")
			if (messageAfterToken.toLowerCase() === command) {
				commandName = command;
				argsStr = ""; // No arguments
				break;
			}
		}

		if (!commandName) {
			// Prefix used, but command is unrecognized
			return null;
		}

		// The rest of the logic remains the same:
		let parsedArgs;

		// 3. Use a SWITCH statement to determine which argument parser to use
		switch (commandName) {
			case ('tts'):
				// Delegate complex argument/flag parsing to a dedicated function
				return this.ProcessTtsMessage(message);
			case ('clip'):
			case ('help'):
			// For simple commands, just use the arguments string
			//parsedArgs = { flags: {}, message: argsStr };
			//break;

			default:
				return null;
		}
	}

	async CallTts(input, command = this.#commandTemplate) {
		command.flags = input.flags || {};
		let flags = {};

		message = input.message || input.messages || "";
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

	ProcessTtsMessage(raw) {
		if (raw[0] != '!') {
			//not a cmd, exiting	
			return null;
		}

		let command = this.#commandTemplate;
		command.flags = {
			p: flagsIn.p || this.#GEBI("ttsPitch")?.value || this.#LSGI("ttsPitch") || "1",
			r: flagsIn.r || this.#GEBI("ttsRate")?.value || this.#LSGI("ttsRate") || "1",
			v: flagsIn.v || this.#GEBI("ttsVoice")?.value || this.#LSGI("ttsVoice") || 51,
		}
		command.command;
		command.template_version = 1;
		command.function = this.CallTts;

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

	/** 
	 * @name ProcessV3YoutubeMessage
	* @description - takes in an unprocessed message from the youtube v3 api, then
	* @returns {JSON} - returns a mesasge of template #message_template [v1]
	*/
	async ProcessV3YoutubeMessage(objectIn) {
		/* TEMPLATE  
			    {
			      "kind": "youtube#liveChatMessage",
			      "etag": "7UKcHN1EfCGU4sMbPulLDDsM0ww",
			      "id": "LCC.EhwKGkNQNno1TXZDMzVBREZVMFVyUVlkbEVJQ3p3",
			      "snippet": {
				"type": "textMessageEvent",
				"liveChatId": "Cg0KC3VCVS1Pa0t5N0VVKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILdUJVLU9rS3k3RVU",
				"authorChannelId": "UCKZigHbgpJG9ldxXMqmiZUg",
				"publishedAt": "2025-11-07T07:30:55.259559+00:00",
				"hasDisplayContent": true,
				"displayMessage": "THIS IS A REGULAR MESSAGE",
				"textMessageDetails": {
				  "messageText": "THIS IS A REGULAR MESSAGE"
				}
			      },
			      "authorDetails": {
				"channelId": "UCKZigHbgpJG9ldxXMqmiZUg",
				"channelUrl": "http://www.youtube.com/channel/UCKZigHbgpJG9ldxXMqmiZUg",
				"displayName": "@vulbyte",
				"profileImageUrl": "https://yt3.ggpht.com/jrcU7ZjcLMBzCQbU6QMucPmC-cBiHOFrmTpDS9gDzUdH9FUTyzqgrkX9-rXzRh6Fac_HWWgNoEA=s88-c-k-c0x00ffffff-no-rj",
				"isVerified": false,
				"isChatOwner": true,
				"isChatSponsor": false,
				"isChatModerator": false
			      }
			    },
		 *
		 */

		let processedMessage = this.#message_template;
		/*
		#message_template = {
			commands: "",
			message: "",
			score: "",
		};
		*/

		processedMessage.authorName = objectIn.authorDetails.displayName;
		processedMessage.authorId = objectIn.channelId;
		processedMessage.date = objectIn.snippet.publishedAt;
		/* parse tib flags */
		processedMessage.platform = "youtube";
		processedMessage.streamOrigin = objectIn.snippet.liveChatId;
		processedMessage.rawMessage = objectIn.textMessageDetails.messageText;

		processedMessage.processedMessage = (() => {
			let rm = processedMessage.rawMessage;
			let command = this.#commandTemplate;

			//trim
			rm = rm.trim();
			rm = sanitizeString(rm);


			//commands
			//flags
			//

		});

		if (jsonIn == undefined) {
			throw new Error("rawMessage passed into EvalForCommands is undefined");
		}

		const msg = {
			author: item.authorDetails?.displayName ?? "Unknown",
			message: item.snippet?.displayMessage ?? "",
			publishedAt: item.snippet?.publishedAt ?? "",
		};
	}
	async ProcessUnprocessedMessageQueue() {
		for (let i = 0; i < this.#unprocessed_queue.length; ++i) {
			try {
				switch (this.#unprocessed_queue[i].platform) {
					case ("youtube"):
						switch (this.#unprocessed_queue[i].apiVersion) {
							case (3):
								this.ProcessV3YoutubeMessage(this.#unprocessed_queue[i]);
						}
				}
			}
			catch (err) {
				console.warn("could not process message");
			}
		}
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

		console.log(`Processing ${yt_messages.length} messages`);

		const table = document.getElementById("messagesTable");
		if (!table) throw new Error("no message table found");


		let newMessagesCount = 0;
		for (let i = 0; i < yt_messages.length; ++i) {
			const item = yt_messages[i];

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
		// 1. DEFINE ALL SCORING FUNCTIONS (using arrow functions for 'this' context) 
		const CheckPunctuation = (message) => {
			let score = 0;

			// Long messages without basic punctuation get penalized
			if (message.length > 75) {
				if (!(message.includes(",") || message.includes(".") || message.includes("?") || message.includes("!"))) {
					score -= 150;
				}
			}

			// Reward for proper spacing after end-of-sentence punctuation
			for (let i = 0; i < message.length; ++i) {
				let char = message[i];

				if (char === "." || char === "?" || char === "!") {
					// Check if the next 1, 2, or 3 characters contain a space (handles single space, double space, etc.)
					const nextChar = message[i + 1];
					const nextNextChar = message[i + 2];
					const nextNextNextChar = message[i + 3];

					if (nextChar === " " || nextNextChar === " " || nextNextNextChar === " ") {
						score += 30;
					}
				}
			}
			console.log(`score CheckPunctuation(): ${score}`);
			return score;
		};

		const CheckTrigrams = async (message) => {
			// ⭐️ CRITICAL FIX: Ensure #trigrams data is loaded before accessing it
			/*
			if (!Array.isArray(this.#trigrams) || this.#trigrams.length === 0) {
				console.warn("Trigrams data is not yet loaded or is empty. Skipping CheckTrigrams.");
				return 0;
			}
			*/

			let score = 0;
			try {
				const words = message.trim().toLowerCase().split(/\s+/);

				for (const word of words) {
					if (word.length >= 3) {
						const currentTrigram = word.slice(0, 3);
						let validTrigramFound = false;

						// This is now safe: 'this' context is correct and data is checked
						if (trigrams.includes(currentTrigram)) {
							score += 50;
							validTrigramFound = true;
						}
						if (!validTrigramFound) {
							score -= 50;
						}
					}
				}

				console.log(`score CheckTrigrams(): ${score}`);
				return score;
			} catch (err) {
				console.error("Original error in CheckTrigrams:", err);
				// Re-throw the application error
				throw new Error("Error processing trigrams logic.");
			}
		};

		const CheckForRepeats = (message) => {
			let score = 0;
			// Safety: Stop 2 chars before the end to safely check i+1 and i+2
			for (let i = 0; i < message.length - 2; ++i) {
				let char = message[i];
				if (message[i + 1] === char && message[i + 2] === char) {
					score -= 50;
				}
			}
			console.log(`score CheckForRepeats(): ${score}`);
			return score;
		};

		const CheckForCaps = (message) => {
			let score = 0;
			if (message[0] === message.charAt(0).toUpperCase()) {
				score += 20;
			} else {
				score -= 10;
			}
			console.log(`score CheckForCaps(): ${score}`);
			return score;
		};

		const CheckForSpaces = (message) => {
			let score = 0;
			let spaceCount = 0;
			for (let i = 0; i < message.length; ++i) {
				if (message[i] === " ") {
					spaceCount += 1;
				}
			}
			const nonSpaceLength = message.length - spaceCount;

			// Avoid division by zero if the message is only spaces (though unlikely after cleaning)
			if (nonSpaceLength > 0 && (spaceCount * 100) / nonSpaceLength < 20) {
				score -= 20;
			} else if (nonSpaceLength > 0) {
				score += 20;
			}

			console.log(`score CheckForSpaces(): ${score}`);
			return score;
		};

		const CheckForSpaceInChunk = (message) => {
			let score = 0;
			for (let i = 0; i < message.length; i += 32) {
				let chunk = message.slice(i, i + 32);
				if (!chunk.includes(" ")) {
					score -= 20;
				}
				// The original logic had no else block, so we maintain that
			}
			console.log(`score CheckForSpaceInChunk: ${score}`);
			return score;
		};


		// 2. SCORING EXECUTION

		let score = 0;

		const functions = [
			CheckPunctuation,
			CheckTrigrams, // ASYNC function
			CheckForRepeats,
			CheckForCaps,
			CheckForSpaces,
			CheckForSpaceInChunk,
		];

		for (const func of functions) {
			let funcScore;

			// ⭐️ CRITICAL FIX: Await the async function to prevent NaN/Promise error
			if (func.constructor.name === 'AsyncFunction') {
				funcScore = await func(message);
			} else {
				funcScore = func(message);
			}

			// Add the returned numerical score
			score += funcScore;

			if (this.config.monitorMessages.debug === true) {
				console.log(`score eval at function call: ${score}`);
			}
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

		if (this.config.monitorMessages.debug == true) {
			console.warn("debug mode on, toggling strict mode to on for testing");
			this.config.monitorMessages.strictMode == true;
		}
	}
}

/*
evalTTS() {

}
*/
