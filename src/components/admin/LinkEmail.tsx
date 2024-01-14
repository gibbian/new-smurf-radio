"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export const LinkEmail = ({ djId }: { djId: string }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");

  const { data: emails } = api.admin.userEmails.useQuery();
  const mutation = api.admin.linkDJ.useMutation({
    onSuccess() {
      setEmail("");
      router.refresh();
    },
    onError(error) {
      setErrorText(error.message);
    },
  });

  const handleForm = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ djId: djId, userEmail: email });
  };

  return (
    <form onSubmit={handleForm}>
      <Select value={email} onValueChange={setEmail}>
        <SelectTrigger>Choose Email</SelectTrigger>
        <SelectContent>
          {emails?.map((email) => (
            <SelectItem
              key={email}
              onSelect={() => {
                setEmail(email);
              }}
              value={email}
            >
              {email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-red-500">{errorText}</div>
      <Button type="submit">Connect</Button>
    </form>
  );
};
