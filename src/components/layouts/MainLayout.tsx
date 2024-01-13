"use client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import { Navbar } from "./Navbar";

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
        <Navbar session={session}></Navbar>
        <main className="p-4 text-text md:p-6">{children}</main>
        <Toaster />
      </div>
    </SessionProvider>
  );
};
