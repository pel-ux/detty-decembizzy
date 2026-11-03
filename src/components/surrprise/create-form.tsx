"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RELATIONSHIPS, type RelationshipId } from "@/features/surprise-creator/types";
import { VIBES, type VibeId } from "@/features/surprise-creator/vibes";

type FieldErrors = Partial<Record<string, string[]>>;

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-pine/20 bg-white px-4 py-3 text-base focus:border-pine focus:outline-none";

export function CreateForm() {
  const router = useRouter();
  const [relationship, setRelationship] = useState<RelationshipId>("friend");
  const [vibe, setVibe] = useState<VibeId>("funny");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const romanticBlocked = relationship === "sibling" || relationship === "family";

  function pickRelationship(next: RelationshipId) {
    setRelationship(next);
    if ((next === "sibling" || next === "family") && vibe === "romantic") setVibe("funny");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = (key: string) => String(fd.get(key) ?? "");

    setPending(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/surprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: text("recipientName"),
          relationship,
          vibe,
          senderName: text("senderName"),
          personalDetail: text("personalDetail"),
          customMessage: text("customMessage"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setError(data.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      router.push(`/preview/${data.publicId}`);
    } catch {
      setError("Network issue. Check your connection and try again.");
      setPending(false);
    }
  }

  const fieldError = (name: string) =>
    fieldErrors[name]?.[0] ? (
      <p id={`${name}-error`} className="mt-1 text-sm font-semibold text-santa">
        {fieldErrors[name]?.[0]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="recipientName" className="font-semibold text-pine">
          Who is this for?
        </label>
        <input
          id="recipientName"
          name="recipientName"
          required
          maxLength={40}
          autoComplete="off"
          placeholder="Their name or group chat name"
          aria-describedby="recipientName-error"
          className={inputClass}
        />
        {fieldError("recipientName")}
      </div>

      <div>
        <label htmlFor="relationship" className="font-semibold text-pine">
          They are your...
        </label>
        <select
          id="relationship"
          value={relationship}
          onChange={(e) => pickRelationship(e.target.value as RelationshipId)}
          className={inputClass}
        >
          {RELATIONSHIPS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="font-semibold text-pine">Pick the vibe</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {VIBES.map((v) => {
            const disabled = v.id === "romantic" && romanticBlocked;
            return (
              <label key={v.id} className={disabled ? "opacity-40" : "cursor-pointer"}>
                <input
                  type="radio"
                  name="vibe"
                  value={v.id}
                  checked={vibe === v.id}
                  disabled={disabled}
                  onChange={() => setVibe(v.id)}
                  className="peer sr-only"
                />
                <span className="block rounded-2xl border-2 border-pine/20 bg-white p-3 peer-checked:border-santa peer-checked:bg-santa/5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine">
                  <span aria-hidden>{v.emoji} </span>
                  <span className="font-bold">{v.label}</span>
                  <span className="mt-1 block text-xs text-ink/65">{v.blurb}</span>
                </span>
              </label>
            );
          })}
        </div>
        {romanticBlocked && (
          <p className="mt-2 text-sm text-ink/65">The Romantic style isn&apos;t available for siblings or family.</p>
        )}
        {fieldError("vibe")}
      </fieldset>

      <div>
        <label htmlFor="senderName" className="font-semibold text-pine">
          Your name <span className="font-normal text-ink/60">(optional, leave blank to stay a mystery)</span>
        </label>
        <input id="senderName" name="senderName" maxLength={40} autoComplete="off" className={inputClass} />
        {fieldError("senderName")}
      </div>

      <div>
        <label htmlFor="personalDetail" className="font-semibold text-pine">
          Something Santa can mention <span className="font-normal text-ink/60">(optional)</span>
        </label>
        <input
          id="personalDetail"
          name="personalDetail"
          maxLength={120}
          autoComplete="off"
          placeholder="e.g. the Lekki trip, your new job"
          className={inputClass}
        />
        {fieldError("personalDetail")}
      </div>

      <div>
        <label htmlFor="customMessage" className="font-semibold text-pine">
          Your own message <span className="font-normal text-ink/60">(optional, up to 200 characters)</span>
        </label>
        <textarea id="customMessage" name="customMessage" rows={3} maxLength={200} className={inputClass} />
        {fieldError("customMessage")}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-santa/10 p-3 text-sm font-semibold text-santa-dark">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 aria-hidden className="h-5 w-5 animate-spin" />}
        {pending ? "Santa is writing..." : "Preview my surprise"}
      </Button>
    </form>
  );
}