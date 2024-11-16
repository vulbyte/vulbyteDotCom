// TODO: fix scaling when fullscreened

import Navbar from "@/components/navbar";

import "./checkerGrid.css";

export default function IWantMinions() {
  const guesses = [
    "free space",
    "popular / cliche music",
    "there's a new character because sequal",
    "all was good until...",
    "minions are ~30% of the ad",
    "is hiding being bad from wifu",
    "repeating a previously done plotline",
    "hahaha fart joke (tldr potty humor)",
    "character thought to be dead is back",
    "pandering to meme culture",
    "big actor is x",
    "ends with TITLE like it's a surprise dispite being the 4th part",
    "main character is slightly different to show they have aged (but not in a way like hair or wrinkles, just a new scarf or some shit)",
    "love / attention triangle",
    "joke characters ruin any tension",
    "rapid cut away from a moment for a joke",
    "nostolgia pandering (bringing something back and showing it off for hype",
    "previous events are mostly / completely ignored minus characters being around",
    "minions screaming / slapstick at studio advertisement / banner",
    "no notiable changes to the enviornment because reasons",
    "clear toy bait (buy my marketable plushie)",
    "some previous big characters (like a lost brother) are now just missing again",
    "annoying pop culture reference (omg is that talletless hack simon coward from the x factor!!?!?!)",
    "fladerization of characters",
    "young character being obsessed with social media / self image",
  ];

  function shuffle(array: string[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  shuffle(guesses);

  let row = "";

  for (let i = 1; i <= 25; i++) {
    if (i % 5 == 0) {
      console.log("ROW:" + row);
      row = "";
    }
    row += i + guesses[i - 1];
  }

  const minionBingo = guesses.map((value) => {
    return (
      <div key={value} className="checkerGrid">
        {value}
        <br />
        <input type="checkbox" />
      </div>
    );
  });

  return (
    <div>
      <Navbar />
      <p className="w-[80%] m-auto">{`
        this is a joke thing that i made in like 15 minutes when talking to a friend. it's a quick little bingo card that was meant to joking poke fun at he dispicable me 4 trailer. tho sadly this can probably be applied to a lot more then just the minions lol
      `}</p>
      <div className="m-auto w-[80%]">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/qQlr9-rF32A?si=cT6_IpMzdKDUBZno"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; 
        autoplay; 
        clipboard-write; 
        encrypted-media; gyroscope; 
        picture-in-picture; web-share"
        ></iframe>
        <br />
        <p>{`the grid is also randomly refreshed every page reload, try it out!`}</p>
      </div>
      <div className="gridContainer text-white grid grid-cols-5">
        {minionBingo}
      </div>
      <p>{`
        please note, the grid matching the colors of gru's scarf was dumb luck, but it works so i'm keeping it anyways.
      `}</p>
      <br />
    </div>
  );
}
