function LSGI(id) {
	return localStorage.getItem(String(id));
}

function GEBI(id) {
	return document.getElementById(id);
}

let urls = {
	getBroadcast: "https://www.googleapis.com/youtube/v3/videos",
	getChannelId: "https://www.googleapis.com/youtube/v3/search",
	getMessages: "https://www.googleapis.com/youtube/v3/liveChat/messages",
};

export default class YoutubeStuff {
	constructor(args = {}) {
		this.args = {
			apiKey: args.apiKey || GEBI("youtube_apiKey")?.value || undefined,
			channelName: args.channelName || GEBI("youtube_channelName")?.value || undefined,
			channelId: args.channelId || GEBI("youtube_channelId")?.value || undefined,
			broadcastId: args.broadcastId || GEBI("youtube_broadcastId")?.value || undefined,
			liveChatId: args.liveChatId || GEBI("youtube_liveChatId")?.value || undefined,
			updateFreq: args.updateFreq || 30, // seconds
			pageCount: 0,
			debug: args.debug || false,
		};
	}

	// Fetch the channel ID using the channel name
	async GetChannelId() {
		// FIX: Check this.args.apiKey instead of this.apiKey
		if (this.args.apiKey == undefined) {
			throw new Error("cannot getChannelId, apiKey is undefined");
		}
		try {
			const channelIdUrl = new URL(urls.getChannelId);
			channelIdUrl.search = new URLSearchParams({
				key: this.args.apiKey,
				q: this.args.channelName,
				type: "channel",
				part: "id",
				maxResults: 1,
			}).toString();

			const res = await fetch(channelIdUrl);
			const data = await res.json();

			const channelId = data.items?.[0]?.id?.channelId;
			if (!channelId) throw new Error("No channelId found in response");

			this.args.channelId = channelId;
			return channelId;
		} catch (err) {
			throw new Error("Failed to get channel id: " + err.message);
		}
	}

	// Fetch the broadcastId of the current/live broadcast
	async GetBroadcastId() {
		// FIX: Check this.args.apiKey instead of this.apiKey
		if (this.args.apiKey == undefined) {
			throw new Error("cannot getBroadcastId, apiKey is undefined");
		}
		try {
			const broadcastUrl = new URL(urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "id,liveStreamingDetails",
				chart: "mostPopular",
				maxResults: 1,
				key: this.args.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);
			const data = await res.json();

			const broadcastId = data.items?.[0]?.id;
			if (!broadcastId) throw new Error("No broadcastId found");

			this.args.broadcastId = broadcastId;
			return broadcastId;
		} catch (err) {
			throw new Error("Failed to get broadcast id: " + err.message);
		}
	}

	// NEW: Get the liveChatId from a broadcast
	async GetLiveChatId() {
		if (this.args.apiKey == undefined) {
			throw new Error("cannot getLiveChatId, apiKey is undefined");
		}
		if (!this.args.broadcastId) {
			throw new Error("cannot getLiveChatId, broadcastId is undefined");
		}
		try {
			const broadcastUrl = new URL(urls.getBroadcast);
			broadcastUrl.search = new URLSearchParams({
				part: "liveStreamingDetails",
				id: this.args.broadcastId,
				key: this.args.apiKey,
			}).toString();

			const res = await fetch(broadcastUrl);
			const data = await res.json();

			const liveChatId = data.items?.[0]?.liveStreamingDetails?.activeLiveChatId;
			if (!liveChatId) throw new Error("No liveChatId found");

			this.args.liveChatId = liveChatId;
			return liveChatId;
		} catch (err) {
			try {
				GEBI("youtube_broadcastId").value
			}
			catch (err) {
				throw new Error("Failed to get liveChatId: " + err.message);
			}
		}
	}

	// Fetch messages from the live chat
	async GetMessages(pageToken = undefined) {
		// FIX: Check this.args.apiKey instead of this.apiKey
		if (this.args.apiKey == undefined) {
			throw new Error("cannot getMessages, apiKey is undefined");
		}
		try {
			// FIX: await the GetLiveChatId call
			if (!this.args.liveChatId) {
				await this.GetLiveChatId();
			}

			const messagesUrl = new URL(urls.getMessages);
			messagesUrl.search = new URLSearchParams({
				key: this.args.apiKey,
				part: "id,snippet,authorDetails",
				liveChatId: this.args.liveChatId,
				maxResults: this.args.maxResults || 200,
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
