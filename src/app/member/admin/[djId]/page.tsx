import { LinkEmail } from "~/components/admin/LinkEmail";
import { QuickControlCard } from "~/components/admin/QuickControlCard";
import { api } from "~/trpc/server";
import { formatSlotFromDate } from "~/utils/time";

export default async function Page({ params }: { params: { djId: string } }) {
  const details = await api.djs.getDjDetails.query({ djId: params.djId });
  if (!details) {
    return <div>Could not find dj</div>;
  }

  return (
    <div>
      <div className="mb-12 flex flex-col gap-2 sm:flex-row">
        <div className="flex-grow">
          <div className="text-lg font-bold">{details.name}</div>
          <div className="text-sm">{details.user?.email}</div>
          <div className="text-sm">
            {details.slot[0] && formatSlotFromDate(details.slot[0]?.time)}
          </div>
        </div>
        <QuickControlCard title="Link Email">
          <LinkEmail djId={params.djId} />
        </QuickControlCard>
      </div>
      <div>Shows</div>
      <div>
        {details.shows.map((show) => (
          <div>{show.id}</div>
        ))}
      </div>
    </div>
  );
}
