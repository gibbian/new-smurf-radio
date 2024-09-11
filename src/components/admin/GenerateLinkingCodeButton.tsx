"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";

export default function GenerateLinkingCodeButton({ djId }: { djId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const generateCode = api.djs.generateLinkingCode.useMutation({
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleGenerateCode = () => {
    setIsLoading(true);
    generateCode.mutate({ djId });
  };

  if (generatedCode) {
    return (
      <p>
        Heres your linking code to access the member pages: {generatedCode}
        <br />
        Just go to https://www.smuradiofrequency.com/link and paste it in. Make
        sure you're signed in.
      </p>
    );
  }

  return (
    <Button onClick={handleGenerateCode} disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate Linking Code"}
    </Button>
  );
}
