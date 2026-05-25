import { MessageCircle, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EBI_WHATSAPP_COMMUNITY_URL } from "@/lib/community";

export function CommunityAccessCard({
  title = "Join through WhatsApp Community",
  summary = "Follow the EBI WhatsApp community, watch the channel updates, then DM the admin personally to confirm your match slot and UPI payment.",
}: {
  title?: string;
  summary?: string;
}) {
  return (
    <div className="arena-shell p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/12">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Community access</p>
          <h2 className="text-2xl font-black uppercase tracking-[0.03em]">{title}</h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">{summary}</p>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-white/8 bg-background/35 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 text-secondary" />
            <p>Step 1. Join the EBI WhatsApp community and follow the channel updates for room details and announcements.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-background/35 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-4 w-4 text-secondary" />
            <p>Step 2. DM the admin personally with your username, Free Fire UID, and match name. Paid rooms are confirmed manually by UPI.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-background/35 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-secondary" />
            <p>Step 3. Wait for your room confirmation in WhatsApp before match time. This keeps entries simple while payment gateway onboarding is paused.</p>
          </div>
        </div>
      </div>

      <Button asChild className="mt-6 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
        <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
          Join EBI WhatsApp Community
        </a>
      </Button>
    </div>
  );
}
