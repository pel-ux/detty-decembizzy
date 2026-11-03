import { PenLine, Eye, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  {
    icon: PenLine,
    title: "Tell Santa the gist",
    text: "Add their name, your relationship, and pick a vibe. No account, no long form.",
  },
  {
    icon: Eye,
    title: "Preview your surprise",
    text: "See exactly what they'll get. Not feeling it? Edit it or try another variation.",
  },
  {
    icon: Send,
    title: "Send the link",
    text: "Share on WhatsApp or anywhere else. They tap, Santa reveals, and the reaction is yours.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-20">
      <Container>
        <SectionHeading eyebrow="How it works" title="Three steps. Zero wahala." />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-2xl border border-pine/10 bg-white/60 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pine text-gold">
                <Icon aria-hidden className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-pine">
                <span className="text-santa">{i + 1}.</span> {title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink/75">{text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}