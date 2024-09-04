import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import LinkDJAccountForm from "./LinkDJAccountForm";

export default async function LinkDJAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  // Check if the user already has a linked DJ account
  if (session.user.djId) {
    redirect("/"); // Redirect to home page or another appropriate page
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Link DJ Account</h1>
      <LinkDJAccountForm />
    </div>
  );
}
export const dynamic = "force-dynamic";
