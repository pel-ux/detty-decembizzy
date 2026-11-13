import { Container } from "@/components/ui/container";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold text-pine">{title}</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: {updated}</p>
      <div className="mt-6 leading-relaxed text-ink/85 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-pine [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </Container>
  );
}