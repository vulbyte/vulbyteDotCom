//import "./chickenLittle.css";
import Navbar from "@/components/navbar";

const textShadowValues = [
  "#ff0 0.08rem 0.08rem 0.03rem",
  "#ff0 -0.08rem 0.08rem 0.03rem",
  "#ff0 0.08rem -0.08rem 0.03rem",
  "#ff0 -0.08rem -0.08rem 0.03rem",

  "#ff0 0.0rem 0.1rem 0.03rem",
  "#ff0 0.1rem 0.0rem 0.03rem",
  "#ff0 0.0rem -0.1rem 0.03rem",
  "#ff0 -0.1rem 0.0rem 0.0rem",
];

const cl = "chimgen little: the game";

export default function chickenLittle() {
  return (
    <div>
      <Navbar />
      <div className="max-w-[60rem] m-auto">
        <img
          src="https://cdn.akamai.steamstatic.com/steam/apps/339040/header.jpg?t=1571775013"
          alt="chicken little cover from steam"
          style={{ width: "100%" }}
        />
        <div style={{ position: "relative" }}>
          <h1
            style={{
              color: "transparent",
              position: "absolute",
              textShadow: textShadowValues.join(", "),
            }}
          >
            {cl}
          </h1>
          <h1
            style={{
              backgroundImage: "linear-gradient(-5deg, #ff0000, #ff5500)",
              backgroundClip: "text",
              color: "transparent",
              position: "absolute",
            }}
          >
            {cl}
          </h1>
        </div>
        <br />
        <br />
        <div>
          <h2> the lost tier of games </h2>
          <sub> vulbyte, 2024/02/25 </sub>
        </div>
        <hr />
        <div>
          <h3> Introduction:</h3>
          <h4> Hook </h4>
          <p>{`chicken little is a better game then most modern titles`}</p>
          <h4> Context </h4>
          <p>
            {`
              recently, on a whim we have noticed that me and bubbs have discovered that chicken little is somehow still available on steam. and this isn't a cheap remake or some knock off or even a port, this is the actual native version, and guess what?
                  it runs fine, flawless even!
            `}
          </p>
          <iframe
            className=""
            style={{
              aspectRatio: "646 / 190",
              height: "190px",
              maxHeight: "100%",
              width: "646px",
              maxWidth: "100%",
              margin: "auto",
            }}
            src="https://store.steampowered.com/widget/339040/"
          ></iframe>
          <sub className="text-zinc-400 m-auto">{`
          please note, if the above link is broken that means the game has been
          removed from steam 
          `}</sub>
        </div>
        <hr />
        <div>
          <h3> Description of the Subject: </h3>
          <h4> Overview </h4>
          <p>
            {" "}
            {`
            before we get too into the weeds, let's actually break down what this game is.
        `}{" "}
            <br />
            {`chicken little`}
            <b> {`the game`} </b>
            {`
            is a game which- 
            nonono, you know, imm a just pull an illuminautti [`}
            <a
              href="https://youtu.be/yDp3cB5fHXQ?si=kgm6JgL9T76-2Wg0&t=2579"
              target="_blank"
            >
              context
            </a>
            {`]and read the wiki
          `}
          </p>
          <p>
            {`
            Chicken Little is a 2005 action-adventure game developed by Avalanche Software for GameCube, Microsoft Windows, PlayStation 2 and Xbox and by Artificial Mind and Movement for the Game Boy Advance; both were published by Buena Vista Games. Based on the 2005 film Chicken Little, they were released in October 2005.
            Plot
            `}
            <br />
            <br />
            {`
            The game follows the same plot as the film Chicken Little. The game also features the original actors reprising their roles in the game, except for Joan Cusack (Abby) and Don Knotts (Mayor Turkey Lurkey) (who are replaced by Pamela Adlon and Jeff Bennett respectively).
            Gameplay
            `}
            <br />
            <br />
            {`
            Chicken Little is an action-adventure game. The player takes control of Chicken Little; occasionally the player is able to play as Abby, Runt, and Fish Out of Water in six different levels and Mayor Turkey Lurkey in one level. The player has to collect five baseball cards throughout each level of the game, the cards unlock special bonus mini-games in multiplayer mode.[2] 
        `}
          </p>
          <cite>
            {`from:`}
            <a
              href="https://en.wikipedia.org/wiki/Chicken_Little_(video_game)"
              target="_blank"
            >
              {`https://en.wikipedia.org/wiki/Chicken_Little_(video_game)`}
            </a>
          </cite>
          <p>{`
        and that's it, that's the whole wikipedia, holy sh*t no one cared about this game! except for me and you're about to hear me rant about it!
        `}</p>
          <h4> Specifications </h4>
          {`
            according to the above it was realeased on most major platforms in 2005 and received 6-7 out of 10, with the game being rated the highest on pc, and the lowest on ps2, the same console i attempted to beat it as a child. 
        `}
        </div>
        <hr />
        <div>
          <h3> Personal Experience or Opinion: </h3>
          <h4> First Impressions </h4>
          <p>{`
            my first experience with this game was back when i was like 12 or so. 
                my parents were nice enough to afford me a ps2 slim, which i had a few games for.

                it was so long ago i'm not certain where we got it from, i believe it was either a walmart discount bin where we got it for like 5$.
        `}</p>
          <h4> Personal Experience </h4>
          <p>{`
            after opening up the packaging up i remember eagerly putting it into the ps2 and eagerly starting it jaws agape on the old black crt, the amazing title screen of "chicken little" came up on the screen and i stared thinking this was the coolest thing
        `}</p>
          <aside>
            {`
            which was honestly funny because as a kid my parents drove around a lot, and i had chicken little in one of those car rest dvd players, but the drives were at most roughly an hour 1h 21m film
          `}
            chick
            <cite>
              [
              <a
                href="https://en.wikipedia.org/wiki/Chicken_Little_(2005_film)"
                target="_blank"
              >
                https://en.wikipedia.org/wiki/Chicken_Little_(2005_film)
              </a>
              ]
            </cite>
            {`
                so i remember only ever making it as far the scene where big click would burst out of the town hall, only for my parent who was driving me to turn off the car even though i already knew how the movie ended, 
                it was always devastating
            `}
          </aside>
          <p>
            {`
                recently, on a whim we have noticed that me and bubbs have discovered that chicken little is somehow still available on steam. and this isn't a cheap remake or some knock off or even a port, this is the actual native version, and guess what?
                it runs fine, flawless even!
            `}
          </p>
        </div>
        <hr />
        <div>
          <h3> Critical Analysis: </h3>
          <p>{`
              next, let's discuss the actual game, if you want ot play it now is your time to check it out, but considering you're had 19 years to play this i'm going to just go ahead 
          `}</p>
          <ol>
            <li>
              <details>
                <summary>late for school</summary>
                <p>{`
                    the game starts with a cute little entry section, and of the game being played wayyy to loud, followed, where you need to get to the school on the other side of the level. 
                `}</p>
                <aside>{`
                    this has a nice intro section teaching you the basic mechanics with ANNOYING POPUS for a tutorial, but thankfully the game only really has a handful of these, and the vast majority of the annoying ones are in this level,

                `}</aside>
                <p>{`
                    after making your way through the grassy hills, you arrive at the school where you need to run around the outside to collect 20¢ worth of pennies to eventually buy a soda and launch yourself into the school, ending the level.
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary> dodge-ball hall </summary>
                <p>{`
                    after launching in through and landing in a mop bucket, the player then navigates through a subway surfer section until they crash through the doors into the gym where there's now a minigame of playing dodgeball.
                `}</p>
                <aside>{`
                    and honestly, the dodgeball section is great, it's not a very complicated section and it definently lacks some polish and iterations that would make it better for longterm play. however because you'll only be doing this for a maximum of 5 times (assuming you're competent) 
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary> goosey chase </summary>
                <p>{`
                    after the dodge-ball game, you're then chanced back through the hall that you just came from with loosey goosey chasing you occasionally throwing dodge-balls at you
              `}</p>
                <aside>{`
                    and holy shit they're insane and f*gin insane and snipe you far too consistently, and i have only found a very very specific movement which was defiantly something that me as a kid would have definantly have rage quitted on.
              `}</aside>
                <p>{`
                    then after making it to the end, it kinda awkwardly cuts to the scene of them in the car talking about how little wants to try baseball
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary> uniform hunt </summary>
                <p>{`
                    this mission starts with you in a dingy back ally after foxy fox held chicken little at gunpoint.  
                    this is a relatively straight forward mission where you unlock the ability to grapple.
                    After making your way from the ally to the town square it then opens up and after you make it to the town square it then opens up and let's you get the rest in any order you prefer.
                    And once you manage to find your uniform your simply head to the field and the level ends. 
                `}</p>
                <aside>{`
                    this level is relatively cute, a simple platforming level that's multi ended and allows for players to sorta take their own path and is a nice section. and is probably one of if not my favorite level
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary> batting practice </summary>
                <aside>{`
                    the next level is basically a part 1 and part 2
                `}</aside>
                <p>{`
                    the level is essentially a level where it's a guitar hero esc section followed by a timing event. this level serves as purely practice for the "main game", 
                    which will let vary on what type of hit you get based how many notes you hit, making the timing at the end easier based on how many you hit. getting various scores based on how well you do, such as a single, double, triple, or if you nail it, a home run.
                    this level is semi unique, as it's basically the only level with a player defined end, letting the player practice as much as they want before you carry on to the big game
               `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>the big game</summary>
                <p>{`
                    after doing the practice, you'll move onto the big game where you make it through a half baked game of baseball,                 
                `}</p>
                <aside>{`
                    though if you're baller like me you'll get a home run on the first hit and end the game early 
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>carpool craze</summary>
                <p>{`
                    after that, following in step with the movie the "sky falls" and the others are called, and this is one of the big asides from the show, because then is when chicken runt steals a car and the whole thing turns into fast and the furious.
                    It has you running some side quests before moving eventually arriving at big clucks house
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>backyard pursuit</summary>
                <p>{`
                after fish is abducted, you unlock the power attack, which is basically the new attack you'll permanently be using after just saves a lot of time and has a large aoe.
                    This level is a great little platforming level that has you chasing after fish, eventually arriving at the ship. This one is just like the "uniform hunt" level mechanically, having you chase the fish, but adding some pipe sliding sections
                `}</p>
                <aside>{`
                    one thing that genuinely blew me away which is such a minor thing is how the textures are in this area, this area is in my opinion the most beautiful level. and considering this was a ps2 game, if you have an idea how these textures would have been to do before things liek substance designer just makes this a great stylized level that may in my opinion be the highlight of the game
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>space simulator</summary>
                <aside>{` 
                    this is where the game both takes a step away from the movie and in my opinion a dip in fun;
                    no offense if you enjoy these sections, but you have bad taste (jk, jk, no jk, jk, seek help, jk)
                `}</aside>
                <p>{`
                    This is a pseudo star-fox clone, which is honestly a little fun, you can collect different weapons that last for a bit, and you have an alt fire where you can fire missiles and stuff.
                    `}</p>
                <aside>{`
                    i don't want to get this too caught up right now, so i'll talk more about this later 
                    `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>alien abby</summary>
                <aside>{`
                    this level is awesome because you get a genuinely nice mix up. and what makes it great is that you now get to play as abby. this change is largely cosmetic but it's great to see the game letting you actually play as another character without just being a cheap level
                `}</aside>
                <i> {`flash ahead to runts escape`}</i>
                <p>{`
                    this level takes place with you as the player navigating through the ship after infiltrating it, 
                `}</p>
                <aside>{`
                    this making it the second time the game branches from the main story, making it so that all the characters got separated instead of just looking for fish
                `}</aside>
                <p>{`
                    but is relatively nice being a fun 3d platforming section with some fun little timed challenges mixed in
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>runaway rust</summary>
                <p>{`
                    this is where there's another nice mix up, you the player getting to play around with one of those alien suits to make it through the ship.
                    this is one of those tank sections but i won't complain about more game
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>space alarm</summary>
                <p>{`
                    this now has you navigating through the ship once again as chicken little! there's some nice little mix ups, some tedium as it's similar to alien abby. but i won't be upset as this is the last level
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>space simulator II</summary>
                <p>{`
                    this game is one those top-down scroller shooter rai-den arcade game, it's rather similar to the first, but it's a nice mix up where it mixes up the gameplay from the last but i don't mind it at all
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>tube surf</summary>
                <p>
                  {`
                    this is where you then cut to whatever fish was up-to.
                    this is when you play 
                `}
                  <a href="https://apple.fandom.com/wiki/IPod_Games">{`
                    vortex
                  `}</a>
                  {`
                    for the iPod classic 3rd gen
                `}
                </p>
              </details>
            </li>
            <li>
              <details>
                <summary>cornfield escape</summary>
                <p>{`
                    after escaping the ship, abby run and fish are standing in the baseball field where they entered the ship, and
                `}</p>
                <aside>{`
                    they were just STANDING IN THE FIELD LIKE A BUNCH OF IDI-
                    after grabbing them all, they then all just fuck off again and
                `}</aside>
                <p>{`
                    and you need to gather them again
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>cannon chaos</summary>
                <p>{`
                    after getting them all again and escaping, then what ends happening
                `}</p>
                <aside>{`
                    is the most batshit thing of this entire game the turkey takes to a truck with a fucking spirit tracks esc canon in the bed and andyou're just single handedly meant to deal with with a cluster of ships because *sure why not*
                `}</aside>
                <p>{`
                    you take out something like 15 ships then the level ends.
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>firetruck frenzy</summary>
                <p>{`
                    suddenly you witness runt hotwire a firetruck and then there's another firetruck level,
                    but this time instead of running a bunch of errands you instead are chasing after this ship having to pass through each one of these rings to gain time and not... 
                    have something i'm sure undesirable happen.
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>tube tumble</summary>
                <p>{`
                    after you get to the mother ship,               
                `}</p>
                <aside>{`
                    i can finally see past the part i was constantly clucked by 
                `}</aside>
                <p>{`
                    and end up in this runt section which has a weird difficulty spike, but this might just be a hard mode difficulty spike. this is just the fish section again but you get the idea. same compliments and complaints.
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>alien little</summary>
                <p>{`
                    and after runt being saved, we're now in a ship where-
                `}</p>
                <aside>{`
                    hold on a second, this is the same level as before!
                    the same one with already did as chicken little and happy with some small changes!
                    this isn't anything atrocious, but it sorta puts a damper on the whole thing. 
                    but what have you, this isn't a big deal. i'm sure the budget was tight and-
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>gravity grab</summary>
                <aside>{`
                    OH GODDAMIT, see i was super into the idea of more coming, but this is just the previous chicken little level again! whatever, this is basically the end of game, probably the last level so let's just-
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>space simulator III</summary>
                <aside>{`
                    ANOTHER STARFOX LEVEL?!    
                    whatever, i guess it's fine, least this level is new from the ground up. a bit repetitive but whatever, at least this has to be the end
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>final boss</summary>
                <aside>{`
                    oh god another fuc-
                    wait hold on, this is a new level? a boss battle? that is unique to this game? 
                    damn this is actually nice
                `}</aside>
                <p>{`
                    this boss requires you dodging and or baiting attacks, hitting a trigger to make a weak point appear, that you can then wail, after three phases you then win.
                `}</p>
                <aside>{`
                    well you know what, that was interesting end, you know it's not the best but it's fine, and a solid end to the game, it's a neat touch where-
                `}</aside>
              </details>
            </li>
            <li>
              <details>
                <summary>runts escape</summary>
                <aside>{`
                    hold on, why is there anoth-...
                    THIS IS A RUNT LEVEL!?
                    holy shit another runt level!
                    why are we doing this?!
                `}</aside>
                <p>{`
                    okay, well, whatever, same as the previous runt level and the fish level. 
                    it's boring but whatever
                `}</p>
              </details>
            </li>
            <li>
              <details>
                <summary>space armada</summary>
                <aside>{`
                    NOW WE'RE DOING ANOTHER SPACE LEVEL AGAIN?! THIS IS THE 4TH ONE OF 24 LEVELS! THAT MEANS 1/5TH OF THIS GAME IS WANNABE STARFOX, 
                    
                okay, remember before when i said that i would talk more about my issue with these levels? 

                well my issue with this section is that they [avalanche studio] has this cloned star-fox,                 
                this is one of those moments where they did something, but somewhat missed what makes it fun. 
                what was fun about starfox and helped make it a lot more engaging was the little bonuses and the secret paths/levels.
                i don't think this level is that bad, but i don't think it's something what should have over 10% of the games levels designated too.
                this isn't a section where i feel overpowered as a vitory lap, 
                this is just a sorta another level which i guess ties into the game, but outside the remoddled ship and new level this feels like a drag and like it should have ended 4 levels ago

                but thankfully, this is the last level.
                `}</aside>
              </details>
            </li>
          </ol>
        </div>
        <hr />
        <div>
          <h3> Pros and Cons: </h3>
          <h4> Strengths (Pros) </h4>
          <ul>
            <li>
              <h5> the game is fun? </h5>
              <p>{`
                one thing that was genuinely shocking about this game for me was that this game was genuinely fun genuinely! 
              `}</p>
            </li>
            <li>
              <h5> stable </h5>
              <p>{`
                this game is schockingly solid, relitively bug less, and is very consistent, expecally compared to the current market of games is (cyberpunk footage here)
                `}</p>
            </li>
            <li>
              <p>{`
                it also had a nice range of mechanics that made the game feel a lot less repetitive and interesting
                `}</p>
            </li>
          </ul>
          <h4> Weaknesses (Cons) </h4>
          <ul>
            <li>
              <h5> the graphics are dated </h5>
              <p>{`
                now i don't want to sound like a dingle, but i will say the graphics are rather dated. and this isn't a "i don't like the style" way, but more a "this was published in 2005 and i can see it". that being said i don't want to make it seem like i'm hating on them, given my limited knowledge of graphics programming, and how  
                `}</p>
              <cite>
                <a
                  href="https://en.wikipedia.org/wiki/PlayStation_2_technical_specifications#:~:text=The%20sixth%2Dgeneration%20hardware%20of,299%20MHz%20in%20later%20consoles)."
                  target="_blank"
                >
                  {`
                the ps2 had a clockspeed of ~295MHz and about 32mb of ram
                  `}
                </a>
              </cite>
              <p>{`
                this is extremely understandable. can you even download a phone app that isn't at least 30mb now? at least one that isn't a "lite" version or a glorified web wrapper
              `}</p>
            </li>
            <li>
              <h5>
                the cuts between the story and gameplay are rather jarring
              </h5>
              <p>{`
                speaking of graphics i find it rather jarring how the cuts between the movie, and the game are. 
                i'm not trying to be rude when i say this, but when i play the game, i can get immersed in the less ideal graphics. 
                the issue though is then i have these cuts between the movie and the in game animations it is VERY jarring to me, and makes me commonly comment how stark i feel the difference is.
                again, i think the game looks great but with the contrast in how the a prerendered movie is vs an either real time or in game cinematic is, it's rather jarring and i sorta with they would have done the whole thing in game. but i understand budget and time constrains probably wouldn't allow that.
              `}</p>
            </li>
            <li>
              <h5> the game has its repetitive moments </h5>
              <p>{`
                this is a thing that is rather rad to say, but the game really felt like crunch was hitting near the end, as the finale platformer is effectively a repeat of only a few levels earlier.
                which really made the last level feel much more like a victory lap then a proper level.
              `}</p>
            </li>
            <li>
              <h5> the game changes the story of chicken little </h5>
              <p>{`
                another issue i have with the game is they change a good chunk of the story and how it goes, and i'm generally not opposed to things being changed; however in this case it feels like it was to simply hold the game together and add more levels. and i completely understand why they did this, however but i don't personally think the story benefits from the changes, and some of the major off branches from the story are some of my more tedious and less favorable levels.
              `}</p>
            </li>
          </ul>
        </div>
        {/*<div>
          <h3> Comparisons: </h3>
          <h4> Benchmarking </h4>
          <h4> Alternatives </h4>
        </div>*/}
        <hr />
        <div>
          <h3> Audience Considerations: </h3>
          <h4> Target Audience </h4>
          <h4> Accessibility </h4>
        </div>
        <hr />
        <div>
          <h3> Supporting Evidence: </h3>
          <h4> Examples </h4>
          <h4> Quotes </h4>
        </div>
        <hr />
        <div>
          <h3> Conclusion: </h3>
          <h4>Summary</h4>
          <h4>Recommendation</h4>
        </div>
        <hr />
        <div>
          <h3>Closing Thoughts:</h3>
          <h4>Final Impressions</h4>
          <h4> Call to Action</h4>
        </div>
      </div>
    </div>
  );
}
