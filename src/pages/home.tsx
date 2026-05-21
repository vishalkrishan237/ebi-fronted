import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CalendarClock,
  ChevronRight,
  Coins,
  Crosshair,
  Shield,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

const featureCards = [
  {
    icon: Trophy,
    title: "Daily Match Queue",
    copy: "Solo rooms, cash tournaments, and Clash Squad fixtures are laid out like a proper event board instead of a random game list.",
  },
  {
    icon: Users,
    title: "Captain-Based Squad Flow",
    copy: "One captain pays for the full 4-player team, the second captain fills the other side, and the room becomes a real 4v4 match.",
  },
  {
    icon: Shield,
    title: "Verified Player Records",
    copy: "Wallet moves, registrations, and winner updates are tracked so the platform feels trustworthy for real players.",
  },
  {
    icon: Ticket,
    title: "Coin-to-Coupon Store",
    copy: "Players can convert coins into rupee coupons with clear values that feel like a real esports wallet perk.",
  },
];

const heroStats = [
  { label: "Formats", value: "Solo and 4v4 Clash Squad" },
  { label: "Captain Flow", value: "4 seats locked per payment" },
  { label: "Rewards", value: "Wallet, coupons, leaderboard" },
];

const matchHighlights = [
  {
    title: "Custom Rooms",
    subtitle: "Free Fire players",
    detail: "50-slot solo rooms with clean start gates and rule-based reward copy.",
    icon: Crosshair,
  },
  {
    title: "Cash Matches",
    subtitle: "Top 5 payout view",
    detail: "Paid solo tournaments display entry fee and payout ladder in simple INR language.",
    icon: Coins,
  },
  {
    title: "Clash Squad",
    subtitle: "2 captains, 2 teams",
    detail: "The first captain creates team one, the second captain creates team two, and the room fills as 8 total seats.",
    icon: Users,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-white/6">
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="Arena" className="h-full w-full object-cover opacity-20 saturate-0" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,13,0.95),rgba(10,10,13,0.72)_55%,rgba(10,10,13,0.88)),linear-gradient(180deg,rgba(10,10,13,0.12),rgba(10,10,13,0.92))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/35 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-xs uppercase tracking-[0.35em] text-secondary/80"
              >
                India Free Fire Tournament Hub
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="max-w-4xl text-5xl font-black uppercase tracking-[0.03em] text-foreground md:text-7xl"
              >
                Real match flow for
                <span className="block text-secondary"> serious esports players</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl"
              >
                Welcome to Elite Battle India, the ultimate hub for competitive gamers. Compete in high-stakes Free Fire tournaments, climb the leaderboard, and instantly cash out your winnings. Dominate the arena today.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Button asChild size="lg" className="h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/lobby">
                    Enter Tournament Lobby
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/10 bg-card/45 hover:bg-white/5">
                  <Link href="/coupons">Open Coupon Store</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 grid gap-3 md:grid-cols-3"
              >
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/8 bg-black/25 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-lg font-bold leading-6">{stat.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="arena-shell p-6"
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Tonight&apos;s Match Desk</p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.04em]">Queue Overview</h2>
                </div>
                <div className="rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  Live Setup
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <PanelMetric label="Solo Cash Room" value="Top 5 payout board" icon={Trophy} />
                <PanelMetric label="Coupon Values" value="1000 coins = Rs. 10" icon={Ticket} />
                <PanelMetric label="Clash Squad" value="Captain pays for 4 seats" icon={Users} />
                <PanelMetric label="Match Control" value="2 captains create 2 teams" icon={CalendarClock} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-secondary/80">Platform Upgrade</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[0.04em]">Built to feel tournament-ready</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            The goal is simple: less fake sci-fi styling, more structure that looks like players can actually trust it for daily rooms and cash matches.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="arena-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-[0.03em]">{card.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{card.copy}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {matchHighlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.05 }}
              className="arena-card p-6"
            >
              <div className="flex items-center justify-between">
                <item.icon className="h-6 w-6 text-secondary" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{item.subtitle}</span>
              </div>
              <h3 className="mt-6 text-3xl font-black uppercase tracking-[0.03em]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PanelMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-background/55 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-4 w-4 text-secondary" />
        {label}
      </div>
      <div className="mt-3 text-lg font-black uppercase tracking-[0.03em]">{value}</div>
    </div>
  );
}
