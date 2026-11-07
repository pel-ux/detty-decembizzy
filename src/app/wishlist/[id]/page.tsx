import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { OwnerPanel } from "@/components/wishlist/owner-panel";
import { GiverPanel } from "@/components/wishlist/giver-panel";
import { isOwner } from "@/features/surprise-creator/ownership";
import { getWishlistByPublicId } from "@/features/wishlists/queries";
import { MAX_ITEMS_PER_WISHLIST } from "@/features/wishlists/schemas";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Secret Wishlist", robots: { index: false } };

export default async function WishlistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lookup = await getWishlistByPublicId(id);

  if (lookup.status === "not_found") notFound();

  if (lookup.status === "expired") {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-3xl font-extrabold text-pine">This wishlist has expired</h1>
        <ButtonLink href={ROUTES.wishlistNew} className="mt-8">Make a new one</ButtonLink>
      </Container>
    );
  }

  const { wishlist, items } = lookup;

  if (await isOwner(id, lookup.manageTokenHash)) {
    // Owner view: claim data is dropped HERE, on the server, so it never reaches their browser.
    const ownerItems = items.map((i) => ({
      id: i.id,
      name: i.name,
      note: i.note,
      priceNaira: i.priceNaira,
      link: i.link,
    }));
    return (
      <Container className="max-w-xl py-10">
        <p className="font-semibold text-santa">🎅🏾 Your secret wishlist</p>
        <h1 className="mb-6 mt-1 text-3xl font-extrabold text-pine">{wishlist.title}</h1>
        <OwnerPanel
          publicId={wishlist.publicId}
          title={wishlist.title}
          items={ownerItems}
          maxItems={MAX_ITEMS_PER_WISHLIST}
        />
      </Container>
    );
  }

  return (
    <Container className="max-w-xl py-10">
      <GiverPanel publicId={wishlist.publicId} ownerName={wishlist.ownerName} title={wishlist.title} items={items} />
    </Container>
  );
}