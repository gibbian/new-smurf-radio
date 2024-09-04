"use client";

import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { type Link as LinkType } from "./MainLayout";

export const MobileLinks = ({
  links,
  session,
}: {
  links: LinkType[];
  session: Session | null;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div>
        <FontAwesomeIcon
          onClick={() => setOpen(!open)}
          icon={faBars}
        ></FontAwesomeIcon>
      </div>
      {open &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[3000] flex w-full flex-col items-center gap-4 bg-[#212E5C] p-2 pt-8 text-xl text-text">
            {links.map((link) => (
              <Link
                onClick={() => setOpen(false)}
                className={twMerge(
                  "text-sm font-semibold uppercase",
                  pathname === link.href ? "underline decoration-2" : undefined,
                )}
                href={link.href}
                key={link.label}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            {session?.user ? (
              <div
                onClick={() => signOut()}
                className="cursor-pointer text-sm font-semibold uppercase"
              >
                Sign Out
              </div>
            ) : (
              <div
                onClick={() => signIn("google")}
                className="cursor-pointer text-sm font-semibold uppercase"
              >
                Sign In
              </div>
            )}
            <div
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 cursor-pointer"
            >
              <FontAwesomeIcon size="lg" icon={faClose}></FontAwesomeIcon>
            </div>
            <div className=""></div>
          </div>,
          document.body,
        )}
    </>
  );
};
