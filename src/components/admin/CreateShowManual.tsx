"use client";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { DatePicker } from "../ui/DatePicker";
import { Button } from "../ui/button";
import { TimeSelect } from "./CreateSlot";
import { DJSelect } from "./DJPicker";

export const CreateShowManual = () => {
  const createShowMutation = api.admin.createManualShow.useMutation({
    onError(error, variables, context) {
      toast.error(error.message);
    },
    onSuccess(data, variables, context) {
      toast(
        `Created show for ${data?.djName} at ${data?.startTime.toLocaleString()}`,
      );
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!dj) {
      return;
    }

    const date = new Date(day);
    date.setHours(hour, 0, 0, 0);

    createShowMutation.mutate({
      djId: dj,
      startTime: date,
    });
  };

  const [dj, setDj] = useState<string>();
  const [day, setDay] = useState<Date>(new Date());
  const [hour, setHour] = useState(0);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
      <DJSelect value={dj} onChange={setDj} />
      <DatePicker value={day} onChange={setDay} />
      <TimeSelect value={hour} setValue={setHour} />
      <Button disabled={createShowMutation.isLoading || !dj} type="submit">
        Submit
      </Button>
    </form>
  );
};
