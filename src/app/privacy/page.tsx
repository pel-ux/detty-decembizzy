import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="13 November 2026">
      <p>
        This policy explains what {BRAND.name} collects, why, and who it is shared with. {BRAND.name} is operated by
        [your business or personal name], based in [city, Nigeria]. You can reach us at{" "}
        <a className="font-semibold text-santa underline" href={`mailto:${BRAND.contactEmail}`}>
          {BRAND.contactEmail}
        </a>
        .
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Surprises:</strong> the recipient name, relationship, chosen vibe, and any optional sender name,
          personal detail or personal note you type, plus the Santa message we generate. We keep these so your link
          keeps working.
        </li>
        <li>
          <strong>Wishlists:</strong> your name, the list title, the gifts you add (names, optional prices, links and
          notes), and the nicknames givers type when they pick a gift.
        </li>
        <li>
          <strong>Payments:</strong> handled by Paystack. We never see or store your card details. We store the
          payment reference, amount, currency, status and which surprise it belongs to. Your email address is sent to
          Paystack for your receipt, and we do not store it.
        </li>
        <li>
          <strong>Cookies and local storage:</strong> a small cookie that proves you created a surprise or wishlist,
          so only you can manage it, and a local setting that remembers where you left the Santa character. We do not
          use advertising cookies. [Update this section if you add analytics.]
        </li>
        <li>
          <strong>Technical data:</strong> our hosting provider may log technical details such as IP address and
          browser type for security and operation of the service.
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To provide the service, process payments, prevent abuse, and answer your messages. We do not sell personal
        data.
      </p>

      <h2>Who we share it with</h2>
      <p>
        Only the services that run {BRAND.name}: Supabase (database), Vercel (hosting) and Paystack (payments). They
        process data on our behalf and under their own terms.
      </p>

      <h2>Links are visible to anyone who has them</h2>
      <p>
        Anyone with a surprise or wishlist link can open it. Links are long and random, but if you post one publicly,
        anyone can see what is on the page. Please do not put sensitive information in a surprise or wishlist.
      </p>

      <h2>How long we keep data</h2>
      <p>
        We keep surprises and wishlists until they expire, [define: for example 90 days after creation], or until you
        ask us to delete them. Payment records are kept as long as needed for accounting and legal reasons.
      </p>

      <h2>Your rights</h2>
      <p>
        Under Nigerian data protection law, and other laws that may apply to you, you may have the right to ask us for
        access to your data, to correct it, or to delete it. Email us with the link to your surprise or wishlist and
        we will respond within [number] days.
      </p>

      <h2>Children</h2>
      <p>
        {BRAND.name} is not directed at children under [13]. If you are under 18, please ask a parent or guardian
        before making a payment.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we will update the date at the top of this page.</p>
    </LegalPage>
  );
}