import YoutubeV3 from "./imports/youtubeV3ApiAccessor/youtube_state.js"
import TTSManager from "./imports/webTTSManager/TTSManager.js";
import {IntTimer} from "/lib/intTimer.mjs";
import {DebugPrint} from "/lib/DebugPrint.mjs";
import {TrieTree} from "/lib/trie_tree.mjs";

// magic values
const trigrams = await fetch('./tib_stuff/trigrams.json')
 .then((res) => {return res.json()});

class Result {
  ok = false;
  data = undefined;
  message = undefined;
  constructor(ok, data, message) {}
}

class testTemplate {
  name = undefined;
  func = undefined;
  expectation = undefined;
  result = undefined;
  constructor(name, func, expectation, result) {
    this.name = name;
    this.func = func;
    this.expectation = expectation;
    this.result = result;
  };
  async Run() {
                console.log(`running Test for ${
      this.name}`);
                try {
                  ret = await this.func().then(res => {return res});
                } catch (err) {
                  return new Result(false, undefined, err);
                }
  }
};

export default class MonitorMessages {
	templates = {
		bannedAt: {
			version: 1, datetime : "", unbannedAt : [], bannAppeals : [],
		},
		channel: {
			version : 1, platform : "", channelName : "", channelId : ""
		},
		commendment: {
			version: 1,
			happenedAt: undefined,
			byUser: undefined, // uuid
			messageCommended: undefined, // messageCommended if any
		},
		commands: {
			version : 1,
			command : undefined,
			flags : undefined,
			func: undefined, // function to call when triggered
			//will check the highest perm first, the first to return true will be assumed. if none true assumed to be public
			AuthNeeded: { 
				owner: true,
				admin: false,
				mod: false,
				// trusted users are users who have a certain amount of lifetime score or time since first appearance.
				trusted: false, 
			}
		},
		errored_queue: {
		    version: 1,          	
		    data: undefined,           	// raw data that errored
		    hardware: undefined,       	// hardware info of the system that failed
		    erroredAt: undefined,      	// unixTime of when the error happened
		    errorMessage: undefined,   	// err.message for quick reference
		    stackTrace: undefined,     	// err.stack: captures the full path of the failure
		    processingStage: undefined,	// identifies which function/.valueblock was running
		    retryCount: 0              	// increments if you attempt to re-process
		},
		flags: {
			flag : undefined, 
			value : undefined, 
			description : undefined, 
			range : {min:0.5, max : 3}
		},
		messages: {
			version: 1,
			authorName: "",
			userUuid: "",
			streamOrigin: "", //what streamid via the platform the message came from
			receivedAt: "",
			commands: [],
			processedMessage: "",
			platform: "",
			messageId: "",
			rawMessage: "",
			score: "",
			state: {}
		},
		misconduct: {
			version: 1,
			happenedAt: undefined, // unixTimestamp	
			byUser: undefined, //  uuid
			messageMisconduct: undefined, // if null do not add
		},
		unprocessed_message_v1: {
			version : 1,
			apiVersion : 3, // youtube,
			data : undefined,
			dateTime : undefined,
			platform : undefined,
			failedProcessingAt : undefined,
		},
		user: {
			version : 1, 
			authorName : undefined,
			channels : [],
			uuid : undefined,
			ttsBans : [], // times they've been restricted from using tts (ie non-english, spam, etc)
			channelBans : [], // when banned and why
			conduct_score: 0, // -5 is the worst, 5 is the best, calculated at init or when a commendment or misconduct is added. ranks are in the following order (worst to best): 
			/*
				opal		- 1.5x score multiplier
				obsidian	- can send gifs
				diamond 	- 1.2x score multiplier
				platinum	- no more negative  -- here and above is trusted
				gold		- 1.1x score multiplier
				silver		- ...
				bronze		- 0.85x
				copper		- 0.75x score multiplier
				concrete	- user now automatically hidden from chat (not dashboard tho)
				dirt		- no chat customization perms
				trash		- 0.5x score multiplier
			*/
			commendments: {
				community: [], // welcoming, helpful, inclusivity, etc
				engaugement: [], // hype, constructive feedback, good chatting, etc
				support: [], //the only thing one can buy
			},
			misconduct: {
				discrimination: [], // racism, sexism, etc
				harassment: [], // bullying, hate speech, etc
				spam: [], // self-promo, asdl;fknfrtn, links, etc
				integrity: [], // language, spoilers, trolling/rage, bypassing filters
			},
			icon: undefined, //only allow icons from yt/twitch/etc
			isSponser: false, // is a paying memeber/has payed money this stream 
			isChatModerator: false, // can remove messages or but users on timeout
			isChatAdmin: false, // can manage blocked words, change chat modes, and some other things
			isVerified: false, // if they have been verified by the platform
			firstSeen: undefined, //Date.now()
			points : 0,
		}
	}

	#state = { // when saving and loading this is what will be saved/loaded
		bannedWords: new TrieTree(), // tree that's good for strings, basically all you need to worry about is: add(), remove(), ContainsString()
		clip_queue: [],
		// NOTE: Assuming this function is part of a class/module where
		config: {
		  monitorMessages : {
		    debug : true,
		    strictMode : false,
		  },
		  censoring: {
			  censorType: "replace", //options: replace with a char, swap word, shadow-ban
			  censorChar: "•",
			  censorWords: ["tacos"],
		  },
		  flag : {
		    description :
			"used to define the token used to trigger the tts,",
		    token : "!",
		    positionOptions : [
		      "start",
		      "end",
		      "anything_after",
		    ],
		    positionSelected : "start", //
		  },
		},
		commands: [ // only add commands that are implimented
			{
				version: 1,
				command: "rank",
				flags: [{ flag: ['d'], value: 1, description: "for people to add/update their rankings on a game", range: { min: 0.1, max: 10 } },
				],
				func: '', //function to call when triggered
				AuthNeeded: { owner: false, admin: false, mod: false, trused: false }
			},
			{
				version: 1,
				command: "clip",
				flags: [
					{ flag: ['d'], value: 1, description: "approximate duration of the clip in minutes", range: { min: 0.1, max: 10 } },
					{ flag: ['m'], value: 1, description: "a message the user can include", range: { min: 0.5, max: 3 } },
				],
				func: '', //function to call when triggered
				AuthNeeded: { owner: false, admin: false, mod: false, trused: false
				}
			},
			{
				version: 1,
				command: "help",
				flags: [{ flag: ['h'], value: 1, description: "show commands and other stuff"},],
				func: '', //function to call when triggered
				AuthNeeded: { owner: false, admin: false, mod: false, }
			},
			{
				version: 1,
				command: "tts",
				flags: [
					{ flag: ['p'], value: 1, description: "modifys the pitch of the tts", range: { min: 0.5, max: 3 } },
					{ flag: ['r', 's'], value: 1, description: "modifys the speed [rate] of the tts message", range: { min: 0.5, max: 3 } },
					{ flag: ['v'], value: 1, description: "modifys the voice of the tts message", range: { min: 0, max: 180 } },
				],
				AuthNeeded: { owner: false, admin: false, mod: false, trused: false},
				func: this.CallTts, //function to call when triggered
			},
		],
		debug: true,
		errored_queue: [], //queue for any/all messages that have errored for ANY reason
		messages: [],
		unprocessed_queue: [], // messages returned from yt fetch
		users: [],
	}
	ExportState() {
	    const jsonString = JSON.stringify(this.#state, (key, value) => {
		// Convert Trie to Array
		if (key === 'bannedWords' && value instanceof TrieTree) {
		    return value.ToArray();
		}

		// Remove functions (JSON can't save code pointers)
		if (typeof value === 'function') {
		    return undefined;
		}

		return value;
	    }, 4); 

	    return jsonString;
	}

	async ImportState(input) {
	    DebugPrint("ImportState: Determining input type...");
	    let data;

	    try {
		// 1. Handle Event (from onchange or drag-and-drop)
		if (input?.target?.files) {
		    const file = input.target.files[0];
		    if (!file) return;
		    const text = await file.text();
		    data = JSON.parse(text);
		} 
		// 2. Handle direct File object
		else if (input instanceof File) {
		    const text = await input.text();
		    data = JSON.parse(text);
		}
		// 3. Handle raw JSON String
		else if (typeof input === 'string') {
		    data = JSON.parse(input);
		}
		// 4. Handle already-parsed Object
		else if (typeof input === 'object' && input !== null) {
		    data = input;
		} 
		else {
		    throw new Error("Unsupported import type.");
		}

		// --- Re-hydration Logic ---
		DebugPrint("Converting banned words to Trie structure");
		const newTrie = new TrieTree();
		if (Array.isArray(data.bannedWords)) {
		    data.bannedWords.forEach(word => newTrie.Add(word));
		}

		DebugPrint("Assigning state to imported value");
		// We merge with existing state to ensure any internal-only values aren't lost
		this.#state = {
		    ...this.#state,
		    ...data,
		    bannedWords: newTrie,
		    // Re-bind commands
		    commands: data.commands.map(cmd => {
			if (cmd.command === "tts") cmd.func = this.CallTts.bind(this);
			return cmd;
		    })
		};
		
		DebugPrint("Import successful!");

	    } catch (err) {
		console.error("ImportState failed:", err);
	    }
	}	

	yt = new YoutubeV3();

	//SORTING FUNCTIONS
	#mergeSortedLists(listA, listB) {
	    let mergedList = Array(listA.length + listB.length);
	    let i = 0; // Pointer for listA
	    let j = 0; // Pointer for listB

	    // 1. Core Comparison Loop
	    // Keep running as long as there are elements in both lists to compare
	    while (i < listA.length && j < listB.length) {
		
		// Compare the elements
		if (listA[i].receivedAt <= listB[j].receivedAt) {
		    // listA item is older or equal (push A)
		    mergedList.push(listA[i]);
		    i++;
		} else {
		    // listB item is older (push B)
		    mergedList.push(listB[j]);
		    j++;
		}
	    }

	    // 2. Append Remaining Elements
	    // One of the loops above finished. Copy any remaining elements 
	    // from the other list (only one of these will ever run)
	    
	    // Append remaining from listA
	    if (i < listA.length) {
		mergedList.push(...listA.slice(i));
	    }
	    
	    // Append remaining from listB
	    if (j < listB.length) {
		mergedList.push(...listB.slice(j));
	    }
	    
	    return mergedList;
	}

	#BubbleSort(arr = undefined) {
	    if (arr == undefined) { throw new Error("arr is undefined"); }
	    let temp;

	    for (let j = 0; j < arr.length - 1; j++) {
		for (let i = j + 1; i < arr.length; i++) {
		    if (arr[j].localeCompare(arr[i]) > 0) {
			temp = arr[j];
			arr[j] = arr[i];
			arr[i] = temp;
		    }
		}
	    }
	    return arr;
	}

	//MATH ESC FUNTIONS
	#Clamp(num, min, max){
		return Math.min(Math.max(num, min), max);
	};
	#lerp(a = undefined, b = undefined, t = undefined){
		if(a == undefined || b == undefined || t == undefined){throw new Error(`a (${a}), b (${b}), or t(${t}) is undefined`);}
		return (a+b-a*t);
	};

	#calc_user_conduct_score(user = undefined){
		unixTimes = {"month1": 2648400,"year1": 31536000,}
		
		let minDuration = unixTimes.month1;
		let maxDuration = unixTimes.year1*2; 

		if(user == undefined){throw new Error("could not calculate user conduct score, input is null")}
		let conduct_score, misconduct_score = 0;	

		const now = Date.now();
		let eventTime; // = user.commendations[Object.keys(user.commendations)[i]][j].happenedAt;
		let age; // = now - eventTime;

		let commendment;
		for(let i = 0; i < Object.keys(user.commendments.length); ++i){
			for(let j = 0; j < user.commendments[i].length; ++j){
				// conduct_score += Number(
				// 	this.clamp(Object.keys(user.commendations)[i][j].happenedAt-(Date.now()-maxDuration), 0, 1)
				// 	/ (maxDuration-minDuration)
				// )
				let timeWeight = (maxDuration - age) / (maxDuration - minDuration);
				eventTime = user.commendations[Object.keys(user.commendations)[i]][j].happenedAt;
				age = now - eventTime;
				conduct_score += Number(this.#Clamp(timeWeight, 0, 1));
			}
		}
	}
	GetUsers(){
		return this.#state.users;
	}

	async LoadBannedWords(event = undefined, method = "add") {
	    DebugPrint("LoadBannedWords() called");
	    if (!event) throw new Error("event is null");

	    let file = event.target.files[0];
	    if (!file) {
		DebugPrint("No file detected");
		return;
	    }

	    let fileType = file.name.split(".").pop().toLowerCase(); // force lowercase to simplify greatly
	    let data = []; 

	    const text = await file.text(); 

	    if (fileType === "json") {
		DebugPrint(".json found, attempting to parse");
		data = JSON.parse(text);
	    } else if (fileType === "csv") {
		DebugPrint(".csv found, attempting to parse");
		data = text.split(/[,\n\r]+/).map(w => w.trim()).filter(w => w !== "");
	    }

	    // Initialize the tree if it doesn't exist
	    if (!this.#state.bannedWords || method === "replace") {
		DebugPrint(method === "replace" ? "Replacing tree" : "Initializing new tree");
		this.#state.bannedWords = new TrieTree();
	    }

	    DebugPrint(`Adding ${data.length} words to the Trie`);
	    
	    // Fill the tree with the new data
	    for (const word of data) {
		this.#state.bannedWords.Add(word);
	    }

	    DebugPrint("Banned words Trie updated.", this.#state.bannedWords.Print());
	    

	    return this.#state.bannedWords;
	}

	async GetUnprocessedQueue(){
		return this.#state.unprocessed_queue;
	}
	async GetMessagesQueue(){
		return this.#state.messages;
	}
	GetErroredQueue(){
		return this.#state.errored_queue;
	}

	async ProcessUnprocessedMessagesQueue(maxAmount = 50) {
	    let i = 0;
	    while (this.#state.unprocessed_queue.length > 0 && i < maxAmount) {
		const currentItem = this.#state.unprocessed_queue.shift();

		try {
		    let processedResult = null;
		    // Route to platform processor
		    switch (String(`${currentItem.platform}_v${currentItem.apiVersion}`).toLowerCase()) {
			case 'youtube_v3':
			    processedResult = await this.ProcessYouTubeV3(currentItem);
			    break;
			default:
			    console.warn(`No processor found for ${currentItem.platform} v${currentItem.apiVersion}`);
			    break;
		    }

		    if (processedResult) {
			const messageText = processedResult.processedMessage;
			
			// Initialize state object if missing (should not happen with fix)
			if (!processedResult.state) processedResult.state = {};

			// Process commands if they exist
			if (processedResult.commands && processedResult.commands.length > 0) {
			    
			    let hasTtsCommand = false;

			    // Bind all commands with state
			    processedResult.commands.forEach(cmd => {
				const commandDefinition = this.#state.commands.find(
				    def => def.command === cmd.command
				);
				if (!commandDefinition || typeof commandDefinition.func !== 'function') return;

				const originalFuncRef = commandDefinition.func; 
				const params = cmd.params;
				
				if (cmd.command === 'tts') {
				    hasTtsCommand = true;
				    // Initialize ttsHasRead only if it's a tts command
				    processedResult.state.ttsHasRead = false;
				}
				
				cmd.func = () => originalFuncRef.call(this, messageText, params, processedResult.state); 
			    });

			    if (hasTtsCommand && processedResult.state.ttsHasRead === undefined) {
				processedResult.state.ttsHasRead = false;
			    }
			}
		    }
		} catch (error) {
		    console.error("Error processing message:", error);
		}
		i = ++i;
	    }
	}

	GetMessagesTimer = new IntTimer({
		name: "GetMessagesTimer",
		timeoutDuration: 15,
	});

	async MonitoringStart() {
	    DebugPrint("running the loop once as a test");
	    try {
		await this.#DaLoop(); 

		// Wrap it so 'this' remains correct when called by the timer
		this.GetMessagesTimer.AddTimeoutListener(() => this.#DaLoop()); 
		this.GetMessagesTimer.AddTimeoutListener(() => this._playOldestUnreadTts()); 
		
		this.GetMessagesTimer.Start();
	    }
	    catch (err) {
		console.error("error with monitoring start\n", err);
	    }
	}

	CreateUserFromFlags(args = {}) {
	    if (!args.channelId) {
		throw new Error("channelId CANNOT be null when creating a new user");
	    }

	    let existingUuid = this.FindUserFromChannelNameAndReturnUuid(args.channelId);
	    if (existingUuid !== undefined) {
		DebugPrint("User already exists. UUID:", existingUuid);
		return existingUuid; 
	    }

	    let user = { ...this.templates.user };

	    // 4. Assign values (Ensure we use channelId consistently)
	    user.authorName      = args.authorName;
	    user.icon            = args.icon;
	    user.channels        = [args.channelId];
	    user.isSponser       = args.isSponser || false;
	    user.isChatModerator = args.isChatModerator || false;
	    user.isChatAdmin     = args.isChatAdmin || false;
	    user.uuid            = crypto.randomUUID();
	    user.firstSeen       = args.firstSeen || Date.now();

	    // 5. Add to private state
	    this.#state.users.push(user);
	    
	    DebugPrint(`User created: ${user.authorName}. Total: ${this.#state.users.length}`);
	    return user.uuid;
	}

	FindUserFromChannelNameAndReturnUuid(channelId = undefined){ // returns uuid of user, undefined if null
		if(channelId == undefined){
			throw new Error("CHANNEL ID IS UNDEFINED");
		}
		// To this:
		let existingUser = this.#state.users.find(u => 
		    u.channels.some(channel => (typeof channel === 'object' ? channel.id === channelId : channel === channelId))
		);
		if(existingUser == undefined){return undefined;}
		return existingUser.uuid;
	}

	AddPointsToUserWithUuid(score, uuid) {
	    if (!uuid) {
		console.error("No UUID provided.");
		return false;
	    }
	    // Note: score could be 0, so check if it's undefined or null specifically
	    if (score === undefined || score === null) {
		console.error("no score to give to user");
		return false;
	    }

	    DebugPrint(`attempting to add score to user`, {score: score, user: uuid});

	    // 1. Locate the user
	    let user = this.#state.users.find(u => u.uuid === uuid);

	    if (user) {
		// 2. Consistent naming: Use .points everywhere
		if (user.points === undefined || isNaN(user.points)) {
		    user.points = 0;
		}

		// 3. Add the new points
		user.points += score;

		DebugPrint(`Points updated for ${user.authorName}: +${score} (Total: ${user.points})`);
		return true;
	    } else {
		console.warn(`AddPointsToUser: User with UUID ${uuid} not found.`);
		return false;
	    }
	}	
	/**
	 * High-performance duplicate check and chronological insertion.
	 * Optimized for tens of thousands of messages.
	 * @param {Object} p_msg - Processed message (must contain .messageId and .receivedAt)
	 */
	SafeAddToMessagesQueue(p_msg) {
	    const queue = this.#state.messages; 
	    const len = queue.length;
	    const targetId = p_msg.messageId;
	    const targetTime = p_msg.receivedAt;

	    for (let i = len - 1; i >= 0; i--) {
	        if (queue[i].messageId === targetId) {
	            DebugPrint("Duplicate message found, ignoring");
	            return false;
	        }

	        if (queue[i].receivedAt < targetTime) {
	            break;
	        }
	    }

	    let low = 0;
	    let high = len;

	    while (low < high) {
	        const mid = (low + high) >>> 1;
	        if (queue[mid].receivedAt < targetTime) {
	            low = mid + 1;
	        } else {
	            high = mid;
	        }
	    }

	    DebugPrint(`Adding message at index ${low}`);
	    if (low === len) {
		queue.push(p_msg);
	    } else {
		queue.splice(low, 0, p_msg);
	    }

	    return true;
	}

	async #DaLoop() {
	    try {
		DebugPrint("Fetching messages from youtube");
		const data = await this.yt.getChatMessages();
		
		DebugPrint(`Received ${data.items?.length || 0} items`);

		if (!data.items || data.items.length === 0) return;

		DebugPrint("adding messages to unprocessed queue");
		for (const item of data.items) {
		    this.ParseAndAddYouTubeV3MessagesToUnprocessedQueue(item);
		}

		DebugPrint("processing unprocecssed_queue");
		while (this.#state.unprocessed_queue.length > 0) {
		    const raw = this.#state.unprocessed_queue.shift();
		    const p_msg = await this.ProcessYouTubeV3Message_v1(raw);

		    const exists = this.#state.messages.some(m => 
			m.receivedAt === p_msg.receivedAt && m.authorId === p_msg.authorId
		    );

		    if (!exists) this.#state.messages.push(p_msg);
		}
		DebugPrint("Current messages: " + this.#state.messages);

		DebugPrint("calling tts");
		await this.ProcessPendingTts();

	    } catch (err) {
		DebugPrint("LOOP CRASHED: ", err);
	    }
	}


	async MonitoringStop() {
	  this.GetMessagesTimer.Stop(); 
	  this.GetMessagesTimer.RemoveTimeoutListener(this.#DaLoop);
	}

	async ProcessYouTubeV3Message_v1(unprocessedMsg) {
		const rmo = unprocessedMsg.data; // rawMessageObject
		DebugPrint("rmo base object to get rata from:", rmo);

		// 1. Initialize the new processed message object
		const newMessage = { ...this.templates.messages };
		DebugPrint("parsing out information from object", unprocessedMsg);
		newMessage.version = 1; // WARN: make new function if this needs to be changed

		newMessage.userUuid = this.FindUserFromChannelNameAndReturnUuid(rmo.authorDetails.channelId);
		if(newMessage.userUuid == undefined){
			DebugPrint("no id found for user, attempting to add the user", rmo);
			newMessage.userUuid = this.CreateUserFromFlags({
				authorName: 		rmo.authorDetails.displayName,
				channelId: 		rmo.authorDetails.channelId,
				isChatModerator: 	rmo.authorDetails.isChatModerator, 
				isChatAdmin: 		false, 
				isSponser: 		rmo.authorDetails.isChatSponsor, 			
				isVerfied: 		rmo.authorDetails.isVerfied,
			});	
		}
		newMessage.authorName = rmo.authorDetails.displayName;
		//newMessage.messageId = u_msg.data.id, // TODO: find messageId
		newMessage.streamOrigin = rmo.snippet.liveChatId; //what streamid via the platform the message came from
		newMessage.receivedAt = new Date(unprocessedMsg.data.snippet.publishedAt).getTime(); //use when received by server/app to help reduce dependancies
		newMessage.platform = "youtube";	

		//sanitize string
		let message = rmo.snippet.textMessageDetails.messageText;
		DebugPrint("checking for banned words in message", message);
		if(this.CheckMessageForBannedWords(message)){
			// TODO: shadow ban user, and flag for review
		};

		newMessage.score = await this.ScoreMessage(message);
		this.AddPointsToUserWithUuid(newMessage.score, newMessage.userUuid);

		DebugPrint("continuing to parse information from message text", unprocessedMsg);
		message = this.SanitizeString(message);
		message = this.ParseCommandFromMessage(message);
		newMessage.processedMessage = message.seperatedText;
		newMessage.commands = message.foundCommands;
		newMessage.state = {};
		if(message.foundCommands.tts != undefined) {
			newMessage.state.ttsHasBeenRead = false;
		}
		newMessage.rawMessage= rmo.snippet.textMessageDetails.messageText;

		DebugPrint("returning the raw message", newMessage);
		return newMessage;
	}



	async _playOldestUnreadTts() {}


	/**
	 * Private member to hold the timer instance.
	 */
	#autoTtsTimer = null; 

	/**
	 * Starts the Auto TTS system with immediate execution and periodic checks.
	 */
	async AutoTtsStart() {
	    DebugPrint("Starting Auto TTS System...");

	    // 1. Stop any existing timer for clean start
	    if (this.#autoTtsTimer) {
		this.AutoTtsStop();
	    }

	    // 2. Execute immediately on start (test/trigger)
	    DebugPrint("Auto TTS: Executing immediate initial run...");
	    await this._playOldestUnreadTts(); 
	    
	    const intervalSeconds = 10; 

	    // 3. Setup the loop timer
	    this.#autoTtsTimer = new IntTimer({
		name: "AutoTTS_Loop",
		timeoutDuration: intervalSeconds,
		maxDuration: 0,      // 0 = infinite looping
		autoStart: false,
		debugMode: false,

		// Action: Called when timer completes its cycle
		timeoutListeners: [
		    async () => {
			DebugPrint(`Auto TTS: Cycle complete. Checking for TTS messages after ${intervalSeconds}s.`);
			// ⭐️ CRITICAL: await the function call in the listener as well
			await this._playOldestUnreadTts(); 
		    }
		],

		// Logging: Called every second
		tickListeners: [
		    () => {
			const currentElapsed = this.#autoTtsTimer.time || 0;
			const remaining = Math.max(0, intervalSeconds - currentElapsed);
			DebugPrint(`Auto TTS: Next check in ${remaining}s`);
		    }
		]
	    });

	    // 4. Start the loop
	    this.#autoTtsTimer.Start();
	    DebugPrint(`Auto TTS: System running. Will check for new TTS messages every ${intervalSeconds} seconds.`);
	}

	/**
	 * Stops the Auto TTS system.
	 */
	AutoTtsStop() {
	    if (this.#autoTtsTimer) {
		DebugPrint("Stopping Auto TTS System...");
		this.#autoTtsTimer.Stop(); 
		this.#autoTtsTimer = null;
		DebugPrint("Auto TTS: System stopped.");
	    } else {
		DebugPrint("Auto TTS: No active system to stop.");
	    }
	}

	async ProcessPendingTts() {
	    DebugPrint("Scanning for pending TTS commands...");

	    for (let i = 0; i < this.#state.messages.length; i++) {
		const msg = this.#state.messages[i];

		// 1. Corrected Check: Search the commands array for 'tts'
		// We use .some() because it returns true as soon as it finds a match
		const hasTtsCommand = Array.isArray(msg.commands) && 
				      msg.commands.some(cmd => cmd.command === "tts");

		const alreadyRead = msg.state?.ttsHasRead === true;

		if (hasTtsCommand && !alreadyRead) {
		    DebugPrint(`Found unread TTS: "${msg.rawMessage}"`);

		    try {
			if (!msg.state) msg.state = {};
			msg.state.ttsHasRead = true;

			// Ensure we handle the text correctly
			const textToSpeak = msg.processedMessage 
			    ? msg.processedMessage.replace(/!tts/gi, "").trim() 
			    : "No message text";

			await this.CallTts(msg, i); 
		    } catch (err) {
			console.error("Failed to play TTS for message:", i, err);
			if (msg.state) msg.state.ttsHasRead = "ERROR";
		    }
		}
	    }
	}

	/**
	 * Executes the Text-to-Speech command using the message and flags.
	 * @param {string} message The clean message text to speak.
	 * @param {Object} flags The command parameters/flags.
	 * @param {Object} messageState - Reference to the message.state object (messageObj.state)
	 * @returns {Promise<void>}
	 */
	async CallTts(
		message, // message which contains tts params
		messages_index= undefined
	) { 
		DebugPrint("CallTts: Starting TTS for message:", message);

		if (!message) {
			//message.messageState.ttsHasRead = true;
			throw new Error("TTS message is empty.");
		}

		const getVoices = () => new Promise((resolve) => {
		let voices = window.speechSynthesis.getVoices();
		if (voices.length > 0) {
		    resolve(voices);
		} else {
		    window.speechSynthesis.onvoiceschanged = () => {
			voices = window.speechSynthesis.getVoices();
			resolve(voices);
		    };
		}
		});

		const voices = await getVoices();
		const textToSpeak = message.processedMessage ? message.processedMessage.replace("!tts", "").trim() : "No text";
		const TTS = new SpeechSynthesisUtterance(textToSpeak);

		let flags;
		if(message.commands){
			for(let i = 0; i < message.commands.length; ++i){
				if(message.commands[i].command == "tts"){
					flags = message.commands[i].params;
				}
			}
		}
		if(flags == null){
			console.warn("no params found for flag, this is an unexpected state. here's the object:\n", JSON.stringify(message, null, 2));
		}
		if(flags != null){
			// Apply flags
			TTS.rate = Number(flags.r) || 1; 
			TTS.pitch = Number(flags.p) || 1;

			if (flags.v !== undefined && voices[flags.v]) {
				TTS.voice = voices[flags.v];
			}
		}

		/*
		if(messages_index != undefined){
			DebugPrint("no messages_index given, attempting to find message");
			for(let i = 0; i < this.#state.messages.length; ++i){
				if( //check auth, msg, and receivedAt to verify that the message is very very likely the same message
					message.authorId == this.#state.messages[i].authorId
					&& message.rawMessage.data.displayMessage == this.#state.messages[i].rawMessage.data.displayMessage 
					&& message.receivedAt == this.#state.messages[i].receivedAt
				){
					messages_index= i;	
					DebugPrint("message found at index: " + i);
					break;
				}
			}
			if(messages_index){
				console.warn("could not find matching message from queue, it is possible this is a text or something else, IF THIS IS UNINTENTIONAL YOU GOT SOME DEBUGGING TO DO");
			}
		};
		*/

		return new Promise((resolve, reject) => {
			TTS.onend = () => {
				let log = "CallTts: Speech completed successfully."; 
				DebugPrint(log);
				resolve(log); 
			};

			TTS.onerror = (e) => {
				console.error("CallTts: TTS error:", e);
				// Set flag on error to prevent re-reading failing messages
				messageState.ttsHasRead = 'ERROR'; 
				reject(new Error(`TTS failed: ${e.error}`));
			}
			DebugPrint("CallTts: Starting speech synthesis...");
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(TTS);
		});

		// Cancel any ongoing speech and start new one
	}



			ProcessTtsMessage(raw) {
			  if (raw[0] != '!') {
			    // not a cmd, exiting
			    return null;
			  }

			  let command = this.templates.commands;
			  command.flags = {
			    p : flags.p || this.#GEBI("ttsPitch")
			    ?.value || this.#LSGI("ttsPitch") || "1",
			    r
			    : flags.r || this.#GEBI("ttsRate")
			    ?.value || this.#LSGI("ttsRate") || "1",
			    v
			    : flags.v || this.#GEBI("ttsVoice")
			    ?.value || this.#LSGI("ttsVoice") || 51, };
			  command.command;
			  command.version = 1;
			  command.func = this.CallTts(message);

			  const argsStr = match[2];
			  const parts = argsStr.trim().split(/\s + /);

			  let flags = {
			    p : "",
			    r : "",
			    v : "",
			  };

			  let msgParts = [];
			  for (let i = 0; i < parts.length; i++) {
			    if (parts[i] == "-r" && parts[i + 1]) {
			      flags.r = parts[i + 1];
			      i++;
			    } else if (parts[i] == "-v" && parts[i + 1]) {
			      flags.v = parts[i + 1];
			      i++;
			    } else if (parts[i] == "-p" && parts[i + 1]) {
			      flags.p = parts[i + 1];
			      i++;
			    } else {
			      msgParts.push(parts[i]);
			    }
			  }

			  return {flags, message : msgParts.join(" ")};
			}

	/**
	 * Parses a single raw YouTube Live Chat Message object and adds it to the 
	 * standardized unprocessed message template.
	 * @param {Object} rawMessage A single raw message object from the YouTube API 'items' array.
	 * @returns {void}
	 */
	ParseAndAddYouTubeV3MessagesToUnprocessedQueue(rawMessage) {
	// Check if the input is a valid object
	    DebugPrint("attempt to add message to unprocessed_queue:", rawMessage);
	    if (!rawMessage || typeof rawMessage !== 'object' || !rawMessage.snippet) {
	        console.warn("rawMessage is not an object, has no snippet, or undefined, skipping");
	        return;
	    }

	    // Convert the ISO 8601 string to Unix time in milliseconds.
	    const unixTimestampMs = new Date(rawMessage.snippet.publishedAt).getTime();

	    // Create a new message object based on the class template
	    let processedMessage = {
		// Use a shallow copy of the template to avoid modifying the template itself
		version : this.templates.unprocessed_message_v1.version,
		apiVersion : 3, // WARN: do not change this, if this needs to be changed make a new function
		platform : "YouTube",
		// Set dynamic/specific fields
		data : rawMessage, // Store the entire raw message object
		receivedAt: unixTimestampMs, // Unix time in milliseconds
		failedProcessingAt : undefined, 
	    };

	    DebugPrint("Adding message to unprocessed_queue: ", processedMessage);
	    this.#state.unprocessed_queue.push(processedMessage)
	    return(processedMessage);
	}

			// PRIVATE FUNCTIONS
	#LSGI(id) {
			return localStorage.getItem(String(id));
			}
	#GEBI(id) {
			return document.getElementById(id);
			}

			// PUBLIC (laid out by general flow)
			async GetMessages(pageToken = undefined) {

			  DebugPrint(`Processing ${yt_messages.length} messages`);

			  const table = document.getElementById("messagesTable");
			  if (!table)
			    throw new Error("no message table found");

			  let newMessagesCount = 0;
			  for (let i = 0; i < yt_messages.length; ++i) {
			    const item = yt_messages[i];

			    // Deduplication check
			    const existing = table.querySelector(
					`tr[data - author = "${esc(msg.author)}"]
		[data - published = "${esc(msg.publishedAt)}"]` );
			    if (existing) {
			      DebugPrint(`Skipping duplicate message from ${msg.author}
					  : "${msg.message}"`);
			      continue;
			    }

			    DebugPrint(`Adding NEW message from ${msg.author}
					: "${msg.message}"`);

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
			      flags = {p : parsed.flags ?.p || "",
				       r : parsed.flags ?.r || "",
				       v : parsed.flags ?.v || "", };
			    }

			    const safeAuthor = esc(msg.author);
			    const safePublished = esc(msg.publishedAt);
			    const safeMessage =
				esc(parsed ? parsed.message : msg.message);

			    // colors to help readiblity
			    let score = await this.EvaluateMessageScore(safeMessage);
			    let scoreColor = "inherit";
			    // highest to lowest
			    if (score > 1000) {
			      scoreColor = "#E62117"
			    } else if (score > 500) {
			      scoreColor = "#E91E63"
			    } else if (score > 200) {
			      scoreColor = "#F57C00"
			    } else if (score > 100) {
			      scoreColor = "#FFCA28"
			    } else if (score > 50) {
			      scoreColor = "#1DE9B6"
			    } else if (score > 20) {
			      scoreColor = "#00E5FF"
			    } else if (score > 0) {
			      scoreColor = "#1E88E5"
			    } else if (score < 0) {
			      scoreColor = "#0000E5"
			    }

			    const tr = document.createElement("tr");
			    tr.setAttribute("data-author", safeAuthor);
			    tr.setAttribute("data-published", safePublished);
			    tr.innerHTML = ` <td> ${idx} < / td > <td> ${safeAuthor} <
					   / td > <td> ${safePublished} < / td >
					   <td style = "color:${flagsColor};"> ${
					       JSON.stringify(flags, null, 2)} < / td >
					   <td style = "color:${scoreColor}"> ${score} <
					   / td >
					   <td style = "color:${messageColor}"> ${
					       safeMessage} < / td >
					   <td>
					   <button id = "btnPlay_${idx}"> Play</ button>
					   </ td><td>
					   <input id = "tts_${idx}" type =
						"checkbox" ${isTtsTrigger ? "checked"
									  : ""}></ td>
					   <td id = "tdTimeout_${idx}"></ td>
					   <td id = "tdBlock_${idx}"></ td>
					   <td id = "tdBan_${idx}"></ td>
				`;

			    // Timeout button
			    const btnTimeout = document.createElement("button");
			    btnTimeout.textContent = "Timeout";
			    tr.querySelector(`#tdTimeout_$ { idx }`)
				.appendChild(btnTimeout);

			    // Block checkbox
			    const cbBlock = document.createElement("input");
			    cbBlock.type = "checkbox";
			    tr.querySelector(`#tdBlock_$ { idx }`).appendChild(cbBlock);

			    // Ban button
			    const btnBan = document.createElement("button");
			    btnBan.textContent = "Ban";
			    btnBan.addEventListener(
				"click", () => {
				  const pin = prompt("Enter 6-digit PIN to ban user:");
				  if (pin == "123456") {
				    alert(`Banned user $ { msg.author }`);
				  } else {
				    alert("Invalid PIN. Ban cancelled.");
				  }
				});
			    tr.querySelector(`#tdBan_$ { idx }`).appendChild(btnBan);

			    // Play button
			    const playBtn = tr.querySelector(`#btnPlay_$ { idx }`);
			    if (playBtn) {
			      playBtn.addEventListener(
				  "click", () => {
				    const messageText =
					parsed ? parsed.message : msg.message;
				    this.CallTts({flags, message : messageText});
				  });
			    }

			    table.appendChild(tr);
			  }

			  DebugPrint(`Added $ {
			    newMessagesCount
			  } new messages to table`);
			  return yt_messages;
			}

			async ScoreMessage(message) { // TODO: MORSE CODE BREAKS THE SCORE: "..-. ..- -.-. -.- / -- --.- / .-.. .. ..-. ." == 440
			  // 1. DEFINE ALL SCORING FUNCTIONS (using arrow functions for
			  // 'this' context)
			DebugPrint("attempting to score message:", message);
			  const CheckPunctuation = (message) => {
			    let score = 0;

			    // Long messages without basic punctuation get penalized
			    if (message.length > 75) {
			      if (!(message.includes(",") || message.includes(".") ||
				    message.includes("?") || message.includes("!"))) {
				score -= 150;
			      }
			    }

			    // Reward for proper spacing after end-of-sentence
			    // punctuation
			    for (let i = 0; i < message.length; ++i) {
			      let char = message[i];

			      if (char == "." || char == "?" || char == "!") {
				// Check if the next 1, 2, or 3 characters contain a
				// space (handles single space, double space, etc.)
				const nextChar = message[i + 1];
				const nextNextChar = message[i + 2];
				const nextNextNextChar = message[i + 3];

				if (nextChar == " " || nextNextChar == " " || nextNextNextChar == " ") {
				  score += 30;
				}
			      }
			    }
			    DebugPrint(`score CheckPunctuation() : ${score}`);
			    return score;
			  };

			  const CheckTrigrams = async(message) => {
			    let score = 0;
			    try {
			      const words = message.trim().toLowerCase().split(/\s + /);

			      for (const word of words) {
				if (word.length >= 3) {
				  const currentTrigram = word.slice(0, 3);
				  let validTrigramFound = false;

				  if (trigrams.includes(currentTrigram)) {
				    score += 50;
				    validTrigramFound = true;
				  }
				  if (!validTrigramFound) {
				    score -= 50;
				  }
				}
			      }

			      //DebugPrint(`score CheckTrigrams() : ${score}`);
			      return score;
			    } catch (err) {
			      //console.error("Original error in CheckTrigrams:", err);
			      throw new Error("Error processing trigrams logic.");
			    }
			  };

			  const CheckForRepeats = (message) => {
			    let score = 0;
			    // Safety: Stop 2 chars before the end to safely check i+1
			    // and i+2
			    for (let i = 0; i < message.length - 2; ++i) {
			      let char = message[i];
			      if (message[i + 1] == char &&message[i + 2] == char) {
				score -= 50;
			      }
			    }
			    DebugPrint(`score CheckForRepeats() : ${score}`);
			    return score;
			  };

			  const CheckForCaps = (message) => {
			    let score = 0;
			    if (message[0] == message.charAt(0).toUpperCase()) {
			      score += 20;
			    } else {
			      score -= 10;
			    }
			    //DebugPrint(`score CheckForCaps() : ${score}`);
			    return score;
			  };

			  const CheckForSpaces = (message) => {
			    let score = 0;
			    let spaceCount = 0;
			    for (let i = 0; i < message.length; ++i) {
			      if (message[i] == " ") {
				spaceCount += 1;
			      }
			    }
			    const nonSpaceLength = message.length - spaceCount;

			    // Avoid division by zero if the message is only spaces
			    // (though unlikely after cleaning)
			    if (nonSpaceLength > 0 &&
				(spaceCount * 100) / nonSpaceLength < 20) {
			      score -= 20;
			    } else if (nonSpaceLength > 0) {
			      score += 20;
			    }

			    DebugPrint(`score CheckForSpaces() : ${score}`);
			    return score;
			  };

			  const CheckForSpaceInChunk = (message) => {
			    let score = 0;
			    for (let i = 0; i < message.length; i += 32) {
			      let chunk = message.slice(i, i + 32);
			      if (!chunk.includes(" ")) {
				score -= 20;
			      }
			    }
			    DebugPrint(`score CheckForSpaceInChunk : ${score}`);
			    return score;
			  };

			  // 2. SCORING EXECUTION

			  let score = 0;

			  const funcs = [
			    CheckPunctuation,
			    CheckTrigrams,
			    //CheckForRepeats,
			    CheckForCaps,
			    CheckForSpaces,
			    CheckForSpaceInChunk,
			  ];

			  for (const func of funcs) {
			    let funcScore;

			    if (func.constructor.name == 'AsyncFunction') {
			      funcScore = await func(message);
			    } else {
			      funcScore = func(message);
			    }

			    score += funcScore;

			    if (this.#state.config.debug == true) {
			      DebugPrint(`score eval at function call : ${score}`);
			    }
			  }

			  return score;
			}



	/**
	 * Renders the processed messages into a visual HTML table based on the provided
	 * mock structure, styles, and pagination logic.
	 * NOTE: This function relies on the existence of `this.#state.messages` 
	 * (array of processed message objects).
	 * @param {number} pageIndex - The current page of messages to display (0 is newest).
	 * @param {number} itemsPerPage - Number of messages per page.
	 * @returns {void}
	 */
	RenderMessagesTable(pageIndex = 0, itemsPerPage = 10) {
	    // Ensure DOM is ready (though typically this runs after page load)
	    if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => this.RenderMessagesTable(pageIndex, itemsPerPage));
		return;
	    }

	    const containerId = "messages_visualization";
	    let container = document.getElementById(containerId);

	    // 1. Create or clear the container (built off-screen)
	    if (!container) {
		container = document.createElement('div');
		container.id = containerId;
	    }
	    container.innerHTML = '';

	    // 2. Inject CSS Styles
	    const style = document.createElement('style');
	    style.textContent = `
		:root {
		    --youtube-color: #f03;
		    --twitch-color: #6441a5;
		    --kick-color: #00e701;
		    --facebook-color: #1877F2;
		    --picarto-color: #35A775;
		    --tiktok-color: #FE2858;
		    --scoreColor1000plus: #E62117;
		    --scoreColor500plus: #E91E63;
		    --scoreColor100plus: #FFCA28;
		    --scoreColor50plus: #1DE9B6;
		    --scoreColor20plus: #00E5FF;
		    --scoreColor0plus: #1E88E5;
		    --scoreColorBelow0: #0000E5;
		}
		#${containerId} table { 
		    width: 100%; 
		    max-width: 100%; 
		    border-collapse: collapse; 
		    margin-bottom: 15px; 
		    font-family: sans-serif;
		}
		#${containerId} th { 
		    text-align: left; 
		    padding: 0.5rem; 
		    background: #333; 
		    color: white; 
		}
		#${containerId} td { 
		    padding: 0.5rem; 
		    vertical-align: middle; 
		}
		#${containerId} tr { background-color: #2a2a2a; color: white; }
		
		.command-trigger-button {
		    background-color: #3873C7;
		    color: white;
		    border: none;
		    padding: 4px 8px;
		    cursor: pointer;
		    font-size: 0.8em;
		    margin-top: 5px;
		    border-radius: 3px;
		}
		.command-trigger-button:hover {
		    background-color: #4A90E2;
		}
	    `;
	    container.appendChild(style);

	    // 3. Create Table Structure
	    const table = document.createElement('table');
	    
	    const thead = document.createElement('thead');
	    thead.innerHTML = `
		<tr>
		    <th style="min-width: 10rem;">user</th>
		    <th>message</th>
		    <th style="min-width: 8rem;">command</th>
		    <th style="min-width: 10rem;">controls</th>
		</tr>
	    `;
	    table.appendChild(thead);

	    const tbody = document.createElement('tbody');

	    // 4. Calculate Pagination Data
	    const sortedMessages = [...this.#state.messages].reverse(); 
	    const totalPages = Math.ceil(sortedMessages.length / itemsPerPage);
	    
	    pageIndex = Math.max(0, Math.min(pageIndex, totalPages > 0 ? totalPages - 1 : 0));
	    
	    const startIndex = pageIndex * itemsPerPage;
	    const endIndex = startIndex + itemsPerPage;
	    const pageItems = sortedMessages.slice(startIndex, endIndex);

	    // 5. Generate Rows using message data
	    pageItems.forEach(msg => {
		const tr = document.createElement('tr');
		
		let platformColorVar = '--youtube-color'; 
		if (msg.platform?.toLowerCase().includes('twitch')) platformColorVar = '--twitch-color';

		const score = msg.score || 0; 

		let scoreColorVar = '--scoreColorBelow0';
		if (score >= 1000) scoreColorVar = '--scoreColor1000plus';
		else if (score >= 500) scoreColorVar = '--scoreColor500plus';
		else if (score >= 100) scoreColorVar = '--scoreColor100plus';
		else if (score >= 50) scoreColorVar = '--scoreColor50plus';
		else if (score >= 20) scoreColorVar = '--scoreColor20plus';
		else if (score > 0) scoreColorVar = '--scoreColor0plus';

		tr.style.cssText = `
		    background-image: linear-gradient(90deg, var(${platformColorVar}), var(${scoreColorVar}));
		    height: 5em;
		    max-height: 5rem;
		    width: 100%;
		    overflow: hidden;
		    border-bottom: 1px solid rgba(0,0,0,0.2);
		    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
		`;

		const now = Date.now();
		const firstSeenTime = msg.date || msg.dateTime || now; 
		const diffSeconds = Math.floor((now - firstSeenTime) / 1000);
		let timeString = "just now";
		if (diffSeconds > 31536000) timeString = `${Math.floor(diffSeconds / 31536000)}y ago`;
		else if (diffSeconds > 2592000) timeString = `${Math.floor(diffSeconds / 2592000)}m ago`;
		else if (diffSeconds > 604800) timeString = `${Math.floor(diffSeconds / 604800)}w ago`;
		else if (diffSeconds > 86400) timeString = `${Math.floor(diffSeconds / 86400)}d ago`;
		else if (diffSeconds > 3600) timeString = `${Math.floor(diffSeconds / 3600)}h ago`;
		else if (diffSeconds > 60) timeString = `${Math.floor(diffSeconds / 60)}min ago`;
		else if (diffSeconds > 10) timeString = `${diffSeconds}s ago`;

		const authorDetails = msg.rawMessage?.data?.authorDetails;
		const isOwner = authorDetails?.isChatOwner;
		const isMod = authorDetails?.isChatModerator;
		const isSponsor = authorDetails?.isChatSponsor;
		
		const gradientStops = ['#000'];
		if (isSponsor) gradientStops.push('#00ffaa');
		if (isMod) gradientStops.push('#2266ff');
		if (isOwner) gradientStops.push('#ffaa00');
		gradientStops.push('#000');
		
		const profileGradient = `radial-gradient(ellipse closest-side, ${gradientStops.join(', ')})`;

		const commandCellDiv = document.createElement('div');
		commandCellDiv.style.cssText = "display:flex; flex-direction:column; font-size: 0.9em; color: white; text-shadow: 1px 1px 1px black;";

		if (msg.commands && msg.commands.length > 0) {
		    msg.commands.forEach(cmd => {
			const cmdDiv = document.createElement('div');
			
			cmdDiv.innerHTML = `
			    <div><strong>${cmd.command}</strong></div>
			    <div style="font-size:0.8em; opacity:0.9; overflow-wrap:break-word;">${JSON.stringify(cmd.params)}</div>
			`;
			
			if (typeof cmd.func === 'function') {
			    const funcButton = document.createElement('button');
			    funcButton.innerText = `Run ${cmd.command}`;
			    funcButton.className = 'command-trigger-button';
			    
			    funcButton.onclick = async () => {
				DebugPrint(`Executing command: ${cmd.command} for message: ${msg.processedMessage}`);
				try {
				    // Call the bound function which already has the state reference
				    await cmd.func(); 
				    funcButton.innerText = 'Success!';
				    funcButton.disabled = true;
				    setTimeout(() => {
					funcButton.innerText = `Run ${cmd.command}`;
					funcButton.disabled = false;
				    }, 1500);
				} catch (e) {
				    console.error(`Error running ${cmd.command}:`, e);
				    funcButton.innerText = 'Error';
				}
			    };
			    commandCellDiv.appendChild(funcButton);
			    
			    // Display current TTS state next to the button for debugging/UX
			    if (cmd.command === 'tts') {
				 const stateSpan = document.createElement('span');
				 stateSpan.innerText = ` (Read: ${!!msg.state.ttsHasRead})`;
				 stateSpan.style.color = msg.state.ttsHasRead ? '#7CFC00' : '#FFD700'; // Green if read, Yellow if unread
				 cmdDiv.appendChild(stateSpan);

				 // Check box for manual state change - useful for monitoring the fix
				 const checkbox = document.createElement('input');
				 checkbox.type = 'checkbox';
				 checkbox.checked = !!msg.state.ttsHasRead;
				 checkbox.onchange = (e) => {
				     msg.state.ttsHasRead = e.target.checked;
				     stateSpan.innerText = ` (Read: ${!!msg.state.ttsHasRead})`;
				     stateSpan.style.color = msg.state.ttsHasRead ? '#7CFC00' : '#FFD700';
				     DebugPrint(`Manually set ttsHasRead for ${msg.authorName} to ${msg.state.ttsHasRead}`);
				 };
				 cmdDiv.prepend(checkbox);
			    }
			}
			commandCellDiv.appendChild(cmdDiv);
		    });
		} else {
		    commandCellDiv.innerHTML = '<span style="opacity:0.5;">-</span>';
		}

		tr.innerHTML = `
		    <td>
			<a href="${authorDetails?.channelUrl || '#'}" target="_blank" style="text-decoration:none; color:inherit;">
			    <div style="display:flex; flex-direction:row; height:100%; align-items:center;">
				<div style="
				    border-radius:100%;
				    display:flex; 
				    justify-content: center; 
				    align-items: center;
				    height:4rem; 
				    width:4rem;
				    min-width:4rem;
				    padding:0.2rem;
				    margin-right:1rem;
				    background-image: ${profileGradient};
				    background-size: 150%; 
				    background-position: center;
				    border: solid white 0.1em;
				">
				    <div style="display:flex; justify-content: center; height:100%; width:100%; overflow:hidden; border-radius:100%;">
					<img style="height:100%; width:100%; object-fit:cover;" 
					     src="${authorDetails?.profileImageUrl || 'https://yt3.ggpht.com/jrcU7ZjcLMBzCQbU6QMucPmC-cBiHOFrmTpDS9gDzUdH9FUTyzqgrkX9-rXzRh6Fac_HWWgNoEA=s88-c-k-c0x00ffffff-no-rj'}"
					     onerror="this.src='https://yt3.ggpht.com/jrcU7ZjcLMBzCQbU6QMucPmC-cBiHOFrmTpDS9gDzUdH9FUTyzqgrkX9-rXzRh6Fac_HWWgNoEA=s88-c-k-c0x00ffffff-no-rj'">
				    </div>
				</div>
				<div style="max-width:10rem; max-height:5rem; overflow: hidden; display:flex; flex-direction:column; justify-content:center;">
				    <span style="font-size:1rem; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color: white; text-shadow: 1px 1px 2px black;">
					${msg.authorName || authorDetails?.displayName || 'Unknown'}
				    </span>
				    <span style="font-size:0.8rem; color: #eee; text-shadow: 1px 1px 2px black;">
					${timeString}
				    </span>
				</div>
			    </div>
			</a>
		    </td>
		    <td style="overflow-wrap:break-word; max-width:20rem; height: 100%; color: white; text-shadow: 1px 1px 1px black;">
			${msg.processedMessage || ''}
		    </td>
		    <td class="command-cell"></td>
		    <td>
			<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(3em, 6em)); gap: 5px;">
			    <input type="button" style="background-color:darkorange; border:none; color:white; padding:5px; cursor:pointer;" value="Bonus">
			    <input type="button" style="background-color:darkblue; border:none; color:white; padding:5px; cursor:pointer;" value="Timeout">
			    <input type="button" style="background-color:darkred; border:none; color:white; padding:5px; cursor:pointer;" value="Ban">
			    <input type="button" style="background-color:indigo; border:none; color:white; padding:5px; cursor:pointer;" value="TTS Ban">
			</div>
		    </td>
		`;

		tr.querySelector('.command-cell').appendChild(commandCellDiv);
		tbody.appendChild(tr);
	    });

	    table.appendChild(tbody);
	    container.appendChild(table);

	    // 6. Navigation Controls
	    const navDiv = document.createElement('div');
	    navDiv.style.cssText = "width:100%; display:flex; justify-content:center; margin-top: 10px;";
	    
	    const fieldset = document.createElement('fieldset');
	    fieldset.style.cssText = "display:flex; justify-content:center; gap: 10px; border: 1px solid #ccc; padding: 10px; background: #222; align-items:center; border-radius: 5px;";
	    
	    const legend = document.createElement('legend');
	    legend.innerText = `Page Navigation (${pageIndex + 1} / ${totalPages || 1})`;
	    legend.style.color = "white";
	    fieldset.appendChild(legend);

	    const btnPrev = document.createElement('input');
	    btnPrev.type = "button";
	    btnPrev.value = "< Newer"; 
	    btnPrev.onclick = () => this.RenderMessagesTable(pageIndex - 1, itemsPerPage);
	    if (pageIndex <= 0) btnPrev.disabled = true;

	    const inputPage = document.createElement('input');
	    inputPage.type = "number";
	    inputPage.value = pageIndex;
	    inputPage.style.cssText = "width:50px; text-align:center; padding:5px;";
	    inputPage.onchange = (e) => {
		const newPage = parseInt(e.target.value);
		if (!isNaN(newPage) && newPage >= 0 && newPage < totalPages) {
		    this.RenderMessagesTable(newPage, itemsPerPage);
		} else {
		    e.target.value = pageIndex; 
		}
	    };

	    const btnNext = document.createElement('input');
	    btnNext.type = "button";
	    btnNext.value = "Older >";
	    btnNext.onclick = () => this.RenderMessagesTable(pageIndex + 1, itemsPerPage);
	    if (pageIndex >= totalPages - 1) btnNext.disabled = true;
	    
	    const btnReload = document.createElement('input');
	    btnReload.type = "button";
	    btnReload.value = "reload table";
	    btnReload.style.cssText = "background-color: #555; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-left: 10px; border-radius: 3px;";
	    btnReload.onclick = () => this.RenderMessagesTable(0, itemsPerPage);

	    fieldset.appendChild(btnPrev);
	    fieldset.appendChild(inputPage);
	    fieldset.appendChild(btnNext);
	    fieldset.appendChild(btnReload); 
	    
	    navDiv.appendChild(fieldset);
	    container.appendChild(navDiv);

	    // 7. Final append
	    const existingContainer = document.getElementById(containerId);
	    if (!existingContainer) {
		document.body.prepend(container);
	    }
	}



	/**
	 * Renders a settings form to manage default flag values for commands.
	 */
	RenderDefaultCommandSettings() {
	    const containerId = "default_command_settings";
	    let container = document.getElementById(containerId);
	    if (!container) {
		container = document.createElement('div');
		container.id = containerId;
		container.style.cssText = "margin: 20px; padding: 15px; border: 1px solid #444; background: #111; color: white;";
		document.body.prepend(container); 
	    }
	    container.innerHTML = '<h2>Default Command Settings</h2>';

	    const table = document.createElement('table');
	    table.style.cssText = 'width: 100%; border-collapse: collapse; margin-top: 10px;';
	    table.innerHTML = `
		<thead>
		    <tr style="background-color: #333;">
			<th style="padding: 10px; text-align: left; width: 10em;">Command</th>
			<th style="padding: 10px; text-align: left;">Flag Inputs / Defaults</th>
			<th style="padding: 10px; text-align: left; width: 10em;">Action</th>
		    </tr>
		</thead>
		<tbody id="default_command_tbody"></tbody>
	    `;
	    container.appendChild(table);
	    const tbody = document.getElementById('default_command_tbody');

	    this.#state.commands.forEach(commandDef => {
		const commandName = commandDef.command;
		const flags = commandDef.flags || [];
		const tr = document.createElement('tr');
		tr.style.borderBottom = '1px solid #444';
		
		const nameTd = document.createElement('td');
		nameTd.style.padding = '10px';
		nameTd.innerHTML = `<strong>!${commandName}</strong>`;
		tr.appendChild(nameTd);

		const inputsTd = document.createElement('td');
		inputsTd.style.padding = '10px';
		const formGroup = document.createElement('div');
		formGroup.style.cssText = "display: flex; flex-wrap: wrap; gap: 10px;";

		flags.forEach(flagDef => {
		    const flagAlias = flagDef.flag[0];
		    const inputId = `cmd-default-${commandName}-${flagAlias}`;
		    const isNumeric = typeof flagDef.value === 'number';

		    const div = document.createElement('div');
		    div.style.cssText = "display: flex; flex-direction: column; min-width: 120px;";

		    const label = document.createElement('label');
		    label.htmlFor = inputId;
		    label.innerText = `-${flagAlias.toUpperCase()}: ${flagDef.description.split(' ')[1] || 'Value'}`;
		    label.title = flagDef.description;
		    label.style.fontSize = '0.9em';
		    label.style.color = '#ccc';

		    const input = document.createElement('input');
		    input.id = inputId;
		    input.name = inputId;
		    input.value = flagDef.value;
		    input.placeholder = `Default: ${flagDef.value}`;
		    input.style.cssText = "padding: 5px; border: 1px solid #888; background: #333; color: white; border-radius: 3px; margin-top: 2px;";

		    if (isNumeric) {
			input.type = 'number';
			input.min = flagDef.range?.min || undefined;
			input.max = flagDef.range?.max || undefined;
			input.step = (flagDef.range?.max - flagDef.range?.min) < 3 ? 0.1 : 1; 
		    } else {
			input.type = 'text'; 
		    }
		    
		    input.classList.add(`flag-input-${commandName}`);

		    div.appendChild(label);
		    div.appendChild(input);
		    formGroup.appendChild(div);
		});

		inputsTd.appendChild(formGroup);
		tr.appendChild(inputsTd);

		const actionTd = document.createElement('td');
		actionTd.style.padding = '10px';
		
		if (typeof commandDef.func === 'function') {
		    const runButton = document.createElement('button');
		    runButton.innerText = `Run !${commandName}`;
		    runButton.style.cssText = "background-color: #007bff; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px;";
		    
		    runButton.onclick = async () => {
			runButton.disabled = true;
			runButton.innerText = 'Running...';
			
			const currentParams = {};
			const inputs = document.querySelectorAll(`.flag-input-${commandName}`);
			inputs.forEach(input => {
			    const alias = input.id.split('-').pop();
			    const value = input.type === 'number' ? parseFloat(input.value) : input.value;
			    if (value !== null && value !== undefined && value !== "") {
				 currentParams[alias] = value;
			    }
			});

			const testMessage = `Testing command !${commandName} with UI defaults.`;

			try {
			    await commandDef.func.call(this, testMessage, currentParams, {});
			    
			    runButton.innerText = 'Success!';
			    DebugPrint(`Successfully executed !${commandName}:`, currentParams);
			} catch (e) {
			    runButton.innerText = 'Error!';
			    console.error(`Error executing !${commandName}:`, e);
			} finally {
			    setTimeout(() => {
				runButton.innerText = `Run !${commandName}`;
				runButton.disabled = false;
			    }, 2000);
			}
		    };
		    actionTd.appendChild(runButton);
		} else {
		    actionTd.innerHTML = '<span style="color:#aaa;">Function not implemented</span>';
		}

		tr.appendChild(actionTd);
		tbody.appendChild(tr);
	    });
	}



	/**
	 * Helper to safely retrieve the current default value from the settings form.
	 */
	_getCommandDefault(commandName, flagAlias) {
	    const inputId = `cmd-default-${commandName}-${flagAlias}`;
	    const input = document.getElementById(inputId);
	    if (input) {
		return input.type === 'number' ? parseFloat(input.value) : input.value;
	    }
	    return null;
	}

	SanitizeString(strang) {
	  // 1. Type Check
	  if (typeof strang !== 'string') {
	    throw new Error("strang is not a string, UNEXPECTED DATA TYPE");
	  }

	  // 2. Sanitize: Create a version with only letters/numbers for checking
	  // We keep the original 'strang' to return if no match is found
	  const cleanStr = strang.toLowerCase().replace(/[^a-z0-9]/g, '');

	  let foundBannedWord = null;

	  // 3. Sliding Window Approach
	  // We check every possible substring against the Trie
	  // i = start position, j = length of the window
	  for (let i = 0; i < cleanStr.length; i++) {
	    for (let len = 1; len <= cleanStr.length - i; len++) {
	      const windowContent = cleanStr.substring(i, i + len);
	      
	      if (this.#state.bannedWords.ContainsString(windowContent)) {
		foundBannedWord = windowContent;
		break; // Found a match, exit inner loop
	      }
	    }
	    if (foundBannedWord) break; // Exit outer loop
	  }

	  // 4. Conditional Logic
	  if (foundBannedWord) {
	    // If a banned word was found, pass to switch statement
	    switch (foundBannedWord) {
	      case "apple": // Example specific case
		DebugPrint("Banned word 'apple' detected.");
		return "REDACTED";
	      default:
		DebugPrint(`Banned word '${foundBannedWord}' detected.`);
		return "****";
	    }
	  }

	  // 5. If no match found, return the original string with spaces/special chars intact
	  return strang;
	}

	ParseCommandFromMessage(rawText) {
	    const result = {
		    foundCommands : [], 
		    seperatedText : rawText
	    };

	    if (!rawText.startsWith(this.#state.config.flag.token)){
		    result.seperatedText = rawText
		    return result;
	    } 

	    const tokens = rawText.split(/\s+/);
	    if (tokens.length == 0) return result;

	    const potentialCommandName = tokens[0].substring(1).toLowerCase();
	    const commandConfig = this.#state.commands.find(c => c.command == potentialCommandName);

	    if (commandConfig) {
		const commandName = commandConfig.command;
		
		const commandData = {
		    command : commandName, 
		    _rawFunc : commandConfig.func, 
		    params : {}
		};

		// --- PHASE 1: Parse provided flags ---
		let messageStartIndex = 1;
		for (let i = 1; i < tokens.length; i++) {
		    const token = tokens[i];
		    if (token.startsWith('-')) {
			const flagKey = token.substring(1); 
			const flagDef = commandConfig.flags.find(f => f.flag.includes(flagKey));

			if (flagDef) {
			    const flagAlias = flagDef.flag[0]; 
			    const valueToken = tokens[i + 1];
			    let val = null;
			    const isNumericFlag = typeof flagDef.value === 'number';

			    if (isNumericFlag) {
				if (valueToken && !isNaN(parseFloat(valueToken))) val = parseFloat(valueToken);
			    } else { 
				if (valueToken) val = valueToken;
			    }
			    
			    if (val !== null) {
				if (isNumericFlag && flagDef.range) {
				    val = Math.max(flagDef.range.min, Math.min(flagDef.range.max, val));
				}
				commandData.params[flagAlias] = val;
				i++;
				messageStartIndex = i + 1;
			    }
			}
		    } else {
			messageStartIndex = i;
			break;
		    }
		}

		// --- PHASE 2: Apply defaults ---
		commandConfig.flags.forEach(flagDef => {
		    const flagAlias = flagDef.flag[0];
		    if (commandData.params[flagAlias] === undefined) {
			const defaultValue = this._getCommandDefault(commandName, flagAlias);
			if (defaultValue !== null) commandData.params[flagAlias] = defaultValue;
		    }
		});

		const actualMessageParts = tokens.slice(messageStartIndex);
		result.cleanText = actualMessageParts.join(" ");
		
		commandData.func = async (injectedState) => {
		     if (typeof commandData._rawFunc === 'function') {
			await commandData._rawFunc.call(
			    this, 
			    result.cleanText, 
			    commandData.params,
			    injectedState // This will be passed when called
			);
		    }
		};

		result.foundCommands.push(commandData);
	    }
	    return result;
	}

	async importFileAsString(url) {
	  try {
	    // Fetch the file from the specified URL
	    const response = await fetch(url);

	    // Check if the request was successful
	    if (!response.ok) {
	      throw new Error(`HTTP error! status: ${response.status}`);
	    }

	    // Get the response body as a plain text string
	    const fileContent = await response.text();

	    return fileContent;

	  } catch (error) {
	    console.error('Error fetching file:', error);
		  throw new Error("could not get file");
	    // You might want to return a default value or re-throw the error
	  }
	}

	async CheckMessageForBannedWords(inMessage = undefined){ //TODO: optimize this a bunch
		try{
			if(inMessage == undefined){
				console.warn("in message is undefined, is this intentional?");
				return false;
			}

			//check message without spaces or caps for bad word	
			let formattedMessage = new Array(inMessage.length-1);
			for(let i = 0; i < inMessage.length; ++i){
				switch(inMessage[i]){
					case("@"):
					case("4"):
						formattedMessage[i] = 'a';
						break;
					case("6"):
					case("8"):
						formattedMessage[i] = 'b';
						break;
					case("<"):
					case("["):
						formattedMessage[i] = 'c';
					case("]"):
						formattedMessage[i] = 'd';
						break;
					case("3"):
						formattedMessage[i] = 'e';
						break;
						// formattedMessage[i] = 'f';
					case("9"):
						formattedMessage[i] = 'g';
						break;
					case("#"):
						formattedMessage[i] = 'h';
						break;
					case("1"):
					case("!"):
						formattedMessage[i] = 'i';
						break;
						// formattedMessage[i] = 'j';
						// formattedMessage[i] = 'k';
					case("("):
					case(")"):
					case("\\"):
					case("/"):
					case("|"):
						formattedMessage[i] = 'l';
						break;
						// formattedMessage[i] = 'm';
						// formattedMessage[i] = 'n';
						// formattedMessage[i] = 'o';
						// formattedMessage[i] = 'p';
						// formattedMessage[i] = 'q';
						// formattedMessage[i] = 'r';
					case("5"):
					case("$"):
						formattedMessage[i] = 's';
						break;
					case("7"):
						formattedMessage[i] = 't';
						break;
						// formattedMessage[i] = 'u';
						// formattedMessage[i] = 'v';
						// formattedMessage[i] = 'w';
						// formattedMessage[i] = 'x';
						// formattedMessage[i] = 'y';
					case(">"): UNKNOWN
					case("%"):
						formattedMessage[i] = 'z';
						break;
					default: 
						console.warn("unaccounted case for input: ", inMessage[i]);
						formattedMessage[i] = '';
						break;
				}
			}
			formattedMessage = String(formattedMessage).toLowerCase();

			for(let i = 0; i < formattedMessage.length; ++i){
				for(let j = formattedMessage.length-1; -1 < j; --j){
					if(this.#state.bannedWords.ContainsString(formattedMessage.slice(i, j))){
						return true
					}
				}
			}
			return false;
		}
		catch(err){
			console.log(err);
		}
	}



                async dispatchCommand(raw,
                                      commandPrefix = this.config.flag.token) {

                  // quick exit
                  if (raw == '' || raw == undefined || raw == null) {
                    throw new Error("MALFORMED INPUT, raw input is null");
                  }

                  if (!raw.startsWith(commandPrefix)) {
                    return {message : raw};
                  }
                  let message = raw.slice(commandPrefix.length, raw.length);

                  let ft = this.templates.flags; // Flag Template
                  const cmds = this.#state.commands;

                  for (let i = 0; i < cmds.flags.length; ++i) {
                    if (message.startsWith(smds.flags.flag)) {
                    }
                  }

                  const messageAfterToken =
                      raw.substring(commandPrefix.length).trim();

                  let commandName = null;
                  let argsStr = null;

                  for (const command of SUPPORTED_COMMANDS) {
                    const commandString = command + ' ';

                    if (messageAfterToken.toLowerCase().startsWith(
                            commandString)) {
                      commandName = command;
                      argsStr =
                          messageAfterToken.substring(commandString.length)
                              .trim();
                      break;
                    }

                    if (messageAfterToken.toLowerCase() == command) {
                      commandName = command;
                      argsStr = "";
                      break;
                    }
                  }

                  if (!commandName) {
                    return null;
                  }

                  let parsedArgs;

                  switch (commandName) {
                  case ('tts'):
                    return this.ProcessTtsMessage(message);
                  case ('clip'):
                  case ('help'):

                  default:
                    return null;
                  }
                }

                ProcessTtsMessage(raw) {
                  if (raw[0] != '!') {
                    return null;
                  }

                  let command = this.templates.commands;
                  command.flags = {
                    p : flagsIn.p || this.#GEBI("ttsPitch")
                    ?.value || this.#LSGI("ttsPitch") || "1",
                    r
                    : flagsIn.r || this.#GEBI("ttsRate")
                    ?.value || this.#LSGI("ttsRate") || "1",
                    v
                    : flagsIn.v || this.#GEBI("ttsVoice")
                    ?.value || this.#LSGI("ttsVoice") || 51, };
		  command.command;
                  command.verison = 1;
                  command.func = this.CallTts;

                  const argsStr = match[2];
                  const parts = argsStr.trim().split(/\s + /);

                  let flags = {
                    p : "",
                    r : "",
                    v : "",
                  };

                  let msgParts = [];
                  for (let i = 0; i < parts.length; i++) {
                    if (parts[i] == "-r" && parts[i + 1]) {
                      flags.r = parts[i + 1];
                      i++;
                    } else if (parts[i] == "-v" && parts[i + 1]) {
                      flags.v = parts[i + 1];
                      i++;
                    } else if (parts[i] == "-p" && parts[i + 1]) {
                      flags.p = parts[i + 1];
                      i++;
                    } else {
                      msgParts.push(parts[i]);
                    }
                  }

                  return {flags, message : msgParts.join(" ")};
                }

	ExportState() {
	    // 1. Process this.#state into a JSON string
	    // The 'replacer' function handles the Trie conversion and removes functions
	    const data = JSON.stringify(this.#state, (key, value) => {
		// Handle the TrieTree conversion
		if (key === 'bannedWords' && value && typeof value.ToArray === 'function') {
		    return value.ToArray();
		}
		
		// Remove functions (CallTts, etc.) to prevent JSON errors
		if (typeof value === 'function') {
		    return undefined; 
		}

		return value;
	    }, 4); // 4 spaces for a pretty, readable JSON file

	    // 2. Set up the file metadata
	    const filename = `bot_settings_${new Date().toISOString().slice(0, 10)}.json`;
	    const type = "application/json";

	    // 3. Create the download trigger
	    const blob = new Blob([data], { type: type });
	    const url = window.URL.createObjectURL(blob);
	    const link = document.createElement('a');
	    
	    link.href = url;
	    link.download = filename;
	    
	    // Append to body is required for some browsers (like Firefox)
	    document.body.appendChild(link);
	    link.click();
	    
	    // Cleanup
	    document.body.removeChild(link);
	    window.URL.revokeObjectURL(url);
	    
	    DebugPrint("State exported successfully as: " + filename);
	}

	constructor(args = {}){
	  this.args = args;
	  this.firstStart = true;

		const stateInput = document.getElementById('state_input');
		stateInput.addEventListener('change', (event) => {
		    this.ImportState(event);
		});

		const fileInput = document.getElementById('blacklist_input');
		fileInput.addEventListener('change', (event) => {
		    this.LoadBannedWords(event);
		});
	}	
}
