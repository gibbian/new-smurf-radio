import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { AccountPageForm } from "./AccountPageForm";

export default async function () {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="px-8 pb-8 pt-4">
      <AccountPageForm session={session} />
    </div>
  );
}
export const dynamic = "force-dynamic";
