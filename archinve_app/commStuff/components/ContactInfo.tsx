"use client";

import { useState } from "react";

//imported functions
import AppendToUrl from "@/lib/AppendToUrl";
import UpdateUrlValue from "@/lib/UpdateUrlValue";

function QuickInput(
  type: string,
  placeholder: string,
  value: string,
  onChange: (event: any) => void,
) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="text-black"
    />
  );
}

//comment for git commit
//comment for git commit 2, electic boogaloosh

//AppendToUrl(key, value, debug?)

export default function ContactInfoForm() {
  //variables for form & respective event handlers
  const [email, setEmail] = useState("");
  const emailChange = (event: any) => {
    setEmail(event.target.value);
    UpdateUrlValue("em", email);
  };
  const [uName, setUName] = useState("");
  const uNameChange = (event: any) => {
    setUName(event.target.value);
    UpdateUrlValue("un", uName);
  };
  const [fName, setFName] = useState("");
  const fNameChange = (event: any) => {
    setFName(event.target.value);
    UpdateUrlValue("fn", fName);
  };
  const [mName, setMName] = useState("");
  const mNameChange = (event: any) => {
    setMName(event.target.value);
    UpdateUrlValue("mn", mName);
  };
  const [lName, setLName] = useState("");
  const lNameChange = (event: any) => {
    setLName(event.target.value);
    UpdateUrlValue("ln", lName);
  };

  return (
    <div className="">
      <h3 className="text-xl"> contact info </h3>
      <h6 className="text-gray-500">
        in the username slot, whatever you put is how i will refer to you
      </h6>
      <br />
      {QuickInput("email", "example@domain.com", email, emailChange)}
      <br />
      {QuickInput("text", "Carrots", uName, uNameChange)}
      <br />
      {QuickInput("text", "Judy", fName, fNameChange)}
      <br />
      {QuickInput("text", "H.", mName, mNameChange)}
      <br />
      {QuickInput("text", "Hops", lName, lNameChange)}
      <p>
        {`if you are uncomfortable filling it out here please just enter something
        obviously fake and i'll omit it, tho i believe with a paypal transfer it
        will be shown their`}
      </p>
    </div>
  );
}
