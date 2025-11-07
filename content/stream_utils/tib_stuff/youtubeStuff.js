
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

	// Fetch the channel ID using the channel name
	async GetChannelId() {
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
	async GetBroadcastId() {
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
	async GetLiveChatId() {
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
