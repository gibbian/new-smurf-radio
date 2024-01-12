"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const AddDJ = () => {
  const utils = api.useUtils();
  const mutation = api.admin.createDJ.useMutation({
    async onSuccess(_data, variables) {
      toast("Added DJ!", { description: variables.name });
      await utils.admin.listDJs.invalidate();
      await utils.admin.listDjSlots.invalidate();
      setName("");
    },
  });
  const [name, setName] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: name,
    });
  };

  return (
    <form onSubmit={submit} className="flex">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name..."
        disabled={mutation.status == "loading"}
      ></Input>
      <Button
        disabled={mutation.status == "loading"}
        type="submit"
        variant={"default"}
      >
        Submit
      </Button>
    </form>
  );
};
