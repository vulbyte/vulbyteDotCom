import React, { useState } from "react";

import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(/*SERVER INFORMATION GOES HERE*/);

const MessageBox = () => {
  //   const [inputValue, setInputValue] = useState("");
  //
  //   const handleInputChange = (event: any) => {
  //     setInputValue(event.target.value);
  //   };
  //
  //   const handleAssessment = async () => {
  //     console.log("Assessed Variable:", inputValue);
  //     // You can perform any assessments or operations on 'inputValue' here
  //     const { data, error } = await supabase
  //       .from("testTable")
  //       .insert({ message: inputValue });
  //     //.select();
  //   };

  return (
    <div>
      <label htmlFor="textInput">Enter Text: </label>
      <input type="text" id="textInput" className="text-black" />
      <button
        className="m-2 pl-2 pr-2 text-black bg-white rounded-md"
        //onClick={/*handleAssessment*/}
      >
        {" "}
        submit{" "}
      </button>
    </div>
  );
};

export default MessageBox;
