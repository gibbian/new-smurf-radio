"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const LinkEmail = ({ djId }: { djId: string }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");
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
      <Input
        value={email}
        type="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></Input>
      <div className="text-red-500">{errorText}</div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
