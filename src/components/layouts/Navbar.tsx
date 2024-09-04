"use client";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { LiveBar } from "./LiveBar";
import { type Link as LinkType } from "./MainLayout";
import { MobileLinks } from "./MobileLinks";

export const Navbar = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const links: LinkType[] = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/schedule",
      label: "Schedule",
    },
    {
      href: "/live",
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

  if (session?.user) {
    links.push({
      href: "/account",
      label: "Account",
    });
  }

  return (
    <div className="top-0">
      <nav className="flex items-center justify-between border-b border-[#939393] bg-[#212E5C] px-6 py-5 md:px-32">
        <Link href="/">
          <div className="text-[16px] font-semibold">SMURF RADIO</div>
        </Link>
        <div className="links hidden gap-7 py-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              className={twMerge(
                "text-sm",
                pathname === link.href ? "underline" : undefined,
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? null : (
            <div
              onClick={() => signIn("google")}
              className="cursor-pointer text-sm font-semibold uppercase"
            >
              Sign In
            </div>
          )}
        </div>
        <div className="block md:hidden">
          <MobileLinks session={session} links={links} />
        </div>
      </nav>
      <LiveBar></LiveBar>
    </div>
  );
};
