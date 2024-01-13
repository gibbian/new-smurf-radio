"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type z } from "zod";
import { editShowSchema } from "~/shared/schemas/editShow";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

interface EditShowFormProps {
  initialData: RouterOutputs["shows"]["getShow"];
}
export const EditShowForm = ({ initialData }: EditShowFormProps) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof editShowSchema>>({
    resolver: zodResolver(editShowSchema),
    defaultValues: {
      title: initialData.title ?? undefined,
      description: initialData.description ?? undefined,
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
    <form
      className="flex max-w-sm flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Show Title"
        aria-label="Title"
        {...register("title")}
      ></Input>
      <Textarea {...register("description")} label="Description" />
      <Button disabled={editMutation.isLoading}>Save</Button>
      <Button
        onClick={() => deleteMutation.mutate({ showId: initialData.id })}
        disabled={deleteMutation.isLoading}
        variant="destructive"
      >
        Delete Show
      </Button>
    </form>
  );
};
