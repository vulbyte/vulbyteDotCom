// FIX: try again button
// TODO: add kuro version

"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import nut from "@/public/weBjorked.jpg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <Navbar />
      <main className="flex h-full flex-col items-center justify-center">
        <h2 className="text-center font-mono ">404</h2>
        <p>{` 
          we or you
        `}</p>
        <div className="m-auto max-w-[50%]">
          <Image
            priority
            src={nut}
            alt="bjorknut"
            className=""
            style={{ margin: "auto" }}
          />
          <h2
            className="
          absolute 
          float-left 
          position 
          w-[50%]
          m-auto
          align-middle
          text-center
        translate-y-[-5rem]
          "
          >
            {" "}
            {`BJORKED`}{" "}
          </h2>
        </div>
        <button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
          }
        >
          Try again
        </button>
      </main>
    </div>
  );
}
