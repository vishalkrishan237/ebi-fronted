import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityAccessCard } from "@/components/community-access-card";
import { MessageCircle } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">WhatsApp Payment Flow</h1>
          <p className="text-muted-foreground">Wallet top-ups and payment gateway checkout are paused. Match confirmations now happen manually inside the EBI WhatsApp community.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <CommunityAccessCard summary="Use the community for room drops, DM the admin for your slot, then confirm manual UPI payment. This replaces the old wallet top-up and payment gateway flow." />

        <Card className="border-white/10 bg-card/60">
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current setup</p>
            <h2 className="text-2xl font-black uppercase tracking-[0.03em] text-foreground">Manual room confirmation</h2>
            <p>
              Payment gateway onboarding is paused, so no in-site top-up or coupon purchase is active right now. Players should use the WhatsApp community for every paid room.
            </p>
            <p>
              The admin confirms slots manually, shares final room instructions in the community, and handles direct UPI payment confirmation there.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/lobby">Browse Matches</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-background/45">
                <Link href="/support">Open Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
