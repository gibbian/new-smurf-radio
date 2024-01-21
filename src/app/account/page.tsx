import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { AccountPageForm } from "./AccountPageForm";

export default async function () {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <AccountPageForm session={session} />
    </div>
  );
}
