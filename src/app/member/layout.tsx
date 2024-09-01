"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { type Link as LinkType } from "~/components/layouts/MainLayout";

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
    {
      label: "Edit Profile",
      href: "/member/profile",
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
      <div className="mb-2 flex gap-7 pb-2">
        {links.map((link) => (
          <Link
            key={link.href}
            className={twMerge(
              "text-sm font-semibold uppercase",
              pathname?.includes(link.href)
                ? "underline decoration-2"
                : undefined,
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
