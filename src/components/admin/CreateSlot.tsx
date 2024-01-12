"use client";
import { setDay as fnsSetDay, set } from "date-fns";
import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { dayMap, formatSlotFromDate, timeMap } from "~/utils/time";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const CreateSlot = () => {
  const { data: slots, refetch, status } = api.admin.listDjSlots.useQuery();
  const mutation = api.admin.assignSlot.useMutation({
    async onSettled() {
      toast("Assigned slot!", { dismissible: true });
      setSelectedDj(undefined);
      await refetch();
    },
  });

  const [selectedDj, setSelectedDj] = useState<string>();
  const [day, setDay] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDj) {
      return;
    }
    // Build a date using the day and time and mutate
    let date = fnsSetDay(new Date(), day);
    date = set(date, { hours: time, seconds: 0, minutes: 0 });

    console.log(date.toLocaleString());
    mutation.mutate({
      djId: selectedDj,
      time: date,
    });
  };

  if (status != "success") {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 pt-3 sm:flex-row"
    >
      <Select
        value={selectedDj}
        disabled={mutation.isLoading}
        onValueChange={(v) => {
          setSelectedDj(v);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select DJ" />
        </SelectTrigger>
        <SelectContent>
          {slots.map((slot) => (
            <SelectItem key={slot.djId} value={slot.djId}>
              {slot.name} {slot.time && "-"}{" "}
              {slot.time && formatSlotFromDate(slot.time)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DaySelect value={day} setValue={setDay}></DaySelect>
      <TimeSelect value={time} setValue={setTime}></TimeSelect>
      <Button
        type="submit"
        disabled={
          !selectedDj ||
          time === undefined ||
          day === undefined ||
          mutation.isLoading
        }
      >
        Set Slot
      </Button>
    </form>
  );
};

interface DaySelectProps {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}
const DaySelect = (props: DaySelectProps) => {
  return (
    <Select
      value={props.value.toString()}
      onValueChange={(v) => {
        props.setValue(parseInt(v));
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Day" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(dayMap).map(([key, value]) => (
          <SelectItem key={value} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const TimeSelect = (props: DaySelectProps) => {
  return (
    <Select
      value={props.value.toString()}
      onValueChange={(v) => {
        props.setValue(parseInt(v));
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Time" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(timeMap).map(([key, value]) => (
          <SelectItem key={value} value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
