"use client";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const FillSchedule = () => {
  const fillScheduleMutation = api.admin.fillSchedule.useMutation({
    onSuccess(data) {
      toast(`Created ${data.length} new shows.`);
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
    </div>
  );
};
