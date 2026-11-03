export const VIBES = [
  {
    id: "funny",
    label: "Funny",
    emoji: "😂",
    blurb: "Playful gist. Santa has receipts.",
    sample:
      "Santa don hear say you dey form hard guy this year. Your December activities are under investigation.",
  },
  {
    id: "savage",
    label: "Savage",
    emoji: "😈",
    blurb: "Friendly roast, zero real damage.",
    sample:
      "Santa reviewed your year. The report is not looking good. But because Christmas is involved, we go manage you.",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "💌",
    blurb: "For the crush, the partner, the almost.",
    sample:
      "Someone has been thinking about you this Christmas. Santa won't reveal who, but the vibes are suspicious.",
  },
  {
    id: "wholesome",
    label: "Wholesome",
    emoji: "🎁",
    blurb: "Warm words for the people who matter.",
    sample:
      "Santa wants you to know that you deserve joy, peace, and beautiful moments this Christmas.",
  },
  {
    id: "mysterious",
    label: "Mysterious",
    emoji: "🕵🏽",
    blurb: "A secret. A suspect. A reveal.",
    sample:
      "A Christmas surprise is waiting for you. One person has something to say, and Santa is keeping the secret.",
  },
] as const;

export type VibeId = (typeof VIBES)[number]["id"];