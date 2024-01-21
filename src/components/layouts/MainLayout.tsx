"use client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import { Navbar } from "./Navbar";
import { usePathname } from "next/navigation";
import { cn } from "~/utils";

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

  const mainContainerClass = cn(
    "p-4 text-text md:p-6",
    pathname === "/live" && "flex-1 p-0 sm:p-4",
  );

  return (
    <SessionProvider session={session}>
      <div
        className={cn(
          pathname === "/live" && "flex h-screen min-h-screen flex-col",
        )}
      >
        <Navbar session={session}></Navbar>
        <main className={mainContainerClass}>{children}</main>
        <Toaster />
      </div>
    </SessionProvider>
  );
};
