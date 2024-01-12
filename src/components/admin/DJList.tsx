import Link from "next/link";
import { api } from "~/trpc/server";

export const DJList = async () => {
  const result = await api.admin.listDJs.query();
  return (
    <div className="flex w-full gap-2 py-4">
      {result.map((dj) => (
        <Link
          href={`/member/admin/${dj.id}`}
          key={dj.id}
          className="border border-border bg-card-bg p-2 text-text/80"
        >
          {dj.name}
        </Link>
      ))}
    </div>
  );
};
