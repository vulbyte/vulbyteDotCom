"use client";

// TODO: make sweet love to my pillow in my dreams

// Import necessary React hooks
import React, { useState, ReactNode } from "react";
import Navbar from "@/components/navbar";

// Create your functional component
const DynamicElements = () => {
  // State to store the created elements
  const [elements, setElements] = useState<ReactNode[]>([]);

  const placeholder = "1234.567km/hr";

  const value = null;

  let gridTemplate = "repeat(auto-fit, minmax(8em, 1fr))";

  // Function to handle button click and add a new element
  const handleButtonClick = () => {
    // Create a unique key for the new element (you can use a library for this in a real application)
    const newElementKey = elements.length + 1;

    // Create a new element and add it to the state
    const newElement = <div key={newElementKey}>Element {newElementKey}</div>;
    setElements([...elements, newElement]);
  };

  return (
    <div>
      <Navbar />
      <br />
      {/* Button to add a new element */}
      <button
        onClick={handleButtonClick}
        className="bg-white text-black pl-4 pr-4 m-4"
      >
        Add Element
      </button>

      {/* Display the created elements */}
      <div className="max-w-[80%] m-auto">
        {elements.map((element) => (
          <div key={(element as { key: React.Key }).key ?? "indexNull"}>
            <div>
              <p>controls</p>
            </div>
            <hr />
            {/*group 1*/}
            <div>
              <div
                className="grid w-[100%]"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <input
                  type="text"
                  value={value!}
                  className="m-1 w-[180%]"
                  placeholder="effect name"
                />
                <button className="bg-red-500 m-1 w-8">{`-`}</button>
              </div>
              <button className="bg-blue-500 w-[100%] m-1"> roll </button>
              <div className="w-auto bg-zinc-800 m-1">
                {`result: ${placeholder}`}
              </div>
              <div className="w-auto bg-purple-500 m-1">
                {`current: ${placeholder}`}
              </div>
              <div className=""></div>
            </div>
            {/*group 2*/}
            <div
              className="grid w-[100%]"
              style={{ gridTemplateColumns: gridTemplate }}
            ></div>
            {/*group 3*/}
            <div
              className="grid w-[100%]"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <h6 className="p-0"> {`settings`} </h6>
              <br />
              <input
                type="text"
                className="min-w-8 m-1 p-0"
                placeholder="unit(s)"
              />
              <br />
              <input
                type="text"
                className="min-w-8 m-1 p-0"
                placeholder="min unit"
              />
              <input
                type="text"
                className="min-w-8 m-1 p-0"
                placeholder="max unit"
              />
              <input
                type="text"
                className="min-w-6 m-1 p-0"
                placeholder="min increment"
              />
              <input
                type="text"
                className="min-w-6 m-1 p-0"
                placeholder="max increment"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export your component
export default DynamicElements;
