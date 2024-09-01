import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { DJProfileForm } from "~/components/member/DJProfileForm";
import { api } from "~/trpc/server";

export default async function DJProfilePage() {
  const session = await getServerAuthSession();

  if (!session?.user.djId) {
    redirect("/");
  }

  const djDetails = await api.djs.getDjDetails.query({
    djId: session.user.djId,
  });

  if (!djDetails) {
    return <div>Error: DJ details not found</div>;
  }

  // Add this type assertion
  const typedDjDetails = {
    ...djDetails,
    socialLinks: djDetails.socialLinks as {
      instagram?: string;
      twitter?: string;
      spotify?: string;
    } | null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit DJ Profile</h1>
      <DJProfileForm initialData={typedDjDetails} />
    </div>
  );
}
