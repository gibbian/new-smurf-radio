import Link from "next/link";
import { DJLinkingCode } from "~/components/admin/DJLinkingCode";
import { QuickControlCard } from "~/components/admin/QuickControlCard";
import { UpcomingShowCard } from "~/components/member/UpcomingShowCard";
import { api } from "~/trpc/server";
import { formatSlotFromDate } from "~/utils/time";

export default async function Page({ params }: { params: { djId: string } }) {
  const details = await api.djs.getDjDetails.query({ djId: params.djId });
  const slot = await api.admin.getUserSlot.query({ djId: params.djId });
  if (!details) {
    return <div>Could not find dj</div>;
  }

  return (
    <div>
      <div className="mb-12 flex flex-col gap-2 sm:flex-row">
        <div className="flex-grow">
          <div className="text-lg font-bold">{details.name}</div>
          <div className="text-sm">{details.user?.email}</div>
          <div>{slot?.time.toLocaleString()}</div>
          <div className="text-sm">
            {details.slot[0] && formatSlotFromDate(details.slot[0]?.time)}
          </div>
        </div>
        <QuickControlCard title="Link Email">
          <DJLinkingCode djId={params.djId} />
        </QuickControlCard>
      </div>
      <div>Shows</div>
      <div className="flex flex-col gap-2">
        {details.shows.map((show) => (
          <Link key={show.id} href={`/member/edit/${show.id}`}>
            <UpcomingShowCard show={show} key={show.id} />
          </Link>
        ))}
      </div>
    </div>
  );
}
