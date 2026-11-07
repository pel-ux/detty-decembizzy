import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CreateWishlistForm } from "@/components/wishlist/create-wishlist-form";

export const metadata: Metadata = { title: "Make a Secret Wishlist" };

export default function NewWishlistPage() {
  return (
    <Container className="max-w-xl py-12">
      <h1 className="text-3xl font-extrabold text-pine sm:text-4xl">Make a secret wishlist</h1>
      <p className="mt-2 mb-8 text-ink/70">
        List what you&apos;d love. Friends and family pick from it, and you never see who picked what.
      </p>
      <CreateWishlistForm />
    </Container>
  );
}