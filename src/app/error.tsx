"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
