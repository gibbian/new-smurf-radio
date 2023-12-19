/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#171717] text-white">
      <h2>Something went wrong!</h2>
      <div className="p-3"></div>
      <button
        className="bg-white p-2 font-bold text-black"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
