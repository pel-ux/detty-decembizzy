import { ROUTES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="bg-santa py-16 text-center text-white">
      <Container>
        <h2 className="text-3xl font-extrabold sm:text-4xl">Santa is already typing.</h2>
        <p className="mx-auto mt-3 max-w-md text-white/85">
          It takes about a minute. Somebody is about to have a very good December.
        </p>
        <ButtonLink href={ROUTES.create} variant="gold" className="mt-8">
          Create a Christmas Surprise
        </ButtonLink>
      </Container>
    </section>
  );
}