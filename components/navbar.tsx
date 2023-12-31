//nextjs flag of where to render
"use client";

//assets
import Image from "next/image";
import vulbyteLogo from "../public/vulbyteIcon.svg";
import vulbyteWordmark from "../public/vulbyteWordmark.svg";
//scripts
import "./Navbar.css";
import UpdateNavbarBackgroundSize from "./navbarFunctions/UpdateNavbarBackgroundSize";
import UpdateNavbarBackgroundStyle from "./navbarFunctions/UpdateNavbarBgStyle";
import GetDate from "@/lib/GetDate"; //return options are y, m, d, or ymd
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  //INIT VARS
  const navbarRef = useRef(null);
  const navbarBgRef = useRef(null);
  let [navbarBgSize, setNavbarBgSize] = useState([0, 0, 0, 0]);
  let [navbarBg, setNavbarBg] = useState(
    "linear-gradient(-44deg, red, orange, yellow, green, cyan, blue, purple, magenta, red) !important",
  );

  //EFFECTS

  //
  useEffect(() => {
    console.log("navbarRef: ", navbarRef.current?.getBoundingClientRect());
    UpdateNavbarBackgroundSize(navbarRef, setNavbarBgSize);

    UpdateNavbarBackgroundStyle(setNavbarBg);
  }, [navbarRef]);

  // when the window updates
  useEffect(() => {
    const handleResize = () => {
      //console.log("window resized");
      UpdateNavbarBackgroundStyle(setNavbarBg);
      UpdateNavbarBackgroundSize(navbarRef, setNavbarBgSize);
    };

    window.addEventListener("resize", handleResize);

    //cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navbarBgRef, navbarRef]);

  //the html to be returned
  return (
    <div>
      {/*rgb background below*/}
      <div
        id="navbarBackground"
        style={{
          position: "absolute",
          top: `${Number(navbarBgSize[0])}`,
          height: `${Number(navbarBgSize[3]) - Number(navbarBgSize[0])}px`,
          width: `${Number(navbarBgSize[2]) - Number(navbarBgSize[1])}px`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          //backgroundImage: navbarBg,
          backgroundImage: navbarBg,
        }}
        className="NavbarBackground w-screen top-0 z-0 flex-row "
        ref={navbarBgRef}
      ></div>

      {/*navbar below*/}
      <nav
        id="navbar"
        style={{
          position: "absolute",
          top: `${navbarBgSize[0]}px`,
          width: "100%",
        }}
        ref={navbarRef}
      >
        {/*navbar below*/}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            zIndex: "5",
          }}
          className="relative z-10"
        >
          {/*logo below*/}
          <div
            className="bg-white align-middle w-48 rounded-r-md"
            style={{
              position: "relative",
              maxHeight: "100%",
            }}
          >
            <div
              className="bg-black text-white rounded-r-md left-0 h-6"
              style={{
                position: "relative",
                width: "90%",
                height: "100%",
                maxHeight: "100%",
              }}
            >
              <a
                href="/"
                className="flex justify-items-end"
                style={{ height: "100%", maxHeight: "100%" }}
              >
                <span style={{ width: "1rem" }} />
                <Image
                  priority
                  src={vulbyteLogo}
                  alt="vulbyte logo"
                  className=""
                  height="40"
                  style={{ maxHeight: "100%" }}
                />
                <Image
                  priority
                  src={vulbyteWordmark}
                  alt="vulbyte wordmark"
                  height="40"
                  className=""
                  style={{ maxHeight: "100%" }}
                />
                <span style={{ width: "1rem" }} />
              </a>
            </div>
          </div>
          {/*links below*/}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
            className="z-10 relative"
          >
            <div className="m-auto">
              <a href="/" target="">
                home
              </a>
            </div>
            <div className="m-auto">
              <a href="/links" target="">
                links
              </a>
            </div>
            <div className="m-auto">
              <a href="/commStuff" target="">
                comm stuff
              </a>
            </div>
          </div>
          {/*<div></div>*/}
        </div>
      </nav>
      <br />
      <br />
    </div>
  );
}
