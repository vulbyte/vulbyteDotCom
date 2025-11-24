
export default class YoutubeStuff {
	#config = {
		apiKey: this.#CheckStorageThenSearchPage("youtube-apiKey") || undefined,
		channelName: this.#CheckStorageThenSearchPage("youtube-channelName") || undefined,
		channelId: this.#CheckStorageThenSearchPage("youtube-channelId") || undefined,
		broadcastId: this.#CheckStorageThenSearchPage("youtube-broadcastId") || undefined,
		liveChatId: this.#CheckStorageThenSearchPage("youtube-liveChatId") || undefined,
		pageCount: 0,
		debug: false,
	}

	#CheckStorageThenSearchPage(str) {
		let val;
		val = this.#LSGI(str);
		if (val != undefined) {
			return val
		}
		val = this.#GEBI(str);
		if (val != undefined) {
			return val
		}
		return undefined;
	}

	#LSGI(id) {
		return localStorage.getItem(String(id));
	}

	#GEBI(id) {
		return document.getElementById(id);
	}

	#urls = {
		getBroadcast: "https://www.googleapis.com/youtube/v3/videos",
		getChannelId: "https://www.googleapis.com/youtube/v3/search",
		getMessages: "https://www.googleapis.com/youtube/v3/liveChat/messages",
	};

	constructor() { }

	/**
	 * @description takes in a dictionary of values, if the value exists within config it will update said value
	 */
	async UpdateConfig(args = {}) {
		if (args = {}) { }
		for (let i = 0; i < Object.keys(args).length; ++i) {
			if (this.#config[Object.keys(args)[i]] != undefined) {
				if (this.#config.debug == true) {
					console.log(`matching values found, updating "${Object.keys(args)[i]}" -> ${Object.values(args)[i]}`);
				}
				this.#config[Object.keys(args)[i]] = Object.values(args)[i];
			}
		}
	}

	async VerifyConfig() {
		let checkConfig = new Promise((RESOLVE, REJECT) => {
			if (this.#config.apiKey == undefined || this.#config.apiKey == '') { REJECT("VALUE '' IS NULL OR UNDEFINED, CANNOT GET YOUTUBE MESSAGES") }
			if (this.#config.liveChatId == undefined || this.#config.liveChatId == '') { REJECT("VALUE '' IS NULL OR UNDEFINED, CANNOT GET YOUTUBE MESSAGES") }

			if (this.#config.channelId == undefined || this.#config.channelId == '') { console.warn("value 'channelId' is null or undefined, may not be able to get youtube messages") }
			if (this.#config.pageCount == undefined || this.#config.pageCount == '') { console.warn("value 'pageCount' is null or undefined, may not be able to get youtube messages") }
			if (this.#config.broadcastId == undefined || this.#config.broadcastId == '') { console.warn("value 'broadcastId' is null or undefined, may not be able to get youtube messages") }
			if (this.#config.channelName == undefined || this.#config.channelName == '') { console.warn("value 'channelName' is null or undefined, may not be able to get youtube messages") }

			console.log("youtube config can get messages");
			RESOLVE("youtube should be ready");
		});
	}

	async GetChannelIdFromChannelName() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getChannelId, apiKey is undefined");
		}
		try {
			const channelIdUrl = new URL(urls.getChannelId);
			channelIdUrl.search = new URLSearchParams({
				key: this.#config.apiKey,
				q: this.#config.channelName,
				type: "channel",
				part: "id",
				maxResults: 1,
			}).toString();

			const res = await fetch(channelIdUrl);
			const data = await res.json();

			const channelId = data.items?.[0]?.id?.channelId;
			if (!channelId) throw new Error("No channelId found in response");

			this.#config.channelId = channelId;
			return channelId;
		} catch (err) {
			throw new Error("Failed to get channel id: " + err.message);
		}
	}

	// Fetch the broadcastId of the current/live broadcast
	async GetBroadcastIdFrom() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getBroadcastId, apiKey is undefined");
		}
		try {
			const broadcastUrl = new URL(urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "id,liveStreamingDetails",
				chart: "mostPopular",
				maxResults: 1,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);
			const data = await res.json();

			const broadcastId = data.items?.[0]?.id;
			if (!broadcastId) throw new Error("No broadcastId found");

			this.#config.broadcastId = broadcastId;
			return broadcastId;
		} catch (err) {
			throw new Error("Failed to get broadcast id: " + err.message);
		}
	}

	// NEW: Get the liveChatId from a broadcast
	async GetLiveChatIdFromBroadcastUrl() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getLiveChatId, apiKey is undefined");
		}
		if (!this.#config.broadcastId) {
			throw new Error("cannot getLiveChatId, broadcastId is undefined");
		}
		try {
			const broadcastUrl = new URL(urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "liveStreamingDetails",
				id: this.#config.broadcastId,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);
			const data = await res.json();

			const liveChatId = data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) throw new Error("No liveChatId found");

			this.#config.liveChatId = liveChatId;
			return liveChatId;
		} catch (err) {
			try {
				this.#GEBI("youtube_broadcastId").value
			}
			catch (err) {
				throw new Error("Failed to get liveChatId: " + err.message);
			}
		}
	}

	/**
	 * @name GetAllUpcomingBroadcastsAndReturnJson
	 * @description Fetches all currently scheduled/upcoming streams for the configured channel and returns the raw API response data.
	 * @returns {Promise<object>} A promise that resolves to the raw JSON response object from the YouTube Search API.
	 */
	async GetAllUpcomingBroadcastsAndReturnJson() {
		if (this.#config.apiKey === undefined) {
			throw new Error("Cannot get upcoming broadcast list: apiKey is undefined");
		}
		if (this.#config.channelId === undefined) {
			throw new Error("Cannot get upcoming broadcast list: channelId is undefined");
		}

		// We will use a higher maxResults to get more than just one result.
		// YouTube's API limit for maxResults in search is typically 50.
		const MAX_RESULTS = 50;

		try {
			// We now request the snippet part as well, as the caller might need titles/thumbnails
			const searchUrl = new URL(this.#urls.getChannelId); // Assuming this is the YouTube Search API endpoint
			searchUrl.search = new URLSearchParams({
				part: "id,snippet", // Requesting more data for flexibility
				type: "video",
				eventType: "upcoming", // Explicitly look for scheduled streams
				channelId: this.#config.channelId,
				maxResults: MAX_RESULTS,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(searchUrl);
			const data = await res.json();

			// Handle API error response (e.g., invalid key, quota exceeded)
			if (data.error) {
				throw new Error(`YouTube API Error: ${data.error.message}`);
			}

			console.log(`✅ Retrieved raw data for ${data.items?.length || 0} upcoming streams for channel ${this.#config.channelId}.`);

			return data;

		} catch (err) {
			console.error("🛑 Failed to retrieve the list of upcoming broadcasts:", err.message);
			throw new Error("Failed to retrieve the list of upcoming broadcasts.");
		}
	}

	// Fetch messages from the live chat
	async GetMessages(pageToken = undefined) {
		//returns json such as: './yt_v3_test.json'
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getMessages, apiKey is undefined");
		}
		try {
			if (!this.#config.liveChatId) {
				await this.GetLiveChatId();
			}

			const messagesUrl = new URL(urls.getMessages);
			messagesUrl.search = new URLSearchParams({
				key: this.#config.apiKey,
				part: "id,snippet,authorDetails",
				liveChatId: this.#config.liveChatId,
				maxResults: this.#config.maxResults || 200,
			}).toString();

			if (pageToken) {
				messagesUrl.searchParams.set("pageToken", pageToken);
			}

			const res = await fetch(messagesUrl);
			const data = await res.json();

			return data;
		} catch (err) {
			throw new Error("Failed to get messages: " + err.message);
		}
	}
}




/* add api key then paste this into the the console to get messages
async function qGetLiveChatId(videoId) {
	const videoDetailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
	videoDetailsUrl.search = new URLSearchParams({
		key: '',
		id: videoId,
		part: 'liveStreamingDetails' // Request the details that contain the chat ID
	}).toString();

	const res = await fetch(videoDetailsUrl);
	const data = await res.json();

	// Extract the long chat ID
	if (data.items && data.items.length > 0 && data.items[0].liveStreamingDetails) {
		return data.items[0].liveStreamingDetails.activeLiveChatId;
	}
	throw new Error("Could not find activeLiveChatId for this video ID.");
}
const qliveChatId = await qGetLiveChatId('uBU-OkKy7EU');
async function qGetMessages(liveChatId = qliveChatId) {
	const messagesUrl = new URL("https://www.googleapis.com/youtube/v3/liveChat/messages");
	messagesUrl.search = new URLSearchParams({
		key: '',
		liveChatId: liveChatId, // This is the long, correct ID
		maxResults: 200,
		part: 'snippet,authorDetails', // ⬅️ THIS IS CRUCIAL
	}).toString();

	const res = await fetch(messagesUrl);
	const data = await res.json();

	// Check for success or error
	if (res.ok) {
		return JSON.stringify(data, null, 2);
	} else {
		// Return the error message if the request still fails for another reason
		return JSON.stringify({ error: data }, null, 2);
	}
}


// Combine the two steps:
console.log(await qGetMessages());
*/
