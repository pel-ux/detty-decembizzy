import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="13 November 2026">
      <p>
        By using {BRAND.name}, you agree to these terms. {BRAND.name} is operated by [your business or personal name].
        Questions? Email{" "}
        <a className="font-semibold text-santa underline" href={`mailto:${BRAND.contactEmail}`}>
          {BRAND.contactEmail}
        </a>
        .
      </p>

      <h2>What the service is</h2>
      <p>
        {BRAND.name} lets you create playful Christmas surprise cards and secret wishlists and share them by link. The
        Santa messages are written from templates for entertainment.
      </p>

      <h2>Be kind</h2>
      <p>You agree not to use the service to:</p>
      <ul>
        <li>harass, threaten, humiliate or target anyone;</li>
        <li>share hateful, sexually explicit or illegal content;</li>
        <li>pretend to be someone else or mislead people;</li>
        <li>try to break, overload or misuse the service.</li>
      </ul>
      <p>
        You are responsible for what you type into names, personal details, notes and wishlist items. We may remove
        content or disable links that break these rules.
      </p>

      <h2>Premium upgrades and payments</h2>
      <p>
        Premium is a one-time purchase for a single surprise, priced in Nigerian Naira and shown before you pay. At
        the time of writing it includes a gold card design, a confetti reveal, and up to 10 message variations. Payments
        are processed by Paystack. If a payment fails or is cancelled, your surprise is not affected and Premium is not
        unlocked. Premium is unlocked only after Paystack confirms the payment to us.
      </p>
      <p>
        Refunds: [write your refund policy, for example whether you refund duplicate or mistaken charges, and how to
        request one].
      </p>

      <h2>Wishlists and gifts</h2>
      <p>
        Wishlists are designed to keep gift choices hidden from the list owner, but this is not a guarantee of
        secrecy. Anyone with the link can open it in another browser. We do not sell, deliver or guarantee any gift.
        Links to shops are third-party sites that we do not control, and any purchase is between you and that seller.
      </p>

      <h2>Availability</h2>
      <p>
        The service is provided as is. Links may expire, features may change, and we do not promise the service will
        always be available or error free.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability
        for any claim is limited to the amount you paid us in the 12 months before the claim.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria. [Confirm with a lawyer.]</p>

      <h2>Changes</h2>
      <p>We may update these terms. If we do, we will change the date at the top of this page.</p>
    </LegalPage>
  );
}