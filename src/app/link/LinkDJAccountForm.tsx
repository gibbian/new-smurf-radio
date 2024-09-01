"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

export default function LinkDJAccountForm() {
  const [linkingCode, setLinkingCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const linkAccount = api.djs.linkUserToDj.useMutation({
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    linkAccount.mutate({ code: linkingCode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="linkingCode" className="mb-2 block text-sm font-medium">
          Enter your linking code:
        </label>
        <Input
          id="linkingCode"
          type="text"
          value={linkingCode}
          onChange={(e) => setLinkingCode(e.target.value)}
          placeholder="Enter linking code"
          className="w-full"
        />
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={linkAccount.isLoading} className="w-full">
        {linkAccount.isLoading ? "Linking..." : "Link Account"}
      </Button>
    </form>
  );
}
