"use client";

import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

interface AccountPageFormProps {
  session: Session;
}

export const AccountPageForm = ({ session }: AccountPageFormProps) => {
  const updateNameMutation = api.account.changeName.useMutation({
    onSuccess() {
      toast("Username updated!");
    },
    onError(error) {
      toast(error.message);
    },
  });
  const [newName, setNewName] = useState(session.user.name ?? "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateNameMutation.mutate({
      newName,
    });
  };

  return (
    <div className="flex flex-col items-start gap-8">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <Input
          disabled={updateNameMutation.isLoading}
          label="Update Username (Chat Only)"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <Button disabled={updateNameMutation.isLoading} type="submit">
          Submit
        </Button>
      </form>
      <Button
        onClick={() => {
          void signOut();
        }}
        variant="destructive"
      >
        Sign Out
      </Button>
    </div>
  );
};
