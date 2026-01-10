// Fixed YoutubeStuff class
export class YoutubeStuff {
	config = {
		apiKey: undefined,		
		channelName: undefined,		
		channelId: undefined,
		broadcastId: undefined,		
		liveChatId: undefined,		
		pageCount: undefined,
		debug: false,
	}

	async getChannelIdByHandle(apiKey = this.config.apiKey, handle = this.config.channelName) {
		const formattedHandle = (handle[0] == "@") ? handle : `@${handle}`;
		const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${formattedHandle}&key=${apiKey}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			if (data.items && data.items.length > 0) {
				const channelId = data.items[0].id;
				console.log(`Channel ID: ${channelId}`);
				return channelId;
			} else {
				console.log("No channel found for that handle.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	async getLiveAndUpcoming(apiKey, channelId) {
		const _apiKey = apiKey || this.config.apiKey;
		const _channelId = channelId || this.config.channelId;
		const statuses = ['live', 'upcoming'];
		let allBroadcasts = [];

		for (const status of statuses) {
			const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${_channelId}&type=video&eventType=${status}&maxResults=5&safeSearch=none&key=${_apiKey}`;
			try {
				const response = await fetch(url);
				const data = await response.json();
				if (data.error) {
					console.error(`YouTube API Error (${status}):`, data.error.message);
					continue; 
				}
				if (data.items && data.items.length > 0) {
					const itemsWithStatus = data.items.map(item => ({
						...item,
						broadcastStatus: status
					}));
					allBroadcasts = allBroadcasts.concat(itemsWithStatus);
				} else {
					if (this.config.debug) console.log(`No ${status} streams found.`);
				}
			} catch (error) {
				console.error(`Network Error fetching ${status} broadcasts:`, error);
			}
		}
		console.log("Broadcasts found:", allBroadcasts);
		return allBroadcasts;
	}

	async getLiveChatId(apiKey, videoId) {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			if (data.items && data.items.length > 0) {
				const streamingDetails = data.items[0].liveStreamingDetails;
				if (streamingDetails && streamingDetails.activeLiveChatId) {
					const chatId = streamingDetails.activeLiveChatId;
					console.log(`Live Chat ID found: ${chatId}`);
					return chatId;
				} else {
					console.log("This video does not have an active live chat (it might be a regular video or a finished stream).");
					return null;
				}
			}
		} catch (error) {
			console.error("Error fetching live chat ID:", error);
		}
	}

	async getChatMessages(liveChatId, pageToken = null) {
		const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&maxResults=200${pageToken ? `&pageToken=${pageToken}` : ''}&key=${this.config.apiKey}`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			if (data.error) {
				console.error("YouTube API Error (chat messages):", data.error.message);
				return null;
			}
			return data;
		} catch (error) {
			console.error("Error fetching chat messages:", error);
			return null;
		}
	}
}
