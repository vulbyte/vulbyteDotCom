"use client";

import Navbar from "@/components/navbar";
import DBAccessTest from "./dbAccessTest";
import MessageBox from "./sendMessage";

export default function Test() {
  return (
    <div>
      <Navbar />
      <p>example</p>

      {/*DBAccessTest("testTable")*/}
      <MessageBox />
    </div>
  );
}
