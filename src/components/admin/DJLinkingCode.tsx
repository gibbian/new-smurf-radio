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
        <p>
          Heres your linking code to access the member pages:
          <br />
          {existingCode.code}
          <br />
          Just go to https://www.smuradiofrequency.com/link and paste it in.
          Make sure you're signed in.
        </p>
      </div>
    );
  }

  return <GenerateLinkingCodeButton djId={djId} />;
};
