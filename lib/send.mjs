// client.mjs - Supabase Edge Function Client (JavaScript ES Modules)

class SupabaseSecureClient {
	constructor(functionUrl, anonKey) {
		// Configuration - easily customizable
		this.config = {
			// Replace with your actual Supabase project URL and Edge Function name
			functionUrl: functionUrl || "https://your-project.supabase.co/functions/v1/secure-messaging",
			anonKey: anonKey || "your-anon-key-here",
			credentials: {
				username: "demo",
				password: "password"
			},
			endpoints: {
				login: "/auth/login",
				refresh: "/auth/refresh",
				message: "/api/message"
			},
			tokenRefreshThreshold: 5 * 60 * 1000, // Refresh if token expires in < 5 minutes
		};

		this.token = null;
		this.tokenExpiry = null;
	}

	// Parse JWT to get expiry time
	parseTokenExpiry(token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp * 1000; // Convert to milliseconds
		} catch (error) {
			console.error('Failed to parse token:', error);
			return null;
		}
	}

	// Check if token needs refresh
	needsRefresh() {
		if (!this.token || !this.tokenExpiry) return true;
		const now = Date.now();
		return (this.tokenExpiry - now) < this.config.tokenRefreshThreshold;
	}

	// Make request to Edge Function with proper headers
	async makeRequest(endpoint, options = {}) {
		const url = `${this.config.functionUrl}${endpoint}`;

		const headers = {
			'Content-Type': 'application/json',
			'apikey': this.config.anonKey,
			...(options.headers || {})
		};

		return fetch(url, {
			...options,
			headers
		});
	}

	// Authenticate and get token
	async authenticate() {
		try {
			const response = await this.makeRequest(this.config.endpoints.login, {
				method: 'POST',
				body: JSON.stringify(this.config.credentials),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Authentication failed');
			}

			this.token = data.token;
			this.tokenExpiry = this.parseTokenExpiry(data.token);

			console.log('Authentication successful');
			return data;

		} catch (error) {
			console.error('Authentication error:', error);
			throw error;
		}
	}

	// Refresh existing token
	async refreshToken() {
		try {
			const response = await this.makeRequest(this.config.endpoints.refresh, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				// If refresh fails, try full authentication
				return await this.authenticate();
			}

			this.token = data.token;
			this.tokenExpiry = this.parseTokenExpiry(data.token);

			console.log('Token refreshed successfully');
			return data;

		} catch (error) {
			console.error('Token refresh error:', error);
			// Fallback to full authentication
			return await this.authenticate();
		}
	}

	// Ensure we have a valid token
	async ensureAuthenticated() {
		if (this.needsRefresh()) {
			if (this.token) {
				await this.refreshToken();
			} else {
				await this.authenticate();
			}
		}
	}

	// Main send function - this is what you and your team will use
	async send(payload) {
		try {
			// Ensure we have a valid token
			await this.ensureAuthenticated();

			// Send the message
			const response = await this.makeRequest(this.config.endpoints.message, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${this.token}`,
				},
				body: JSON.stringify({ payload }),
			});

			const data = await response.json();

			if (!response.ok) {
				// If unauthorized, try to refresh token and retry once
				if (response.status === 401 || response.status === 403) {
					console.log('Token expired, refreshing and retrying...');
					await this.authenticate();

					// Retry the request
					const retryResponse = await this.makeRequest(this.config.endpoints.message, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${this.token}`,
						},
						body: JSON.stringify({ payload }),
					});

					const retryData = await retryResponse.json();

					if (!retryResponse.ok) {
						throw new Error(retryData.error || 'Request failed after retry');
					}

					return retryData;
				}

				throw new Error(data.error || 'Request failed');
			}

			return data;

		} catch (error) {
			console.error('Send error:', error);
			throw error;
		}
	}

	// Allow configuration updates
	updateConfig(newConfig) {
		this.config = { ...this.config, ...newConfig };
	}
}

// Factory function to create configured client
export function createSecureClient(functionUrl, anonKey) {
	return new SupabaseSecureClient(functionUrl, anonKey);
}

// Default client instance (you'll need to set your URLs)
const defaultClient = new SupabaseSecureClient();

// Export the simple send function for easy use by your team
export const send = async (payload) => {
	return await defaultClient.send(payload);
};

// Export the client class for advanced usage
export { SupabaseSecureClient };

// Configure the default client (call this once in your app)
export function configureClient(functionUrl, anonKey, credentials) {
	defaultClient.updateConfig({
		functionUrl,
		anonKey,
		...(credentials && { credentials })
	});
}

// Example usage for testing (only runs if this is the main module)
if (import.meta.url === `file://${process.argv[1]}` || globalThis.Deno?.args?.[0]?.endsWith('client.mjs')) {
	// You need to set these values for testing
	const FUNCTION_URL = "https://your-project.supabase.co/functions/v1/secure-messaging";
	const ANON_KEY = "your-anon-key-here";

	configureClient(FUNCTION_URL, ANON_KEY);

	async function test() {
		try {
			console.log('Testing Supabase Edge Function messaging...');

			const result1 = await send({ message: 'Hello, Edge Function!', type: 'greeting' });
			console.log('Response 1:', result1);

			const result2 = await send({
				message: 'This is a test message from Edge Function client',
				data: { userId: 123, action: 'update' }
			});
			console.log('Response 2:', result2);

			console.log('All tests passed!');

		} catch (error) {
			console.error('Test failed:', error);
		}
	}

	await test();
}
