import { api } from "~/trpc/server";
import { Button } from "../ui/button";
import GenerateLinkingCodeButton from "./GenerateLinkingCodeButton";

export const DJLinkingCode = async ({ djId }: { djId: string }) => {
  const existingCode = await api.djs.getExistingLinkingCode.query({ djId });

  if (existingCode) {
    return (
      <div>
        <p>Existing linking code: {existingCode.code}</p>
        <p>Expires at: {existingCode.expiresAt.toLocaleString()}</p>
      </div>
    );
  }

  return <GenerateLinkingCodeButton djId={djId} />;
};
