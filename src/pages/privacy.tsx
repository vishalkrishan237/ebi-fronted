import { PolicyShell } from "@/components/policy-shell";

export default function PrivacyPage() {
  return (
    <PolicyShell
      eyebrow="Legal"
      title="Privacy Policy"
      summary="This policy explains what Elite Battle India collects, why it is collected, and how player data is used to run tournaments, protect accounts, and respond to support or compliance requests."
      sections={[
        {
          title: "1. Information we collect",
          body: [
            "We may collect account information such as username, email address, Free Fire UID, match history, support messages you send to us, and records tied to room participation.",
            "For paid rooms confirmed manually, UPI payment references, settlement notes, and verification records may also be stored to confirm entry status and investigate disputes.",
          ],
        },
        {
          title: "2. Why we use your data",
          body: [
            "Your data is used to create player accounts, register tournament entries, confirm eligibility, record match participation, respond to support tickets, and protect the platform from abuse.",
            "We may also use operational logs, manual payment-status records, and account history to investigate cheating, impersonation, fake payment claims, multiple-account abuse, or prize disputes.",
          ],
        },
        {
          title: "3. Sharing and processors",
          body: [
            "Elite Battle India may rely on hosting providers, database providers, analytics tools, email tools, and payment partners to run the service. These partners process data only as needed to support the platform.",
            "We may disclose information if required by law, payment-provider review, fraud-prevention needs, or valid requests from legal authorities or regulated payment partners.",
          ],
        },
        {
          title: "4. Data retention",
          body: [
            "We retain tournament and payment-related records for operational, support, fraud-prevention, and compliance purposes. Some data may remain in backups or audit logs even after a profile is no longer actively used.",
            "If you ask us to review or remove account information, we may keep the minimum records necessary to detect abuse, settle disputes, or comply with legal obligations.",
          ],
        },
        {
          title: "5. Security and access",
          body: [
            "We take reasonable steps to protect player information, but no internet platform can promise absolute security. Players must keep account credentials private and avoid sharing login access with others.",
            "If you believe your account has been compromised or misused, contact support immediately so we can review activity and secure the profile where possible.",
          ],
        },
        {
          title: "6. Your requests",
          body: [
            "You may contact us to ask about account information, support records, or tournament history associated with your profile. We may request verification before disclosing or changing sensitive account details.",
            "For privacy-related support, contact the address listed on the support page and include your username and registered email so we can locate the correct account safely.",
          ],
        },
      ]}
      sideNote={
        <>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Data handling</p>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Tournament integrity first</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Match logs, entry records, and manual payment references help us resolve disputes, confirm winners, and block duplicate-account abuse. That is a big part of why we keep operational history.
          </p>
        </>
      }
    />
  );
}
