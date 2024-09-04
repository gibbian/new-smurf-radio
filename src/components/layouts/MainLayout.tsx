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
    "mx-4 text-text bg-[#141414] border border-b-none grow border-black px-4 md:px-8 pb-12 md:mx-[80px] lg:mx-[120px]",
    pathname === "/live" && "flex-1 overflow-hidden p-0 sm:p-4",
  );

  return (
    <SessionProvider session={session}>
      <div
        className={cn(
          "flex h-screen min-h-screen flex-col border-b-0",
          pathname === "/live" && "debug flex h-screen min-h-screen flex-col",
        )}
      >
        <Navbar session={session}></Navbar>
        <main className={mainContainerClass}>{children}</main>
        <Toaster />
      </div>
    </SessionProvider>
  );
};
