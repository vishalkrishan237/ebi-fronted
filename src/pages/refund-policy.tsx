import { PolicyShell } from "@/components/policy-shell";

export default function RefundPolicyPage() {
  return (
    <PolicyShell
      eyebrow="Policy"
      title="Refund & Cancellation"
      summary="This policy explains when Elite Battle India may refund a player, when a tournament can be cancelled, and how payment or coupon reversals are handled."
      sections={[
        {
          title: "1. Free-entry rooms",
          body: [
            "Free-entry tournaments do not involve entry-fee refunds because no cash entry is collected. However, operational rewards, coupons, or promotional bonuses may still be corrected or cancelled if a room is invalid or abused.",
          ],
        },
        {
          title: "2. Paid-entry rooms",
          body: [
            "If a paid tournament is cancelled before it starts, fails to launch correctly, or is voided by the operator because of a technical or integrity issue, the platform may reverse or refund eligible entry value according to the active payment flow and operational records.",
            "A player's payment alone does not guarantee a refund in every scenario. Refunds depend on whether the room was actually cancelled, whether the entry was valid, and whether fraud, chargeback abuse, or policy violations are involved.",
          ],
        },
        {
          title: "3. Non-refundable cases",
          body: [
            "No refund may be issued for player no-shows, voluntary exits, gameplay mistakes, poor internet connection on the player's side, disqualification for cheating or rule-breaking, duplicate entries created by abuse, or unsupported payment disputes.",
            "Coupon redemptions, promotional credits, or manually granted balance may also be non-refundable where fraud, duplication, or policy abuse is detected.",
          ],
        },
        {
          title: "4. Payment review and timeline",
          body: [
            "If a payment dispute or refund request is accepted, processing time depends on the active payment partner, settlement flow, and platform verification requirements. Players should allow reasonable processing time after confirmation.",
            "Where payment collection is paused, under review, or unavailable, Elite Battle India may delay refund completion until the operational or payment review is resolved safely.",
          ],
        },
        {
          title: "5. How to request a refund review",
          body: [
            "Send your username, registered email, Free Fire UID, match name, entry amount, payment reference, and a short explanation of the issue to support. Screenshots of the room or payment result help speed up review.",
            "Submitting false refund claims, edited proofs, or duplicate tickets may lead to account action and rejection of future requests.",
          ],
        },
      ]}
      sideNote={
        <>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Quick rule</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Cancelled room, then review</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The cleanest refund case is a room that never starts or is cancelled by the operator. If the room is played and a player is merely unhappy with the result, that usually does not qualify as a refund event.
          </p>
        </>
      }
    />
  );
}
