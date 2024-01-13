"use client";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const RandomButtons = () => {
  const utils = api.useUtils();
  const fillScheduleMutation = api.admin.fillSchedule.useMutation({
    onSuccess(data) {
      toast(`Created ${data.length} new shows.`);
    },
  });

  const goLiveMutation = api.admin.goLive.useMutation({
    async onSuccess() {
      await utils.shows.getLiveShow.invalidate();
      toast("Going live!");
    },
    onError(e) {
      toast.error(e.message);
    },
  });

  return (
    <div>
      <Button
        disabled={fillScheduleMutation.isLoading}
        onClick={() => fillScheduleMutation.mutate()}
      >
        Fill Schedule
      </Button>
      <Button
        disabled={goLiveMutation.isLoading}
        onClick={() => goLiveMutation.mutate()}
      >
        Go Live
      </Button>
    </div>
  );
};
