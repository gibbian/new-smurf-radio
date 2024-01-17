import { type FormEvent, useState } from "react";
import { Input } from "../ui/input";

interface MessageSendBarProps {
  onMessage: (message: string) => void;
}

export const MessageSendBar = ({ onMessage }: MessageSendBarProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onMessage(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Send Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></Input>
    </form>
  );
};
