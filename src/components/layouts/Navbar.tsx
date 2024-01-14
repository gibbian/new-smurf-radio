"use client";
import { type Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { type Link as LinkType } from "./MainLayout";
import { MobileLinks } from "./MobileLinks";
import { LiveBar } from "./LiveBar";

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
    <div className="sticky top-0">
      <nav className="flex items-center justify-between border-b border-[#939393] bg-bg px-4 py-3 md:px-6">
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
      <LiveBar></LiveBar>
    </div>
  );
};