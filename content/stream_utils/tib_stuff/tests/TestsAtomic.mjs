import { exec } from 'node:child_process';
import Cockatiel from '../Cockatiel.mjs';

/**
 * 1. RUNTIME DETECTION
 */
const getRuntime = () => {
    if (typeof Deno !== 'undefined') return 'deno';
    if (typeof Bun !== 'undefined') return 'bun';
    if (typeof process !== 'undefined' && process.versions?.node) return 'node';
    return 'browser';
};

/**
 * 2. PURE DECLARATIVE MANIFEST
 */
const testManifest = [
	/* for copy paste:
	{
		name: "⚠️",
		input: {},
		targetMethod: "FunctionName",
		expectedOutput: undefined,
	},
	 */
	{
		name: "AddLogToLogs",
		input: {
		    type: "log",
		    message: "Test String",
		    data: undefined,
		    error: undefined,
		},
		targetMethod: "AddLogToLogs",
		expectedOutput: true,
	},
	{
		name: "Get Log",
		input: undefined,
		targetMethod: "GetLogs",
		expectedOutput: [],
	},
	{
		name: "Basic Debug Labeling",
		input: {msg: "Test String"},
		targetMethod: "DebugPrint",
		expectedOutput: 
		{
		    type: "log",
		    message: "Test String",
		    data: undefined,
		    error: undefined,
		}
	},
	{
		name: "FormatTime 185 (3:05) from number",
		input: 185,
		targetMethod: "FormatTime",
		expectedOutput: "3:05",
	},
	{
		name: "FormatTime 125 (2:05) from string",
		input: "125",
		targetMethod: "FormatTime",
		expectedOutput: "2:05",
	},
	{
		name: "FormatTime 0 from string",
		input: "0",
		targetMethod: "FormatTime",
		expectedOutput: "0:00",
	},
	{
		name: "FormatTime negative string",
		input: -1234,
		targetMethod: "FormatTime",
		expectedOutput: "0:00",
	},
	{
		name: "FormatTime invalid string",
		input: "asdf",
		targetMethod: "FormatTime",
		expectedOutput: {error: "cannot parse time from input"},
	},
	{
		name: "FormatTime undefined string",
		input: undefined,
		targetMethod: "FormatTime",
		expectedOutput: {"error": "cannot process value, s is undefined or null"},
	},
	{
		name: "FormatTime no input",
		input: "",
		targetMethod: "FormatTime",
		expectedOutput: {"error": "cannot process value, s is undefined or null"},
	},	

	{
		name: "Process valid yes vote command",
		input: {
			version: 1,
			authorName: "test_user",
			userUuid: crypto.randomUUID(),
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "",
			platform: "",
			rawMessage: "!vote -y",
			messageId: "",
			score: "",
			state: {}
		},
		targetMethod: "ProcessVoteCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			command: {
				type: "vote",
				flags: {"y": true, "n": false, "dd": false}, // flags will be a key value, such as: {-y: true}
				string: "",
				executedAt: "type:number"
			}, // vote, tts, etc
			spend: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				err: undefined,
				erroredAt: undefined,
			},
		},
	},
	{
		name: "Process valid yes vote with double down command",
		input: {
			version: 1,
			authorName: "test_user",
			userUuid: crypto.randomUUID(),
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "",
			platform: "",
			rawMessage: "!vote -y -dd",
			messageId: "",
			score: "",
			state: {}
		},
		targetMethod: "ProcessVoteCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			command: {
				type: "vote",
				flags: {"y": true, "n":false, "dd": true}, // flags will be a key value, such as: {-y: true}
				string: "",
				executedAt: Date.now()
			}, // vote, tts, etc
			spend: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				err: undefined,
				erroredAt: undefined,
			},
		},
	},
	{
		name: "Process valid no vote command",
		input: {
			version: 1,
			authorName: "test_user",
			userUuid: crypto.randomUUID(),
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "",
			platform: "",
			rawMessage: "!vote -n",
			messageId: "",
			score: "",
			state: {}
		},
		targetMethod: "ProcessVoteCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			command: {
				type: "vote",
				flags: {"n": true, "y": false, "dd": false}, // flags will be a key value, such as: {-y: true}
				string: "",
				executedAt: Date.now()
			}, // vote, tts, etc
			spend: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				err: undefined,
				erroredAt: undefined,
			},
		},
	},
	{
		name: "Process valid no vote command with double down",
		input: {
			version: 1,
			authorName: "test_user",
			userUuid: crypto.randomUUID(),
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "",
			platform: "",
			rawMessage: "!vote -n -dd",
			messageId: "",
			score: "",
			state: {}
		},
		targetMethod: "ProcessVoteCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			command: {
				type: "vote",
				flags: {"n": true, 'y': false, "dd": true}, // flags will be a key value, such as: {-y: true}
				string: "",
				executedAt: Date.now(),
			}, // vote, tts, etc
			spend: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				err: undefined,
				erroredAt: undefined,
			},
		},
	},
	{
		name: "Process invalid vote command",
		input: {
			version: 1,
			authorName: "test_user",
			userUuid: crypto.randomUUID(),
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "",
			platform: "",
			rawMessage: "!vote asdf",
			messageId: "",
			score: "",
			state: {}
		},
		targetMethod: "ProcessVoteCommand",
		expectedOutput: {
			isValid: false, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			command: {
				type: "vote",
				flags: {"n": false, "y": false, "dd": false}, // flags will be a key value, such as: {-y: true}
				string: "",
				executedAt: undefined,
			}, // vote, tts, etc
			spend: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				"err": "MISSING_CHOICE",
				"erroredAt": "type:number" 
			    },
		    },
		
	},

	{
		name: "HandleVoteStateUpdate",
		input: {
		    "isValid": true,
		    "command": {
			"type": "vote",
			"flags": {
			    "n": true,
			    "y": false,
			    "dd": false
			},
			"string": "",
			"executedAt": "type:number"
		    },
		    "spend": 0,
		    "version": 1,
		    "errInfo": {}
		},
		targetMethod: "HandleVoteStateUpdate",
		expectedOutput: false,
	},

	{
		name: "ProcessPrectionCommand: create standard prediction",
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
		targetMethod: "CreateNewPrediction",
		expectedOutput: {
			id: "type:string",
			type: "prediction",
			startedAt: "type:number",
			completedAt: undefined,
			expiresAt: undefined,
			state: {
			    prompt: "will this work?",
			    votes: [],
			    lockoutDuration: 45,
			    timeRemainingUntilLockout: "type:class",
			    timeRemainingUntilRefund: "type:class",
			}
		},
	},	
	{
		name: "ProcessPrectionCommand: create prediction with no 'p' flag",
		input: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "!prediction -l 45",
			rawMessage: "!prediction -l 45",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "CreateNewPrediction",
		expectedOutput: {
		    "error": "prompt is empty, cannot create"
		},
	},
	{
		name: "ProcessPrectionCommand: create prediction with no 'l' flag",
		input: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "10091ef9-35ee-4d19-9e41-e337c492162a",
			streamOrigin: "youtube", //what streamid via the platform the message came from
			receivedAt: Date.now(),
			commands: [],
			processedMessage: "!prediction -p will this work?",
			rawMessage: "!prediction -p will this work?",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "CreateNewPrediction",
		expectedOutput: {
		    "id": "type:string",
		    "startedAt": "type:number",
		    "state": {
			"lockoutDuration": 300,
			"prompt": "will this work?",
			"timeRemainingUntilLockout": "type:class",
			"timeRemainingUntilRefund": "type:class",
			"votes": []
		    },
		    "type": "prediction"
		},
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
			processedMessage: "!prediction -l 45",
			rawMessage: "!prediction -l 45",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "CreateNewPrediction",
		expectedOutput: {error: "prompt is empty, cannot create"},
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
			processedMessage: "!prediction",
			rawMessage: "!prediction",
			platform: "youtube",
			messageId: "asdf1234qwer5678",
			score: "0",
			state: {}	
		},
		targetMethod: "CreateNewPrediction",
		expectedOutput: {error: "prompt is empty, cannot create"},
	},	

	{
		name: "CHE TEST",
		input: {type: 'div'},
		targetMethod: "CHE",
		expectedOutput: {error: "CHE, likely no document, cannot render. returning null"},
	},


    {
        name: "Clamp test: value exceeds max",
        input: { val: 6, min: 1, max: 4 }, 
        targetMethod: "Clamp",
        expectedOutput: 4,
    },
    {
        name: "Clamp test: value below min",
        input: { val: 1, min: 2, max: 6 }, 
        targetMethod: "Clamp",
        expectedOutput: 2,
    },
    {
        name: "Clamp test: negative value within range",
        // Logic: range is -4 to -3. -1 is actually HIGHER than -3.
        input: { val: -1, min: -3, max: -4 }, 
        targetMethod: "Clamp",
        expectedOutput: -3, 
    },
    {
        name: "Clamp test: negative value below min",
        // Logic: range is -6 to -2. -8 is LOWER than -6.
        input: { val: -8, min: -2, max: -6 }, 
        targetMethod: "Clamp",
        expectedOutput: -6,
    },
	
	{
		name: "GetUsers",
		input: undefined,
		targetMethod: "GetUsers",
		expectedOutput: [],
	},

	{
		name: "LoadBannedWords",
		input: undefined,
		targetMethod: "GetUsers",
		expectedOutput: [],
	},


	{
		name: "GetUnprocessedQueue",
		input: undefined,
		targetMethod: "GetUnprocessedQueue",
		expectedOutput: [],
	},
	{
		name: "GetMessagesQueue",
		input: undefined,
		targetMethod: "GetMessagesQueue",
		expectedOutput: [],
	},
	{
		name: "GetErroredQueue",
		input: undefined,
		targetMethod: "GetErroredQueue",
		expectedOutput: [],
	},
	{
		name: "GetEvents",
		input: undefined,
		targetMethod: "GetEvents",
		expectedOutput: [],
	},
	{
		name: "GetSubWindows",
		input: undefined,
		targetMethod: "GetSubWindows",
		expectedOutput: {},
	},

	
	{
		name: "CreateUserFromFlags no channel id",
		input: undefined,
		targetMethod: "CreateUserFromFlags",
		expectedOutput: {
			error: "channelId CANNOT be null when creating a new user"
		},
	},
	{
		name: "CreateUserFromFlags with channel id",
		input: {channelId: "asdf1234qwer56789"},
		targetMethod: "CreateUserFromFlags",
		expectedOutput: {
			version : 1, 
			authorName : undefined,
			channels : ["asdf1234qwer56789"],
			uuid : "type:string",
			ttsBans : [],
			channelBans : [], 
			conduct_score: 0, 
			commendments: {
				community: [], 
				engagement: [], 
				support: [], 
			},
			misconduct: {
				discrimination: [], 
				harassment: [], 
				spam: [], 
				integrity: [], 
			},
			icon: undefined,
			isSponser: false, 			
			isChatModerator: false, 
			isChatAdmin: false,
			isVerified: false,
			firstSeen: "type:number",
			points : 0,
		},
	},	

	{
		name: "ProcessYoutubeV3Message_v1 with valid input",
		input: {
			  "version": 1,
			  "apiVersion": 3,
			  "platform": "YouTube",
			  "data": {
			    "kind": "youtube#liveChatMessage",
			    "etag": "ZH94DnsFG0i0w2nEiwn5-16VZ2w",
			    "id": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
			    "snippet": {
			      "type": "textMessageEvent",
			      "liveChatId": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
			      "authorChannelId": "UCKZigHbgpJG9ldxXMqmiZUg",
			      "publishedAt": "2026-02-19T07:17:50.330172+00:00",
			      "hasDisplayContent": true,
			      "displayMessage": "HELLO SMALLSVILLE",
			      "textMessageDetails": {
				"messageText": "HELLO SMALLSVILLE"
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
			  "receivedAt": 1771485470330
			},
		targetMethod: "ProcessYoutubeV3Message_v1",
		expectedOutput: {
			version: 1,
			authorName: "vulbyte",
			userUuid: "type:string",
			streamOrigin: "type:string", //what streamid via the platform the message came from
			receivedAt: 1771485470330,
			commands: [],
			processedMessage: "HELLO SMALLSVILLE",
			platform: "youtube",
			messageId: "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
			processedMessage: "HELLO SMALLSVILLE",
			score: "type:number",
			state: {}
		},
	},
	{
		name: "ProcessYoutubeV3Message_v1 with tts command",
		input: {
			  "version": 1,
			  "apiVersion": 3,
			  "platform": "YouTube",
			  "data": {
			    "kind": "youtube#liveChatMessage",
			    "etag": "ZH94DnsFG0i0w2nEiwn5-16VZ2w",
			    "id": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
			    "snippet": {
			      "type": "textMessageEvent",
			      "liveChatId": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
			      "authorChannelId": "UCKZigHbgpJG9ldxXMqmiZUg",
			      "publishedAt": "2026-02-19T07:17:50.330172+00:00",
			      "hasDisplayContent": true,
			      "displayMessage": "!tts -v 51 -r 1.9 -p 1.2 yo was good",
			      "textMessageDetails": {
				"messageText": "!tts -v 51 -r 1.9 -p 1.2 yo was good"
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
			  "receivedAt": 1771485470330
			},
		targetMethod: "ProcessYoutubeV3Message_v1",
		expectedOutput: {
		    "authorName": "vulbyte",
		    "commands": {
			"command": "tts",
			"errInfo": {},
			"flags": {
			    "p": "1.2",
			    "r": "1.9",
			    "v": "51"
			},
			"isValid": false,
			"message": "yo was good",
			"spend": 0,
			"version": 1
		    },
		    "messageId": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
		    "platform": "youtube",
		    "processedMessage": "yo was good",
		    "rawMessage": "!tts -v 51 -r 1.9 -p 1.2 yo was good",
		    "receivedAt": 1771485470330,
		    "score": -170,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "userUuid": "type:string",
		    "version": 1
		},
	},

	{
		name: "ScoreMessage with string",
		input: "hello how are you today?",
		targetMethod: "ScoreMessage",
		expectedOutput: "type:number",
	},
	{
		name: "ScoreMessage with garble",
		input: "laksdfveioubnejamlkbjaeunbelk javl;khenb",
		targetMethod: "ScoreMessage",
		expectedOutput: "type:number",
	},
	{
		name: "ScoreMessage no input",
		input: undefined,
		targetMethod: "ScoreMessage",
		expectedOutput: 0,
	},
	{
		name: "ScoreMessage numbers only",
		input: 123456789,
		targetMethod: "ScoreMessage",
		expectedOutput: "type:number",
	},

	
	{
		name: "ParseCommandFromMessage",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "!tts yo was good",
		    "receivedAt": 1771485470330,
		    "score": -100,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "userUuid": {
			"authorName": "@vulbyte",
			"channelBans": [],
			"channels": [
			    "UCKZigHbgpJG9ldxXMqmiZUg"
			],
			"commendments": {
			    "community": [],
			    "engagement": [],
			    "support": []
			},
			"conduct_score": 0,
			"firstSeen": "type:number",
			"icon": "",
			"isChatAdmin": false,
			"isChatModerator": false,
			"isSponser": false,
			"isVerified": false,
			"misconduct": {
			    "discrimination": [],
			    "harassment": [],
			    "integrity": [],
			    "spam": []
			},
			"points": 0,
			"ttsBans": [],
			"uuid": "type:string",
			"version": 1
		    },
		    "version": 1
		},
		targetMethod: "ParseCommandFromMessage",
		expectedOutput: {
		    "command": "tts",
		    "spent": 0,
		    "flags": {
			"p": "1.2",
			"r": "1.9",
			"v": 51
		    },
		"isChatAdmin": false,
		"isChatModerator": false,
		"isSponser": false,
		"isVerified": false,
		"version": 1
	    },
	},
	
	{
		name: "CheckMessageForBannedWords",
		input: undefined,
		targetMethod: "CheckMessageForBannedWords",
		expectedOutput: false,
	},

	{
		name: "DispatchCommand",
		input: {},
		targetMethod: "DispatchCommand",
		expectedOutput: undefined,
	},

	{
		name: "ProcessClipCommand",
		input: {},
		targetMethod: "ProcessClipCommand",
		expectedOutput: undefined,
	},

	{
		name: "ProcessTtsCommand",
		input: {},
		targetMethod: "ProcessTtsCommand",
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
];

/**
 * Loose comparison helper
 * - Handles UUIDs and 'firstSeen' loosely
 * - Handles Object Equality (Value-based rather than Reference-based)
 * - Handles Error Objects/Messages gracefully
 */
const isMatch = (actual, expected) => {
    // 1. Handle Type Tokens (Loose Checks)
    if (typeof expected === 'string' && expected.startsWith('type:')) {
        const requiredType = expected.split(':')[1];
        // Handle 'array' separately since typeof [] is 'object'
        if (requiredType === 'array') return Array.isArray(actual);
        if (requiredType === 'null') return actual === null;
        return typeof actual === requiredType;
    }

    // 2. Standard Strict Checks
    if (actual === expected) return true;
    if (typeof actual !== typeof expected) return false;
    if (actual === null || expected === null) return actual === expected;
    if (typeof expected !== 'object') return actual === expected;

    // 3. Array Handling
    if (Array.isArray(expected)) {
        if (!Array.isArray(actual) || actual.length !== expected.length) return false;
        return expected.every((val, i) => isMatch(actual[i], val));
    }

    // 4. Object Handling
    const eKeys = Object.keys(expected);
    if (Object.keys(actual).length !== eKeys.length) return false;

    for (const key of eKeys) {
        // Keep your specific timestamp logic
        if (key === 'executedAt' && typeof actual[key] === 'number' && typeof expected[key] === 'number') {
            if (Math.abs(actual[key] - expected[key]) <= 50) continue;
            return false;
        }
        if (!isMatch(actual[key], expected[key])) return false;
    }
    return true;
};

/**
 * 4. UNIVERSAL FILE HANDLER
 * Saves reports to ./test_results/ and opens them.
 */
async function saveAndOpen(filename, content) {
    const runtime = getRuntime();
    const isWin = (typeof process !== 'undefined' ? process.platform : Deno.build.os).startsWith('win');
    const startCmd = isWin ? 'start' : 'open';
    
    // Define the directory and full path
    const dir = './test_results';
    const filePath = `${dir}/${filename}`;

    console.log(`Saving report to ${filePath}...`);

    if (runtime === 'node') {
        const fs = await import('node:fs');
        const { exec } = await import('node:child_process');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(filePath, content);
        exec(`${startCmd} ${filePath}`);
    } 
    else if (runtime === 'bun') {
        const { mkdir } = await import('node:fs/promises');
        
        // Bun supports node:fs/promises for directory creation
        await mkdir(dir, { recursive: true });
        
        await Bun.write(filePath, content);
        Bun.spawn([startCmd, filePath]);
    } 
    else if (runtime === 'deno') {
        // Deno uses its own mkdir logic
        await Deno.mkdir(dir, { recursive: true }).catch(() => {});
        
        await Deno.writeTextFile(filePath, content);
        new Deno.Command(startCmd, { args: [filePath] }).spawn();
    }
}

async function runTestSuite() {
    const runtime = getRuntime();
    console.log(`🧪 Running Pure I/O Tests [${runtime}]...`);
    
    let rows = "";
    let passedCount = 0;

    const toPlain = (obj) => (obj === undefined) ? undefined : JSON.parse(JSON.stringify(obj));

    const stableStringify = (obj) => {
        if (obj === undefined) return "undefined";
        if (obj === null || typeof obj !== 'object') return JSON.stringify(obj, null, 4);
        if (Array.isArray(obj)) {
            return "[\n" + obj.map(item => stableStringify(item).split('\n').map(l => "    " + l).join('\n').trimStart()).join(",\n") + "\n]";
        }
        const sortedObj = {};
        Object.keys(obj).sort().forEach(key => {
            const val = obj[key];
            sortedObj[key] = (val !== null && typeof val === 'object') ? JSON.parse(stableStringify(val)) : val;
        });
        return JSON.stringify(sortedObj, null, 4);
    };

    let lastMismatch = ""; 
    const isMatchFuzzy = (actual, expected, path = "root") => {
        // 1. Handle Type Tokens
        if (typeof expected === 'string' && expected.startsWith('type:')) {
            const requiredType = expected.split(':')[1];
            
            // FIX: If the actual value is already the token string (from toJSON), it's a match
            if (actual === expected) return true;

            let match = false;
            switch (requiredType) {
                case 'array':  match = Array.isArray(actual); break;
                case 'null':   match = (actual === null); break;
                case 'class':  match = (actual === 'type:class'); break; // Handled by toJSON
                default:       match = (typeof actual === requiredType);
            }

            if (!match) lastMismatch = `${path} (Expected type:${requiredType}, got ${typeof actual})`;
            return match;
        }

        if (actual === expected) return true;
        if (typeof expected !== 'object' || expected === null || actual === null) {
            lastMismatch = `${path} (Value mismatch)`;
            return false;
        }

        // 2. Handle Arrays
        if (Array.isArray(expected)) {
            if (!Array.isArray(actual)) {
                lastMismatch = `${path} (Expected array, got ${typeof actual})`;
                return false;
            }
            if (expected.length === 0 && actual.length > 0) {
                lastMismatch = `${path} (Expected empty array, but found ${actual.length} items)`;
                return false;
            }
            if (actual.length !== expected.length) {
                lastMismatch = `${path} (Array length mismatch: ${expected.length} vs ${actual.length})`;
                return false;
            }
            return expected.every((val, i) => isMatchFuzzy(actual[i], val, `${path}[${i}]`));
        }

        // 3. Handle Objects
        const eKeys = Object.keys(expected);
        const aKeys = Object.keys(actual);

        if (eKeys.length === 0 && aKeys.length > 0) {
            lastMismatch = `${path} (Expected empty object, but found keys: ${aKeys.join(', ')})`;
            return false;
        }

        for (const key of eKeys) {
            if (!(key in actual)) {
                lastMismatch = `${path} (Missing key in actual: "${key}")`;
                return false;
            }
            // Fuzzer for timestamps
            if (key.toLowerCase().endsWith('at') && typeof actual[key] === 'number' && typeof expected[key] === 'number') {
                if (Math.abs(actual[key] - expected[key]) <= 1000) continue;
            }
            // Logic for "type:number" or "type:string" expected in object values
            if (!isMatchFuzzy(actual[key], expected[key], `${path}.${key}`)) return false;
        }
        return true;
    };

    const getMaskedActual = (actual, expected) => {
        if (typeof expected === 'string' && expected.startsWith('type:')) {
            return actual; 
        }

        if (actual !== null && typeof actual === 'object' && expected !== null && typeof expected === 'object') {
            const masked = Array.isArray(actual) ? [] : {};
            for (const key in actual) {
                masked[key] = (expected && key in expected) 
                    ? getMaskedActual(actual[key], expected[key]) 
                    : actual[key];
            }
            return masked;
        }
        return actual;
    };

    const localManifest = JSON.parse(JSON.stringify(testManifest));

    for (const test of localManifest) {
        let bot = new Cockatiel(); 
        let caughtError = null;
        let passed = false;
        let rawActual = null;
        let executionTrace = [];
        lastMismatch = "";

        const currentInput = test.input; 
        const currentExpected = test.expectedOutput;
	executionTrace.push("sending input to function: " + JSON.stringify(4, null, test.input));

        try {
            const fn = await bot[test.targetMethod];
            if (typeof fn !== 'function') throw new Error(`Method ${test.targetMethod} not found`);

            executionTrace.push(`[SYSTEM] Method identified: ${test.targetMethod}`);
            const inputForCall = (currentInput === undefined) ? undefined : JSON.parse(JSON.stringify(currentInput));
            
            const result = await fn.call(bot, inputForCall);

            if (result && typeof result === 'object') {
                const cName = result.constructor.name;
                executionTrace.push(`[VERIFY] Notice: Result is a ${cName === "Object" ? "plain Object" : "live instance of " + cName}`);
            }

            rawActual = toPlain(result); 

            passed = isMatchFuzzy(rawActual, currentExpected);
            if (!passed) executionTrace.push(`[LOGIC] Mismatch at: ${lastMismatch}`);

        } 
	catch (e) {
	    caughtError = e.message || String(e);
	    executionTrace.push(`[SYSTEM] Caught: ${caughtError}`);
	    
	    // Create the actual object to compare against expectedOutput
	    rawActual = { error: caughtError };

	    // Determine if it passed
	    if (test.expectedError) {
		// Case A: Test defines expectedError as a top-level property
		passed = caughtError.toLowerCase().includes(test.expectedError.toLowerCase());
	    } else if (currentExpected && typeof currentExpected === 'object' && 'error' in currentExpected) {
		// Case B: Test defines error inside expectedOutput object (your current case)
		passed = isMatchFuzzy(rawActual, currentExpected);
	    } else {
		passed = false;
		executionTrace.push(`[LOGIC] Unexpected throw encountered.`);
	    }
	}
        if (passed) passedCount++;

        const actualToShow = (passed && !caughtError) ? getMaskedActual(rawActual, currentExpected) : rawActual;
        const expectedToShow = test.expectedError ? { error: test.expectedError } : currentExpected;

        const expectedLines = stableStringify(expectedToShow).split('\n');
        const actualLines = stableStringify(actualToShow).split('\n');
        const maxLines = Math.max(expectedLines.length, actualLines.length);

        let diffedExpected = "", diffedActual = "";
        for (let i = 0; i < maxLines; i++) {
            const eLine = expectedLines[i] ?? "";
            const aLine = actualLines[i] ?? "";
            
            const isTypeToken = eLine.includes('"type:');
            const isLiteralMatch = (eLine.trim() === aLine.trim()) && (eLine !== "" || aLine !== "");
            
            // If the fuzzer passed, we treat type token lines as matches for the UI
            const isMatch = isLiteralMatch || (passed && isTypeToken);

            diffedExpected += `<span class="${isMatch ? 'line-match' : 'line-expect'}">${eLine || ' '}</span>\n`;
            diffedActual += `<span class="${isMatch ? 'line-match' : 'line-mismatch'}">${aLine || ' '}</span>\n`;
        }

        let botLogs = (typeof bot.GetLogs === 'function') ? bot.GetLogs() : [];
        const combinedLogs = [...executionTrace.map(m=>({type:'runner',message:m})), ...botLogs];

rows += `
<tr class="${passed ? 'pass' : 'fail'}">
    <td colspan="3">
        <details ${passed ? '' : 'open'}>
            <summary>
                <span class="status-icon">${passed ? '✔' : '✘'}</span>
                <span class="test-name"><b>${test.name}</b></span>
                <span class="meta">Method: ${test.targetMethod}</span>
            </summary>
            <div class="details-content">
                <div class="full-width" style="margin-bottom: 20px;">
                    <div class="label">INPUT:</div>
                    <pre class="code-block" style="border-color: #23863655; color: #8b949e;">${stableStringify(currentInput)}</pre>
                </div>

                <div class="comparison-grid">
                    <div class="column"><div class="label">EXPECTED:</div><pre class="code-block diff-block">${diffedExpected}</pre></div>
                    <div class="column"><div class="label">ACTUAL:</div><pre class="code-block diff-block">${diffedActual}</pre></div>
                </div>

                <div class="full-width" style="margin-top: 20px;">
                    <div class="label">TRACE & LOGS:</div>
                </div>
		    <pre class="code-block log-style">${combinedLogs.map(l => {
				    const type = String(l?.type || "unknown").toUpperCase();
				    const msg = String(l?.message || "");
				    
				    // NEW: Capture the 'data' (the 'val' from DebugPrint)
				    let dataStr = "";
				    if (l.val != undefined) {
					// Stringify the object so it's readable in the report
					try {
					    dataStr = " " + (typeof l.val === 'object' ? JSON.stringify(l.val, null, 4) : String(l.val));
					} catch(e) {
					    dataStr = " [Unserializable Data]";
					}
				    }

				    let prefix = type === 'RUNNER' ? '🧪' : (type === 'THROW' ? '💥' : '🦜');
				    let style = msg.includes('[LOGIC]') ? 'color: #ff7b72; font-weight: bold;' : '';
				    
				    // Combine message and data string
				    return `<span style="${style}">${prefix} [${type}] ${msg}${dataStr}</span>`;
				}).join('\n')}</pre>
            </div>
        </details>
    </td>
</tr>`;    
	}

    const passRate = localManifest.length > 0 ? ((passedCount / localManifest.length) * 100).toFixed(1) : 0;

    const reportHtml = `<html><head><style>
        body { background: #0d1117; color: #c9d1d9; font-family: -apple-system, sans-serif; padding: 2rem; }
        table { width: 100%; border-collapse: collapse; background: #161b22; border: 1px solid #30363d; border-radius: 6px; margin-top: 20px; }
        summary { padding: 12px; cursor: pointer; display: flex; align-items: center; border-bottom: 1px solid #30363d; }
        .status-icon { width: 30px; font-weight: bold; }
        .pass .status-icon { color: #3fb950; }
        .fail .status-icon { color: #f85149; }
        .test-name { flex-grow: 1; }
        .meta { color: #8b949e; font-family: monospace; font-size: 11px; }
        .details-content { padding: 20px; background: #0d1117; }
        .comparison-grid { display: flex; gap: 20px; }
        .column { flex: 1; min-width: 0; }
        .code-block { background: #010409; padding: 10px; border: 1px solid #30363d; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; }
        .diff-block { white-space: pre; }
        .line-match { color: #6e7681; }
        .line-mismatch { background: rgba(248, 81, 73, 0.15); color: #ff7b72; display: block; width: 100%; }
        .line-expect { background: rgba(63, 185, 80, 0.15); color: #7ee787; display: block; width: 100%; }
        .log-style { color: #c9d1d9; border-left: 3px solid #30363d; }
        .label { font-size: 10px; font-weight: bold; color: #8b949e; margin-bottom: 6px; text-transform: uppercase; }
        .percentage { font-size: 0.8em; color: #8b949e; margin-left: 10px; font-weight: normal; }
    </style></head><body>
        <h1>🦜 Cockatiel I/O Report</h1>
        <p>Passed: <b>${passedCount}/${localManifest.length}</b> <span class="percentage">(${passRate}%)</span></p>
        <table>${rows}</table>
    </body></html>`;

    await saveAndOpen(`${Date.now()}_io_test.html`, reportHtml);
}


runTestSuite().catch(console.error);
