const reviews_v2 = 
[
	/*
		{
				name: "",
				img: "",
				datePlayed: "",
				completed: false,
				stream: "",
				pros: [],
				cons: [],
				rankings: {
						gameplay: 5,
						graphics: 5,
						audio: 5,
						story: 5,
						microtransactions: 5,
						uniqueness: 5,
				},
				links: {steam: ""},
				review: ""
		},
		*/
		{
				name: "IRON LUNG",
				img: "https://i.ytimg.com/vi/bOHbe5tbhJI/hqdefault.jpg",
				datePlayed: "2026_01_29",
				completed: true,
				stream: "https://www.youtube.com/watch?v=gX3fQHqcL5c",
				pros: [
					"natural dialogue (actually)"
				],
				cons: [],
				rankings: {
					graphics: 9,
					audio: 9,
					story: 8,
					pacing: 9,
					uniqueness: 10,
				},
				links: {website: "https://ironlung.com/"},
				review: "a genuinely unique movie with an intraging environment, which kept me engauged the whole time. this isn't a youtuber movie, it's just a good movie"
		},
		{
			name: "Amnesia: rebirth",
			img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/999220/header.jpg?t=1752056337",
			datePlayed: "2026-01-24",
			completed: true,
			stream: "https://www.youtube.com/watch?v=n-Wds66nsYM",
			pros: [
				"unique environments",
				"looks great",
				"immersive gameplay",
				"physics based world"
			],
			cons: [
				"simple monsters that are repetitive",
			],
			rankings: {
					gameplay: 7,
					graphics: 9,
					audio: 9,
					story: 8,
					uniqueness: 10,
			},
			links: {steam: "https://store.steampowered.com/app/999220/Amnesia_Rebirth/"},
			review: "fun game, a touch repetitive with the enemy sections. it's generally pretty obvious when a monster about to appear 9/10 of the time if you're familiar with horror game design. thankfully the story and unique environments make up for it"
		},
];

export default reviews_v2;
