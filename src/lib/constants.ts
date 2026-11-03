export const BRAND = {
  name: "Detty Decembizzy",
  tagline: "Your Christmas. Your Vibe. Santa's Watching.",
  description:
    "Create a funny, personalised Christmas surprise from Nigerian Santa and share it with one link.",
  // PLACEHOLDER: replace with a real inbox before launch.
  contactEmail: "hello@dettydecembizzy.com",
} as const;

export const ROUTES = {
  home: "/",
  create: "/create",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#styles", label: "Styles" },
  { href: "#pricing", label: "Free vs Premium" },
  { href: "#faq", label: "FAQ" },
] as const;