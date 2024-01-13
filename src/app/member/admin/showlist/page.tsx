"use client";
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
        {shows.map((show) => (
          <Card key={show.id} className="flex justify-between gap-2">
            <div>
              <div>{show.djName}</div>
              <div>{show.title}</div>
              <div>{show.startTime.toLocaleString()}</div>
            </div>
            <Button
              onClick={() => deleteShowMuatation.mutate({ showId: show.id })}
              variant="destructive"
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
