import { PolicyShell } from "@/components/policy-shell";

export default function FairPlayPage() {
  return (
    <PolicyShell
      eyebrow="Policy"
      title="Fair Play Policy"
      summary="Competitive integrity is the center of Elite Battle India. This policy explains how cheating, false identities, duplicate accounts, squad abuse, and manual payment fraud are handled."
      sections={[
        {
          title: "1. Core fair-play rule",
          body: [
            "Every player must compete using their own account and their own Free Fire UID. Match entry, squad registration, and reward collection must reflect the actual player participating in the room.",
          ],
        },
        {
          title: "2. Prohibited conduct",
          body: [
            "The following may lead to removal, refund denial, prize cancellation, suspension, or permanent bans: hacks, emulator or tool abuse where prohibited, identity swapping, ghost accounts, fake UIDs, collusion, intentional result manipulation, or false winner claims.",
            "Players must not create multiple accounts to claim duplicate tournament entries or fake payment approval. Captains must not submit teammate UIDs that do not belong to valid and consenting players.",
          ],
        },
        {
          title: "3. Squad registration integrity",
          body: [
            "For squad-based matches, captains are responsible for entering the correct teammate UIDs. If a captain submits invalid, fake, or unapproved player information, the entry may be rejected or removed.",
            "If the system or admin review detects that the same person is attempting to occupy multiple seats or submit mismatched identity details, the team may be denied participation.",
          ],
        },
        {
          title: "4. Evidence and review",
          body: [
            "Elite Battle India may review room screenshots, lobby records, payment logs, UID history, support tickets, and player reports to decide whether a rule has been violated.",
            "Repeated suspicious activity or refusal to cooperate with verification may be treated as a separate integrity issue even if the original complaint is unresolved.",
          ],
        },
        {
          title: "5. Penalties",
          body: [
            "Penalties can include warnings, room cancellation, removal from a tournament, refund refusal, suspension, permanent account bans, and blocking future paid-room processing.",
            "Serious fraud or payment abuse may also be reported to payment or fraud-monitoring partners where necessary to protect the platform.",
          ],
        },
      ]}
      sideNote={
        <>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Player standard</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">One player, one identity</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The easiest way to stay safe is simple: use your real account, your real UID, your real team, and keep tournament evidence if something goes wrong.
          </p>
        </>
      }
    />
  );
}
