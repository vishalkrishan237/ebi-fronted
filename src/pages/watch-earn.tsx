import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityAccessCard } from "@/components/community-access-card";
import { MessageCircle, PlayCircle } from "lucide-react";

export default function WatchEarnPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <PlayCircle className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">Community Updates</h1>
          <p className="text-muted-foreground">Referral bonuses and watch rewards are retired. The fastest way to stay updated is through the EBI WhatsApp community and direct support chat.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <CommunityAccessCard summary="Instead of referral and watch reward systems, EBI now uses one WhatsApp community for room updates, player support, and match confirmation." />

        <Card className="border-white/10 bg-card/60">
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Why this changed</p>
            <h2 className="text-2xl font-black uppercase tracking-[0.03em] text-foreground">Simpler player flow</h2>
            <p>
              We removed the old watch reward, coin, and referral system to keep the platform focused on matches, support, and direct player communication.
            </p>
            <p>
              Room drops, paid match instructions, and appeal follow-ups now move through the same WhatsApp community so players do not have to jump between extra features.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/lobby">Go to Lobby</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/10 bg-background/45">
                <Link href="/support">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Support & Appeals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
