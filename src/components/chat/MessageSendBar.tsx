import { FormEvent, useState } from "react";
import { type api } from "~/trpc/react";
import { Input } from "../ui/input";

interface MessageSendBarProps {
  onMessage: (message: string) => void;
}

export const MessageSendBar = ({ onMessage }: MessageSendBarProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onMessage(value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Input value={value} onChange={(e) => setValue(e.target.value)}></Input>
    </form>
  );
};
