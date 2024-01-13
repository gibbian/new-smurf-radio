import { EditShowForm } from "~/components/member/EditShowForm";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { showId: string } }) {
  const show = await api.shows.getShow.query({ showId: params.showId });

  return <EditShowForm initialData={show}></EditShowForm>;
}
