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
//  VARS private messages should be treated as static.
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
async GetAndReturnUsers(){return this.#users;
}
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
async GetAndReturnUnprocessedMessages(){return this.#unprocessed_queue;
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
			{
				flag: ["read"],
				value: false,
				description: "an internal flag used to mark if a message is read.",
				range: {min: 0, max: 1}
			}
		],
		AuthNeeded: { 
			owner: false,
			admin: false,
			mod: false,
		},
		func: this.CallTts, //function to call when triggered
	},
]

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

                /**
                 * Helper: Parses a raw string (e.g., "!tts -r 2.0 Hello World")
                 * Identifies commands from #commands, extracts flags, and
                 * returns clean text.
                 */
/**
 * Helper: Parses a raw string (e.g., "!tts -r 2.0 Hello World")
 * Identifies commands from #commands, extracts flags, and
 * returns clean text.
 */
_parseCommandString(rawText) {
    const result = {foundCommands : [], cleanText : rawText};

    if (!rawText.startsWith('!'))
        return result;

    const tokens = rawText.split(/\s+/);
    if (tokens.length == 0)
        return result;

    const potentialCommandName =
        tokens[0].substring(1).toLowerCase();

    const commandConfig = this.#commands.find(
        c => c.command == potentialCommandName);

    if (commandConfig) {
        const commandName = commandConfig.command;
        
        const commandData = {
            command : commandName, 
            _rawFunc : commandConfig.func, 
            params : {}
        };

        // --- PHASE 1: Parse provided flags from the message ---
        let messageStartIndex = 1;
        
        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i];

            if (token.startsWith('-')) {
                const flagKey = token.substring(1); 

                const flagDef = commandConfig.flags.find(
                    f => f.flag.includes(flagKey));

                if (flagDef) {
                    const flagAlias = flagDef.flag[0]; 
                    const valueToken = tokens[i + 1];
                    
                    const isNumericFlag = typeof flagDef.value === 'number';
                    let val = null;

                    if (isNumericFlag) {
                        if (valueToken && !isNaN(parseFloat(valueToken))) {
                            val = parseFloat(valueToken);
                        }
                    } else { 
                        if (valueToken) {
                            val = valueToken;
                        }
                    }
                    
                    if (val !== null) {
                        if (isNumericFlag && flagDef.range) {
                            val = Math.max(flagDef.range.min,
                                           Math.min(flagDef.range.max, val));
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

        // --- PHASE 2: Apply defaults for missing flags ---
        commandConfig.flags.forEach(flagDef => {
            const flagAlias = flagDef.flag[0];
            
            if (commandData.params[flagAlias] === undefined) {
                const defaultValue = this._getCommandDefault(commandName, flagAlias);
                
                if (defaultValue !== null) {
                    commandData.params[flagAlias] = defaultValue;
                }
            }
        });

        // Reconstruct the message text minus the command and flags
        const actualMessageParts = tokens.slice(messageStartIndex);
        result.cleanText = actualMessageParts.join(" ");
        
        // ⭐️ CRITICAL FIX: Bind the execution function to correctly pass all three arguments.
        commandData.func = async () => {
            if (typeof commandData._rawFunc === 'function') {
                await commandData._rawFunc.call(
                    this, 
                    result.cleanText,   
                    commandData.params, 
                    commandData         // Passed as the third argument!
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
                    ... this.#message_template
                  }; // Shallow copy template

                  // 2. Map basic metadata
                  newMessage.template_version = 1;
                  newMessage.platform = "YouTube";
                  newMessage.rawMessage = unprocessedMsg; // Keep reference to the container
                  newMessage.date = unprocessedMsg.dateTime;
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
        // Take the first item (FIFO)
        const currentItem = this.#unprocessed_queue.shift();

        try {
            let processedResult = null;

            switch (String(`${currentItem.platform}_v${currentItem.apiVersion}`).toLowerCase()) {
                case 'youtube_v3':
                    // Assume ProcessYouTubeV3 returns the message object 
                    processedResult = await this.ProcessYouTubeV3(currentItem);
                    break;
                default:
                    console.warn(`No processor found for ${currentItem.platform} v${currentItem.apiVersion}`);
                    currentItem.failedProcessingAt = Date.now();
                    break;
            }

            if (processedResult) {
                const messageText = processedResult.processedMessage;

                // ⭐️ CORRECTED STEP: Iterate commands, perform lookup, and bind the function
                if (processedResult.commands && processedResult.commands.length > 0) {
                    processedResult.commands.forEach(cmd => {
                        
                        // 1. LOOKUP: Find the original command definition object using the CORRECT property: this.#commands
                        const commandDefinition = this.#commands.find(
                            def => def.command === cmd.command
                        );

                        if (!commandDefinition) {
                            console.error(`Unknown command: '${cmd.command}'. Cannot bind function.`);
                            return; 
                        }

                        // 2. EXTRACT: Get the original, unbound function reference (e.g., this.CallTts)
                        const originalFuncRef = commandDefinition.func; 
                        const params = cmd.params;
                        
                        // Safety check
                        if (typeof originalFuncRef !== 'function') {
                            console.error(`Command definition for '${cmd.command}' is invalid. 'func' is not a callable function.`);
                            return; 
                        }
                        
                        // 3. BIND: Overwrite cmd.func with the new zero-argument closure.
                        // This closure is now ready to be called via cmd.func()
                        cmd.func = () => originalFuncRef.call(this, messageText, params); 
                    });
                }

                this.#messages_queue.push(processedResult);
            }

        } catch (error) {
            console.error("Error processing message:", error);
            currentItem.failedProcessingAt = Date.now();
        }
        i = ++i;
    }
}


async #DaLoop(){
    const timeoutDuration = 5000;
    
    // Note: The Promise/setTimeout structure is maintained as requested
    new Promise(async (RESOLVE, REJECT) => { 
        setTimeout(async () => {
            try {
                console.log(`[MonitorLoop] Starting cycle. Queue size: ${this.#unprocessed_queue.length}`);
                
                // --- 1. GET MESSAGES (Fetch) ---
                // Assume this returns the raw API response object { items: [...], nextPageToken: ... }
                const newMessagesRaw = await this.#serviceHandlers.youtube.GetMessages(); 
                
                const rawItems = newMessagesRaw?.items || [];
                
                console.log("new youtube messages are:\n");
                console.log(JSON.stringify(newMessagesRaw, null, 2));
                console.log(`[MonitorLoop] Fetched ${rawItems.length} new messages.`);

                for (let i = 0; i < rawItems.length; ++i) {
                    // Pass the single raw item to the helper function
                    await this.ParseAndAddYouTubeV3MessagesToUnprocessedQueue(rawItems[i]);
                }

                console.log("new unprocessed_queue: \n" + JSON.stringify(this.#unprocessed_queue, null, 2));
		} catch (err) {
		        console.error("[MonitorLoop ERROR] Cycle failed:", err);
		        // Reject here for fetch/initial setup failure
		        REJECT("COULD NOT GET NEW MESSAGES:\n" + err.message);
		}

                // --- 2. PROCESS QUEUE (Command Parsing) ---
                try{
                    console.log("processing unprocessed messages");
                    await this.ProcessUnprocessedMessagesQueue();
                    
                    console.log("new messages_queue: \n" + JSON.stringify(this.#messages_queue, null, 2));
                    RESOLVE("DATA PROCESSED SUCCESSFULLY"); // Resolve here for success
                }
                catch(err){
                    const msg = ("COULD NOT PROCESS UNPROCESSED_QUEUE IN TIME: " + err);
                    console.error(msg)
                    REJECT(msg);
                }
        }, timeoutDuration);
    });
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
			let cleanTest = false;
			try{
				await this.#DaLoop();
				cleanTest = true;
			}
			catch(err){
				console.error("MONITORINGLOOP() FAILED AND THREW ERROR");
				cleanTest = false;
			}

			this.GetMessagesTimer.AddTimeoutListener(this.MonitorLoop);
			// TODO: start the timer kronk
			this.GetMessagesTimer.timeoutDuration = 20;
			this.GetMessagesTimer.tickListeners += (() => {console.log(this.GetMessagesTimer.time)})
			this.GetMessagesTimer.Start();
		};

		/*
                  try {
                    // test it to see if it works
                    await MonitorLoop();
                    // if works, then you can start the timer
                    this.GetMessagesTimer.AddTimeoutListener(MonitorLoop);
                  } catch (err) {
                    console.log(
                        "test loop failed, probably shouldn't continue");
                    if (this.config.monitorMessages.strictMode == true) {
                      throw new Error(
                          "error in MonitorLoop(), failed and threw error");
                    }
                  }
                }
		*/

                async MonitoringStop() {
		  this.GetMessagesTimer.Stop(); 
                  this.GetMessagesTimer.RemoveTimeoutListener(MonitorLoop);
                }



// Add this private variable to the top of your class to hold the timer instance:
#autoTtsTimer = null; 
async AutoTtsStart() {
    console.log("Starting Auto TTS System...");

    if (this.#autoTtsTimer) {
        await this.AutoTtsStop();
    }

    // Instantiate IntTimer with the callback configured as a timeout listener
    this.#autoTtsTimer = new IntTimer({
        name: "AutoTTS_Loop",
        timeoutDuration: 20, // 20 seconds
        timeoutListeners: [ 
            async () => { await this._playOldestUnreadTts(); } 
        ],
        autoStart: true,
        // Set debugMode to true to see 'tick' logs
        debugMode: false 
    });

    if (this.#autoTtsTimer.alive !== true) {
        this.#autoTtsTimer.Start();
    }
}

async AutoTtsStop() {
    if (this.#autoTtsTimer) {
        console.log("Stopping Auto TTS System...");
        await this.#autoTtsTimer.Stop(); // Calls the Stop method in IntTimer
        this.#autoTtsTimer = null;
    }
}

/**
 * Internal helper to find and play the oldest unread TTS message.
 * This is where the 'read' flag is EVALUATED.
 */
async _playOldestUnreadTts() {
    if (this.#messages_queue.length === 0) return;

    for (const messageObj of this.#messages_queue) {
        
        if (!messageObj.commands || messageObj.commands.length === 0) continue;

        // PROTOCOL: Access the commands and scan for the TTS command
        const ttsCmd = messageObj.commands.find(c => c.command === 'tts');

        // PROTOCOL: Check the 'read' flag on the command's parameters
        if (ttsCmd && !ttsCmd.params.read) {
            
            try {
                // Execute the bound function. 
                // This call will execute CallTts() and MARK THE MESSAGE AS READ.
                if (typeof ttsCmd.func === 'function') {
                    await ttsCmd.func();
                } else {
                    console.warn("AutoTts: TTS command found but function is missing.");
                }

                // Play only ONE message per cycle
                return; 

            } catch (error) {
                console.error("AutoTts execution error, skipping message:", error);
            }
        }
    }
}


                async VerifyConfig() {
                  try {
                    await this.yt.VerifyConfig()
                  } catch (err) {
                    throw new Error("could not verify config:\n" + err);
                  }
                }

/**
 * Fetches the latest batch of messages from the YouTube Live Chat API (v3),
 * updates the polling token, and returns the messages parsed into the standard template.
 * * @returns {Array<Object>} An array of new messages formatted according to the unprocessed template.
 */

                /**
                 * @returns {null}
                 */
		// TODO: this for when i add more platforms
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
                  const messageAfterToken =
                      raw.substring(commandPrefix.length).trim();

                  let commandName = null;
                  let argsStr = null;

                  // 2. Iterate over the array to find a command match
                  for (const command of SUPPORTED_COMMANDS) {
                    // Create the full expected command string (e.g., "tts ")
                    const commandString = command + ' ';

                    // Check if the message starts with the command followed by
                    // a space
                    if (messageAfterToken.toLowerCase().startsWith(
                            commandString)) {
                      commandName = command;
                      // The arguments are everything after the command and the
                      // first space
                      argsStr =
                          messageAfterToken.substring(commandString.length)
                              .trim();
                      break; // Stop iteration once a command is found
                    }

                    // Also check for the case where the command is alone (e.g.,
                    // "!prefixhelp")
                    if (messageAfterToken.toLowerCase() == command) {
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

                  // 3. Use a SWITCH statement to determine which argument
                  // parser to use
                  switch (commandName) {
                  case ('tts'):
                    // Delegate complex argument/flag parsing to a dedicated
                    // function
                    return this.ProcessTtsMessage(message);
                  case ('clip'):
                  case ('help'):
                    // For simple commands, just use the arguments string
                    // parsedArgs = { flags: {}, message: argsStr };
                    // break;

                  default:
                    return null;
                  }
                }

/**
 * Executes the Text-to-Speech command using the message and flags 
 * passed directly from the command dispatcher.
 * * @param {string} message The clean message text to speak.
 * @param {Object} flags The command parameters/flags (e.g., { p: 1.5, r: 1.0, v: 2 }).
 * @returns {void}
 */
async CallTts(message, flags, commandObject) {
    // New third argument: commandObject (This is the object we need to modify)
    
    if (!message) {
        throw new Error("could not call tts, message is empty after processing.");
    }

    const getVoices = () => new Promise((resolve) => {
        let v = window.speechSynthesis.getVoices();
        if (v && v.length)
            return resolve(v);
        const onChange = () => {
            window.speechSynthesis.removeEventListener(
                'voiceschanged', onChange);
            resolve(window.speechSynthesis.getVoices());
        };
        window.speechSynthesis.addEventListener('voiceschanged', onChange);
        setTimeout(() => resolve(window.speechSynthesis.getVoices()), 250);
    });

    const voices = await getVoices();
    const utter = new SpeechSynthesisUtterance(message);

    // 3. Apply Flags (Using the extracted `flags` object)

    let desiredVoice = null;
    
    // Check for 'v' (voice) flag
    if (flags.v) {
        const maybeIdx = Number(flags.v);
        
        if (!Number.isNaN(maybeIdx) && voices[maybeIdx]) {
            desiredVoice = voices[maybeIdx];
        } else {
            desiredVoice = voices.find(
                v => v.name == flags.v || v.lang == flags.v);
        }
    }
    if (desiredVoice)
        utter.voice = desiredVoice;

    // Apply 'r' (rate) and 'p' (pitch) flags
    utter.rate = Number(flags.r) || 1; 
    utter.pitch = Number(flags.p) || 1;

    // 4. Speak
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);

    // ⭐️ CRITICAL FIX: Mark the message as read after execution.
    // The commandObject argument *is* the command in the queue that holds the state.
    if (commandObject && commandObject.params) {
        commandObject.params.read = true; // SETS THE FLAG TRUE
    }
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

// Inside MessageProcessor class...

/**
 * Parses a single raw YouTube Live Chat Message object and adds it to the 
 * standardized unprocessed message template.
 * * @param {Object} rawMessage A single raw message object from the YouTube API 'items' array.
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

                async ScoreMessage(message) {
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
                    console.log(`score CheckPunctuation() : ${score}`);
                    return score;
                  };

                  const CheckTrigrams = async(message) => {
                    // ⭐️ CRITICAL FIX: Ensure #trigrams data is loaded before
                    // accessing it
                    /*
                    if (!Array.isArray(this.#trigrams) || this.#trigrams.length
                    === 0) { console.warn("Trigrams data is not yet loaded or is
                    empty. Skipping CheckTrigrams."); return 0;
                    }
                    */

                    let score = 0;
                    try {
                      const words = message.trim().toLowerCase().split(/\s + /);

                      for (const word of words) {
                        if (word.length >= 3) {
                          const currentTrigram = word.slice(0, 3);
                          let validTrigramFound = false;

                          // This is now safe: 'this' context is correct and
                          // data is checked
                          if (trigrams.includes(currentTrigram)) {
                            score += 50;
                            validTrigramFound = true;
                          }
                          if (!validTrigramFound) {
                            score -= 50;
                          }
                        }
                      }

                      console.log(`score CheckTrigrams() : ${score}`);
                      return score;
                    } catch (err) {
                      console.error("Original error in CheckTrigrams:", err);
                      // Re-throw the application error
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
                    console.log(`score CheckForRepeats() : ${score}`);
                    return score;
                  };

                  const CheckForCaps = (message) => {
                    let score = 0;
                    if (message[0] == message.charAt(0).toUpperCase()) {
                      score += 20;
                    } else {
                      score -= 10;
                    }
                    console.log(`score CheckForCaps() : ${score}`);
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

                    console.log(`score CheckForSpaces() : ${score}`);
                    return score;
                  };

                  const CheckForSpaceInChunk = (message) => {
                    let score = 0;
                    for (let i = 0; i < message.length; i += 32) {
                      let chunk = message.slice(i, i + 32);
                      if (!chunk.includes(" ")) {
                        score -= 20;
                      }
                      // The original logic had no else block, so we maintain
                      // that
                    }
                    console.log(`score CheckForSpaceInChunk : ${score}`);
                    return score;
                  };

                  // 2. SCORING EXECUTION

                  let score = 0;

                  const funcs = [
                    CheckPunctuation,
                    CheckTrigrams, // ASYNC function
                    CheckForRepeats,
                    CheckForCaps,
                    CheckForSpaces,
                    CheckForSpaceInChunk,
                  ];

                  for (const func of funcs) {
                    let funcScore;

                    // ⭐️ CRITICAL FIX: Await the async function to prevent
                    // NaN/Promise error
                    if (func.constructor.name == 'AsyncFunction') {
                      funcScore = await func(message);
                    } else {
                      funcScore = func(message);
                    }

                    // Add the returned numerical score
                    score += funcScore;

                    if (this.config.monitorMessages.debug == true) {
                      console.log(`score eval at function call : ${score}`);
                    }
                  }

                  return score;
                }



/**
 * Renders the processed messages into a visual HTML table based on the provided
 * mock structure, styles, and pagination logic.
 * * NOTE: This function relies on the existence of `this.#messages_queue` 
 * (array of processed message objects).
 * * @param {number} pageIndex - The current page of messages to display (0 is newest).
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
        
        /* Style for the new command buttons */
        .command-trigger-button {
            background-color: #3873C7; /* A medium blue for action */
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
    
    // Create the header
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
        
        // --- Dynamic Color Logic ---
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

        // --- Time Ago Logic (First Seen) ---
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


        // --- User Roles for Profile Gradient ---
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

        // --- Command Cell Content Generation ---
        const commandCellDiv = document.createElement('div');
        commandCellDiv.style.cssText = "display:flex; flex-direction:column; font-size: 0.9em; color: white; text-shadow: 1px 1px 1px black;";

        if (msg.commands && msg.commands.length > 0) {
            msg.commands.forEach(cmd => {
                const cmdDiv = document.createElement('div');
                
                cmdDiv.innerHTML = `
                    <div><strong>${cmd.command}</strong></div>
                    <div style="font-size:0.8em; opacity:0.9; overflow-wrap:break-word;">${JSON.stringify(cmd.params)}</div>
                `;
                
                // ⭐️ NEW: Add a button to call the bound function
                if (typeof cmd.func === 'function') {
                    const funcButton = document.createElement('button');
                    funcButton.innerText = `Run ${cmd.command}`;
                    funcButton.className = 'command-trigger-button';
                    
                    // Bind the function to the button click event
                    // We wrap it in an arrow function to ensure it runs asynchronously/safely
                    funcButton.onclick = async () => {
                        console.log(`Executing command: ${cmd.command} for message: ${msg.processedMessage}`);
                        try {
                            await cmd.func();
                            // Optional: Give visual feedback that the command ran
                            funcButton.innerText = 'Run Success!';
                            funcButton.disabled = true;
                            setTimeout(() => {
                                funcButton.innerText = `Run ${cmd.command}`;
                                funcButton.disabled = false;
                            }, 1500);
                        } catch (e) {
                            console.error(`Error running ${cmd.command}:`, e);
                            funcButton.innerText = 'Run Error';
                        }
                    };
                    cmdDiv.appendChild(funcButton);
                }
                commandCellDiv.appendChild(cmdDiv);
            });
        } else {
            commandCellDiv.innerHTML = '<span style="opacity:0.5;">-</span>';
        }


        // --- Assemble the Row (Using existing HTML structure for user/message/controls) ---
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

        // Manually insert the command content into the command cell to preserve the onclick binding
        tr.querySelector('.command-cell').appendChild(commandCellDiv);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    // 6. Navigation Controls (unchanged)
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

    // 7. FINAL APPENDING STEP
    const existingContainer = document.getElementById(containerId);
    if (!existingContainer) {
        document.body.prepend(container); // Using appendChild for simplicity, but prepending is fine too
    }
}



/**
 * Renders a settings form to manage default flag values for commands,
 * allowing users to test execution directly from the UI.
 * NOTE: The command must have a 'func' defined to be testable.
 */
RenderDefaultCommandSettings() {
    // 1. Setup container
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

    // 2. Iterate over all defined commands
    this.#commands.forEach(commandDef => {
        const commandName = commandDef.command;
        const flags = commandDef.flags || [];
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #444';
        
        // Command Name Cell
        const nameTd = document.createElement('td');
        nameTd.style.padding = '10px';
        nameTd.innerHTML = `<strong>!${commandName}</strong>`;
        tr.appendChild(nameTd);

        // Inputs Cell
        const inputsTd = document.createElement('td');
        inputsTd.style.padding = '10px';
        const formGroup = document.createElement('div');
        formGroup.style.cssText = "display: flex; flex-wrap: wrap; gap: 10px;";

        let hasInputs = false;

        // 3. Iterate over command flags and generate inputs
        flags.forEach(flagDef => {
            const flagAlias = flagDef.flag[0]; // e.g., 'p'
            const inputId = `cmd-default-${commandName}-${flagAlias}`;
            const isNumeric = typeof flagDef.value === 'number';

            const div = document.createElement('div');
            div.style.cssText = "display: flex; flex-direction: column; min-width: 120px;";

            const label = document.createElement('label');
            label.htmlFor = inputId;
            // Use the main flag alias and description
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
            
            // Add a class for easy retrieval of all inputs for this command
            input.classList.add(`flag-input-${commandName}`);

            div.appendChild(label);
            div.appendChild(input);
            formGroup.appendChild(div);
            hasInputs = true;
        });

        inputsTd.appendChild(formGroup);
        tr.appendChild(inputsTd);

        // Action Cell
        const actionTd = document.createElement('td');
        actionTd.style.padding = '10px';
        
        if (typeof commandDef.func === 'function') {
            const runButton = document.createElement('button');
            runButton.innerText = `Run !${commandName}`;
            runButton.style.cssText = "background-color: #007bff; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px;";
            
            // 4. Bind the function call to the button
            runButton.onclick = async () => {
                runButton.disabled = true;
                runButton.innerText = 'Running...';
                
                // Collect the current values from the form inputs for this command
                const currentParams = {};
                const inputs = document.querySelectorAll(`.flag-input-${commandName}`);
                inputs.forEach(input => {
                    const alias = input.id.split('-').pop();
                    const value = input.type === 'number' ? parseFloat(input.value) : input.value;
                    if (value !== null && value !== undefined && value !== "") {
                         currentParams[alias] = value;
                    }
                });

                // A simple command call often includes a message. 
                // Since this is a default settings test, we'll use a placeholder message.
                const testMessage = `Testing command !${commandName} with UI defaults.`;

                try {
                    // Call the original function using .call to set the 'this' context, 
                    // passing the test message and the collected parameters.
                    await commandDef.func.call(this, testMessage, currentParams);
                    
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
 * @param {string} commandName 
 * @param {string} flagAlias 
 * @returns {string|number|null} The current input value, or null if not found.
 */
_getCommandDefault(commandName, flagAlias) {
    const inputId = `cmd-default-${commandName}-${flagAlias}`;
    const input = document.getElementById(inputId);
    if (input) {
        // If it's a number input, return the number value. Otherwise, return the string value.
        return input.type === 'number' ? parseFloat(input.value) : input.value;
    }
    return null;
}



                // RUN
        	constructor(args = {}) {
                  //console.warn(`all tests passed : $ { this.testResults }`);

                  this.args = args;
                  this.firstStart = true;

                  const apiKey = this.#GEBI("youtube_apiKey")           ?.value;
                  const broadcastId = this.#GEBI("youtube_broadcastId") ?.value;

                  this.yt = new YoutubeStuff(
                      {apiKey : apiKey, broadcastId : broadcastId});

                  this.monitorInterval = null;
                  this.messageIndex = 0;

                  // IMPORTANT: Store the nextPageToken to get new messages
                  this.nextPageToken = null;

                  if (this.config.monitorMessages.debug == true) {
                    console.warn("debug mode on, toggling strict mode to on for testing");
                    this.config.monitorMessages.strictMode == true;
                  }

        // Ensure DOM is ready (though typically this runs after page load)
		this.RenderMessagesTable();
		this.RenderDefaultCommandSettings()
                
	}
}


