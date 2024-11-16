// TODO: fix links here

import Navbar from "@/components/navbar";

export default function Scripts() {
  return (
    <div>
      <Navbar />
      <br />
      <h1 className="text-3xl"> {` this is the script page `} </h1>
      <p>
        {`
        this is where i store and save things (the scripts and whatever i make), 
        i post them publicly because it's primarily easier for me,
        `}
        <br />
        <br />

        {`
        however if it helps others due to accessibility, ease of fact checking, etc etc,
        then that's a nice bonus. `}
        <br />
        <br />
        {`
        hope you enjoy!
        `}
        <br />
        <br />
        {`
                oh btw, if you're wondering why there's gaps, those are either abandoned projects are me just being bad at documenting-
            `}
      </p>
      <hr />
      <h2> scripts: </h2>
      <ul className="p-4">
        <li>
          <a href="/projects/scripts/0024-newYears" className="text-teal">
            {`
                0024-newYears
            `}
          </a>
        </li>
        <li>
          <a href="/projects/scripts/0025-chickenLittle" className="text-teal">
            {`
                0025-chickenLittle - the lost tier of games
            `}
          </a>
        </li>
        <li>
          <a href="/projects/scripts/0025-chickenLittle" className="text-teal">
            {`
                0025-chickenLittle - the lost tier of games
            `}
          </a>
        </li>
        <li>
          <a
            href="/projects/scripts/0028-linux-zero_to_hero"
            className="text-teal"
          >
            {`
                0028-linux-zer0_to_hero
            `}
          </a>
        </li>
      </ul>
    </div>
  );
}
