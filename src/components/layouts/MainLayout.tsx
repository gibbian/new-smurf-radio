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
  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col bg-bg text-text">
        <Navbar session={session}></Navbar>
        <main className="flex h-full flex-1 flex-col p-4 text-text md:p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </SessionProvider>
  );
};
