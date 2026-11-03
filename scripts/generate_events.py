import os
import json
import urllib.request
import urllib.parse

YOUTUBE_HANDLE = "vulbyte"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
TWITCH_USERNAME = "vulbyte"
KICK_USERNAME = "vulbyte"

events = []

def make_request(url, headers=None, data=None):
    if headers is None:
        headers = {}
    headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    # Set referrer to match Google Cloud Key restrictions
    headers["Referer"] = "https://vulbyte.com"
    
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

# 1. Fetch YouTube Streams
if YOUTUBE_API_KEY:
    chan_url = f"https://www.googleapis.com/youtube/v3/channels?part=id&forHandle={YOUTUBE_HANDLE}&key={YOUTUBE_API_KEY}"
    chan_data = make_request(chan_url)
    if chan_data and "items" in chan_data and len(chan_data["items"]) > 0:
        channel_id = chan_data["items"][0]["id"]
        yt_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={channel_id}&type=video&eventType=upcoming&key={YOUTUBE_API_KEY}"
        yt_data = make_request(yt_url)
        if yt_data and "items" in yt_data:
            for item in yt_data["items"]:
                events.append({
                    "title": item["snippet"]["title"],
                    "start": item["snippet"]["publishedAt"],
                    "description": item["snippet"].get("description", "Upcoming YouTube Stream"),
                    "backgroundColor": "#FF0000",
                    "borderColor": "#CC0000",
                    "textColor": "#FFFFFF",
                    "extendedProps": {
                        "links": [{"name": "Watch on YouTube", "url": f"https://youtube.com/watch?v={item['id']['videoId']}", "icon": "fa-brands fa-youtube"}]
                    }
                })

# 2. Fetch Twitch Schedule
gql_query = json.dumps({
    "query": f'query {{ user(login: "{TWITCH_USERNAME}") {{ schedule {{ segments {{ title startTime category {{ name }} }} }} }} }}'
}).encode('utf-8')

twitch_data = make_request(
    "https://gql.twitch.tv/gql",
    headers={"Client-Id": "kimne78kx3ncx6br8g4mv6wki5h1ko", "Content-Type": "application/json"},
    data=gql_query
)

if twitch_data and "data" in twitch_data:
    segments = twitch_data["data"].get("user", {}).get("schedule", {}).get("segments", []) or []
    for seg in segments:
        cat_name = seg.get("category", {}).get("name", "Variety") if seg.get("category") else "Variety"
        events.append({
            "title": seg["title"],
            "start": seg["startTime"],
            "description": f"Category: {cat_name}",
            "backgroundColor": "#9146FF",
            "borderColor": "#772CE8",
            "textColor": "#FFFFFF",
            "extendedProps": {
                "links": [{"name": "Watch on Twitch", "url": f"https://twitch.tv/{TWITCH_USERNAME}", "icon": "fa-brands fa-twitch"}]
            }
        })

# 3. Fetch Kick Streams
kick_data = make_request(f"https://kick.com/api/v2/channels/{KICK_USERNAME}")
if kick_data:
    if kick_data.get("livestream"):
        ls = kick_data["livestream"]
        cat = ls.get("categories", [{}])[0].get("name", "Gaming") if ls.get("categories") else "Gaming"
        events.append({
            "title": ls.get("session_title", f"{KICK_USERNAME} Live on Kick"),
            "start": ls.get("created_at"),
            "description": f"Category: {cat} (Currently Live!)",
            "backgroundColor": "#53FC18",
            "borderColor": "#00B301",
            "textColor": "#000000",
            "extendedProps": {
                "links": [{"name": "Watch on Kick", "url": f"https://kick.com/{KICK_USERNAME}", "icon": "fa-solid fa-play"}]
            }
        })
    if kick_data.get("schedule") and isinstance(kick_data["schedule"].get("slots"), list):
        for slot in kick_data["schedule"]["slots"]:
            cat = slot.get("category", {}).get("name", "Upcoming Stream") if slot.get("category") else "Upcoming Stream"
            events.append({
                "title": slot.get("title", f"{KICK_USERNAME} Scheduled Stream"),
                "start": slot.get("start_time"),
                "description": f"Category: {cat}",
                "backgroundColor": "#53FC18",
                "borderColor": "#00B301",
                "textColor": "#000000",
                "extendedProps": {
                    "links": [{"name": "Watch on Kick", "url": f"https://kick.com/{KICK_USERNAME}", "icon": "fa-solid fa-play"}]
                }
            })

# Output events.json to root directory
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "..", "events.json")

with open(output_path, "w") as f:
    json.dump(events, f, indent=2)

print(f"Successfully generated events.json at {output_path} with {len(events)} events.")
