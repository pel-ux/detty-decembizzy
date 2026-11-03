import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CreateForm } from "@/components/surrprise/create-form";

export const metadata: Metadata = { title: "Create a Surprise" };

export default function CreatePage() {
  return (
    <Container className="max-w-xl py-12">
      <h1 className="text-3xl font-extrabold text-pine sm:text-4xl">Tell Santa the gist</h1>
      <p className="mt-2 mb-8 text-ink/70">No account needed. You&apos;ll preview it before sharing.</p>
      <CreateForm />
    </Container>
  );
}