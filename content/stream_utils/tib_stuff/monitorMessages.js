import YoutubeStuff from "./youtubeStuff.js";
import {IntTimer} from "./intTimer.js";

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
  // testResults.passed for status
  //

  testResults = function RunTests() {
    passed = false;

    /*
    tests = [
            new testTemplate(),
    ];
    for(let i = 0; i < Object.keys(tests).length; ++i){

    }
    */
    passed = true;
    return passed;
  }

// tldr: this is largely ment to live as state, with functions used to monitor
// state
// VARS private messages should be treated as static.
#bannedAtTemplate = {
  datetime : "", unbannedAt : [], bannAppeals : [],
}
#serviceHandlers = {
// loose to be extensiable
youtube : new YoutubeStuff(),
}
#channelTemplate = {
version : 1, platform : "", channelName : "", channelId : ""
}
#banAppealTemplate = {
version : 1, message : "",
}
#banTemplate = {
version : 1, iat : "", eat : "", reason : "", appeals : []
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
	version : 1, 
	authorName : "",
        channels : [],
        uuid : "",
        ttsBans : [],
        channelBans : [],
        firstSeen: "",
	points : 0,
};
/**
 * @returns {JSON}
 */
async AddProcessedMessagesToQueue(input){
	if(input == ''){
		throw new Error("input is undefined, not doing anything");
	}
	//try convert to object if string
	if(typeof(input) == 'string'){
		try{
			if(
				input.includes(".json")
			){
				await fetch(input).then((res) => {
					input = res.json();
				})
			}
			else if(typeof(input) == "object"){
				JSON.parse(input);
			}
			else {
				throw new Error("input is no ta string or object, cannot parse");
			}
		}
		catch(err){
			console.error(err);
		}
	}	

	function mergeSortedLists(listA, listB) {
	    let mergedList = Array(listA.length + listB.length);
	    let i = 0; // Pointer for listA
	    let j = 0; // Pointer for listB

	    // 1. Core Comparison Loop
	    // Keep running as long as there are elements in both lists to compare
	    while (i < listA.length && j < listB.length) {
		
		// Compare the elements
		if (listA[i].unixTime <= listB[j].unixTime) {
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
	this.#messages_queue = mergeSortedLists(this.#messages_queue, input);
}

/**
 * @returns {JSON}
 */
async GetAndReturnUsers(){return this.#users;}
#unprocessed_queue = []; // messages returned from yt fetch
/**
 * @name unpressed_queue
 * @description - template for messages that have not been processed
 * @param {number} version - version number of the unprocessed message template
 * used
 * @param {number} apiVersion - version of the api the message was got from
 * @param {number} data - the data of the individual message
 * @param {number} dateTime - the value of date.now of when the message was
 * received.
 * @param {string} platform - teh platform the message came from
 * @param {string} failedProcessingAt - undefined if not attempted, if attempted
 * will have a value from Date.now()
 * @return {Array<Object>}
 */
#unprocessed_message_template = {
	version : 1,
	apiVersion : 3, // youtube,
	data : undefined,
	dateTime : undefined,
	platform : undefined,
	failedProcessingAt : undefined,
}
/**
 * @returns {JSON}
 */
async GetAndReturnUnprocessedMessages(){
	return this.#unprocessed_queue;
}
#messages_queue = [];
/**
 * @returns {JSON}
 */
async GetAndReturnProcessedMessages(){return this.#messages_queue;
}

/**
 * @name #flagsTemplate
 * @param {Array<string>} flag - the flag[s] to trigger the cmd, must be in an
 * array
 * @param {string} value - value for the flag
 * @param {string} valueType - type for the input value to modify params
 * @param {string} description - tldr of what the flag does to the cmd
 * @param {range} if number, min and max values
 */
#flagsTemplate = {
	flag : undefined, 
	value : undefined, 
	description : undefined, 
	range : {min:0.5, max : 3}
}
/**
 * @name #commandTemplate
 * @param {number} template_version - version of the command
 * @param {string} command - flag to trigger the command
 * @param {Array} flags - additional params to modify the command
 * @param {Function} function - what code snippit to trigger when cmd is called
 */
#commandTemplate = {
	template_version : 1,
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
}

#commands = [ // only add commands that are implimented
	{
		template_version: 1,
		command: "rank",
		flags: [
			{
				flag: ['d'],
				value: 1,
				description: "for people to add/update their rankings on a game",
				range: { min: 0.1, max: 10 }
			},
		],
		func: '', //function to call when triggered
		AuthNeeded: { 
			owner: false,
			admin: false,
			mod: false,
			trused: false
		}
	},
	{
		template_version: 1,
		command: "clip",
		flags: [
			{
				flag: ['d'],
				value: 1,
				description: "approximate duration of the clip in minutes",
				range: { min: 0.1, max: 10 }
			},
			{
				flag: ['m'],
				value: 1,
				description: "a message the user can include",
				range: { min: 0.5, max: 3 }
			},
		],
		func: '', //function to call when triggered
		AuthNeeded: { 
			owner: false,
			admin: false,
			mod: false,
			trused: false
		}
	},
	{
		template_version: 1,
		command: "help",
		flags: [],
		func: '', //function to call when triggered
		AuthNeeded: { 
			owner: false,
			admin: false,
			mod: false,
		}
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
				range: { min: 0, max: 180 }
			},
		],
		AuthNeeded: { 
			owner: false,
			admin: false,
			mod: false,
		},
		func: this.CallTts, //function to call when triggered
	},
]

// ⭐️ FIX: Removed the 'state: {}' object from the template to prevent all new messages from sharing the same reference.
#message_template = {
	template_version: 1,
	authorName: "",
	authorId: "",
	streamOrigin: "", //what streamid via the platform the message came from
	unixTime: "",
	commands: [],
	processedMessage: "",
	platform: "",
	rawMessage: "",
	score: "",
};

#clip_queue = [];
	// NOTE: Assuming this function is part of a class/module where
	config = {
	  monitorMessages : {
	    debug : true,
	    strictMode : false,
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
	}



_parseCommandString(rawText) {
    const result = {foundCommands : [], cleanText : rawText};

    if (!rawText.startsWith('!')) return result;

    const tokens = rawText.split(/\s+/);
    if (tokens.length == 0) return result;

    const potentialCommandName = tokens[0].substring(1).toLowerCase();
    const commandConfig = this.#commands.find(c => c.command == potentialCommandName);

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
        
        // ⭐️ UPDATE: We just prepare the function here. 
        // We cannot bind the 'messageObject' yet because it doesn't exist.
        // The binding will happen in the processor or we pass it dynamically.
        // For now, let's keep it simple: The function expects (message, flags, messageState).
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



                /**
                 * Specific processor for YouTube API v3 messages.
                 * Maps YouTube raw data to your standard #message_template.
                 */
                async ProcessYouTubeV3(unprocessedMsg) {
                  const raw = unprocessedMsg.data;
                  const snippet = raw.snippet;
                  const author = raw.authorDetails;

                  // 1. Initialize the new processed message object
                  const newMessage = {
                    ... this.#message_template,
                    // ⭐️ CRITICAL FIX: Initialize 'state' with a NEW object literal 
                    // to prevent reference sharing (state pollution).
                    state: {} 
                  }; // Shallow copy template

                  // 2. Map basic metadata
                  newMessage.template_version = 1;
                  newMessage.platform = "YouTube";
                  newMessage.rawMessage = unprocessedMsg; // Keep reference to the container
                  newMessage.unixTime = unprocessedMsg.date;
                  newMessage.authorName = author.displayName;
                  newMessage.authorId = author.channelId;
                  newMessage.streamOrigin = snippet.liveChatId; // Or videoId if you prefer

                  // 3. Extract text content
                  // YouTube messages can be simple text or fan funding, etc. We
                  // target textMessageEvent.
                  let textContent = "";
                  if (snippet.type == 'textMessageEvent') {
                    textContent = snippet.textMessageDetails.messageText;
                  } else if (snippet.displayMessage) {
                    // Fallback for other types
                    textContent = snippet.displayMessage;
                  }

                  // 4. Parse for commands
                  // We use a helper helper to strip commands/flags and return
                  // clean text
                  const parseResult = this._parseCommandString(textContent);

                  newMessage.commands = parseResult.foundCommands;
		  parseResult.cleanText = this.sanitizeString(parseResult.cleanText);
		  newMessage.processedMessage = parseResult.cleanText;

		  newMessage.score = await this.ScoreMessage(parseResult.cleanText);

                  return newMessage;
                }

async ProcessUnprocessedMessagesQueue(maxAmount = 50) {
    let i = 0;
    while (this.#unprocessed_queue.length > 0 && i < maxAmount) {
        const currentItem = this.#unprocessed_queue.shift();

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
                        const commandDefinition = this.#commands.find(
                            def => def.command === cmd.command
                        );
                        if (!commandDefinition || typeof commandDefinition.func !== 'function') return;

                        const originalFuncRef = commandDefinition.func; 
                        const params = cmd.params;
                        
                        // ⭐️ CRITICAL: Initialize ttsHasRead if it's a TTS command
                        if (cmd.command === 'tts') {
                            hasTtsCommand = true;
                            // Initialize ttsHasRead only if it's a tts command
                            processedResult.state.ttsHasRead = false;
                        }
                        
                        // BIND: Overwrite cmd.func, passing processedResult.state
                        // The bound function will call CallTts(messageText, params, processedResult.state)
                        cmd.func = () => originalFuncRef.call(this, messageText, params, processedResult.state); 
                    });

                    // ⭐️ NEW: Only add ttsHasRead if there was an actual TTS command found.
                    // (This should be redundant due to the check inside the loop, but is a fail-safe)
                    if (hasTtsCommand && processedResult.state.ttsHasRead === undefined) {
                        processedResult.state.ttsHasRead = false;
                    }
                }
                this.#messages_queue.push(processedResult);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        i = ++i;
    }
}



async MonitorLoop() {
	console.log("starting Loop MonitoringLoop");
        const TimeoutDuration = 5000;
        
        // Note: The outer REJECT will fire immediately. A better polling pattern 
        // is typically done with recursion/setInterval, but this follows your structure.

//	console.log("daLoop set up, calling");
        //await daLoop;
	//console.log("daLoop called");

        
        // This line is needed to kick off the next loop cycle if you want continuous polling
        // If this is only meant to be a single-shot function, remove the line below.
        
        // Recursive call to start the next cycle after the timeout/processing finishes
        //return this.MonitorLoop(); 
    }


GetMessagesTimer = new IntTimer();

async MonitoringStart() {
	// asset
	
	
	// test

    // Start polling loop
    try {
        console.log("[MonitoringStart] Starting polling loop for new messages...");
        
        // Use YouTube's recommended polling interval (stored in config after first GetMessages call)
        const pollingInterval = this.#serviceHandlers.youtube.GetPollingInterval() || 8000;
        
        console.log(`[MonitoringStart] Using polling interval: ${pollingInterval}ms`);
        
        this.GetMessagesTimer.AddTimeoutListener(() => this.#DaLoop());
        this.GetMessagesTimer.timeoutDuration = pollingInterval;
        
        this.GetMessagesTimer.tickListeners.push(() => {
            console.log(`[Timer] Tick: ${this.GetMessagesTimer.time}`);
        });
        
        this.GetMessagesTimer.Start();
        console.log("[MonitoringStart] Polling started successfully!");
        
    } catch (err) {
        console.error("[MonitoringStart ERROR] Failed to start polling loop:", err);
        throw err;
    }
}


async #DaLoop() {
    try {
        console.log(`[DaLoop] Starting cycle. Queue size: ${this.#unprocessed_queue.length}`);
        
        // --- 1. GET NEW MESSAGES (Uses stored pageToken automatically) ---
        const newMessagesRaw = await this.#serviceHandlers.youtube.GetMessagesAtPage(); 
        
        const rawItems = newMessagesRaw?.items || [];
        
        if (rawItems.length > 0) {
            console.log("New YouTube messages:");
            console.log(JSON.stringify(newMessagesRaw, null, 2));
            console.log(`[DaLoop] Fetched ${rawItems.length} new messages.`);

            for (let i = 0; i < rawItems.length; ++i) {
                this.ParseAndAddYouTubeV3MessagesToUnprocessedQueue(rawItems[i]);
            }

            console.log("Updated unprocessed_queue:\n" + JSON.stringify(this.#unprocessed_queue, null, 2));
        } else {
            console.log("[DaLoop] No new messages this cycle.");
        }

        // --- 2. PROCESS QUEUE ---
        if (this.#unprocessed_queue.length > 0) {
            console.log("Processing unprocessed messages...");
            await this.ProcessUnprocessedMessagesQueue();
            
            console.log("Updated messages_queue:\n" + JSON.stringify(this.#messages_queue, null, 2));
            console.log("[DaLoop] Cycle completed successfully");
        }
        
    } catch (err) {
        console.error("[DaLoop ERROR] Cycle failed:", err);
        // Don't throw - let the timer continue trying
    }
}


                async MonitoringStop() {
		  this.GetMessagesTimer.Stop(); 
                  this.GetMessagesTimer.RemoveTimeoutListener(this.MonitorLoop);
                }



/**
 * Internal helper: Finds the oldest message with a TTS command that has not been read.
 * CRITICAL: This only processes messages that have BOTH a TTS command AND ttsHasRead === false
 * which is effectively the oldest if the queue is FIFO chronological. Most importantly,
 * it now awaits the execution before completing the function, preventing a new 
 * call of AutoTtsStart/loop from executing on a new message before the previous one is finished.
 */
async _playOldestUnreadTts() {
	if (!this.#messages_queue || this.#messages_queue.length === 0) {
		console.warn("Auto TTS: Message queue is empty.");
		return;
	}
	console.log(`Auto TTS: Checking ${this.#messages_queue.length} messages in queue...`);
	//check msg has commands
	let ttsIndex = -1;

	let msg;
	for(let i = 0; i < this.#messages_queue.length; ++i){
		msg = this.#messages_queue[i];
		// 1. Must have commands array
		if (msg.commands.length === 0) {
		    continue;
		} 

		//check cmd is a tts command
		let ttsFound = false;
		for(let j = 0; j < msg.commands.length; ++j){
			if(msg.commands[j].command == "tts"){
				ttsFound = true;
				break;	
			}
		}
		if(!ttsFound){
			continue;	
		}

		//check message hasn't been read
		if(!msg.state || msg.state.ttsHasRead == false){
			console.log(`Auto TTS: Found unread TTS message from ${msg.authorName}: "${msg.processedMessage}"`);
			ttsIndex = i;
			break;
		}
		if(i == this.#messages_queue.length-1){console.warn("erached end of mesasge queue without finding a match")}
	};
	if(ttsIndex == -1){
		console.warn("no tts mesasges found in the queue");
		return;
	}

	if(message == undefined){
		console.warn("msg is empty" + "\n" + JSON.stringify(msg, null, 2));
	}
	
// ... (message selection logic above)

console.log("attempting to execute command from tts message" + "\n" + JSON.stringify(msg, null, 2));
let cmdExecuteAttempted = false;
for(let i = 0; i < msg.commands.length; ++i){
    // ✅ CORRECTED: Access the command property of the array element at index i
    if(msg.commands[i].command != "tts"){ 
        continue  
    }
    cmdExecuteAttempted = true;

    switch(msg.template_version){
        case(1):
            await this.CallTts(msg);
            // After successful call, you might want to break the loop 
            // if you only want to execute the first TTS command.
            // break;
        default:
            throw new Error("no compatable command version found" + "\n" + JSON.stringify(msg, null, 2));
    }
}
if(cmdExecuteAttempted == false){
    throw new Error("somehow message selected did not have a tts command attached" + "\n" + JSON.stringify(msg, null, 2));
}
}


/**
 * Private member to hold the timer instance.
 */
#autoTtsTimer = null; 

/**
 * Starts the Auto TTS system with immediate execution and periodic checks.
 */
async AutoTtsStart() {
    console.log("Starting Auto TTS System...");

    // 1. Stop any existing timer for clean start
    if (this.#autoTtsTimer) {
        this.AutoTtsStop();
    }

    // 2. Execute immediately on start (test/trigger)
    console.log("Auto TTS: Executing immediate initial run...");
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
                console.log(`Auto TTS: Cycle complete. Checking for TTS messages after ${intervalSeconds}s.`);
                // ⭐️ CRITICAL: await the function call in the listener as well
                await this._playOldestUnreadTts(); 
            }
        ],

        // Logging: Called every second
        tickListeners: [
            () => {
                const currentElapsed = this.#autoTtsTimer.time || 0;
                const remaining = Math.max(0, intervalSeconds - currentElapsed);
                console.log(`Auto TTS: Next check in ${remaining}s`);
            }
        ]
    });

    // 4. Start the loop
    this.#autoTtsTimer.Start();
    console.log(`Auto TTS: System running. Will check for new TTS messages every ${intervalSeconds} seconds.`);
}

/**
 * Stops the Auto TTS system.
 */
AutoTtsStop() {
    if (this.#autoTtsTimer) {
        console.log("Stopping Auto TTS System...");
        this.#autoTtsTimer.Stop(); 
        this.#autoTtsTimer = null;
        console.log("Auto TTS: System stopped.");
    } else {
        console.log("Auto TTS: No active system to stop.");
    }
}


/**
 * Executes the Text-to-Speech command using the message and flags.
 * @param {string} message The clean message text to speak.
 * @param {Object} flags The command parameters/flags.
 * @param {Object} messageState - Reference to the message.state object (messageObj.state)
 * @returns {Promise<void>}
 */
async CallTts(message, messages_queue_index = undefined) { 
	console.log("CallTts: Starting TTS for message:", message);

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
	const TTS = new SpeechSynthesisUtterance(message);

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

	if(messages_queue_index != undefined){
		console.log("no messages_queue_index given, attempting to find message");
		for(let i = 0; i < this.#messages_queue.length; ++i){
			if( //check auth, msg, and unixTime to verify that the message is very very likely the same message
				message.authorId == this.#messages_queue[i].authorId
				&& message.rawMessage.data.displayMessage == this.#messages_queue[i].rawMessage.data.displayMessage 
				&& mesasge.unixTime == this.#messages_queue[i].unixTime
			){
				messages_queue_index = i;	
				console.log("message found at index: " + i);
				break;
			}
		}
		if(messages_queue_index){
			console.warn("could not find matching message from queue, it is possible this is a text or something else, IF THIS IS UNINTENTIONAL YOU GOT SOME DEBUGGING TO DO");
		}
	};

	return new Promise((resolve, reject) => {
		TTS.onend = () => {
			let log = "CallTts: Speech completed successfully."; 
		    	console.log(log);
			resolve(log); 
		};

		TTS.onerror = (e) => {
		    	console.error("CallTts: TTS error:", e);
		    	// Set flag on error to prevent re-reading failing messages
			messageState.ttsHasRead = 'ERROR'; 
			reject(new Error(`TTS failed: ${e.error}`));
		}
		console.log("CallTts: Starting speech synthesis...");
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

                  let command = this.#commandTemplate;
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
                  command.template_version = 1;
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
async ParseAndAddYouTubeV3MessagesToUnprocessedQueue(rawMessage) {
    // Check if the input is a valid object
    if (!rawMessage || typeof rawMessage !== 'object' || !rawMessage.snippet) {
        console.warn("Invalid single raw message object provided. Skipping.");
        return;
    }

    // Convert the ISO 8601 string to Unix time in milliseconds.
    const unixTimestampMs = new Date(rawMessage.snippet.publishedAt).getTime();

    // Create a new message object based on the class template
    const processedMessage = {
        // Use a shallow copy of the template to avoid modifying the template itself
        version : this.#unprocessed_message_template.version,
        apiVersion : this.#unprocessed_message_template.apiVersion,
        platform : "YouTube",
        // Set dynamic/specific fields
        data : rawMessage, // Store the entire raw message object
        dateTime : unixTimestampMs, // Unix time in milliseconds
        failedProcessingAt : undefined, 
    };

    this.#unprocessed_queue.push(processedMessage);
}

                // PRIVATE FUNCTIONS
#LSGI(id) {
                return localStorage.getItem(String(id));
                }
#GEBI(id) {
                return document.getElementById(id);
                }

#messageDisbatch(message){}

                // PUBLIC (laid out by general flow)
                async GetMessages(pageToken = undefined) {

                  console.log(`Processing ${yt_messages.length} messages`);

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
                      console.log(`Skipping duplicate message from ${msg.author}
                                  : "${msg.message}"`);
                      continue;
                    }

                    console.log(`Adding NEW message from ${msg.author}
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

                  console.log(`Added $ {
                    newMessagesCount
                  } new messages to table`);
                  return yt_messages;
                }

                async ScoreMessage(message) { // TODO: MORSE CODE BREAKS THE SCORE: "..-. ..- -.-. -.- / -- --.- / .-.. .. ..-. ." == 440
                  // 1. DEFINE ALL SCORING FUNCTIONS (using arrow functions for
                  // 'this' context)
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
                    //console.log(`score CheckPunctuation() : ${score}`);
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

                      //console.log(`score CheckTrigrams() : ${score}`);
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
                    //console.log(`score CheckForRepeats() : ${score}`);
                    return score;
                  };

                  const CheckForCaps = (message) => {
                    let score = 0;
                    if (message[0] == message.charAt(0).toUpperCase()) {
                      score += 20;
                    } else {
                      score -= 10;
                    }
                    //console.log(`score CheckForCaps() : ${score}`);
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

                    ///console.log(`score CheckForSpaces() : ${score}`);
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
                    //console.log(`score CheckForSpaceInChunk : ${score}`);
                    return score;
                  };

                  // 2. SCORING EXECUTION

                  let score = 0;

                  const funcs = [
                    CheckPunctuation,
                    CheckTrigrams,
                    CheckForRepeats,
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

                    if (this.config.monitorMessages.debug == true) {
                      //console.log(`score eval at function call : ${score}`);
                    }
                  }

                  return score;
                }



/**
 * Renders the processed messages into a visual HTML table based on the provided
 * mock structure, styles, and pagination logic.
 * NOTE: This function relies on the existence of `this.#messages_queue` 
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
    const sortedMessages = [...this.#messages_queue].reverse(); 
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
                        console.log(`Executing command: ${cmd.command} for message: ${msg.processedMessage}`);
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
                             console.log(`Manually set ttsHasRead for ${msg.authorName} to ${msg.state.ttsHasRead}`);
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

    this.#commands.forEach(commandDef => {
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
                    console.log(`Successfully executed !${commandName}:`, currentParams);
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

                async VerifyConfig() {
                  try {
                    await this.yt.VerifyConfig()
                  } catch (err) {
                    throw new Error("could not verify config:\n" + err);
                  }
                }

                async GetMessages() {
                  let messageLists = new Promise.all([this.yt.GetMessages])
                                         .then((values) => {

                                                            });
                }

                sanitizeString(strang) {
                  if (typeof strang != 'string') {
                    throw new Error(
                        "strang is not a string, UNEXPECTED DATA TYPE");
                  }

                  const miniscules = [
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
                    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
                    's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ];
                  const caps = [
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                    'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                  ];
                  const numbers =
                      [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];

const specials = [
                    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '[', ']',
                    '?', '/', '|', '.', ',', ':', ';'
                  ];
                  const valid_chars = miniscules + caps + numbers + specials;

                  let matchFound = false;
                  for (let i = 0; i < strang.length; ++i) {
                    for (let j = 0; j < valid_chars.length; ++j) {
                      if (strang[i] == valid_chars[j]) {
                        matchFound = true; break;
                      }
                    }
                    if (!matchFound) {
                      strang[i] = '';
                    }
                  }
                  return strang
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

                  let ft = this.#flagsTemplate;
                  const cmds = this.#commands;

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

                  let command = this.#commandTemplate;
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
                  command.template_version = 1;
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

        	constructor(args = {}) {
                  this.args = args;
                  this.firstStart = true;

                  const apiKey = this.#GEBI("youtube_apiKey")           ?.value;
                  const broadcastId = this.#GEBI("youtube_broadcastId") ?.value;

                  this.yt = new YoutubeStuff(
                      {apiKey : apiKey, broadcastId : broadcastId});

                  this.monitorInterval = null;
                  this.messageIndex = 0;

                  this.nextPageToken = null;

                  if (this.config.monitorMessages.debug == true) {
                    console.warn("debug mode on, toggling strict mode to on for testing");
                    this.config.monitorMessages.strictMode == true;
                  }

		this.RenderMessagesTable();
		this.RenderDefaultCommandSettings()
                
	}
}
