import { PolicyShell } from "@/components/policy-shell";

export default function SupportPage() {
  return (
    <PolicyShell
      eyebrow="Support"
      title="Help, Appeals & Contact"
      summary="Use this page when you need tournament support, account help, dispute review, appeal handling, or compliance clarification about Elite Battle India."
      sections={[
        {
          title: "1. Contact channel",
          body: [
            "Primary support email: vishalkrishan2212@gmail.com",
            "When you contact support, include your username, registered email, Free Fire UID, match name, and screenshots or payment references if your issue relates to a room result or transaction.",
          ],
        },
        {
          title: "2. Appeal requests",
          body: [
            "If you believe a room result, ban, refund decision, or winner declaration was wrong, send an appeal with a clear timeline of what happened and attach proof. Appeals without evidence may be closed quickly.",
            "Appeals should focus on facts: room ID or match name, your UID, payment or coupon reference if relevant, and screenshots of custom-room results or admin instructions.",
          ],
        },
        {
          title: "3. Support response targets",
          body: [
            "Standard support target: 24 to 48 working hours.",
            "Disputes involving payments, fraud review, or tournament integrity may require longer review because platform logs, payment records, and player evidence may need to be checked together.",
          ],
        },
        {
          title: "4. Issues we can review",
          body: [
            "Examples include account access problems, UID mismatch, cancelled rooms, winner disputes, coupon redemption questions, fair-play complaints, and reward or refund review requests.",
            "Support cannot promise a specific outcome, but it can confirm whether a case qualifies for correction, refund review, payout review, or account action.",
          ],
        },
        {
          title: "5. Abuse of support",
          body: [
            "Spam tickets, abusive language, repeated false claims, edited screenshots, or duplicate evidence submissions may delay review and can also count as a conduct issue on the platform.",
          ],
        },
      ]}
      sideNote={
        <>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Best practice</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Keep your proof ready</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            For any important issue, save screenshots of lobby instructions, result screens, UID proof, and payment confirmation. That is the fastest way to make an appeal strong and clear.
          </p>
        </>
      }
    />
  );
}
