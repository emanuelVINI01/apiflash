"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-4 bg-zinc-950 text-white">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-zinc-400">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
