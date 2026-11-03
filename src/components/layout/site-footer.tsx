import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/constants";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="bg-pine-dark text-cream/80">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-extrabold text-cream">{BRAND.name}</p>
          <p className="mt-1 text-sm">{BRAND.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <Link href={ROUTES.privacy} className="hover:text-gold">Privacy</Link>
          <Link href={ROUTES.terms} className="hover:text-gold">Terms</Link>
          <a href={`mailto:${BRAND.contactEmail}`} className="hover:text-gold">Contact</a>
        </nav>
      </Container>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {BRAND.name}. Made with love and a bit of wahala.
      </div>
    </footer>
  );
}