import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSurpriseByPublicId } from "@/features/surprise-creator/queries";
import { isOwner } from "@/features/surprise-creator/ownership";
import { generateSantaMessage } from "@/features/surprise-creator/generator";
import { REGEN_LIMITS } from "@/features/payments/pricing";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!rateLimit(`regen:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const lookup = await getSurpriseByPublicId(id);
  if (lookup.status !== "found") {
    return NextResponse.json({ error: "Surprise not found." }, { status: 404 });
  }
  if (!(await isOwner(id, lookup.manageTokenHash))) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  const s = lookup.surprise;
  const limit = REGEN_LIMITS[s.tier]; // the database tier decides, never the client
  if (s.regenCount >= limit) {
    return NextResponse.json(
      { error: s.tier === "free" ? "You've used all your free variations." : "No variations left." },
      { status: 403 },
    );
  }

  const message = generateSantaMessage(
    { vibe: s.vibe, recipientName: s.recipientName, personalDetail: s.personalDetail },
    s.generatedMessage,
  );

  const { data, error } = await createAdminClient()
    .from("surprises")
    .update({ generated_message: message, regen_count: s.regenCount + 1 })
    .eq("public_id", id)
    .eq("regen_count", s.regenCount)
    .select("public_id");

  if (error || !data?.length) {
    return NextResponse.json({ error: "Couldn't update. Try again." }, { status: 409 });
  }

  return NextResponse.json({ message, remaining: limit - (s.regenCount + 1) });
}