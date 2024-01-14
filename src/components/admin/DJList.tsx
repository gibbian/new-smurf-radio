import Link from "next/link";
import { api } from "~/trpc/server";

export const DJList = async () => {
  const result = await api.admin.listDJs.query();
  return (
    <div className="grid grid-cols-2 gap-2 pb-4 md:grid-cols-4 xl:grid-cols-6">
      {result.map((dj) => (
        <Link
          href={`/member/admin/${dj.id}`}
          key={dj.id}
          className="border border-border bg-card-bg p-2 text-sm text-text/80"
        >
          {dj.name}
        </Link>
      ))}
    </div>
  );
};
