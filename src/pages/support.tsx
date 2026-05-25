import { useMemo, useState } from "react";
import { AlertCircle, FileText, Mail, Send } from "lucide-react";
import { PolicyShell } from "@/components/policy-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORT_EMAIL = "vishalkrishan564@gmail.com";

export default function SupportPage() {
  const [issueType, setIssueType] = useState("tournament-appeal");
  const [username, setUsername] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [freeFireUid, setFreeFireUid] = useState("");
  const [matchName, setMatchName] = useState("");
  const [description, setDescription] = useState("");

  const mailtoHref = useMemo(() => {
    const issueLabel = ISSUE_TYPE_LABELS[issueType] ?? "General support";
    const subject = `Elite Battle India Appeal - ${issueLabel} - ${username || "Player"}`;
    const body = [
      `Issue type: ${issueLabel}`,
      `Username: ${username || "-"}`,
      `Registered email: ${registeredEmail || "-"}`,
      `Free Fire UID: ${freeFireUid || "-"}`,
      `Match name / room: ${matchName || "-"}`,
      "",
      "Problem description:",
      description || "-",
      "",
      "Attachments I can provide:",
      "- Result screenshots",
      "- Lobby screenshots",
      "- UPI payment reference if relevant",
    ].join("\n");

    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [description, freeFireUid, issueType, matchName, registeredEmail, username]);

  return (
    <PolicyShell
      eyebrow="Support"
      title="Help, Appeals & Contact"
      summary="Use this page when you need tournament support, account help, dispute review, appeal handling, or compliance clarification about Elite Battle India."
      supportEmail={SUPPORT_EMAIL}
      sections={[
        {
          title: "1. Contact channel",
          body: [
            `Primary support email: ${SUPPORT_EMAIL}`,
            "When you contact support, include your username, registered email, Free Fire UID, match name, and screenshots or UPI payment references if your issue relates to a room result or payment confirmation.",
          ],
        },
        {
          title: "2. Appeal requests",
          body: [
            "If you believe a room result, ban, refund decision, or winner declaration was wrong, send an appeal with a clear timeline of what happened and attach proof. Appeals without evidence may be closed quickly.",
            "Appeals should focus on facts: room ID or match name, your UID, UPI payment reference if relevant, and screenshots of custom-room results or admin instructions.",
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
            "Examples include account access problems, UID mismatch, cancelled rooms, winner disputes, manual payment confirmation issues, fair-play complaints, and refund review requests.",
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
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Appeal form</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Send support details fast</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Fill this once and tap the button. Your mail app will open with the full appeal already written so players can send their issue directly.
            </p>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/8 bg-background/35 p-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue type</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger id="issue-type">
                  <SelectValue placeholder="Choose issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tournament-appeal">Tournament appeal</SelectItem>
                  <SelectItem value="payment-dispute">Payment dispute</SelectItem>
                  <SelectItem value="refund-request">Refund request</SelectItem>
                  <SelectItem value="ban-review">Ban review</SelectItem>
                  <SelectItem value="account-help">Account help</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registered-email">Registered email</Label>
                <Input id="registered-email" type="email" value={registeredEmail} onChange={(e) => setRegisteredEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ff-uid">Free Fire UID</Label>
                <Input id="ff-uid" value={freeFireUid} onChange={(e) => setFreeFireUid(e.target.value)} placeholder="Enter your UID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="match-name">Match name / room</Label>
                <Input id="match-name" value={matchName} onChange={(e) => setMatchName(e.target.value)} placeholder="EBI Solo 2 or room name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appeal-description">Describe the problem</Label>
              <Textarea
                id="appeal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, what time it happened, and what result or manual payment issue you want reviewed."
                className="min-h-32"
              />
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-400" />
                <p>Attach screenshots in your mail app after it opens. Result screens, payment references, and lobby screenshots make appeals much stronger.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                <a href={mailtoHref}>
                  <Send className="mr-2 h-4 w-4" />
                  Open appeal email
                </a>
              </Button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Email support directly
              </a>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/8 bg-background/35 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <FileText className="h-4 w-4 text-secondary" />
              What to include
            </div>
            <div className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
              <p>1. Your exact username and registered email</p>
              <p>2. Your Free Fire UID</p>
              <p>3. Match name or room details</p>
              <p>4. Screenshots of results, lobby, or payment proof</p>
            </div>
          </div>
        </div>
      }
    />
  );
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  "tournament-appeal": "Tournament appeal",
  "payment-dispute": "Payment dispute",
  "refund-request": "Refund request",
  "ban-review": "Ban review",
  "account-help": "Account help",
};
