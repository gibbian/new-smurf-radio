import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export const deleteShowAction = async (showId: string) => {
  "use server";
  await api.member.deleteShow.mutate({ showId });
  redirect("/member/upcoming");
};
