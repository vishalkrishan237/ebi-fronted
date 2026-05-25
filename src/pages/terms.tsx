import { PolicyShell } from "@/components/policy-shell";

export default function TermsPage() {
  return (
    <PolicyShell
      eyebrow="Legal"
      title="Terms & Conditions"
      summary="These terms govern how players access Elite Battle India, join Free Fire tournaments, confirm paid entries through WhatsApp, and use the platform fairly and safely."
      sections={[
        {
          title: "1. Platform scope",
          body: [
            "Elite Battle India is a competitive esports platform built for organized Free Fire tournaments. The platform offers account-based player tracking, leaderboard systems, and WhatsApp-led room coordination for paid matches.",
            "By using the site, you agree that match participation, account access, manual entry confirmation, and tournament decisions are subject to the rules published on the platform and the decisions of the Elite Battle India operations team.",
          ],
        },
        {
          title: "2. Eligibility",
          body: [
            "You must provide accurate account details, including a valid username, email, and Free Fire UID. You may not impersonate another player or register using false identity information.",
            "If local law restricts your participation, you must not use paid tournament features. Elite Battle India may request additional verification before approving manual room entry, refunds, or dispute requests.",
          ],
        },
        {
          title: "3. Skill-based competition",
          body: [
            "Tournament outcomes are based on in-game performance, match standings, room results, and rule-based scoring. Elite Battle India does not present its tournaments as gambling, casino play, or random chance entertainment.",
            "Solo and Clash Squad rooms follow the format shown on the match card, including seat limits, start gates, payout ladders, and the room instructions published by the admin.",
          ],
        },
        {
          title: "4. Match entry and payouts",
          body: [
            "A player's entry is valid only after the admin confirms the join successfully through the WhatsApp community flow. For paid rooms, this requires direct UPI confirmation or other approval steps before the seat is considered locked.",
            "Prize amounts, payout ladders, and room rules may differ by tournament. The values published on the match card or match details page at the time of entry will apply unless the room is cancelled or corrected before it begins.",
          ],
        },
        {
          title: "5. Account conduct",
          body: [
            "Cheating, teaming abuse, unauthorized multiple accounts, payment abuse, fake payment claims, chargeback fraud, or manipulation of tournament results can lead to suspension, prize cancellation, permanent bans, and reporting to payment or fraud partners.",
            "Players must not share another player's account, Free Fire UID, or verification details in a way that misrepresents tournament identity.",
          ],
        },
        {
          title: "6. Operator decisions and disputes",
          body: [
            "Elite Battle India may review screenshots, lobby evidence, payment records, server logs, and player reports before deciding disputes. Final decisions on cancelled rooms, suspected fraud, rule violations, or winner corrections are made by the operations team.",
            "If you need to appeal a decision, contact support with your username, Free Fire UID, match name, and supporting proof. Incomplete or abusive appeals may be closed without action.",
          ],
        },
        {
          title: "7. Changes to service",
          body: [
            "We may update tournament formats, feature access, reward systems, or these terms as the platform evolves. Continued use of the site after updates means you accept the revised terms.",
            "If legal, operational, or compliance conditions require it, Elite Battle India may pause paid rooms or change the manual entry process until service is restored safely.",
          ],
        },
      ]}
      sideNote={
        <>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Operational note</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Tournament evidence matters</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            If a room result is disputed, keep screenshots of custom-room results, player placements, and any lobby instructions. That makes reviews faster and cleaner for everyone.
          </p>
        </>
      }
    />
  );
}
