"use client";

import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { type Link as LinkType } from "./MainLayout";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

export const MobileLinks = ({ links }: { links: LinkType[] }) => {
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
          <div className="fixed bottom-0 left-0 right-0 top-0 z-[3000] flex w-full flex-col items-center gap-4 bg-bg p-2 pt-8 text-xl text-white">
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
            <div
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4"
            >
              <FontAwesomeIcon size="lg" icon={faClose}></FontAwesomeIcon>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
