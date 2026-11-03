"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Gift } from "lucide-react";
import { BRAND, NAV_LINKS, ROUTES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-pine/10 bg-cream/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href={ROUTES.home} className="flex items-center gap-2 font-display text-lg font-extrabold text-pine">
          <Gift aria-hidden className="h-5 w-5 text-santa" />
          {BRAND.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-ink/80 hover:text-santa">
              {link.label}
            </a>
          ))}
          <ButtonLink href={ROUTES.create} className="px-5 py-2 text-sm">
            Create a Surprise
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-pine md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>
<div aria-hidden="true" className="christmas-lights" />
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-pine/10 bg-cream md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 font-semibold text-ink/80 hover:bg-pine/5"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href={ROUTES.create} className="mt-2">
              Create a Surprise
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}