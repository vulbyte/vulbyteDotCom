
export default class YoutubeStuff {
	#config = {
		apiKey: this.#CheckStorageThenSearchPage("youtube-apiKey") || undefined,
		channelName: this.#CheckStorageThenSearchPage("youtube-channelName") || undefined,
		channelId: this.#CheckStorageThenSearchPage("youtube-channelId") || undefined,
		broadcastId: this.#CheckStorageThenSearchPage("youtube-broadcastId") || undefined,
		liveChatId: this.#CheckStorageThenSearchPage("youtube-liveChatId") || undefined,
		pageCount: undefined,
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

	/*
	async TestYoutubeStuffAndDisplay(){
		function CE(args = {elem: 'div', id: undefined, class: undefined, innerText: undefined, innerHTML: undefined, onclick: undefined, src: undefined, value: undefined}) {
			let elem = document.createElement(args.elem || 'div'); // Use 'div' as default
			if (args.id) elem.id = args.id;
			if (args.class) elem.className = args.class;
			if (args.innerText) elem.innerText = args.innerText;
			if (args.innerHTML) elem.innerHTML = args.innerHTML;
			if (args.onclick) elem.onclick = args.onclick;
			if (args.onkeyup) elem.onkeyup = args.onkeyup;
			if (args.src) elem.src = args.src;
			if (args.value) elem.value = args.value;
			return elem;
		};

		//init 
		let parent = CE();
		let helperId = "helper" + String(Math.random());
		let helperVal = String(Math.random());
		let Result = {
			name: "",
			msg: "",
			ok: "",
		};
		function UpdateResult(){
			Result.name = nme;
			Result.msg = msg;
			Result.ok = ok;
		}

		//helpers	
		try{
			UpdateResult("#GEBI", "testing #GEBI", false);
			document.appendChild(CE({id:helperId, innerText:helperVal}));
			this.#GEBI(helperId);
		}
		catch(err){

		}
		CE()
		this.#LSGI();	

		this.#CheckStorageThenSearchPage(helperId);
		//functions
	}
	*/

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

	/*
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
	*/

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

			console.log()(`got channelId as: ${channelId}`);

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
			const broadcastUrl = new URL(this.#urls.getBroadcast);
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

			console.log(`got broadcastId: ${broadcastId}`);

			this.#config.broadcastId = broadcastId;
			return broadcastId;
		} catch (err) {
			throw new Error("Failed to get broadcast id: " + err.message);
		}
	}

	async GetLiveChatIdFromBroadcastUrl() {
		if (this.#config.apiKey == undefined) {
			throw new Error("cannot getLiveChatId, apiKey is undefined");
		}
		if (!this.#config.broadcastId) {
			throw new Error("cannot getLiveChatId, broadcastId is undefined");
		}
		try {
			const broadcastUrl = new URL(this.#urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "liveStreamingDetails",
				id: this.#config.broadcastId,
				key: this.#config.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);
			const data = await res.json();

			const liveChatId = data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) throw new Error("No liveChatId found");

			console.log(`got liveChatId: ${liveChatId}`);

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

			console.log(`✅ Retrieved raw data for ${data.items?.length} upcoming streams for channel ${this.#config.channelId}.`);

			return data;

		} catch (err) {
			console.error("🛑 Failed to retrieve the list of upcoming broadcasts:", err.message);
			throw new Error("Failed to retrieve the list of upcoming broadcasts.");
		}
	}

	async GetMessagesAtPage(pageToken = this.#config.pageCount) {
	    if (this.#config.apiKey == undefined) {
		throw new Error("cannot getMessages, apiKey is undefined");
	    }
	    
	    if (!this.#config.liveChatId) {
		throw new Error("cannot getMessages, liveChatId is undefined. Please set it via config.");
	    }

	    try {
		const messagesUrl = new URL(this.#urls.getMessages);
		messagesUrl.search = new URLSearchParams({
		    key: this.#config.apiKey,
		    part: "id,snippet,authorDetails",
		    liveChatId: this.#config.liveChatId,
		    maxResults: this.#config.maxResults || 200, 
		}).toString();

		const tokenToUse = pageToken;

		if (this.#config.debug) {
		    console.log(`[GetMessages] Current token in config: ${this.#config.pageCount}`);
		    console.log(`[GetMessages] Token being sent: ${tokenToUse}`);
		}
		
		if (tokenToUse) {
		    messagesUrl.searchParams.set("pageToken", tokenToUse);
		}

		const res = await fetch(messagesUrl);
		const data = await res.json();
		
		if (data.error) {
		    console.error("YouTube API Error Details:", data.error); 
		    throw new Error(`YouTube API Error: ${data.error.message}`);
		}

		// Store the next page token
		if (data.nextPageToken) {
		    this.#config.pageCount = data.nextPageToken;
		    if (this.#config.debug) {
			console.log(`[GetMessages] Updated next page token: ${this.#config.pageCount}`);
		    }
		}
		
		// IMPORTANT: Store YouTube's recommended polling interval
		if (data.pollingIntervalMillis) {
		    this.#config.pollingInterval = data.pollingIntervalMillis;
		    if (this.#config.debug) {
			console.log(`[GetMessages] YouTube recommends polling every ${data.pollingIntervalMillis}ms`);
		    }
		}

		    console.log(`got messages at page:\n ${data.stringify(data)}`);
		
		return data;
	    } catch (err) {
		console.error('Error fetching live chat messages:', err.message);
		throw new Error("Failed to get messages: " + err.message);
	    }
	}

	GetPollingInterval() {
	    return this.#config.pollingInterval || 5000; // Default to 5 seconds
	}

// NEW: Method for continuous polling (after initial catch-up)
	async StartPolling(onNewMessages, intervalMs = 5000) {
	    if (this.#config.debug) {
		console.log(`[StartPolling] Starting real-time polling every ${intervalMs}ms...`);
	    }

	    // Now poll for new messages using the stored pageToken
	    const pollInterval = setInterval(async () => {
		try {
		    const data = await this.GetMessages(); // Uses stored token
		    
		    if (data.items && data.items.length > 0) {
			if (this.#config.debug) {
			    console.log(`[StartPolling] Got ${data.items.length} new messages`);
			}
			
			if (typeof onNewMessages === 'function') {
			    onNewMessages(data.items, false); // false = new messages
			}
		    }
		} catch (err) {
		    console.error('[StartPolling] Error during polling:', err);
		}
	    }, intervalMs);

	    // Return function to stop polling
	    return () => {
		clearInterval(pollInterval);
		if (this.#config.debug) {
		    console.log('[StartPolling] Stopped polling');
		}
	    };
	}

}
