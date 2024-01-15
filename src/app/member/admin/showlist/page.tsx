"use client";
import { format } from "date-fns";
import Link from "next/link";
import { Card } from "~/components/Card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function Page() {
  const { data: shows, refetch } = api.admin.listAllShows.useQuery();
  const utils = api.useUtils();
  const deleteShowMuatation = api.admin.deleteShow.useMutation({
    async onSuccess(data, variables, context) {
      await refetch();
    },

    async onMutate(variables) {
      utils.admin.listAllShows.setData(
        undefined,
        (old) => old?.filter((old) => old.id !== variables.showId),
      );
    },
  });

  if (!shows) {
    return null;
  }

  if (shows.length === 0) {
    return <div>No shows</div>;
  }

  return (
    <div>
      <div>
        {shows.map((show, index) => (
          <>
            {/*Show a hr for the current time*/}
            {shows.findIndex((show) => show.endTime > new Date()) === index &&
              index !== 0 && <hr className="my-2 border-t-2 border-border" />}
            <Card key={show.id} className="flex justify-between gap-2">
              <div>
                <div>{show.djName}</div>
                <div>{show.title}</div>
                <div>{format(show.startTime, "h aa - EEEE, MMM d")}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/member/edit/${show.id}`}>
                  <Button>Edit</Button>
                </Link>
                <Button
                  onClick={() =>
                    deleteShowMuatation.mutate({ showId: show.id })
                  }
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </Card>
          </>
        ))}
      </div>
    </div>
  );
}
