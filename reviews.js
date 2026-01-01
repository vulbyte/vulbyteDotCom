const reviews = 
[
	/*
		{
				name: "",
				img: "",
				rankings: {
						gameplay: 5,
						graphics: 5,
						audio: 5,
						story: 5,
						uniqueness: 5,
				},
				links: {steam: ""},
				review: "<a href='' target='_blank'> orignally played on youtube here</a>"
		},
		*/
		{
				name: "blameless",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/530330/header.jpg?t=1567232080",
				rankings: {
						gameplay: 4,
						graphics: 4,
						audio: 7,
						story: 6,
						uniqueness: 7,
				},
				links: {steam: "https://store.steampowered.com/app/530330/Blameless/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "5 NIGHTS AT BOBR KURWA",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3583060/56bced90d6b5122a4cc4b26c795d6d03fbdf6aab/header.jpg?t=1743307667",
				rankings: {
						gameplay: 6.5,
						graphics: 6,
						audio: 4,
						story: 4,
						uniqueness: 4,
				},
				links: {steam: "https://store.steampowered.com/app/3583060/5_NIGHTS_AT_BOBR_KURWA/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "Car Mechanic Simulator 2015",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/320300/header.jpg?t=1750427326",
				rankings: {
						gameplay: 6,
						graphics: 6,
						audio: 6,
						uniqueness: 9,
				},
				links: {steam: "https://store.steampowered.com/app/320300/Car_Mechanic_Simulator_2015/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "Black Rose",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/453890/header.jpg?t=1640161442",
				rankings: {
						gameplay: 7,
						graphics: 8,
						audio: 4,
						story: 4,
						uniqueness: 4,
				},
				links: {steam: "https://store.steampowered.com/app/453890/Black_Rose/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "Check vs Mate (aka battle vs chess)",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/211070/header.jpg?t=1685146935",
				rankings: {
						gameplay: 8,
						graphics: 9,
						audio: 8,
						story: 5,
						uniqueness: 8,
				},
				links: {steam: "https://store.steampowered.com/app/211070/Check_vs_Mate/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "Alice Mesmerizing Episodes of Neurosis (AMEN)",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3355430/header.jpg?t=1766221507",
				rankings: {
						gameplay: 4,
						graphics: 6,
						audio: 4,
						story: 6,
						uniqueness: 3,
				},
				links: {steam: "https://store.steampowered.com/app/3355430/Alice_Mesmerizing_Episodes_of_Neurosis_AMEN/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
			name: "memology: italitan war meme",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3852580/5f7f0627d1b1b15a7daf998b17af7042ee401978/header.jpg?t=1760543376",
				rankings: {
						gameplay: 3,
						graphics: 3,
						audio: 4,
						uniqueness: 6,
				},
				links: {steam: "https://store.steampowered.com/app/3852580/MEMOLOGY_ITALIAN_MEME_WAR/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "8 ball",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/818530/header.jpg?t=1735740937",
				rankings: {
						gameplay: 3,
						graphics: 4,
						audio: 6,
						uniqueness: 4,
				},
				links: {steam: "https://store.steampowered.com/app/818530/8_Ball/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "OLDTV",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/643270/header.jpg?t=1694713917",
				rankings: {
						gameplay: 9,
						graphics: 9,
						audio: 7,
						story: 5,
						uniqueness: 10,
				},
				links: {steam: "https://store.steampowered.com/app/643270/OLDTV/"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
				name: "PUNCH_OUT (wii)",
				img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPYmL7KRG8O6SZkzxuwicnUtNkVQ4Qc9oSMg&s",
				rankings: {
						gameplay: 10,
						graphics: 9,
						audio: 9,
						story: 6.5,
						uniqueness: 10,
				},
				links: {nintendo: "https://www.nintendo.com/en-gb/Games/Wii/PUNCH-OUT--282706.html"},
				review: "<a href='https://www.youtube.com/watch?v=Qj3wg9-5QeQ' target='_blank'> orignally played on youtube here: https://www.youtube.com/watch?v=Qj3wg9-5QeQ</a>"
		},
		{
			name: "5 nights at Timokha 4: School",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3296200/header.jpg?t=1735010296",
				rankings: {
						gameplay: 6,
						graphics: 5,
						audio: 3,
						uniqueness: 6,
				},
				links: {steam: "https://store.steampowered.com/app/3296200/5_nights_at_Timokha_4_School/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> ⚠️this entire game was russian outside of the menus so there's a massive language barrier⚠️the game was funny obsurd, but i feel like most of the humor was crude in a bad way, however i felt like this game was a bit of a fun 'fuck it i don't need this 2$' sorta game. if you don't speak russian you'll prboably have a rought time, if you do lmk how it goes for you lol"
		},
		{
			name: "Ghost Master: Resurrection",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3289090/header.jpg?t=1761859479",
				rankings: {
						gameplay: 9,
						graphics: 7,
						audio: 6,
						story: 8,
						uniqueness: 10,
				},
				links: {steam: "https://store.steampowered.com/app/3289090/Ghost_Master_Resurrection/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> it's a fun top down game, where instead of pleasing all the humans inside you're trynig to haunt them to get them to leave. a fun little twist on the genre, it's fun but is a bit dated so teh controls are rather clunky. that being said the game far and away makes up for it with its personality that it absolutely oozes"
		},
		{
				name: "Super Hexagon",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/221640/header.jpg?t=1653925774",
				rankings: {
						gameplay: 8,
						graphics: 9,
						audio: 10,
						uniqueness: 10,
				},
				links: {steam: "https://store.steampowered.com/app/221640/Super_Hexagon/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> the game is very simple and smal, but it's very very fun. a great game to add to your arsonal of 'i have a few minutes but dont want to get into something' games. i bought it when it came out and still love, never had an issue with it"
		},
		{
				name: "Russian Life Simulator",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1070330/header.jpg?t=1749477331",
				rankings: {
						gameplay: 2,
						graphics: 5,
						audio: 7,
						uniqueness: 3,
				},
				links: {steam: "https://store.steampowered.com/app/1070330/Russian_Life_Simulator/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> cookie clicker with a meme russian twist. most of is prety obvious, some fun little gafs. do yours a favor and get an auto clicker, it will make your life so much easier."
		},
		{
				name: "Press X to Not Die",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/402330/header.jpg?t=1756071866",
				rankings: {
						gameplay: 3,
						graphics: 8,
						audio: 4,
						story: 6,
						uniqueness: 10,
				},
				links: {steam: "https://store.steampowered.com/app/402330/Press_X_to_Not_Die/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> I AM A GAMER THERE FOR I SURVIVED"
		},
		{
				name: "Mister Furry: Hot Muscles",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1578220/2b44eb2081f6410206afa084555438c370ab4e63/header.jpg?t=1746979349",
				rankings: {
						gameplay: 6,
						graphics: 5,
						audio: 4,
						story: 6,
						uniqueness: 7,
				},
				links: {steam: "https://store.steampowered.com/app/1578220/Mister_Furry_Hot_Muscles/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> it's funny at times, butis mostly jsut shock humor. the game lacks subtly and i mostly just feel concerned i'm going to be flashed more then skidding into the joke, and i love these kinda jokes. tho all the buff furries make me ho-💥"
		},
		{
				name: "it's spring again",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/434210/header.jpg?t=1760395596",
				rankings: {
						gameplay: 3,
						graphics: 7,
						audio: 6,
						uniqueness: 4,
				},
				links: {steam: "https://store.steampowered.com/app/434210/Its_Spring_Again/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> its' a cute kids game, i feel like some ui stuff is not entuitive enough for kids to properly underrstand, aswell as the experience is really really short. fine game but leave a lot to be desired"
		},
		{
			name: "Dont Crash: The Political Game",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1389270/header.jpg?t=1755742612",
				rankings: {
						gameplay: 7,
						graphics: 4,
						audio: 4,
						uniqueness: 6,
				},
				links: {steam: "https://store.steampowered.com/app/1389270/Dont_Crash__The_Political_Game/"},
				review: "<a href='https://www.youtube.com/live/s4RfohvAP4I' target='_blank'> orignally played on youtube here: https://www.youtube.com/live/s4RfohvAP4I </a> a fun little joke game, lacks depth but lowkey is actually surprisingly fun. ai can be really brutal to fight so you need to pick your enounters, if not you get bonned pertty easy, kinda wish there was a sniper ngl lol"
		},
		{
				name: "Amnesia: The Bunker",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1944430/header.jpg?t=1734702362",
				rankings: {
						gameplay: 6,
						graphics: 9,
						audio: 8,
						story: 6,
						uniqueness: 9,
				},
				links: {steam: "https://store.steampowered.com/app/1944430/Amnesia_The_Bunker/"},
			review: "stream: <a href='https://www.youtube.com/watch?v=7M93qzI5oBM' target='_blank'>https://www.youtube.com/watch?v=7M93qzI5oBM</a> the game is quite fun, i feel like the first 4 or so hours were really fun, the next 2 hours feel a bit tedious, and the ending at the very end sacrificed player agency for a dogshit cutscene. genuinely play this game if you're a horror fan, but my god that last room fucking sucks. great game however now even writing this 30 minutes after the end has me peeved."
		},
		{
				name: "Klonoa: door to phantomile",
				img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1730680/header.jpg?t=1708327336",
				rankings: {
						gameplay: 4,
						graphics: 7,
						audio: 6,
						story: 3,
						uniqueness: 8,
				},
				links: {steam: "https://store.steampowered.com/app/1730680/Klonoa_Phantasy_Reverie_Series/"},
				review: "it's 'cat in the hat video game's daddy from 1980s. as someone who didn't grow up wit this game, it has a lot of rough edges. maybe the remake butchered it. however, the game feel like it needs a tonne of work if it resembels the original at all."
		},
		{
				name: "DOOM (2016)",
				img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/379720/header.jpg?t=1750784856',
				rankings: {
						gameplay: 6.5,
						graphics: 10,
						audio: 9,
						story: 6.25,
						uniqueness: 9,
				},
				links: {steam: "https://store.steampowered.com/app/379720/DOOM/"},
				review: '(⚠️ read the caps at the end ⚠️:) the only soundtrack from a game where i put the album on as a whole for the listening experience ("mick gordon at his peak" - rory). the game is fun, however i think the gunplay is rather slow, and the glory kill system has some rather notable flaws. monsters feel a bit too generic and the only variety i feel is who to shoot first not how to eleminate them. glory kills are a neat mechanical idea however i really feel like theyre over used and about 1/2 way through the game they really loose their luster. ⚠️PLAY THIS GAME ON A LOW DIFFICULTY AND ENJOY THE SITES. IT IS NOT WORTH TRYING TO PLAY ON HIGH DIFFICULTIES'
		},
		{
				name: "Five nights at freddies: security breach [CCR]",
				img: 'https://images.gamebanana.com/img/ss/wips/530-90_67d35df92334d.jpg',
				rankings: {
						gameplay: 9,
						graphics: 8.5,
						audio: 8.5,
						story: 7,
						uniqueness: 8.5,
				},
				links: {website: 'https://gamebanana.com/wips/90175'},
				review: 'genuinely peak fnaf, i have never had a better experience in a fnaf game. i now consider this the essential way to play fnaf:SB, if you play the base version without this mod you are GENUINELY loosing out on a signifigantly better experience. this mod doesnt change the game in any way i would consider core to the experience, so i personally still consider it vanilla, but it is a signifigantly better version over what is on steam. must play if youre a fan of the series.'
		},
		{
				name: "peak",
				img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3527290/bd3771d9a3827610b2742de13d8552918008c302/header_alt_assets_2.jpg?t=1764003551',
				rankings: {
						gameplay: 4,
						graphics: 9,
						audio: 6,
						story: 6,
						uniqueness: 8,
				},
				links: {steam: 'https://store.steampowered.com/app/3527290/PEAK/'},
				review: 'the game can be fun but the rng really hurts the levels. theres a few places where you just get effed and it really doesnt feel fun. the game is fun with friends but so is every game ever so im trying to evaluate the game without that.'
		},
		{
				name: "Call Of Duty: Black Ops 2 [zombies]",
				img: 'https://static.wikia.nocookie.net/steamtradingcards/images/8/89/Call_of_Duty_Black_Ops_II_Zombies_Logo.jpg',
				rankings: {
						gameplay: 6.5,
						graphics: 9,
						audio: 7,
						story: 6,
						microtransactions: 7,
						uniqueness: 8,
				},
				links: {steam: "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/"},
				review: 'personally my favorite zombies. weapons are a bit of a let down. maps are generally pretty colstraphobic. all the packapunch weapons sounding the same is also a bit tedious. i want to like transit but it is pretty annoying with exploding zombies. ggwp'
		},
		{
				name: "Call Of Duty: Black Ops 2 [campaign]",
				img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/202970/header.jpg?t=1748037715',
				rankings: {
						gameplay: 8,
						graphics: 8,
						audio: 7,
						story: 9,
						microtransactions: 7,
						uniqueness: 7,
				},
				links: {steam: "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/"},
				review: 'what i personally consider to be the peak of AAA gaming'
		},
		{
			name: "legend of zelda: oot",
			img: 'https://m.media-amazon.com/images/I/817VNvs-r9L._AC_UF1000,1000_QL80_.jpg',
			rankings: {
				gameplay: 5,
				graphics: 7,
				audio: 6,
				story: 8,
				uniqueness: 7.5,
			},
			links: {},
			review: "eh, it's okay-- Great fairy has bush, would. \n- rory",
		},
		{
			name: "i'm going to die if i don't eat sushi!",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2000280/header.jpg?t=1655812824',
			rankings: {
				gameplay: 8,
				graphics: 6,
				audio: 8,
				story: 8,
				uniqueness: 7,
			},
			links: {steam: 'https://store.steampowered.com/app/2000280/Im_going_to_die_if_I_dont_eat_sushi/'},
			review: 'if you know anime tropes, this game is a fun little chuckle. the best tldr i can think of for this game is an "asset flip" that parodies animes, but i mean that in the best way possible'
		},
		{
			name: "kittens wardrobe",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2571400/header.jpg?t=1757034056',
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 6.5,
				story: 6.5,
				uniqueness: 7,
			},
			links: {steam: "https://store.steampowered.com/app/2571400/Kittens_Wardrobe/"},
			review: 'a cute fun game, a short play probably better for a younger sterotypically female audience (ie a younger sister type person). however still a fun game which was cute :3. only issue are: it can feel a touch slow, audio was a bit flat, and i wish there was more minigames'
		},
		{
			name: "short hop laser",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1651750/header.jpg?t=1633549448',
			rankings: {
				gameplay: 4,
				graphics: 4,
				audio: 5,
				uniqueness: 4,
			},
			links: {steam: 'https://store.steampowered.com/app/1651750/Short_Hop_Laser/'},
			review: 'another early game dev project, some fun little mechanics at play. main suggestion would be on the next project have a more cohesive style, and polish mechanics more around fun over trying to show off an animation. wish you well on the next project :3'
		},
		{
			name: "Dee's nuts",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1778500/header.jpg?t=1737227465',
			rankings: {
				gameplay: 4,
				graphics: 5,
				audio: 3,
				uniqueness: 5,
			},
			links: {steam: "https://store.steampowered.com/app/1778500/Dees_Nuts/"},
			review: 'a fun little first game, the game has quite a few rough edges, and is a pretty typical "catch things in a basket" sorta mini-game. i sadly cant really recommend the game, however i hope  the developer continues improving and making steps in their game dev journey :3'
		},
		{
			name: "Finding Frankie",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2597970/header.jpg?t=1731527788',
			rankings: {
				gameplay: 6.5,
				graphics: 9,
				audio: 8,
				story: 6,
				uniqueness: 7,
			},
			links: {steam: 'https://store.steampowered.com/app/2597970/Finding_Frankie/'},
			review: 'a short fun indie game, mechanics could be explored more, story feel a bit flat and confusing. the part where the map opens up felt rather pointless and was just to get achevements. couldnt see anything during one of the sections so that was frustrating.'
		},
		{
			name: "loophole",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3629400/07e456ba31800b9e1a431c8aebda011f31a11ede/header.jpg?t=1752476446',
			rankings: {
				gameplay: 9,
				graphics: 9,
				audio: 9,
				story: 5.5,
				uniqueness: 10,
			},
			links: {steam: "https://store.steampowered.com/app/3629400/Loophole/"},
			review: "a fun and interesting puzzel game that really forces you to think in a new way, it's a very fun game, good for about 9 hours of playtime from my experience. for about 10usd i would say it's well worth it. a very different experience from something liek subnautica, but still a very good experience, and if you enjoy puzzel games, you should be upset not to play this one."
		},
		{
			name: "underground turtle races",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3107820/header.jpg?t=1763154285',
			rankings: {
				gameplay: 3,
				graphics: 3,
				audio: 3,
				uniqueness: 7,
			},
			review: 'DISCLAIMER, I GOT THIS AS A GIFT, NEITHER ME OR THE GIVER NEW IT WAS AI UNTIL I ACCEPTED. \n \n game is a fun lil gag, numbers mean effectively nothing and its kinda like rolling a die and betting which side it lands on. the devs at least seem to be aware of what the game is so its at least bargin brin priced',
			links: {
				steam: 'https://store.steampowered.com/app/3107820/Underground_Turtle_Races/'
			}
		},
		{
			name: "CHEESE ROLLING",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3809440/dc2146025073b286bd6ace9f183f3a0f991f3aa9/header.jpg?t=1761446109',
			rankings: {
				gameplay: 9,
				graphics: 9,
				audio: 8,
				uniqueness: 10,
			},
			links: {
				steam: "https://store.steampowered.com/app/3809440/Cheese_Rolling/"
			},
			review: 'the game redefines the third person genre, if one truely wishes to obtain the cheese this game transends into a religeous experience where one is attempting to not just get the cheese wheel, but the cheese within ones self.'
		},
		{
			name: "Jackbox starter",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1755580/header.jpg?t=1734653341',
			rankings: {
				gameplay: 9,
				graphics: 8,
				audio: 7,
				story: 6,
				uniqueness: 10,
			},
			links: {
				steam: "https://store.steampowered.com/app/1755580/The_Jackbox_Party_Starter/"
			},
			review: 'all of the games are bangers, the drawing netreg can be very frustrating tho'
		},
		{
			name: "Jackbox 6",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1005300/header.jpg?t=1728584590',
			rankings: {
				gameplay: 5,
				graphics: 8,
				audio: 7,
				story: 5,
				uniqueness: 10,
			},
			links: {
				steam: 'https://store.steampowered.com/app/1005300/The_Jackbox_Party_Pack_6/',
			},
			review: 'role models && murder party are fun! the rest are kinda only good for small groups at home'
		},
		{
			name: "Jackbox 4",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/610180/header.jpg?t=1728584458',
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 7,
				story: 4,
				uniqueness: 10,
			},
			links: {
				steam: 'https://store.steampowered.com/app/610180/The_Jackbox_Party_Pack_4/',
			},
			review: 'all are fun except civic doodle, survive the internet makes it hard to set up good jokes. still fun tho!'
		},
		{
			name: "Jackbox 2",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/397460/header.jpg?t=1728584193',
			rankings: {
				gameplay: 6,
				graphics: 8,
				audio: 6.5,
				story: 4,
				uniqueness: 10,
			},
			links: {
				steam: "https://store.steampowered.com/app/397460/The_Jackbox_Party_Pack_2/"
			},
			review: 'fun game, 2 of the games are flops to stream, and 2 are kinda dull with the host yapping too much, quiplash is gold tho'
		},
		{
			name: "Animaddicts 4",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1949930/header.jpg?t=1654099352',
			rankings: {
				gameplay: 2,
				graphics: 6,
				audio: 3,
				story: 2,
				uniqueness: 3,
			},
			links: {
				steam: "https://store.steampowered.com/app/1949930/Animaddicts_4/",
			},
			review: 'the game is extremely novice, and has many many ruogh edges. i would respect the game a lot more if it was like 2$ regularly, however this game at the time of writing is about 20$USD, and although i do not think it is a scam (because you very clearly know what youre getting from teh previews), i wish to know what the dev is smoking so i can have some plz and ty'
		},
		{
			name: "Getting over it",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240720/header.jpg?t=1666987027',
			rankings: {
				gameplay: 6,
				graphics: 9,
				audio: 7,
				story: 6.5,
				uniqueness: 7,
			},
			review: 'fine game, the artists personal story is okay. gameplay has mechanics which are imo pooly designed, although they lean into the rage jaja funny moments i personally dont find it to be consistent enough i can enjoy it.'
		},
		{
			name: "Dirt Rally 2.0",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/690790/header.jpg?t=1730918452',
			rankings: {
				gameplay: 9,
				graphics: 7.5,
				audio: 10,
				story: 5,
				uniqueness: 8,
				microtransations: 7,
			},
			review: 'fun racing game with a clear niche, if you enjoy the game you will need to buy some tracks to help with repition, weather conditions are a bit limited, and visual popins can very very noticable and destracting. '
		},
		{
			name: "alien: isolation",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/214490/header.jpg?t=1728557065',
			rankings: {
				gameplay: 6.5,
				graphics: 10,
				audio: 8,
				story: 7.5,
				uniqueness: 10,
			},
			links: {
				steam: "https://store.steampowered.com/app/214490/Alien_Isolation/",
			},
			review: 'a horror game in its own defined category. no horror game matches its quality or themeing. gameplay is shallopw but is made up for with amazing graphics, solid enough story, and decent music. if you were only able to give someone a single horror game to date, this would be it. it is legendary for a reason.'
		},
		{
			name: "carrion",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/953490/header.jpg?t=1760015957',
			rankings: {
				gameplay: 6.5,
				graphics: 9,
				audio: 9,
				story: 6.5,
				uniqueness: 9,
			},
			links: {steam: "https://store.steampowered.com/app/953490/CARRION/"},
			review: 'a fun twist on the context of the protagonist, the gameplay can be a touch repetitive, and the areas are all hard to tell appart (expect the jungle area). fun game worth trying at some point :3'
		},
		{
			name: "EXIT 8",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2653790/header.jpg?t=1756464433',
			rankings: {
				gameplay: 6.5,
				graphics: 9,
				audio: 8,
				uniqueness: 9,
			},
			links: {steam: "https://store.steampowered.com/app/2653790/The_Exit_8/"},
			review: 'a short and fun game, only issue is that the game is a bit too short and lacks depth. is a fun experience but wont last more then an hour most likely. work a play'
		},
		{
			name: "monstrum",
			img: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/296710/header.jpg?t=1748505684',
			rankings: {
				gameplay: 8,
				graphics: 7,
				audio: 8,
				story: 7,
				uniqueness: 9,
			},
			links: {steam: "https://store.steampowered.com/app/296710/Monstrum/"},
			review: 'fun short roguelike with plenty unique twists, first person controller is a but clunky and the audio in some places is poorly mixed, however is a very fun game, debaitibly a must play :3'
		},
		{
			name: "escape the backrooms (not-completed)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1943950/c5ecb6ccafea6eb86d1ab6413f452eb07dcee27f/header.jpg?t=1758195724',
			rankings: {
				gameplay: 5.5,
				graphics: 8,
				audio: 6,
				story: 5,
				uniqueness: 9,
			},
			links: {steam: 'https://store.steampowered.com/app/1943950/Escape_the_Backrooms/'},
			review: 'fun game, monsters desperately need to make sounds like stomping when theyre roaming because of BS deaths. animations overall could use a bit of polish. audio mixing needs some work, monsters can be very very loud and people can be very quiet. controls can also use some tweaking and reworking (ie not being able to walk with a lean.'
		},
		{
			name: "five nights at freddies: help wanted",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/732690/header.jpg?t=1686587846',
			rankings: {
				gameplay: 6.5,
				graphics: 8,
				audio: 9,
				story: 6,
				uniqueness: 9,
			},
			links: {steam: 'https://store.steampowered.com/app/732690/FIVE_NIGHTS_AT_FREDDYS_HELP_WANTED/'},
			review: 'fun game, crashes a lot, soft locked at the end, solid experience on sale, not worth replaying to get the ending tho imo'
		},
		{
			name: "bendy and the ink machine",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/622650/header.jpg?t=1756641105',
			rankings: {
				gameplay: 4,
				graphics: 9.5,
				audio: 8,
				story: 6.5,
				uniqueness: 8.5,
			},
			links: {
				steam: 'https://store.steampowered.com/app/622650/Bendy_and_the_Ink_Machine/',
			},
			review: 'a very visually unique game with some fun characters, the gameplay can be very repitious and unclear but overall is fine, if youre a less experience gamer who is not "mlg" youll probably find this game just about right :3'
		},
		{
			name: "amnesia: the dark decent",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/57300/header.jpg?t=1751032707',
			rankings: {
				gameplay: 8,
				graphics: 9,
				audio: 6.5,
				story: 7,
				uniqueness: 7.5,
			},
			review: 'fun game, very immersive sim without being an immersive sim. audio is unremarkable, plot is a little minimal, and the setting is a touch generic, still very fun and worth a play :3',
			links: {
				steam: 'https://store.steampowered.com/app/57300/Amnesia_The_Dark_Descent/'

			}
		},
		{
			name: "popgoes arcade",
			img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1986840/7e87fc84a2060c1a2783538ac0d95e6e6a0dc1bd/header.jpg?t=1750966745",
			rankings: {
				gameplay: 7,
				graphics: 9,
				audio: 7,
				story: 6,
				customer_support: 10,
				uniqueness: 7.5,
			},
			links: {
				steam: "https://store.steampowered.com/app/1986840/POPGOES_Arcade/",
			},
			review: 'this review does not include the machinest'
		},
		{
			name: "the spongebob movie game",
			img: 'https://upload.wikimedia.org/wikipedia/en/4/40/The_SpongeBob_SquarePants_Movie_Game.jpg',
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 10,
				story: 8,
				uniqueness: 7,
			},
			review: 'good fun game with some cut corners, not much to play after the first go. a bit repetitive, if you watched somenoe like me play, then i would say you experienced 99% of what the game has to offer. note: i have 0 idea if theres a reward for getting more then 100% or all the chests, but i imagine theres not much. main issue is the image-cutscenes are just bad'
		},
		{
			name: "ultrakill (early access)",
			img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1229490/header.jpg?t=1740623813",
			links: {
				gog: "https://www.gog.com/en/game/ultrakill",
				itch: "https://hakita.itch.io/ultrakill-prelude",
				steam: "https://store.steampowered.com/app/1229490/ULTRAKILL/",
				website: "https://newbloodstore.com/collections/ultrakill",
			},
			rankings: {
				gameplay: 10,
				graphics: 9,
				audio: 8,
				story: 6,
				uniqueness: 9,
			},
			review: `ultrakill is an amazing arena-shooter, the gameplay is by far the best being most similar to doom 2016 but with a much better feel and weapons
can actually combo each other instead of simply compliment.<br>
it uses graphics best described as "late ps1" but with some modern improves. although seen as a downside
it helps the game run at consistent stable framerates. <br>
the music is largely solid, each stage feeling like it fits each level without ever crossing the line
into
distracting or bad. the only thing i would argue is that i feel as if the music can feel a bit flat, and
more more variety with each song could help a lot`
		},
		{
			"name": "subnautica",
			"img": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/264710/header.jpg?t=1751944840",
			links: {
				steam: "https://store.steampowered.com/app/264710/Subnautica/",
				epic: "https://store.epicgames.com/en-US/p/subnautica",
				website: "https://unknownworlds.com/subnautica/",
			},
			rankings: {
				"gameplay": 7,
				"graphics": 9,
				"audio": 9,
				"story": 7,
				uniqueness: 10,
			},
			"review": `
<a herf="https://www.youtube.com/live/kwzGEKu4Q1s?si=N0aQ4CJ2t8-Cs2m_&t=12032">https://www.youtube.com/live/kwzGEKu4Q1s?si=N0aQ4CJ2t8-Cs2m_&t=12032</a><br>
subnautica is a fantastic game that is truely unique, each area feels expansive and unique with plenty of sprawling environments to explore. the creative way they used a volcanic pillar to justify the 2km³ map feel much more real and justified. as well as the great biodiversity and great sense of exploration, only complaints are that grinding for materials can be a bit tedious, some audio bugs, some ai just going through walls, and some other stuff i'm sure i'm forgetting. overall the game is very fun and i personally consider it a must play`,
		},
		{
			name: "cats are liquid: a better place",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1188080/header.jpg?t=1740086473',
			links: {
				steam: "https://store.steampowered.com/app/1188080/Cats_are_Liquid_A_Better_Place/",
				website: "https://lastquarterstudios.com/",
			},
			rankings: {
				gameplay: 6.5,
				graphics: 7,
				audio: 7,
				story: 7,
				uniqueness: 7,
			},
			review: `tldr: fun game, a bit tedious. full review here:
	<a href="https://www.youtube.com/live/l6DiORiVgOg?si=nMD3Imr-b6BiXkNU&t=8661">https://www.youtube.com/live/l6DiORiVgOg?si=nMD3Imr-b6BiXkNU&t=8661</a>					`
		},
		{
			name: "hollow knight (1)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg?t=1695270428',
			links: {
				steam: "https://store.steampowered.com/app/367520/Hollow_Knight/",
				nintendo: "https://www.nintendo.com/us/store/products/hollow-knight-switch/",
				website: "http://hollowknight.com/",
			},
			rankings: {
				gameplay: 9,
				graphics: 9,
				audio: 7,
				story: 6.5,
				uniqueness: 9,
			},
			review: `tldr: fun and interesting, apprecaited all the variety, some areas felt a bit heavily weighted and lacked some identifying landmarks.

<a href="https://www.youtube.com/live/GOjFySAZYzI?si=Njil0ZI7k4u8r9xi&t=14159">https://www.youtube.com/live/GOjFySAZYzI?si=Njil0ZI7k4u8r9xi&t=14159</a>
	`
		},
		{
			name: "pizza tower",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2231450/header.jpg?t=1732516978',
			links: {
				steam: "https://store.steampowered.com/app/2231450/Pizza_Tower/",
			},
			rankings: {
				gameplay: 9,
				graphics: 8,
				audio: 8,
				story: 6,
				uniqueness: 9,
			},
			review: `tldr: pepino can be a bit hard to read, needs a bit more color separation for readibilty, worth playing for the final fight alone
<a href="https://www.youtube.com/live/naRVKqJBgcQ?si=5IWQiEBrWrfZ4S4E&t=3664">https://www.youtube.com/live/naRVKqJBgcQ?si=5IWQiEBrWrfZ4S4E&t=3664</a>
`
		},
		{
			name: "plants vs zombies (goty edition)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3590/header.jpg?t=1738970324',
			links: {
				steam: "https://store.steampowered.com/app/3590/Plants_vs_Zombies_GOTY_Edition/",
				website: "https://www.ea.com/games/plants-vs-zombies",
			},
			rankings: {
				gameplay: 9,
				graphics: 6.5,
				audio: 9,
				story: 6,
				uniqueness: 9,
			},
			review: 'fun game for people of any skill level, you deserve to play it :3, graphics not being scalable to work on more modern devices hurts but overall the game is still very playable and is your time'
		},
		{
			name: "the brookhaven experiment",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440630/header.jpg?t=1715711024',
			links: {
				steam: "https://store.steampowered.com/app/440630/The_Brookhaven_Experiment/",
				website: "https://www.phosphorgames.com/"
			},
			rankings: {
				gameplay: 7,
				graphics: 6.5,
				audio: 6.5,
				story: 6.5,
				uniqueness: 7,
			},
			review: `<a href="https://www.youtube.com/live/kUsgrNWZ-EU?si=iotCq2RXSZK9D_sC&t=17805">https://www.youtube.com/live/kUsgrNWZ-EU?si=iotCq2RXSZK9D_sC&t=17805</a>
the game is fun as a "first vr game", but is better off in short bursts. the game has some questionable color grading making it so when you take a hit it turns the flashlight from a "sorta needed" into a "dear god i can't see anything".
some easy patches would easily raise this game by a while point.
please don't play on harder difficulties.
`
		},
		{
			name: "sonic the hedgehog: 06",
			img: 'https://upload.wikimedia.org/wikipedia/en/d/d1/Sonic_the_Hedgehog_Next-Gen_Box_Art.JPG',
			links: {
				// No current store links, as it's a retro title, linking to the official Sonic website.
				website: "https://archive.org/details/sonic-06-website",
			},
			rankings: {
				gameplay: 3,
				graphics: 3,
				audio: 6.5,
				story: 4,
				uniqueness: 4,
			},
			review: `<a href="https://www.youtube.com/live/AKqUatstanw?si=frx4VhJBv-beIIlu&t=14847">https://www.youtube.com/live/AKqUatstanw?si=frx4VhJBv-beIIlu&t=14847</a>
the game is not redeemable, it deserves to not exitst. there is no reason to bother remaking the game, as it's fundimentally broken.
`
		},
		{
			name: "deltarune (chapers 1-4)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1671210/7ccda5b1631d2e60cc756a3271e845dbb9168821/header.jpg?t=1749252480',
			links: {
				steam: "https://store.steampowered.com/app/1671210/DELTARUNE_Chapter_1__2/",
				itch: "https://tobyfox.itch.io/deltarune",
				nintendo: 'https://www.nintendo.com/us/store/products/deltarune-switch/',
				playstation: "https://store.playstation.com/en-us/concept/233495",
				website: "https://www.deltarune.com/",
			},
			rankings: {
				gameplay: 9,
				graphics: 8,
				audio: 8,
				story: 7,
				uniqueness: 9,
			},
			review: `this is a tldr review for chapers 1-4:
		the game is great, with characters you feel like you want to car about and does a great job of making sure, music, and story	all mixing together to be truely greater than the sum of the parts
	`
		},
		{
			name: "FNAF: secret of the mimic",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215390/527bbebaa5764de58528487b3f2142c44a58b267/header.jpg?t=1758038461',
			links: {
				playstation: 'https://www.playstation.com/en-ca/games/five-nights-at-freddys-secret-of-the-mimic/',
				steam: "https://store.steampowered.com/app/2215390/Five_Nights_at_Freddys_Secret_of_the_Mimic/",
			},
			rankings: {
				gameplay: 6,
				graphics: 9,
				audio: 9,
				story: 8,
				uniqueness: 7,
			},
			review: `<a href="https://www.youtube.com/live/ZkgowNd8GNw?si=yOFa59qtqpjASfZD&t=18941">https://www.youtube.com/live/ZkgowNd8GNw?si=yOFa59qtqpjASfZD&t=18941</a>
great game, just dont bother with the ending that requires the terminal, it's not worth how much time it takes, could have skipped the dolly section and been very content`
		},
		{
			name: "r6 siege (y10s4)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/359550/12ea3dc64ca6aae755efe83e96b6c658876bd6d2/header_alt_assets_14.jpg?t=1757692841',
			links: {
				steam: "https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/",
				website: "https://www.ubisoft.com/en-us/game/rainbow-six/siege",
			},
			rankings: {
				gameplay: 8,
				graphics: 8,
				audio: 7,
				story: 3,
				uniqueness: 9,
			},
			review: `great game that has likely the highest skill/knowedge floor compared to any other multiplayer game. story is ass, community is overly toxic and agressive, and the graphics although fine have been "e-sports-ified" which makes a lot of fun mechanics and things not possible making the game way more of a sweat fest.
	`
		},
		{
			name: "super mario 64 ds",
			img: 'https://i.ytimg.com/vi/lmSdaKBdcFQ/maxresdefault.jpg',
			links: {
				// Retro title, linking to the official Nintendo website
				website: "https://www.nintendo.com/",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 7,
				story: 6,
				uniqueness: 8,
			},
			review: 'gun game, better then the original imo, movement very hurt due to the 8-directional lock isntead of having an alalogue input'
		},
		{
			name: "scooby-doo: night of 100 frights",
			img: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Scooby-Doo%21_Night_of_100_Frights_Coverart.png',
			links: {
				// Retro title, no current store link
				website: "https://www.activision.com/",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 8,
				story: 6,
				uniqueness: 8,
			},
			review: 'gun game! a touch repetitive, platforming can be difficult due to lack of shadow below scooby-doo making landing a bit hard. due to the pathfinder you might get stuck'
		},
		{
			name: "ENA: Dream BBQ (demo)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2134320/header.jpg?t=1755357900',
			links: {
				steam: "https://store.steampowered.com/app/2134320/ENA_Dream_BBQ/",
				website: "https://joelgc.com/",
			},
			rankings: {
				gameplay: 5.5,
				graphics: 10,
				audio: 7,
				story: 6,
				uniqueness: 8,
			},
			review: `<a href="https://www.youtube.com/live/8bn9yrE6Y8k?si=0DdEpIKbCJ-aEhoU&t=5846">https://www.youtube.com/live/8bn9yrE6Y8k?si=0DdEpIKbCJ-aEhoU&t=5846</a> very fun game, giving you a wash of that feaver dream vibe. mechanically is pretty shallow, but easily makes up for that with the characters and unique creative touches all over the place`
		},
		{
			name: "minecraft",
			img: 'https://xboxwire.thesourcemediaassets.com/sites/2/2024/05/Hero-8c18da7c19a1a8811ddb.jpg',
			links: {
				playstation: "https://store.playstation.com/en-us/search/minecraft",
				nintendo: "https://www.nintendo.com/us/store/products/minecraft-switch/",
				xbox: "https://www.xbox.com/en-US/games/store/minecraft/9MVXMVT8ZKWC/0010",
				website: "https://www.minecraft.net/",
			},
			rankings: {
				gameplay: 7,
				graphics: 6,
				audio: 9,
				story: 3,
				uniqueness: 9,
			},
			review: 'movement is a bit flat, game can be pretty tedious, creativity in the game can be a bit restrictive'
		},
		{
			name: "anti-chamber",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/219890/header.jpg?t=1525832559',
			links: {
				steam: "https://store.steampowered.com/app/219890/Antichamber/",
			},
			rankings: {
				gameplay: 6.7,
				graphics: 8,
				audio: 6,
				story: 6.5,
				uniqueness: 9,
			},
			review: `<a href="https://www.youtube.com/live/S3MOQb-g4tM?si=auRaxulgp0K23Oro&t=9231">https://www.youtube.com/live/S3MOQb-g4tM?si=auRaxulgp0K23Oro&t=9231</a> a fun unique game, personally felt like the puzzles fell a touch flat and gameplay wise a puzzel or two bugged which made them very annoying to deal with. combined with crashing ocationaly it was a bit of a sharp edge, overall fun tho!`
		},
		{
			name: "sonic: unleased",
			img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Sonic_unleashed_boxart.jpg/250px-Sonic_unleashed_boxart.jpg',
			links: {
				// Retro title, linking to the official Sonic website.
				website: "https://github.com/hedge-dev/UnleashedRecomp",
			},
			rankings: {
				gameplay: ((8 + 3) / 2),
				graphics: 7,
				audio: 6,
				story: 7,
				uniqueness: 6,
			},
			review: `day levels: 8/10, nighttime: 3/10, enough said`
		},
		{
			name: "wild assault",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2827230/29dd4dd566d8b7a9f0bb4cf6675e099cb8bec97d/header.jpg?t=1758785085',
			links: {
				steam: "https://store.steampowered.com/app/2827230/Wild_Assault/",
			},
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 7,
				story: 3,
				uniqueness: 8,
			},
			review: `fun game, leaning too much into ARs are the work hourse and everything else is secondary, attachments can be overwhelming and don't feel like they do much, some movement mechanics for certain characters are easy to exploid making fighting against them feel very unfair and annoying.

playing against bots is funner, but the bots can be far too repetitive.`
		},
		{
			name: "ape escape 2",
			img: 'https://upload.wikimedia.org/wikipedia/en/c/c1/Ape_Escape_2_Coverart.png',
			links: {
				// Retro title, often available via PlayStation Store on modern consoles.
				playstation: "https://store.playstation.com/en-us/product/UP9000-CUSA02194_00-SCES508850000001",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 7.5,
				story: 8,
				uniqueness: 8.5,
			},
			review: `fun game with a good amount of variety, mechanics can be a bit tedious and the 2nd lap is really tedious with all the gadget switching you need to do. could have easily cut the number in half. 
	music feels like it uses a sound font, feeling not as good compared to 1 or 3, still fun thuogh :3`
		},
		{
			name: "R.E.P.O",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3241660/1ea445e044a2d5b09cfa8291350b63ebed6e5741/header.jpg?t=1750949552',
			links: {
				steam: "https://store.steampowered.com/app/3241660/REPO/",
			},
			rankings: {
				gameplay: 7,
				graphics: 9,
				audio: 7.5,
				story: 5,
				uniqueness: 7,
			},
			review: `fun game! but repetitive and not very worth playing solo imo. a bit tedious but very fun with friends! amazign party game, don't bother playing alone`
		},
		{
			name: "Ape Escape: on the loose (psp remake)",
			img: 'https://m.media-amazon.com/images/I/71VlQednaDL.jpg',
			links: {
				// PSP remake, linking to the PS Plus Classics version where available.
				playstation: "https://store.playstation.com/en-us/product/UP9000-PPSA11127_00-UCUS986090000000",
			},
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 8,
				story: 8,
				uniqueness: 9,
			},
			review: `very novel game with tonnes of unique levels and the soundtrack slaps, lap 2 can be a bit tedious but doesn't hurt the game too much. all the extra mini-games are a very welcome edition tho the 30coin one is a dud and should have been either unique levels or had some other twist to them.`
		},
		{
			name: "overwatch 2",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2357570/999173ea7fa3a4541fbf036256b5c58ee0a97df0/header_alt_assets_16.jpg?t=1757964658',
			links: {
				steam: "https://store.steampowered.com/app/2357570/Overwatch_2/",
				website: "https://playoverwatch.com/en-us/",
			},
			rankings: {
				gameplay: 6,
				graphics: 8,
				audio: 7,
				story: 6,
				uniqueness: 7,
			},
			review: `very e-sports game, as a new player you can be thrown into lobies against people who have played this game for ages and just get horribly stomped to the point you can't even leave spawn. great aniamtion, a bit floaty feeling, i get the popularity but in modern day it lacks anything to make it stand out other than the characters`
		},
		{
			name: "Call Of Duty: WWII",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/476600/header.jpg?t=1751302904',
			links: {
				steam: "https://store.steampowered.com/app/476600/Call_of_Duty_WWII/",
				xbox: "https://www.xbox.com/en-US/games/store/call-of-duty-wwii/BV0NSD4NN4V4/0001",
				website: "https://www.callofduty.com/wwii",
			},
			rankings: {
				gameplay: 7,
				graphics: 9,
				audio: 7,
				story: 3,
				uniqueness: 3,
				microtransations: 2,
			},
			links: {
				steam: "https://store.steampowered.com/app/690790/DiRT_Rally_20/"
			},
			review: `the only 2 levels worth playing are the spy level and the spy mission with the train, other then that gunplay is generally tedious and doesn't offer much to really elevate the game. story is bland and some how made me not want to engauge. don't waste your time and play COD:WAW instead. it's better in every way`
		},
		{
			name: "paladins (2025)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/444090/header.jpg?t=1713560419',
			links: {
				steam: "https://store.steampowered.com/app/444090/Paladins__Champions_of_the_Realm/",
				epic: "https://store.epicgames.com/en-US/p/paladins",
				website: "https://www.hirezstudios.com/",
			},
			rankings: {
				gameplay: 6.5,
				graphics: 7,
				audio: 6.5,
				story: 5,
				uniqueness: 6,
			},
			review: `fine game, movement feels floaty, and lacks identity, play can be fun minus some balancing issues. main issue imo is that the game really lacks identity and feel like the devs threw shit at the wall to see what can stick.`
		},
		{
			name: "Five nights at freddies: ruin (dlc)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1924720/header.jpg?t=1690268396',
			links: {
				// DLC for Security Breach
				steam: "https://store.steampowered.com/app/1924720/Five_Nights_at_Freddys_Security_Breach_Ruin/",
			},
			rankings: {
				gameplay: 6,
				graphics: 9,
				audio: 8,
				story: 8,
				uniqueness: 8,
			},
			review: 'mechanics are boring and tedious, however the art, characters, environment make this a really fun experience. if you enjoy linear horror experiences this does it pretty well'
		},
		{
			name: "Five nights at freddies: security breach",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/747660/header.jpg?t=1686587905',
			links: {
				steam: "https://store.steampowered.com/app/747660/Five_Nights_at_Freddys_Security_Breach/",
				playstation: "https://store.playstation.com/en-us/product/UP4263-PPSA02102_00-FNAFSECBREACH001",
			},
			rankings: {
				gameplay: 7,
				graphics: 6,
				audio: 7.5,
				story: 6,
				uniqueness: 7.5,
			},
			review: 'game is buggy and story is flawed, however the concept is novel and still fun enough i consider it worth a play [roxy my queen <3]'
		},
		{
			name: "dark souls 3",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/374320/header.jpg?t=1748630784',
			links: {
				steam: "https://store.steampowered.com/app/374320/DARK_SOULS_III/",
				xbox: "https://www.xbox.com/en-US/games/store/dark-souls-iii-deluxe-edition/C23CWXL81H3L/0001",
				playstation: "https://store.playstation.com/en-us/product/UP0700-CUSA03388_00-DARKSOULS3000000",
				website: "https://www.bandainamcoent.com/games/dark-souls-iii",
			},
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 9,
				story: 6.5,
				uniqueness: 9,
			},
			review: 'player machanics are repitive but all the bosses and unique characters make the game greatly worth playing. net reg is horrible, turn off your systems internet before playing.'
		},
		{
			name: "SAS:4 zombie assault",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/678800/header.jpg?t=1680706586',
			links: {
				steam: "https://store.steampowered.com/app/678800/SAS_Zombie_Assault_4/",
				playstore: "https://play.google.com/store/apps/details?id=com.ninjakiwi.sasza4&hl=en_US",
				website: "https://ninjakiwi.com/",
			},
			rankings: {
				gameplay: 8,
				graphics: 7,
				audio: 6,
				story: 6.5,
				uniqueness: 6.5,
			},
			review: `fun game! short and sweet, wouldn't consider it a longterm-play game, but a fun flashgame flashback :3`
		},
		{
			name: "titanfall 2",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1237970/header.jpg?t=1726160226',
			links: {
				steam: "https://store.steampowered.com/app/1237970/Titanfall_2/",
				playstation: "https://store.playstation.com/en-us/product/UP0006-CUSA04027_00-TITANFALL2RSPWN1",
				xbox: "https://www.xbox.com/en-US/games/store/titanfall-2/C0X2HNVH08FB/0001",
				website: "https://www.ea.com/games/titanfall/titanfall-2",
			},
			rankings: {
				gameplay: 8,
				graphics: 9,
				audio: 7,
				story: 8,
				uniqueness: 10,
			},
			review: `a great game, mechanics can be a bit repetitive and story feels a bit over hyped, multiplayer was fun when not getting stomped. worth a play, but but the whole experience leaves me feeling like it's missing something`
		},
		{
			name: "sonic: generations",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71340/header.jpg?t=1704380608',
			links: {
				steam: "https://store.steampowered.com/app/71340/Sonic_Generations_Collection/",
			},
			rankings: {
				gameplay: 7,
				graphics: 8,
				audio: 7,
				story: 6,
				uniqueness: 5,
			},
			review: 'fun game, but it neruters a good chunk of the songs and levels they took from. story also falls flat. other levels which have been forced to play in a different style feel forced and makes the levels feel more tedious then they need to be. it`s a fine game but could have been much better. use to to find what levels you like then play the game those levels come from'
		},
		{
			name: "sonic: cd (american version)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/200940/header.jpg?t=1653084020',
			links: {
				steam: "https://store.steampowered.com/app/200940/Sonic_CD/",
			},
			rankings: {
				gameplay: 8,
				graphics: 9,
				audio: 7,
				story: 7,
				uniqueness: 8,
			},
			review: `fun with unique levels that dont stick around for too much, bosses are very unique but the final feel a bit wrong. the USA music also feels like a downgrade compared to the european upgrade.`
		},
		{
			name: "sonic: forces (switch version)",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/637100/header.jpg?t=1721835292',
			links: {
				steam: "https://store.steampowered.com/app/637100/Sonic_Forces/",
				nintendo: "https://www.nintendo.com/us/store/products/sonic-forces-switch/",
				playstation: "https://store.playstation.com/en-us/product/UP1613-PPSA07358_00-THUMPERPS5000000",
				xbox: "https://www.xbox.com/en-CA/games/store/sonic-forces-digital-standard-edition/c4k9sqc799zg"
			},
			rankings: {
				gameplay: 6.5,
				graphics: 7,
				audio: 6.5,
				story: 6,
				uniqueness: 6,
			},
			review: 'game feels like an autoscroller and lacks much input from the player. on the switch it dipped below playable framerates making the game studdery. assuming frame issues are gone the game is fine but nothing remarkable and overall inoffensive. a bit bland, but if it is your first sonic game its not the worst place to start'
		},
		{
			name: "thumper",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/356400/header.jpg?t=1677622045',
			links: {
				steam: "https://store.steampowered.com/app/356400/Thumper/",
				playstore: "https://play.google.com/store/apps/details?id=com.Drool.ThumperPocketEdition",
				playstation: "https://store.playstation.com/en-us/product/UP1613-CUSA03577_00-THUMPERPS4FULL00",
				nintendo: "https://www.nintendo.com/us/store/products/thumper-switch/",
				website: "http://thumpergame.com/",
			},
			rankings: {
				gameplay: 7,
				graphics: 6,
				audio: 8,
				uniqueness: 9,
			},
			review: 'fun rythem game, the main issue is the music and visuals can be a touch repetitive so more diversity in the sound scape would be nice'
		},
		{
			name: "lethal company",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1966720/header.jpg?t=1750273815',
			links: {
				steam: "https://store.steampowered.com/app/1966720/Lethal_Company/",
				youtube: "https://www.youtube.com/channel/UCpM_c956nrR6sBkRK122Biw",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 8,
				story: 7,
				uniqueness: 8,
			},
			review: 'fun game, style is neat but there are some clear animation issues i personally find distracting but considering that is my major issue it shuold tell you how fun the game is. solo can be bs but it is a great party game. wish mod could be a bit dependant on the server but that is a hyper minimal complaint'
		},
		{
			name: "battle bit: remastered",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/671860/header.jpg?t=1730393449',
			links: {
				steam: "https://store.steampowered.com/app/671860/BattleBit_Remastered/",
				youtube: "https://www.youtube.com/mrokidoki0",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 6,
				uniqueness: 8,
			},
			review: 'fun game, issues is that guns you unlock later are clearly better and classes feel unbalanced. nightlevels are also fun but people never vote for them so do not expect to play them'
		},
		{
			name: "pilgrim",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2965660/header.jpg?t=1724085112',
			links: {
				steam: "https://store.steampowered.com/app/2965660/Pilgrim/",
				website: "https://www.desperatemeasuresgames.com/",
			},
			rankings: {
				gameplay: 7,
				graphics: 7,
				audio: 6,
				story: 6,
				uniqueness: 8,
			},
			review: 'NOTE: REVIEW FROM JULY 2024 <br> fun "extration co-op" game that is similar to lethal company, when i played it was fun for a solid 4 hours, however it felt pertty repetitive after that. '
		},
		{
			name: "granny",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/962400/header.jpg?t=1687541775',
			links: {
				playstore: "https://play.google.com/store/search?q=granny&c=apps",
				steam: "https://store.steampowered.com/app/962400/Granny/",
			},
			rankings: {
				gameplay: 8,
				graphics: 7,
				audio: 6,
				story: 7,
				uniqueness: 7.5,
			},
			review: 'solid game that plays like a fun puzzle game, some communication can be unclear and a thing with 2 chests feels like bs unless i missed something. overall pretty fun and novel so i would say it is worth a play'
		},
		{
			name: "it steals",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1349060/header.jpg?t=1667091081',
			links: {
				itch: "https://zeekerss.itch.io/it-steals",
				steam: "https://store.steampowered.com/app/1349060/It_Steals/",
			},
			rankings: {
				gameplay: 9,
				graphics: 9,
				audio: 8,
				story: 5,
				uniqueness: 8,
			},
			review: 'a great game with a great new game plus that properly challanges the player, great play!'
		},
		{
			name: "five nights at freddy's",
			img: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/319510/header.jpg?t=1666889251',
			links: {
				steam: "https://store.steampowered.com/app/319510/Five_Nights_at_Freddys/",
				playstore: "https://play.google.com/store/search?q=five+nights+at+freddies&c=apps",
			},
			rankings: {
				gameplay: 6.5,
				graphics: 7.5,
				audio: 6,
				story: 6,
				uniqueness: 10,
			},
			review: 'a unique setting and playstyle, tho it can be a touch repetitive. characters are well designed and icon, with tonnes of fun rng based easter eggs'
		}
	];

export default reviews;
