"use client";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Link from "next/link";

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
    <div className="flex flex-wrap items-center justify-center">
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
      <Button>
        <Link href={"/member/admin/showlist"}>Show List</Link>
      </Button>
    </div>
  );
};
