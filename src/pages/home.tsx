import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronRight, MessageCircle, Shield, Trophy, Users } from "lucide-react";
import { EBI_WHATSAPP_COMMUNITY_URL } from "@/lib/community";

const featureCards = [
  {
    icon: Trophy,
    title: "Daily Match Queue",
    copy: "Solo rooms and Clash Squad fixtures are posted with cleaner match cards, clear prize pools, and direct WhatsApp instructions instead of messy payment gateway friction.",
  },
  {
    icon: Users,
    title: "Captain Based Squad Flow",
    copy: "For Clash Squad rooms, captain one locks the first 4 seats, captain two locks the other 4 seats, and both teams are confirmed manually through WhatsApp.",
  },
  {
    icon: Shield,
    title: "Simple Manual Entry",
    copy: "Players join the community, follow the channel, DM the admin personally, and confirm their slot with direct UPI payment before the room goes live.",
  },
  {
    icon: MessageCircle,
    title: "Community First Support",
    copy: "Announcements, room details, appeals, and support now live around the EBI WhatsApp community so players know exactly where to go.",
  },
];

const heroStats = [
  { label: "Match Types", value: "Solo and 4v4 Clash Squad" },
  { label: "Entry Flow", value: "WhatsApp and direct UPI" },
  { label: "Community", value: "One hub for rooms and support" },
];

const matchHighlights = [
  {
    title: "Paid Solo Rooms",
    subtitle: "Manual confirmation",
    detail: "Join the community, DM the admin, confirm your UPI payment, and lock your slot for the next solo room.",
    icon: Trophy,
  },
  {
    title: "Clash Squad",
    subtitle: "2 captains, 8 seats",
    detail: "One captain fills the first 4 seats, the second captain fills the other 4 seats, and the room becomes a full 4v4 battle.",
    icon: Users,
  },
  {
    title: "Community Drops",
    subtitle: "Fast updates",
    detail: "Room announcements, last-minute changes, and support replies are pushed through the EBI WhatsApp community first.",
    icon: CalendarClock,
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
                  <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
                    Join WhatsApp Community
                  </a>
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
                  Community Live
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <PanelMetric label="Solo Rooms" value="WhatsApp confirmed entry" icon={Trophy} />
                <PanelMetric label="Clash Squad" value="Captain 1 then captain 2" icon={Users} />
                <PanelMetric label="Support" value="DM admin directly" icon={MessageCircle} />
                <PanelMetric label="Room Control" value="Announcements in community" icon={CalendarClock} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-secondary/80">Platform Upgrade</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-[0.04em]">Built to feel tournament ready</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            The goal is simple: cleaner match cards, direct player communication, and a manual entry flow that players can actually understand from the first click.
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
