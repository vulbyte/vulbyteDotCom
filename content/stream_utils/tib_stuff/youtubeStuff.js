
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

	GetConfig() {
		let newConfig = this.#config;
		newConfig.delete("apiKey");
		return
	}

	#CheckStorageThenSearchPage(str) {
		let val;
		val = this.#LSGI(str);
		if (val != undefined) {
			return val
		}
		console.log(`unable to find value ${val} in localStorage`);
		val = this.#GEBI(str);
		if (val != undefined) {
			return val
		}
		console.log(`unable to find value ${val} within HTML`);
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

	async GetChannelIdFromChannelName() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getChannelId, apiKey is undefined");
		}
		try {
			const channelIdUrl = new URL(this.#urls.getChannelId);
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
	async GetBroadcastIdFromChannelId() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getBroadcastId, apiKey is undefined");
		}
		try {
			// ✅ Use the SEARCH endpoint, not getBroadcast
			const searchUrl = new URL(this.#urls.getChannelId); // This is the search endpoint
			searchUrl.search = new URLSearchParams({
				part: "snippet",
				type: "video",
				eventType: "live",
				channelId: this.#config.channelId,
				maxResults: 1,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(searchUrl);
			const data = await res.json();

			const broadcastId = data.items?.[0]?.id?.videoId;
			if (!broadcastId) throw new Error("No broadcastId found");

			this.#config.broadcastId = broadcastId;
			return broadcastId;
		} catch (err) {
			console.warn("Failed to get live broadcast, trying upcoming: " + err.message);

			// Try upcoming streams
			try {
				const searchUrl = new URL(this.#urls.getChannelId); // Search endpoint
				searchUrl.search = new URLSearchParams({
					part: "snippet",
					type: "video",
					eventType: "upcoming",
					channelId: this.#config.channelId,
					maxResults: 1,
					key: this.#config.apiKey,
				}).toString();

				const res = await fetch(searchUrl);
				const data = await res.json();

				const broadcastId = data.items?.[0]?.id?.videoId;
				if (!broadcastId) throw new Error("No upcoming broadcastId found");

				this.#config.broadcastId = broadcastId;
				return broadcastId;
			} catch (err) {
				throw new Error("Failed to get broadcast id: " + err.message);
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

			// ⭐️ Change: Return the raw data object
			return data;

		} catch (err) {
			console.error("🛑 Failed to retrieve the list of upcoming broadcasts:", err.message);
			throw new Error("Failed to retrieve the list of upcoming broadcasts.");
		}
	}

	// Helper to pause execution
	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async PollForLiveChatId(maxAttempts = 30, delaySeconds = 15) {
		const delayMs = delaySeconds * 1000;

		for (let i = 1; i <= maxAttempts; i++) {
			try {
				// Attempt to get the ID
				const liveChatId = await this.GetLiveChatIdFromBroadcastId();
				console.log(`✅ Success! Live Chat ID retrieved on attempt ${i}.`);
				return liveChatId;

			} catch (error) {
				const isNotActiveError = error.message.includes("Live chat is not active yet");

				if (isNotActiveError) {
					// If it's the "not ready yet" error, wait and try again
					if (i === maxAttempts) {
						console.error("🔴 Fatal: Maximum polling attempts reached. Live Chat ID not found.");
						throw new Error("Failed to get liveChatId: Max attempts reached.");
					}

					console.warn(`⏳ Attempt ${i}/${maxAttempts}: Retrying in ${delaySeconds}s...`);
					await delay(delayMs);
					continue;
				}

				// If it's any other error (API key, URL, etc.), stop immediately
				console.error("❌ Fatal API or configuration error during polling:", error.message);
				throw error;
			}
		}
	}

	// NEW: Get the liveChatId from a broadcast
	async GetLiveChatIdFromBroadcastId() {
		if (this.#config.apiKey == undefined) {
			throw new Error("Cannot getLiveChatId, apiKey is undefined");
		}
		if (!this.#config.broadcastId) {
			throw new Error("Cannot getLiveChatId, broadcastId is undefined");
		}

		// CRITICAL: Ensure this is the Videos API endpoint:
		// this.#urls.getBroadcast should be "https://www.googleapis.com/youtube/v3/videos"

		try {
			const broadcastUrl = new URL(this.#urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "liveStreamingDetails",
				id: this.#config.broadcastId,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);

			if (!res.ok) {
				const errorBody = await res.json().catch(() => ({}));
				throw new Error(`API Request failed with status ${res.status}: ${errorBody.error?.message || 'Unknown API Error'}`);
			}

			const data = await res.json();

			// Inside GetLiveChatIdFromBroadcastId's try block, replace the old error line:
			// ...
			const liveChatId = data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) {
				// ⭐️ This specific error message is what the poller will look for
				const streamStatus = data.items?.[0]?.liveStreamingDetails?.lifeCycleStatus;
				if (streamStatus === 'upcoming' || streamStatus === 'created') {
					throw new Error("Live chat is not active yet for this upcoming stream. Polling required.");
				}
				throw new Error("No activeLiveChatId found for the broadcast.");
			}
			// ...}

			this.#config.liveChatId = liveChatId;
			return liveChatId;
		} catch (err) {
			// ⭐️ SIMPLIFIED CATCH BLOCK
			throw new Error("Failed to get liveChatId: " + err.message);
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
