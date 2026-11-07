/** What the list owner sees. Deliberately has NO claim information. */
export type OwnerItem = {
  id: string;
  name: string;
  note: string | null;
  priceNaira: number | null;
  link: string | null;
};

/** What givers see. */
export type GiverItem = OwnerItem & { claimedBy: string | null };