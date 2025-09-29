function LSGI(id) {
	return localStorage.getItem(String(id));
}
function GEBI(id) {
	return document.getElementById(id);
}

// Enhanced YoutubeStuff class with structured message monitoring
export default class YoutubeStuff {
	constructor(args = {}) {
		this.args = {
			apiKey: args.apiKey || GEBI("youtube_apiKey").value || undefined,
			channelName: args.channelName || GEBI("youtube_channelName").value || undefined,
			channelId: args.channelId || GEBI("youtube_channelId").value || undefined,
			broadcastId: args.broadcastId || GEBI("youtube_broadcastId").value || undefined,
			updateFreq: args.updateFreq || 30, // seconds
			debug: args.debug || false,
		};

		// Debug constructor values
		this.log("YoutubeStuff constructor initialized with:");
		this.log("- apiKey:", this.args.apiKey ? "SET" : "MISSING");
		this.log("- channelName:", this.args.channelName || "MISSING");
		this.log("- channelId:", this.args.channelId || "MISSING");
		this.log("- broadcastId:", this.args.broadcastId || "MISSING");
		this.log("- debug:", this.args.debug);

		// Pagination state
		this.paginationCache = null;
		this.liveChatId = null;
		this.currentHighestPage = null;
		this.maxResultsPerPage = 2000; // YouTube API maximum
	}

	log(...msg) {
		if (this.args.debug) console.log("[YoutubeStuff]", ...msg);
	}

	// Helper method to add delays between API requests
	async DelayRequest(milliseconds = 2000) {
		return new Promise(resolve => setTimeout(resolve, milliseconds));
	}

	// Helper method to get and cache liveChatId
	async GetLiveChatId() {
		if (this.liveChatId) return this.liveChatId;

		// Debug current state
		this.log("GetLiveChatId called with:");
		this.log("- apiKey:", this.args.apiKey ? "SET" : "MISSING");
		this.log("- broadcastId:", this.args.broadcastId || "MISSING");
		this.log("- channelName:", this.args.channelName || "MISSING");
		this.log("- channelId:", this.args.channelId || "MISSING");

		if (!this.args.apiKey) {
			throw new Error("API key is missing. Please set the YouTube API key.");
		}

		if (!this.args.broadcastId) {
			throw new Error(`Broadcast ID is missing. Current value: ${this.args.broadcastId}. Please run the stream wizard or set the broadcast ID manually.`);
		}

		const broadcastUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
		broadcastUrl.search = new URLSearchParams({
			part: "liveStreamingDetails",
			id: this.args.broadcastId,
			key: this.args.apiKey,
		}).toString();

		this.log("Making request to:", broadcastUrl.toString());

		const broadcastRes = await fetch(broadcastUrl);
		const broadcastData = await broadcastRes.json();

		this.log("Broadcast API response:", broadcastData);

		if (broadcastData.error) {
			throw new Error(`API Error: ${broadcastData.error.message}`);
		}

		if (!broadcastData.items || broadcastData.items.length === 0) {
			throw new Error(`No broadcast found with ID: ${this.args.broadcastId}. The broadcast may have ended or the ID may be incorrect.`);
		}

		this.liveChatId = broadcastData.items?.[0]?.liveStreamingDetails?.activeLiveChatId;

		if (!this.liveChatId) {
			const streamDetails = broadcastData.items[0]?.liveStreamingDetails;
			this.log("Live streaming details:", streamDetails);
			throw new Error(`No active live chat found for broadcast ${this.args.broadcastId}. The stream may not be live yet, may have ended, or chat may be disabled.`);
		}

		this.log("Retrieved and cached liveChatId:", this.liveChatId);
		return this.liveChatId;
	}

	// Discover pagination info and cache it
	async DiscoverPagination(liveChatId) {
		let pageToken = null;
		let messages = [];

		do {
			const data = await this.FetchSinglePage(liveChatId, pageToken);
			messages = messages.concat(data.items);
			pageToken = data.nextPageToken ?? null;  // ✅ only update if it exists
		} while (pageToken);

		return messages;
	}

	// Helper to fetch a single page
	async FetchSinglePage(liveChatId, pageToken) {
		const messagesUrl = new URL("https://www.googleapis.com/youtube/v3/liveChat/messages");
		messagesUrl.searchParams.set("part", "id,snippet,authorDetails");
		messagesUrl.searchParams.set("liveChatId", liveChatId);
		messagesUrl.searchParams.set("key", this.apiKey || GEBI("youtube_apiKey").value);
		messagesUrl.searchParams.set("maxResults", this.maxResults || 999);

		if (pageToken) {
			messagesUrl.searchParams.set("pageToken", pageToken);
		}

		const resp = await fetch(messagesUrl);
		const data = await resp.json();

		if (data.error) {
			throw new Error("API Error: " + data.error.message);
		}

		return data;
	}

	// Main GetMessages method - gets specific page or newest page
	async GetMessages(pageNum = null) {
		this.log(`GetMessages called with pageNum: ${pageNum}`);

		const liveChatId = await this.GetLiveChatId();

		// If no page number specified, get the newest page
		if (pageNum === null) {
			pageNum = await this.GetNewestPageNumber();
		}

		// Get pagination info to map page number to token
		const paginationInfo = await this.DiscoverPagination();

		if (pageNum >= paginationInfo.totalPages || pageNum < 0) {
			throw new Error(`Page ${pageNum} out of range. Total pages: ${paginationInfo.totalPages}`);
		}

		const targetPage = paginationInfo.pages[pageNum];
		const pageResult = await this.FetchSinglePage(liveChatId, targetPage.pageToken);

		this.log(`Retrieved ${pageResult.messages.length} messages from page ${pageNum}`);

		// Add messages to table
		this.AddMessagesToTable(pageResult.messages);

		// Check if we got maximum results and there are more pages
		if (pageResult.messages.length === this.maxResultsPerPage && targetPage.hasMorePages) {
			this.log(`Page ${pageNum} returned maximum results, there may be newer messages on page ${pageNum + 1}`);

			// Update our highest known page
			if (pageNum >= this.currentHighestPage) {
				this.currentHighestPage = pageNum + 1;
				// Refresh pagination cache to discover new pages
				await this.DiscoverPagination(true);
			}
		}

		return pageResult.messages;
	}

	// Get the newest (highest) page number
	async GetNewestPageNumber() {
		if (this.currentHighestPage !== null) {
			return this.currentHighestPage;
		}

		const paginationInfo = await this.DiscoverPagination();
		this.currentHighestPage = paginationInfo.totalPages - 1;

		this.log(`Determined newest page number: ${this.currentHighestPage}`);
		return this.currentHighestPage;
	}

	// Get ALL messages from all pages
	async GetAllMessages() {
		this.log("Starting GetAllMessages - fetching complete chat history...");

		const startTime = Date.now();
		let totalMessagesRetrieved = 0;
		let currentPage = 0;
		let allMessages = [];

		// Discover total pages available
		const paginationInfo = await this.DiscoverPagination();
		this.log(`GetAllMessages: Will fetch ${paginationInfo.totalPages} pages`);

		// Loop through all pages from 0 to the last page
		while (currentPage < paginationInfo.totalPages) {
			try {
				// Add delay before each GetMessages call (except the first one)
				if (currentPage > 0) {
					this.log(`GetAllMessages: Waiting 2 seconds before fetching page ${currentPage}...`);
					await this.DelayRequest(2000);
				}

				this.log(`GetAllMessages: Fetching page ${currentPage} of ${paginationInfo.totalPages - 1}`);

				const pageResult = await this.GetMessages(currentPage);

				allMessages.push(...pageResult.messages);
				totalMessagesRetrieved += pageResult.messageCount;

				this.log(`GetAllMessages: Page ${currentPage} completed - ${pageResult.messageCount} messages`);

				currentPage++;

			} catch (error) {
				this.log(`GetAllMessages: Error on page ${currentPage}:`, error.message);

				// If it's a rate limit error, wait longer before continuing
				if (error.message.includes("sent too soon") || error.message.includes("rate")) {
					this.log("GetAllMessages: Rate limit detected, waiting 5 seconds before continuing...");
					await this.DelayRequest(5000);
				}

				// Continue to next page instead of failing completely
				currentPage++;
			}
		}

		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;

		this.log(`GetAllMessages completed: ${totalMessagesRetrieved} messages from ${currentPage} pages in ${duration.toFixed(2)} seconds`);

		return {
			messages: allMessages,
			totalMessages: totalMessagesRetrieved,
			totalPages: currentPage,
			duration: duration,
			pagesProcessed: currentPage
		};
	}

	// Add messages to the HTML table
	AddMessagesToTable(messages = []) {
		if (!Array.isArray(messages) || messages.length === 0) {
			this.log("AddMessagesToTable: No messages to add");
			return;
		}

		const table = document.getElementById("messagesTable");

		if (!table) {
			console.error("AddMessagesToTable: messagesTable element not found");
			return;
		}

		this.log(`AddMessagesToTable: Adding ${messages.length} messages to table`);

		messages.forEach(message => {
			// Skip if message already exists (check by ID)
			const existingRow = table.querySelector(`tr[data-message-id="${message.id}"]`);
			if (existingRow) {
				this.log(`Skipping duplicate message ID: ${message.id}`);
				return;
			}

			const row = table.insertRow();
			row.setAttribute('data-message-id', message.id);
			row.setAttribute('data-published-at', message.publishedAt);

			// Add cells based on your existing table structure
			// Adjust these based on your actual table columns
			const timeCell = row.insertCell(0);
			const authorCell = row.insertCell(1);
			const messageCell = row.insertCell(2);
			const actionCell = row.insertCell(3);
			const ttsButtonCell = row.insertCell(4);
			const ttsCheckboxCell = row.insertCell(5);

			// Format time
			const messageTime = new Date(message.publishedAt);
			timeCell.textContent = messageTime.toLocaleTimeString();

			// Author
			authorCell.textContent = message.author;

			// Message content
			messageCell.textContent = message.message;
			messageCell.style.wordWrap = "break-word";
			messageCell.style.maxWidth = "300px";

			// Action buttons (adjust based on your needs)
			actionCell.innerHTML = '<button onclick="console.log(\'Action clicked\')">Action</button>';

			// TTS button (adjust based on your TTS implementation)
			ttsButtonCell.innerHTML = `<button onclick="window.speakMessage?.('${message.message.replace(/'/g, "\\'")}')">🔊</button>`;

			// TTS checkbox
			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = true; // Default checked for auto-TTS
			ttsCheckboxCell.appendChild(checkbox);
		});

		this.log(`AddMessagesToTable: Successfully added ${messages.length} messages`);
	}

	// Utility method to refresh and get new messages since last check
	async GetNewMessagesSinceLastUpdate() {
		this.log("Checking for new messages since last update...");

		// Add delay before refresh to respect rate limits
		await this.DelayRequest(2000);

		// Refresh pagination to catch any new pages
		await this.DiscoverPagination(true);

		// Add another delay before getting messages
		await this.DelayRequest(2000);

		// Get messages from the newest page
		const newestPageResult = await this.GetMessages();

		return newestPageResult;
	}

	// Method to manually set broadcast ID and validate it
	async SetBroadcastId(broadcastId) {
		this.log(`SetBroadcastId called with: ${broadcastId}`);

		if (!broadcastId) {
			throw new Error("Broadcast ID cannot be empty");
		}

		this.args.broadcastId = broadcastId;

		// Clear cached liveChatId to force refresh
		this.liveChatId = null;
		this.paginationCache = null;

		// Validate the broadcast ID by trying to get liveChatId
		try {
			await this.GetLiveChatId();
			this.log(`Broadcast ID ${broadcastId} validated successfully`);
			return true;
		} catch (error) {
			this.log(`Broadcast ID ${broadcastId} validation failed:`, error.message);
			throw error;
		}
	}

	// Method to refresh configuration from DOM elements
	RefreshConfig() {
		const oldConfig = { ...this.args };

		this.args = {
			apiKey: LSGI("youtube_apiKey") || GEBI("youtube_apiKey") || this.args.apiKey,
			channelName: LSGI("youtube_channelName") || GEBI("youtube_channelName") || this.args.channelName,
			channelId: LSGI("youtube_channelId") || GEBI("youtube_channelId") || this.args.channelId,
			broadcastId: LSGI("youtube_broadcastId") || GEBI("youtube_broadcastId") || this.args.broadcastId,
			updateFreq: this.args.updateFreq,
			debug: this.args.debug,
		};

		this.log("Configuration refreshed:");
		this.log("- apiKey:", oldConfig.apiKey !== this.args.apiKey ? `CHANGED (${this.args.apiKey ? 'SET' : 'MISSING'})` : (this.args.apiKey ? 'SET' : 'MISSING'));
		this.log("- channelName:", oldConfig.channelName !== this.args.channelName ? `CHANGED (${this.args.channelName || 'MISSING'})` : (this.args.channelName || 'MISSING'));
		this.log("- channelId:", oldConfig.channelId !== this.args.channelId ? `CHANGED (${this.args.channelId || 'MISSING'})` : (this.args.channelId || 'MISSING'));
		this.log("- broadcastId:", oldConfig.broadcastId !== this.args.broadcastId ? `CHANGED (${this.args.broadcastId || 'MISSING'})` : (this.args.broadcastId || 'MISSING'));

		// Clear cache if config changed
		if (oldConfig.broadcastId !== this.args.broadcastId || oldConfig.apiKey !== this.args.apiKey) {
			this.log("Key configuration changed, clearing cache");
			this.ClearPaginationCache();
		}

		return this.args;
	}
}
