"use client";

import Navbar from "@/components/navbar";

import { createClient } from "@supabase/supabase-js";

import { useState } from "react";

//const supabase = createClient(/*account, anon key*/);

export default function Account() {
  const [userName, setUserName] = useState("username");
  /*

  const updateValues = async () => {
    console.log("updating user values");
    const { data, error } = await supabase
      .from("testTable")
      .insert({ message: inputValue });
  };
*/

  return (
    <div>
      <Navbar />
      <br />
      <p>account page</p>
      <input type="text" value={userName} />
    </div>
  );
}
