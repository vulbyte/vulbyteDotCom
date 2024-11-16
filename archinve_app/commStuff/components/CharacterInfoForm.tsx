"use client";

import { useState } from "react";

export default function CharacterInfoForm() {
  function GenerateCharInfoForm(inputAmnt: number) {
    function AddCharacterForm() {
      if (inputAmnt >= 5) {
        {
          //return with a plain text input
          /* {{{1 */
        }
        return (
          <div>
            <p>
              because there is more then 5, please compile a list of the refs
              then include them here. ideally in a format similar to:
              <p>
                charA (name): <br />
                ref(s): (links) <br />
                height: <br />
                <br />
                charB (name): <br />
                ref(s): (links) <br />
                height: <br />
                <br />
                etc etc
              </p>
            </p>
            <input type="text" />
          </div>
        );
        {
          /* }}}1 */
        }
      }
      return (
        <div>
          <input type="text" placeholder="name" className="text-black" />
          <br />
          <input type="url" placeholder="ref" className="text-black" />
          <br />
          <input type="height" placeholder="name" className="text-black" />
          <br />
        </div>
      );
    }

    let index = inputAmnt;
    while (index > 0) {
      index--;
    }
    return (
      <div>
        <p> please enter the information for each character </p>
        <AddCharacterForm />
      </div>
    );
  }

  const [rangeValue, setRangeValue] = useState(1); //default value
  const handleRangeChange = (event: any) => {
    const newValue = event.target.value;
    setRangeValue(newValue);
  };

  return (
    <div>
      <h3> character(s) info</h3>
      <h6 className="text-gray-500">
        this is general, thing, more questions will be enquired later
      </h6>
      <div>
        <p> how many characters? </p>
        <input
          type="range"
          min="0"
          max="10"
          value={rangeValue}
          onChange={handleRangeChange}
        />
        <p>selected value: {String(rangeValue) == "10" ? "10+" : rangeValue}</p>
        <br />
        {GenerateCharInfoForm(rangeValue)}
      </div>
    </div>
  );
}
