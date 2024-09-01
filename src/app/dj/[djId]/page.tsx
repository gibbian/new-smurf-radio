import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { DJProfileDisplay } from "~/components/dj/DJProfileDisplay";

export default async function DJProfilePage({
  params,
}: {
  params: { djId: string };
}) {
  const djDetails = await api.djs.getDjDetails.query({
    djId: params.djId,
  });

  if (!djDetails) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DJProfileDisplay dj={djDetails} />
    </div>
  );
}
