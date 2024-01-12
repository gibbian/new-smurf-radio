"use client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Toaster } from "../ui/sonner";
import { MobileLinks } from "./MobileLinks";

export type Link = {
  href: string;
  label: string;
};

export const MainLayout = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const pathname = usePathname();
  const links: Link[] = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/schedule",
      label: "Schedule",
    },
    {
      href: "/stream",
      label: "Stream",
    },
    // TODO: Add archive
  ];

  if (session?.user.djId) {
    links.push({
      href: "/member/upcoming",
      label: "Member",
    });
  }

  if (!session?.user) {
    links.push({
      href: "/api/auth/signin/google",
      label: "Sign in",
    });
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-bg text-text">
        <nav className="sticky top-0 flex items-center justify-between border-b border-[#939393] px-4 py-3 md:px-6">
          <div className="text-[16px] font-semibold">SMURF RADIO</div>
          <div className="links hidden gap-7 py-2 md:flex">
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
          <div className="block md:hidden">
            <MobileLinks links={links} />
          </div>
        </nav>
        <main className="p-4 text-text md:p-6">{children}</main>
        <Toaster />
      </div>
    </SessionProvider>
  );
};
