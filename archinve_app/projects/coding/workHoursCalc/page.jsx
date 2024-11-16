"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar";
import { useState } from "react";

//var assert = require('assert');

export default function WorkHoursCalc() {

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [hours, setHours] = useState("");

    function CalcHours(startTime, endTime, breakTime) {
        setHours(
            "total = " + (endTime-startTime-breakTime)*24 + "\n",
        );
    }

  return (
    <div>
      <Navbar />
      <br/>
      <br/>
      <div style={{margin:"auto"}}>
          <h1> work hour calculator </h1>
          <details style={{maxWidth:"60em", margin:"auto",}} ><summary> THING TO NOTE: </summary>
          <ol> 
              <li>
                  {`simply enter your time without any special characters and have it returned to you. \n`}
              </li>
              <li>
                  {` hours that roll over midnight don't work, and this does not support special characters. \n`}
              </li>
              <li>
                  {`only military times work, as 9am and 9pm are impossible to tell appart without context`}
              </li>
      {/*<li>
                {`if start time is before noon, and end time is less than the start time, end time will be +1200 to try be helpful`}
              </li>*/}
          </ol>
          </details>
          <div>
              <div>
                  <input
                  style={{padding:"0.5em", margin:"0.5em"}}
                  placeholder="Start Time (HHmm)"
                  onChange={(e) => setStartTime((e.target.value)/2400%60)}
                  />
                  <input
                  style={{padding:"0.5em", margin:"0.5em"}}
                  placeholder="End Time (HHmm)"
                  onChange={(e) => {
                    setEndTime((e.target.value)/2400%60)}
                  }
                  />
                  <input
                  style={{padding:"0.5em", margin:"0.5em"}}
                  placeholder="Break Time (as a decimal of 1 hr (ie 30min = 0.5))"
                  onChange={(e) => setBreakTime((e.target.value)/2400)}
                  />
                  <button style={{backgroundColor:"blue", padding:"0.5em"}}
                    onClick={
                        (() => setHours(
                        "total = " + Math.round(((endTime-startTime-breakTime)%60)*4*24)/4 + "\n",
                        ))
                    }>
                    Submit
                  </button>
              </div>
              <div>
                <p>
                  {`
                    startTime normalized: ${startTime} \n
                    aka: ${(startTime *24) <= 1300 ? (startTime*2400 + "am") : (startTime*2400-1200 + "pm")}
                  `}
                </p>
                <p>
                  {`
                    endTime normalized: ${endTime} \n 
                    aka: ${(endTime *24) >= 1300 ? (endTime*2400 + "am") : (endTime*2400-1200 + "pm")}
                  `}
                </p>
                <p>
                    breakTime normalized: {breakTime} aka: {breakTime *2400}hr(s)
                </p> 
              </div>
          </div>
          <div>Result: {hours} hours</div>
      </div>
      <Footer />
    </div>
  );
}

