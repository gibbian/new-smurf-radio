"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "~/utils";
import { Button } from "./button";
import { Calendar, type CalendarProps } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: Date;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
  calendarProps?: CalendarProps;
}
export function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"form"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !props.value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value ? format(props.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...props.calendarProps}
          mode="single"
          selected={props.value}
          onSelect={(v) => {
            setOpen(false);
            if (v) {
              props.onChange(v);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
