import Link from "next/link";
import { redirect } from "next/navigation";
import { UpcomingShowCard } from "~/components/member/UpcomingShowCard";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function () {
  const createShowAction = async () => {
    "use server";
    const result = await api.member.createNewShow.mutate();
    redirect(`/member/edit/${result.id}`);
  };

  const upcomingShows = await api.member.myUpcomingShows.query();

  return (
    <div>
      <div className="flex flex-col gap-2">
        {upcomingShows.length === 0 && (
          <div className="grid min-h-[100px] place-items-center text-sm text-white/40">
            You have no upcoming shows!
            <form action={createShowAction}>
              <Button className="w-full">New Show</Button>
            </form>
          </div>
        )}
        {upcomingShows.map((show) => (
          <Link href={`/member/edit/${show.id}`}>
            <UpcomingShowCard key={show.id} show={show} />
          </Link>
        ))}
      </div>
      {upcomingShows.length !== 0 && (
        <form action={createShowAction} className="mt-4">
          <Button className="w-full">New Show</Button>
        </form>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
