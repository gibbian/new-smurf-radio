"use client";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { type ReactNode } from "react";
import { type Link as LinkType } from "~/components/layouts/MainLayout";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

// Member layout
export default function ({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = useSession();
  if (auth.status != "authenticated") {
    return <div>ERROR</div>;
  }

  const links: LinkType[] = [
    {
      label: "Upcoming Shows",
      href: "/member/upcoming",
    },
  ];

  const user = auth.data.user;

  if (user.accessLevel == 4) {
    links.push({
      label: "ADMIN",
      href: "/member/admin",
    });
  }

  return (
    <>
      <div className="mb-6 flex gap-7 pb-2">
        {links.map((link) => (
          <Link
            key={link.href}
            className={twMerge(
              "text-sm font-semibold uppercase",
              pathname === link.href ? "underline decoration-2" : undefined,
            )}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </>
  );
}
