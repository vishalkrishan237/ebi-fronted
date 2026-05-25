import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommunityAccessCard } from "@/components/community-access-card";
import { Ticket } from "lucide-react";

export default function CouponsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Ticket className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">Community Entry Desk</h1>
          <p className="text-muted-foreground">Coupons and coin discounts have been retired. Match entry is now confirmed directly through the EBI WhatsApp community.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <CommunityAccessCard />

        <Card className="border-white/10 bg-card/60">
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">What changed</p>
            <h2 className="text-2xl font-black uppercase tracking-[0.03em] text-foreground">Coins and coupons removed</h2>
            <p>
              The old coupon store and coin wallet have been removed to keep the platform simpler. Every paid room is now handled manually through WhatsApp and direct UPI confirmation with the admin.
            </p>
            <p>
              If you want to join a room, open the lobby, pick your match, then use the WhatsApp community button to reserve your slot.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/lobby">Open Tournament Lobby</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-background/45">
                <Link href="/support">Support & Appeals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
