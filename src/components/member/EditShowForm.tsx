"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { editShowSchema } from "~/shared/schemas/editShow";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface EditShowFormProps {
  initialData: RouterOutputs["shows"]["getShow"];
}
export const EditShowForm = ({ initialData }: EditShowFormProps) => {
  const router = useRouter();
  const { handleSubmit, watch, setValue } = useForm<
    z.infer<typeof editShowSchema>
  >({
    resolver: zodResolver(editShowSchema),
    defaultValues: {
      title: initialData.title ?? undefined,
      description: initialData.description ?? undefined,
      genres: initialData.genres ?? [],
    },
  });

  const editMutation = api.member.editShow.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deleteMutation = api.member.deleteShow.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/member/upcoming");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editShowSchema>> = (values) => {
    editMutation.mutate({
      payload: values,
      showId: initialData.id,
    });
  };

  return (
    <div>
      <div className="my-10 text-xl">
        Editing show for{" "}
        <div className="text-2xl font-bold">
          {format(initialData.startTime, "h aa EEEE LLL d")}
        </div>
      </div>
      <form
        className="flex max-w-sm flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Show Title"
          aria-label="Title"
          value={watch("title")}
          onChange={(e) => {
            setValue("title", e.target.value);
          }}
        ></Input>
        <Textarea
          value={watch("description")}
          onChange={(e) => {
            setValue("description", e.target.value);
          }}
          label="Description"
        />
        <GenrePicker
          onChange={(value) => {
            setValue("genres", value);
          }}
          value={watch("genres")}
        />
        <Button disabled={editMutation.isLoading}>Save</Button>
        <Button
          onClick={() => deleteMutation.mutate({ showId: initialData.id })}
          disabled={deleteMutation.isLoading}
          variant="destructive"
        >
          Delete Show
        </Button>
      </form>
    </div>
  );
};

interface GenrePickerProps {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
}
export const GenrePicker = ({ value, onChange }: GenrePickerProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <Label>Genres</Label>
      <div className="mt-1 flex flex-wrap items-start gap-2">
        {value?.map((genre) => (
          <div
            className="cursor-pointer whitespace-nowrap rounded-full border border-border bg-bg p-1 px-2 text-sm hover:line-through"
            onClick={() => {
              onChange(value?.filter((g) => g !== genre));
            }}
            key={genre}
          >
            {genre}
          </div>
        ))}
        <input
          onKeyUp={(keyEvent) => {
            if (keyEvent.key === "Enter") {
              onChange([...(value ?? []), input]);
              setInput("");
            }
          }}
          className="rounded-full border border-border bg-input-bg p-1 pl-3 text-sm placeholder:text-white/50 focus-visible:outline-none"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Add Genre..."
          type="text"
        />
      </div>
    </div>
  );
};
