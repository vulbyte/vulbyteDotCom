// ================== youtubeStuff.js ==================
function LSGI(id) {
	return localStorage.getItem(String(id));
};
function GEBI(id) {
	return document.getElementById(id)?.value; // fetch value from input if DOM element
}
export class YoutubeStuff {
	constructor(args = {}) {
		this.args = {
			apiKey: args.apiKey || LSGI("youtube_apiKey") || GEBI("youtube_apiKey") || undefined,
			channelName: args.channelName || LSGI("youtube_channelName") || GEBI("youtube_channelName") || undefined,
			channelId: args.channelId || LSGI("youtube_channelId") || GEBI("youtube_channelId") || undefined,
			broadcastId: args.broadcastId || LSGI("youtube_broadcastId") || GEBI("youtube_broadcastId") || undefined,
			//maxResults: args.maxResults || 30,
			updateFreq: args.updateFreq || 30, // seconds
			debug: args.debug || false,
		};
	}

	log(...msg) {
		if (this.args.debug) console.log("[YoutubeStuff]", ...msg);
	}

	async GetYoutubeChannelId() {
		if (!this.args.apiKey || !this.args.channelName)
			throw new Error("API key or Channel name missing");

		const url = new URL("https://www.googleapis.com/youtube/v3/channels");
		url.search = new URLSearchParams({
			part: "id",
			forUsername: this.args.channelName,
			key: this.args.apiKey,
		}).toString();

		const res = await fetch(url);
		const data = await res.json();

		if (!data.items?.length) throw new Error("No channel found");
		this.args.channelId = data.items[0].id;

		this.log("Fetched channel ID:", this.args.channelId);
		return this.args.channelId;
	}

	async GetLiveStreams() {
		if (!this.args.apiKey || !this.args.channelId)
			throw new Error("API key or Channel ID missing");

		const url = new URL("https://www.googleapis.com/youtube/v3/search");
		url.search = new URLSearchParams({
			part: "id",
			channelId: this.args.channelId,
			eventType: "live",
			type: "video",
			key: this.args.apiKey,
			//maxResults: this.args.maxResults,
		}).toString();

		const res = await fetch(url);
		const data = await res.json();

		if (!data.items?.length) {
			this.log("No live broadcasts found");
			return null;
		}

		if (data.items.length === 1) {
			this.args.broadcastId = data.items[0].id.videoId;
		}

		this.log("Fetched live streams:", data.items);
		this.log("Current broadcast ID:", this.args.broadcastId);

		return data.items.map((item) => item.id.videoId);
	}

	async GetMessages(/*pageToken = undefined*/) {
		if (!this.args.apiKey || !this.args.broadcastId)
			throw new Error("API key or Broadcast ID missing");

		// Step 1: get liveChatId for the broadcast
		const broadcastUrl = new URL(
			"https://www.googleapis.com/youtube/v3/videos"
		);
		broadcastUrl.search = new URLSearchParams({
			part: "liveStreamingDetails",
			id: this.args.broadcastId,
			key: this.args.apiKey,
		}).toString();

		const broadcastRes = await fetch(broadcastUrl);
		const broadcastData = await broadcastRes.json();

		const liveChatId =
			broadcastData.items?.[0]?.liveStreamingDetails?.activeLiveChatId;

		if (!liveChatId) {
			this.log("No live chat available for broadcast");
			return { messages: [] };
		}

		// Step 2: fetch messages from liveChatId
		const messagesUrl = new URL(
			"https://www.googleapis.com/youtube/v3/liveChat/messages"
		);
		const params = {
			part: "id,snippet,authorDetails",
			liveChatId,
			key: this.args.apiKey,
			//maxResults: 200 || this.args.maxResults, // FIX THIS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		};
		//if (pageToken) params.pageToken = pageToken;

		messagesUrl.search = new URLSearchParams(params).toString();

		const messagesRes = await fetch(messagesUrl);
		console.log(messagesUrl);
		const messagesData = await messagesRes.json();
		console.log(messagesData);

		const messages =
			messagesData.items?.map((m) => ({
				id: m.id,
				author: m.authorDetails.displayName,
				message: m.snippet.displayMessage,
				publishedAt: m.snippet.publishedAt,
			})) || [];

		this.log("Fetched messages:", messages);

		return {
			messages,
			nextPageToken: messagesData.nextPageToken,
			pollingIntervalMillis: messagesData.pollingIntervalMillis,
		};
	}
}

