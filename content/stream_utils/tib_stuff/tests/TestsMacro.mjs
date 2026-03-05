//this file is testing chains of functionality to confirm that things are happening as they're suppose too. 
//ie adding and removing an unprocessed message and reading it

	ProcessPredictionCommand(messageObject) {
	    this.DebugPrint({msg: "--- Function Entered ---"});
	    
	    // 1. Resolve the message content - Added rawMessage as a fallback
	    const message = messageObject.text || messageObject.rawMessage || "";
	    
	    // 2. Auth Check
	    const userUuid = messageObject.userUuid; 
	    const user = this.#state.users.find(u => u.uuid === userUuid);

	    if (!user) {
		this.DebugPrint({msg: `CRITICAL: User [${userUuid}] not found.`});
		return {};
	    }

	    if (!user.isChatModerator) return {};

	    // 3. Setup Command Object
	    let commandObj = {
		version: 1,
		command: "prediction",
		flags: [
		    { flag: ['p'], value: undefined },
		    { flag: ['t', 'l'], value: undefined },
		    { flag: ['e'], value: undefined },
		    { flag: ['r'], value: undefined },
		]
	    };

	    // 4. Parsing Loop - IMPROVED REGEX
	    commandObj.flags.forEach(f => {
		f.flag.forEach(char => {
		    // Updated Regex: Matches the flag, and optionally captures following text 
		    // until the next flag (-) or end of string
		    const regex = new RegExp(`-${char}(?:\\s+([^\\-]+))?`, 'i');
		    const match = message.match(regex);
		    
		    if (match) {
			// If the flag exists, mark it as true/empty string at minimum
			// match[1] will be the value if provided, otherwise an empty string
			f.value = (match[1] ? match[1].trim() : "");
			this.DebugPrint({msg: `Parsed Flag -${char}: ${f.value}`});
		    }
		});
	    });

	    // 5. Execution Gate
	    const pFlag = commandObj.flags.find(f => f.flag.includes('p'));
	    const eFlag = commandObj.flags.find(f => f.flag.includes('e'));
	    const rFlag = commandObj.flags.find(f => f.flag.includes('r'));

	    if (pFlag && pFlag.value !== undefined) {
		this.DebugPrint({msg: "Conditions met for Creation."});
		this.CreateNewPrediction(commandObj);
	    } 
	    // Check if the flags themselves were found (even if value is "")
	    else if (eFlag?.value !== undefined || rFlag?.value !== undefined) {
		this.DebugPrint({msg: "Conditions met for Resolution."});

		const activeEvent = this.#state.events.find(e => e.type === "prediction");
		if (!activeEvent) {
		    this.DebugPrint({msg: "Resolution failed: No active prediction found."});
		    return commandObj;
		}

		let winningSide = 'refund'; 
		const val = eFlag?.value?.toLowerCase();

		if (val === 'y' || val === 'yes') {
		    winningSide = 'yes';
		} else if (val === 'n' || val === 'no') {
		    winningSide = 'no';
		}

		this.EndPrediction(activeEvent.id, winningSide);
		this.#state.events = this.#state.events.filter(e => e.id !== activeEvent.id);
		this.EventDisplayManager();
		
		this.DebugPrint({msg: `Prediction ${activeEvent.id} resolved as: ${winningSide}`});
	    } 
	    else {
		this.DebugPrint({msg: "No valid execution flags found."});
	    }

	    return commandObj;
	}


	ProcessPredictionCommand(messageObject) {
	    this.DebugPrint({msg: "--- Function Entered ---"});
	    
	    // 1. Resolve the message content - Added rawMessage as a fallback
	    const message = messageObject.text || messageObject.rawMessage || "";
	    
	    // 2. Auth Check
	    const userUuid = messageObject.userUuid; 
	    const user = this.#state.users.find(u => u.uuid === userUuid);

	    if (!user) {
		this.DebugPrint({msg: `CRITICAL: User [${userUuid}] not found.`});
		return {};
	    }

	    if (!user.isChatModerator) return {};

	    // 3. Setup Command Object
	    let commandObj = {
		version: 1,
		command: "prediction",
		flags: [
		    { flag: ['p'], value: undefined },
		    { flag: ['t', 'l'], value: undefined },
		    { flag: ['e'], value: undefined },
		    { flag: ['r'], value: undefined },
		]
	    };

	    // 4. Parsing Loop - IMPROVED REGEX
	    commandObj.flags.forEach(f => {
		f.flag.forEach(char => {
		    // Updated Regex: Matches the flag, and optionally captures following text 
		    // until the next flag (-) or end of string
		    const regex = new RegExp(`-${char}(?:\\s+([^\\-]+))?`, 'i');
		    const match = message.match(regex);
		    
		    if (match) {
			// If the flag exists, mark it as true/empty string at minimum
			// match[1] will be the value if provided, otherwise an empty string
			f.value = (match[1] ? match[1].trim() : "");
			this.DebugPrint({msg: `Parsed Flag -${char}: ${f.value}`});
		    }
		});
	    });

	    // 5. Execution Gate
	    const pFlag = commandObj.flags.find(f => f.flag.includes('p'));
	    const eFlag = commandObj.flags.find(f => f.flag.includes('e'));
	    const rFlag = commandObj.flags.find(f => f.flag.includes('r'));

	    if (pFlag && pFlag.value !== undefined) {
		this.DebugPrint({msg: "Conditions met for Creation."});
		this.CreateNewPrediction(commandObj);
	    } 
	    // Check if the flags themselves were found (even if value is "")
	    else if (eFlag?.value !== undefined || rFlag?.value !== undefined) {
		this.DebugPrint({msg: "Conditions met for Resolution."});

		const activeEvent = this.#state.events.find(e => e.type === "prediction");
		if (!activeEvent) {
		    this.DebugPrint({msg: "Resolution failed: No active prediction found."});
		    return commandObj;
		}

		let winningSide = 'refund'; 
		const val = eFlag?.value?.toLowerCase();

		if (val === 'y' || val === 'yes') {
		    winningSide = 'yes';
		} else if (val === 'n' || val === 'no') {
		    winningSide = 'no';
		}

		this.EndPrediction(activeEvent.id, winningSide);
		this.#state.events = this.#state.events.filter(e => e.id !== activeEvent.id);
		this.EventDisplayManager();
		
		this.DebugPrint({msg: `Prediction ${activeEvent.id} resolved as: ${winningSide}`});
	    } 
	    else {
		this.DebugPrint({msg: "No valid execution flags found."});
	    }

	    return commandObj;
	}

	{
		name: "⚠️(is a macro test) ProcessPrectionCommand: refund prediction",
		input: {
			authorName: "@vulbyte",
			commands: [],
			messageId: "",
			platform: "youtube",
			processedMessage: "weeeeee",
			rawMessage: "!prediciton -r",
			receivedAt: 1771039317784,
			score: -50,
			state: {},
			streamOrigin: "Cg0KC29xVnRfQnlhVml3KicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILb3FWdF9CeWFWaXc",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			version: 1,
		},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},

	
	{
		name: "ProcessPrectionCommand: create prediction with l flag",
		input: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "!prediction -p will this work? -l 45",
			rawMessage: "!prediction -p will this work? -l 45",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	{
		name: "ProcessPrectionCommand: create prediction without prompt but with l flag",
		input: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "!prediction -p will this work?",
			rawMessage: "!prediction -l 45",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	{
		name: "ProcessPrectionCommand: create prediction with no info",
		input: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "!prediction -p will this work?",
			rawMessage: "!prediction -l 45",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
 	// RenderPredictionHtml is basically impossible to test	
	// EndPrediction relys on an event existing thus needs to be a macro test	
	// AddEventToEventQueue is a macro level fn	
	// Event DisplayManager is a macro level fn
	// RenderStandbyHTML is a macro level fn
	// CreateEvent ^^^
	// EndEvent ^^^
	// EndAllEvents ^^^
	// UpdateBannedWordsTrie() ^^^
	// RemoveBannedWord() ^^^
	// CalcUserConductScore is a macro level func	
	// ProcessUnprocessedMessage Queue is a macro level function
	
	// MonitoringStart is ^^^	
	// FindUserFromChannelNameAndReturnUuid is a macro something something	
	// AddPointsToUserWithUuid ^^^	
	// AddUserToUsers ^^^	
	//SafeAddToMessagesQueue ^^^
	// DaLoop ^^^
	// MonitoringStop ^^^
	/* how test?
	{
		name: "Process Pending Tts",
		input: {},
		targetMethod: "ProcessPendingTts",
		expectedOutput: "this shouldn't complete",
	},
	*/

	/* how test?
	{
		name: "CallTts",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/* macro?
	{
		name: "ParseAndAddYoutubeV3MessageToUnprocessedQueue",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "LSGI",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "GEBI",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "ParseAndAddYoutubeV3MessageToUnprocessedQueue",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/
	/* render messages table is macro
	{
		name: "RenderMessagesTable",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/* render default command settings is macro
	{
		name: "RenderDefaultCommandSettings",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "SanitizeString",
		input: {},
		targetMethod: "SanitizeString",
		expectedOutput: undefined,
	},
	*/
	/*
	{
		name: "importfileasstring",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/
	/*
	{
		name: "GenerateYoutubeConfig",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "GenerateControlBarUI",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "ModifyUserPoints",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "GenerateUserManagement",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "UpdateUserDisplay",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "PushToSubWindow",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	/*
	{
		name: "CreateSubWindow",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/
	/*
	{
		name: "UpdateUserDisplay",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	*/

	


	{ /* this is a macro command because it relys on the state of the state to get the timestamp */
		name: "ProcessClipCommand",
		input: {
		    "authorName": "vulbyte",
		    "commands": {
			"tts": {
			    "errInfo": {},
			    "flags": {
				"p": "1.2",
				"r": "1.9",
				"v": "51"
			    },
			    "isValid": true,
			    "message": "yo was good",
			    "spend": 10000,
			    "version": 1
			}
		    },
		    "messageId": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
		    "platform": "youtube",
		    "processedMessage": "yo was good",
		    "rawMessage": "!tts -v 51 -r 1.9 -p 1.2 yo was good",
		    "receivedAt": 1771485470330,
		    "score": -170,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "userUuid": "bfd32d55-458b-4ba8-9568-f4e226f77949",
		    "version": 1
		},
		targetMethod: "ProcessClipCommand",
		expectedOutput: undefined,
	},



	{
		name: "GenerateBannedWordsConfig",
		input: {},
		targetMethod: "GenerateBannedWordsConfig",
		expectedOutput: undefined,
	},

	{
		name: "UpdateBannedWordsList",
		input: {},
		targetMethod: "UpdateBannedWordsList",
		expectedOutput: undefined,
	},

	{
		name: "GetTrigramsFromFile",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},


	{
		name: "CheckMessageForBannedWords",
		input: undefined,
		targetMethod: "CheckMessageForBannedWords",
		expectedOutput: false,
	},
