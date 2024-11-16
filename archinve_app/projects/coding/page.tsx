// TODO: center linksuntil then f

"use client";

import Navbar from "@/components/navbar";
import MostPopularMK8Character from "./mk8dxCharCounter/page";

export default function Projects() {
  return (
    <div>
      <Navbar />
      projects page
      <br />
      <ul>
        <li>
          <a href="/projects/coding/mk8dxCharCounter"> mk8dxCharCounter </a>
        </li>
        <li>
          <a href="/projects/coding/iDontWantSex"> iDontWantSexIWantMinions </a>
        </li>
        <li>
          <a href="/projects/coding/workHoursCalc"> workHoursCalc </a>
        </li>
      </ul>
    </div>
  );
}
