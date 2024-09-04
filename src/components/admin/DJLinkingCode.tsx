import { api } from "~/trpc/server";
import { Button } from "../ui/button";
import GenerateLinkingCodeButton from "./GenerateLinkingCodeButton";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const DJLinkingCode = async ({ djId }: { djId: string }) => {
  const existingCode = await api.djs.getExistingLinkingCode.query({ djId });

  const [user] = await db.select().from(users).where(eq(users.djId, djId));

  if (user) {
    return (
      <div>
        <p>This DJ is already linked to an account.</p>
      </div>
    );
  }

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
