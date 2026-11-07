import { ROUTES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function WishlistPromo() {
  return (
    <section className="bg-pine py-16 text-cream">
      <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">New</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Tired of &ldquo;what do you want for Christmas?&rdquo;</h2>
          <p className="mt-3 text-lg text-cream/85">
            Make a secret wishlist. Friends and family pick gifts from it, nobody doubles up,
            and you never see who picked what.
          </p>
        </div>
        <ButtonLink href={ROUTES.wishlistNew} variant="gold">Make my wishlist</ButtonLink>
      </Container>
    </section>
  );
}