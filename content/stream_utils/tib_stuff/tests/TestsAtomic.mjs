import { exec } from 'node:child_process';
import Cockatiel from '../Cockatiel.mjs';

const ReferenceBot = new Cockatiel();

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
			commandType: "vote",
			flags: {
				a: ReferenceBot.GetState().commands.vote.flags.a.range.min, 
				"y": true, 
				"n": false, 
				"dd": false
			}, // flags will be a key value, such as: {-y: true}
			string: null,
			executedAt: null,
			pointsOffer: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
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
			commandType: "vote",
			flags: {
				a: ReferenceBot.GetState().commands.vote.flags.a.range.min, 
				"y": true, 
				"n": false, 
				"dd": true, 
			}, // flags will be a key value, such as: {-y: true}
			string: null,
			executedAt: null,
			pointsOffer: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
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
			commandType: "vote",
			flags: {
				a: ReferenceBot.GetState().commands.vote.flags.a.range.min, 
				"y": false, 
				"n": true, 
				"dd": false
			}, // flags will be a key value, such as: {-y: true}
			string: null,
			executedAt: null,
			pointsOffer: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
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
			commandType: "vote",
			flags: {
				a: ReferenceBot.GetState().commands.vote.flags.a.range.min, 
				"y": false, 
				"n": true, 
				"dd": true, 
			}, // flags will be a key value, such as: {-y: true}
			string: null,
			executedAt: null,
			pointsOffer: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
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
			commandType: "vote",
			flags: {
				"a": ReferenceBot.GetState().commands.vote.flags.a.range.min, 
				"n": false, 
				"y": false, 
				"dd": false
			}, // flags will be a key value, such as: {-y: true}
			string: null,
			executedAt: null,
			pointsOffer: 0, // amount spent on the command, if is less than cost change to value needed, after checking if the user has the nessisary amount
			version: 1, // version to check
			errInfo: {
				"err": "missing valid y/n choice",
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
		name: "GetMessages",
		input: undefined,
		targetMethod: "GetMessages",
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
		name: "ProcessTtsCommand",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "!tts -v 69 -p 1.9 -r 0.8 yo was good?",
		    "receivedAt": 1771485470330,
		    "score": -100,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "version": 1
		},
		targetMethod: "ProcessTtsCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			commandType: "tts",
			flags: {
				p: 1.9,
				r: 0.8,
				v: 69
			}, // flags will be a key value, such as: {-y: true}
			message: "yo was good?",
			executedAt: null,
			pointsOffer: 0, // amount spent on the command,
			version: 1, // version to check
			errInfo: {
				err: null,
				erroredAt: null,
			},
			state: {readAt: null,}
		},
	},

	{
		name: "ProcessTtsCommand with no flags",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "!tts yo was good?",
		    "receivedAt": 1771485470330,
		    "score": -100,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "version": 1
		},
		targetMethod: "ProcessTtsCommand",
		expectedOutput: {
			isValid: true, // if everything passes, then true, if not (ie not enough credits, not the right perms, etc, then false
			commandType: "tts",
			flags: {
				p: ReferenceBot.GetState().commands.tts.flags.p.value,
				r: ReferenceBot.GetState().commands.tts.flags.r.value,
				v: ReferenceBot.GetState().commands.tts.flags.v.value,
			}, // flags will be a key value, such as: {-y: true}
			message: "yo was good?",
			executedAt: null,
			pointsOffer: 0, // amount spent on the command,
			version: 1, // version to check
			errInfo: {
				err: null,
				erroredAt: null,
			},
		},
	},

	{
		name: "ParseCommandFromMessage - no command",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "here's message with no commands",
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
		expectedOutput: {},
	},	
	
	{
		name: "ParseCommandFromMessage - tts",
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
		    "tts": {
			"commandType": "tts",
			"errInfo": {
			    "err": null,
			    "erroredAt": null
			},
			"executedAt": null,
			"flags": {
			    "p": 1,
			    "r": 1,
			    "v": 1
			},
			"isValid": true,
			"message": "yo was good",
			"pointsOffer": 0,
			"version": 1
		    }
		},
	},	

	{
		name: "ParseCommandFromMessage - clip",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "!clip  lmao this was so fuggin funny",
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
		    "clip": {
			"commandType": "clip",
			"errInfo": {
			    "err": null,
			    "erroredAt": null
			},
			"executedAt": null,
			"flags": {},
			"isValid": true,
			"message": "lmao this was so fuggin funny",
			"pointsOffer": 0,
			"version": 1,
			"state": {}
		    }
		},
	},	

	{
		name: "ParseCommandFromMessage - vote",
		input: {
		    "authorName": "@vulbyte",
		    "commands": [],
		    "messageId": "",
		    "platform": "youtube",
		    "rawMessage": "!vote -y -dd common vulb!",
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
		    "vote": {
			"commandType": "vote",
			"errInfo": {
			    "err": null,
			    "erroredAt": null
			},
			"executedAt": null,
			"flags": {
			    "y": true,
			    "n": false,
			    "dd": true,
			    "a": 100,
			},
			"isValid": true,
			"message": "common vulb!",
			"pointsOffer": 0,
			"version": 1
		    }
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
			commands: {},
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
			"tts": {
				commandType: "tts",
				"errInfo": {
					"err": null,
					"erroredAt": null
				},
				"executedAt": null,
				"flags": {
					"p": 1.2,
					"r": 1.9,
					"v": 51
				},
				"isValid": true,
				"message": "yo was good",
				"pointsOffer": 0,
				"version": 1,
				state: {readAt: null,}
			},
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
		name: "ProcessYoutubeV3Message_v1 with clip command",
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
			      "displayMessage": "!clip that was sick!",
			      "textMessageDetails": {
				"messageText": "!clip that was sick!"
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
			"clip": {
			    "commandType": "clip",
			    "errInfo": {
				"err": null,
				"erroredAt": null
			    },
			    "executedAt": null,
			    "flags": {},
			    "isValid": true,
			    "message": "that was sick!",
			    "pointsOffer": 0,
			    "state": {},
			    "version": 1
			}
		    },
		    "messageId": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
		    "platform": "youtube",
		    "processedMessage": "that was sick!",
		    "rawMessage": "!clip that was sick!",
		    "receivedAt": 1771485470330,
		    "score": -200,
		    "state": {},
		    "streamOrigin": "Cg0KC3JHN3ZGN3BjVlBZKicKGFVDS1ppZ0hiZ3BKRzlsZHhYTXFtaVpVZxILckc3dkY3cGNWUFk",
		    "userUuid": "type:string",
		    "version": 1
		},
	},
	{
		name: "ProcessYoutubeV3Message_v1 with vote command",
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
			      "displayMessage": "!vote -y -dd you got this dumbass!",
			      "textMessageDetails": {
				"messageText": "!vote -y -dd you got this dumbass!"
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
			"vote": {
			    "commandType": "vote",
			    "errInfo": {
				"err": null,
				"erroredAt": null
			    },
			    "executedAt": null,
			    "flags": {
				"a": 100,
				"dd": true,
				"n": false,
				"y": true
			    },
			    "isValid": true,
			    "message": "you got this dumbass!",
			    "pointsOffer": 0,
			    "state": {},
			    "string": null,
			    "version": 1
			}
		    },
		    "messageId": "LCC.EhwKGkNNLVB2TkdCNVpJREZlZkJ3Z1FkNExJQzZR",
		    "platform": "youtube",
		    "processedMessage": "you got this dumbass!",
		    "rawMessage": "!vote -y -dd you got this dumbass!",
		    "receivedAt": 1771485470330,
		    "score": -280,
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
];

const getRuntime = () => {
    if (typeof Deno !== 'undefined') return 'deno';
    if (typeof Bun !== 'undefined') return 'bun';
    if (typeof process !== 'undefined' && process.versions?.node) return 'node';
    return 'browser';
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
    // 1. SETUP
    const runtime = getRuntime();
    console.log(`🧪 Running Pure I/O Tests [${runtime}]...`);
    
    let rows = ""; 
    let passedCount = 0;
    let lastMismatch = "";

    const toPlain = (obj) => (obj === undefined) ? undefined : JSON.parse(JSON.stringify(obj));

    /**
     * UTILITY: A custom stringifier that sorts object keys alphabetically.
     */
    const stableStringify = (obj) => {
        if (obj === undefined) return "undefined";
        if (obj === null || typeof obj !== 'object') return JSON.stringify(obj, null, 4);
        if (Array.isArray(obj)) {
            return "[\n" + obj.map(item => stableStringify(item).split('\n').map(l => "    " + l).join('\n').trimStart()).join(",\n") + "\n]";
        }
        const sortedObj = {};
        Object.keys(obj).sort().forEach(key => {
            const val = obj[key];
            // Recursively ensure nested objects are also stable
            sortedObj[key] = (val !== null && typeof val === 'object') ? JSON.parse(stableStringify(val)) : val;
        });
        return JSON.stringify(sortedObj, null, 4);
    };

    /**
     * CORE LOGIC: Deep comparison.
     * Checks "type:" directives BEFORE strict equality.
     */
    const isMatchFuzzy = (actual, expected, path = "root") => {
        if (typeof expected === 'string' && expected.startsWith('type:')) {
            const requiredType = expected.split(':')[1];
            let match = false;
            switch (requiredType) {
                case 'number': match = (typeof actual === 'number'); break;
                case 'string': match = (typeof actual === 'string'); break;
                case 'array':  match = Array.isArray(actual); break;
                case 'null':   match = (actual === null); break;
                case 'class':  
                    match = (actual !== null && typeof actual === 'object' && actual.constructor !== Object); 
                    break;
                default: match = (typeof actual === requiredType);
            }
            if (!match) {
                const got = (actual !== null && typeof actual === 'object') ? actual.constructor.name : typeof actual;
                lastMismatch = `${path} (Expected type:${requiredType}, got ${got})`;
            }
            return match;
        }

        if (actual === expected) return true;

        if (expected === null || actual === null || typeof expected !== 'object') {
            lastMismatch = `${path} (Value mismatch)`;
            return false;
        }

        if (Array.isArray(expected)) {
            if (!Array.isArray(actual) || actual.length !== expected.length) {
                lastMismatch = `${path} (Array length mismatch)`;
                return false;
            }
            return expected.every((val, i) => isMatchFuzzy(actual[i], val, `${path}[${i}]`));
        }

        const eKeys = Object.keys(expected);
        for (const key of eKeys) {
            if (!(key in actual)) {
                lastMismatch = `${path} (Missing key: "${key}")`;
                return false;
            }
            if (!isMatchFuzzy(actual[key], expected[key], `${path}.${key}`)) return false;
        }
        return true;
    };

    /**
     * UI HELPER: Masks actual data to match expected keys for the report.
     */
    const getMaskedActual = (actual, expected) => {
        if (typeof expected === 'string' && expected.startsWith('type:')) return actual; 
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

    // 2. EXECUTION LOOP
    const localManifest = JSON.parse(JSON.stringify(testManifest));

    for (const test of localManifest) {
        let bot = new Cockatiel(); 
        let caughtError = null;
        let passed = false;
        let rawActual = null; 
        let executionTrace = [];
        lastMismatch = "";

        const trace = (msg) => {
            const stackLine = new Error().stack.split('\n')[2] || "";
            let location = "";
            const match = stackLine.match(/([^\\\/]+):(\d+):(\d+)\)?$/);
            if (match) location = `${match[1]}:${match[2]}`;
            executionTrace.push({ message: msg, stack: location });
        };

        const currentInput = test.input; 
        const currentExpected = test.expectedOutput;

        try {
            const fn = await bot[test.targetMethod];
            if (typeof fn !== 'function') throw new Error(`Method ${test.targetMethod} not found`);

            const inputForCall = (currentInput === undefined) ? undefined : JSON.parse(JSON.stringify(currentInput));
            
            // EXECUTE: Get raw result (preserved classes)
            const result = await fn.call(bot, inputForCall);
            rawActual = result; 

            // COMPARE: Check rawActual vs currentExpected
            passed = isMatchFuzzy(rawActual, currentExpected);
            if (!passed) trace(`[LOGIC] Mismatch at: ${lastMismatch}`);

	} catch (e) {
	    caughtError = e.message || String(e);
	    rawActual = { error: caughtError };
	    
	    // 1. Check if we expected a specific error string (shorthand)
	    if (test.expectedError) {
		passed = caughtError.toLowerCase().includes(test.expectedError.toLowerCase());
	    } 
	    // 2. If expectedOutput is an object containing "error", compare it fuzzily
	    else if (currentExpected && typeof currentExpected === 'object' && 'error' in currentExpected) {
		passed = isMatchFuzzy(rawActual, currentExpected);
	    } 
	    else {
		passed = false;
		trace(`[LOGIC] Unexpected throw encountered: ${caughtError}`);
	    }
	    
	    trace(`[SYSTEM] Caught: ${caughtError}`);
	}
        if (passed) passedCount++;

        // 3. DIFF GENERATION
        const plainActual = toPlain(rawActual);
        const actualToShow = (passed && !caughtError) ? getMaskedActual(plainActual, currentExpected) : plainActual;
        const expectedToShow = test.expectedError ? { error: test.expectedError } : currentExpected;

        const expectedLines = stableStringify(expectedToShow).split('\n');
        const actualLines = stableStringify(actualToShow).split('\n');
        const maxLines = Math.max(expectedLines.length, actualLines.length);

        let diffedExpected = "", diffedActual = "";
        for (let i = 0; i < maxLines; i++) {
            const eLine = expectedLines[i] ?? "";
            const aLine = actualLines[i] ?? "";
            const isLineMatch = (eLine.trim() === aLine.trim()) && (eLine !== "" || aLine !== "");
            const isFuzzyPass = (passed && eLine.includes('"type:'));

            diffedExpected += `<span class="${(isLineMatch || isFuzzyPass) ? 'line-match' : 'line-expect'}">${eLine || ' '}</span>\n`;
            diffedActual += `<span class="${(isLineMatch || isFuzzyPass) ? 'line-match' : 'line-mismatch'}">${aLine || ' '}</span>\n`;
        }

        let botLogs = (typeof bot.GetLogs === 'function') ? bot.GetLogs() : [];
        const combinedLogs = [...executionTrace.map(m => ({ type: 'runner', ...m })), ...botLogs];

        // Append the HTML for this specific test row
        rows += `
        <tr class="${passed ? 'pass' : 'fail'}">
            <td colspan="3">
                <details>
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

                    const stack = l.stack || "";

                    let dataStr = "";

                    if (l.val != undefined) {

                        try { 
				dataStr = " " 
				+ (typeof l.val === 'object' 
					? JSON.stringify(l.val, null, 4) 
					: String(l.val)
				); 
			} 
			catch(e) { 
				dataStr = " [Unserializable]"; 
			}
                    }

                    let prefix = type === 'RUNNER' ? '🧪' : (type === 'THROW' ? '💥' : '🦜');

                    let style = msg.includes('[LOGIC]') ? 'color: #ff7b72; font-weight: bold;' : '';

                    return `<div style="${style} border-bottom: 1px solid #ffffff05; padding: 2px 0;">${prefix} [${type}] ${msg}${dataStr} <span style="opacity:0.4; font-size: 10px; margin-left: 10px;">at ${stack}</span></div>`;

                }).join('')}</pre>

            </div>
                </details>
            </td>
        </tr>`;    

	if(passed == false){
		console.log("[EXIT] ERROR, FAILURE FOUND");
		//break;
	}
    }

    // 4. FINAL REPORT: Calculate stats and build the full HTML file
    const passRate = localManifest.length > 0 ? ((passedCount / localManifest.length) * 100).toFixed(1) : 0;
    const reportHtml = `
    <html>
        <head><style>body { 

            background: #0d1117; color: #c9d1d9; font-family: -apple-system, sans-serif; padding: 2rem; 

            max-width: 1200px; margin: 0 auto; line-height: 1.5;

        }

        table { width: 100%; border-collapse: collapse; background: #161b22; border: 1px solid #30363d; border-radius: 6px; margin-top: 20px; table-layout: fixed; }

        summary { padding: 12px; cursor: pointer; display: flex; align-items: center; border-bottom: 1px solid #30363d; }

        .status-icon { width: 30px; font-weight: bold; flex-shrink: 0; }

        .test-name { flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .meta { color: #8b949e; font-family: monospace; font-size: 11px; }

        .details-content { padding: 20px; background: #0d1117; }

        .comparison-grid { display: flex; gap: 20px; flex-wrap: wrap; }

        .column { flex: 1; min-width: 300px; }

        .code-block { background: #010409; padding: 10px; border: 1px solid #30363d; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; }

        .diff-block { white-space: pre; }

        .line-match { color: #6e7681; }

        .line-mismatch { background: rgba(248, 81, 73, 0.15); color: #ff7b72; display: block; width: 100%; }

        .line-expect { background: rgba(63, 185, 80, 0.15); color: #7ee787; display: block; width: 100%; }

        .log-style { color: #c9d1d9; border-left: 3px solid #30363d; }

        .label { font-size: 10px; font-weight: bold; color: #8b949e; margin-bottom: 6px; text-transform: uppercase; }

        .percentage { font-size: 0.8em; color: #8b949e; margin-left: 10px; font-weight: normal; }

        .pass .status-icon { color: #3fb950; } .fail .status-icon { color: #f85149; }

    </style></head>
        <body>
            <h1>🦜 Cockatiel I/O Report</h1>
            <p>Passed: <b>${passedCount}/${localManifest.length}</b> (${passRate}%)</p>
            <table>${rows}</table>
        </body>
    </html>`;

    // Save the file and open it in the browser automatically
    await saveAndOpen(`${Date.now()}_io_test.html`, reportHtml);
}


runTestSuite().catch(console.error);
