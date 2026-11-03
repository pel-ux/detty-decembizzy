import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const FAQS = [
  {
    q: "Do I need an account?",
    a: "No. Create a surprise, preview it, and share it without signing up.",
  },
  {
    q: "Is it really free?",
    a: "Yes, the basic surprise is free. Premium styling is optional and you can preview before you pay.",
  },
  {
    q: "Can the person see who sent it?",
    a: "Only if you add your name. Leave it blank and the sender stays a mystery.",
  },
  {
    q: "Is the link private?",
    a: "Each surprise gets a long, random link that can't be guessed. Only people you send it to will have it.",
  },
  {
    q: "Will Santa say anything harsh?",
    a: "No. Even the Savage vibe is a friendly roast. We avoid threats, humiliation and anything explicit.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-cream-deep py-20">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Quick answers" />
        <div className="mt-10 max-w-3xl divide-y divide-pine/15 rounded-2xl bg-cream ring-1 ring-pine/10">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-pine">
                {q}
                <Plus aria-hidden className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 leading-relaxed text-ink/75">{a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}