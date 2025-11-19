// ================== monitorMessages.js ==================
import { IntTimer } from "./intTimer.js";
import YoutubeStuff from "./youtubeStuff.js";

//magic values
const trigrams = await fetch('./tib_stuff/trigrams.json').then((res) => { return res.json() });;

export default class MonitorMessages {
	INIT() { };
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
	#commandTemplate = {
		template_version: 1,
		command: undefined,
		flag: undefined,
		function: undefined, //function to call when triggered
	}
	#message_template = {
		template_version: 1,
		authorName: "",
		authorId: "",
		streamOrigin: "", //what streamid via the platform the message came from
		date: "",
		commands: "",
		processedMessage: "",
		platform: "",
		rawMessage: "",
		score: "",
		isDeleted: "", // archive messages incase user sends something bad then deletes
	};
	async GetAndReturnEmptyMessageTemplate() {
		let res = this.#message_template;
		for (let i = 0; i < Object.keys(res); ++i) {

		}
		return this.#message_template;
	}

	yt = new YoutubeStuff({});

	#clip_queue = [];
	// NOTE: Assuming this function is part of a class/module where the '#' private syntax is valid.
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
				function: this.textToSpeechHandler,
				readAt: "",
			},
		},
	}

	TIMING() { }

	MessageTimer = new IntTimer();
	TtsTimer = new IntTimer();

	async StartMonitoring() {
		try {
			//config
			if (this.yt.GetApiKey() == undefined) { throw new Error("YT CONFIG DOES NOT HAVE AN API KEY, CANNOT START)"); }
			if (this.yt.config.liveChatId == undefined) { throw new Error("YT CONFIG DOES NOT HAVE A LIVECHATID, CANNOT START)"); }

			//init
			await GetMessagesAndAddToUnprocessedQueue();
			await ProcessUnprocessedAndAddMessageQueue();

			//making the loop for timeout
			async function DaBiggieBoiLoop() {
				// process messages into queue
				this.#unprocessed_queue += await this.GetUnprocessedMessages();
				this.#messages_queue += await this.ProcessUnprocessedMessageQueue();
				await this.AddMessagesToTable();
			}

			MessageTimer.TimeoutListeners += DaBiggieBoiLoop;

			MessageTimer.Start();
			TtsTimer.Start();
			console.log("mm: started timers");
		}
		catch (err) {
			console.error("could not start the monitor messages due to error:\n" + err);
		}

	}

	async StopMonitoring() {
		MessageTimer.Stop();
		TtsTimer.Stop();
		console.log("mm: stopped timers");
	}

	async StartAutoTts() {

	}

	async StopAutoTts() {

	}

	DATAFLOW() { }

	ProcessUnprocessedAndAddMessageToQueue() {

	}

	async AddUnprocessedMessagesFromJsonToUnprocessedQueue(input) {
		if (input == undefined) { throw new Error("input is empty"); }

		let successfulness = {
			fail: 0,
			success: 0,
		}

		for (let i = 0; i < input.length; ++i) {
			// NOTE if the version needs to be updated, do so here!
			switch (input[i].version) {
				case (1):
					this.#unprocessed_queue += input[i];
					successfulness.success += 1;
					break;
				default:
					console.warn("incompatable version found, cannot add to list");
					successfulness.fail += 1;
			}
		}

		console.log(`unprocessed messages added to queue. the ratio of failed to successful messages is: \n❌${successfulness.failed} : ✅${successfulness.success}`);
	}


	async AddProcessUnprocessedfMessagesFromJsonToProcessedMessagesQueue(/* this uses the this.#unprocessed_queue*/) {
		if (this.#unprocessed_queue[0] == undefined) { throw new Error("unprocessed queue is empty"); }

		let successfulness = {
			fail: 0,
			success: 0,
		}

		for (let i = 0; i < input.length; ++i) {
			// NOTE if the version needs to be updated, do so here!
			switch (input[i].version) {
				case (1):
					this.#messages_queue += input[i];
					this.
						successfulness.success += 1;
					break;
				default:
					console.warn("incompatable version found, cannot add to list");
					successfulness.fail += 1;
			}
		}

		console.log(`unprocessed messages added to queue. the ratio of failed to successful messages is: \n❌${successfulness.failed} : ✅${successfulness.success}`);
	}


	async AddUsersFromJsonToProcessedMessagesQueue(input) {
		if (input == undefined) { throw new Error("input is empty"); }

		let successfulness = {
			fail: 0,
			success: 0,
		}

		for (let i = 0; i < input.length; ++i) {
			// NOTE if the version needs to be updated, do so here!
			switch (input[i].version) {
				case (1):
					this.#users += input[i];
					successfulness.success += 1;
					break;
				default:
					console.warn("incompatable version found, cannot add to list");
					successfulness.fail += 1;
			}
		}

		console.log(`unprocessed messages added to queue. the ratio of failed to successful messages is: \n❌${successfulness.failed} : ✅${successfulness.success}`);
	}




	/**
	 * @returns {null}
	 */
	async GetMessagesAndAddToUnprocessedQueue() {
		try { //youtube
			let resp;
			// Pass the pageToken to get the next batch of messages
			resp = await this.yt.GetMessages(pageToken);


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
	 * Filters a message string, keeping only a-zA-Z0-9, space, and a specified set of symbols.
	 * This implicitly removes emojis and other disallowed characters (like accented letters).
	 *
	 * @param {string} message - The input string to be cleaned.
	 * @returns {string} The cleaned message string.
	 */
	sanitizeString(message) {
		if (typeof message !== 'string') {
			return "";
		}

		// This regex defines all ALLOWED characters inside the square brackets [].
		// The caret (^) at the start of the brackets inverts the match, so it matches 
		// any character NOT in the set. The 'g' flag ensures global replacement.
		//
		// Allowed characters:
		// a-zA-Z0-9: Letters and numbers
		// \s: Whitespace (spaces, tabs)
		// ':;?/*&!@#$%^&*()<>:.,": The list of specific symbols you provided
		//
		const allowedCharsRegex = /[^a-zA-Z0-9\s':;?/*&!@#$%^&*()<>,.\"]/g;

		let cleanedMessage = message.replace(allowedCharsRegex, '');

		// Normalize spaces: Collapse multiple spaces into a single space, and trim.
		return cleanedMessage.replace(/\s+/g, ' ').trim();
	}

	/**
	 * Parses the message for the command prefix and command name using array iteration, then dispatches argument parsing.
	 * @param {string} raw - The raw message string.
	 * @param {string} commandPrefix - The custom prefix token.
	 * @returns {object|null} An object containing the command name, flags, and message, or null if no command is matched.
	 */
	dispatchCommand(raw, commandPrefix) {
		if (!raw.startsWith(commandPrefix)) {
			return { message: raw };
		}

		// Define the array of supported commands
		const SUPPORTED_COMMANDS = [
			'tts',
			'clip',
			'help'
		];

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
	async AddMessagesToTable(pageToken = undefined) {

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

			scoreColor = this.ColorForScoreValue();


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

	ColorFromScoreValue(score) {
		//highest to lowest
		if (score > 1000) { return "#E62117" }
		else if (score > 500) { return "#E91E63" }
		else if (score > 200) { return "#F57C00" }
		else if (score > 100) { return "#FFCA28" }
		else if (score > 50) { return "#1DE9B6" }
		else if (score > 20) { return "#00E5FF" }
		else if (score > 0) { return "#1E88E5" }
		return "#0000e5";
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

	TTS_STUFF() { }

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

	// RUN
	constructor(args = {}) {
		this.args = args;
		this.firstStart = true;

		let updatedConfiged = {
			apiKey: this.#GEBI("youtube_apiKey")?.value,
			broadcastId: this.#GEBI("youtube_broadcastId")?.value,
		}



		this.monitorInterval = null;
		this.messageIndex = 0;

		// IMPORTANT: Store the nextPageToken to get new messages
		this.nextPageToken = null;
	}
}

/*
evalTTS() {

}
*/
