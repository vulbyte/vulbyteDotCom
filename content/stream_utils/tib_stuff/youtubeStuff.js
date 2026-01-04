export default class YoutubeStuff {
	config = {
		apiKey,		
		channelName,		
		channelId,
		broadcastId,		
		liveChatId,		
		pageCount,
		debug: false,
	}

	async getChannelIdByHandle(apiKey, handle) {
		// Ensure the handle starts with @
		const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

		const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${formattedHandle}&key=${apiKey}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.items && data.items.length > 0) {
				const channelId = data.items[0].id;
				console.log(`Channel ID: ${channel_id}`);
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
		// We search for type 'video' with eventType 'live' or 'upcoming'
		// Note: The API requires calling these separately or using a single query.
		// To get BOTH in one go, 'live' is the standard for what's happening now.

		const statuses = ['live', 'upcoming'];
		let allBroadcasts = [];

		for (const status of statuses) {
			const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=${status}&key=${apiKey}`;

			try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.items) {
				// Add a custom property to track if it's live or upcoming
				const itemsWithStatus = data.items.map(item => ({
					...item,
					broadcastStatus: status
				}));
				allBroadcasts = allBroadcasts.concat(itemsWithStatus);
			}
			} catch (error) {
				console.error(`Error fetching ${status} broadcasts:`, error);
			}
		}

		console.log("Broadcasts found:", allBroadcasts);
		return allBroadcasts;
	}

	async getLiveChatId(apiKey, videoId) {
		// The liveChatId is stored inside 'liveStreamingDetails'
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
}
