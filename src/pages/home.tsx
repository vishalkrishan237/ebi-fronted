import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, Video, Users, ChevronRight, Coins } from "lucide-react";

const featureCards = [
  {
    icon: Trophy,
    title: "Tournament Operations",
    copy: "Daily brackets, verified winners, and a clean competitive flow that feels like a real gaming platform.",
  },
  {
    icon: Video,
    title: "Watch & Earn",
    copy: "Timed video rewards feed directly into the wallet ledger so engagement payouts stay auditable.",
  },
  {
    icon: Shield,
    title: "Ledger-Safe Wallet",
    copy: "Balance mutations route through immutable wallet entries and audit events instead of loose balance edits.",
  },
  {
    icon: Users,
    title: "Referral Growth",
    copy: "Every player gets a unique referral code, and each verified friend pays out a one-time server-side reward.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-white/6">
        <div className="absolute inset-0">
          <img src="/hero-bg.png" alt="Arena" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_32%),radial-gradient(circle_at_82%_18%,_rgba(244,114,182,0.15),_transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.45),rgba(2,6,23,0.92))]" />
          <div className="absolute inset-x-[-20%] top-10 h-24 rotate-[-8deg] bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-2xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
          <div className="grid gap-10 xl:grid-cols-[1.35fr_0.85fr] xl:items-end">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-xs uppercase tracking-[0.35em] text-primary/80"
              >
                Professional Esports Platform
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="max-w-4xl text-5xl md:text-7xl font-black tracking-tight text-foreground"
              >
                A neon-lit arena for{" "}
                <span className="bg-gradient-to-r from-primary via-cyan-200 to-secondary bg-clip-text text-transparent">
                  competitive players
                </span>
                .
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 max-w-2xl text-lg md:text-xl leading-8 text-muted-foreground"
              >
                Queue into live tournaments, collect verified wallet rewards, and build growth loops that feel premium instead of patched together.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(34,211,238,0.22)]">
                  <Link href="/lobby">
                    Enter Tournament Lobby
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/10 bg-card/45 hover:bg-white/5">
                  <Link href="/watch-earn">Open Watch & Earn</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="arena-shell arena-scan p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <PanelMetric label="Verified Rewards" value="Wallet-ledger" icon={Coins} />
                <PanelMetric label="Referral Payout" value="+25 coins" icon={Users} />
                <PanelMetric label="Daily Login" value="+20 coins" icon={Video} />
                <PanelMetric label="Welcome Bonus" value="+400 coins" icon={Trophy} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <h2 className="text-2xl font-black">{card.title}</h2>
                  <p className="mt-3 text-muted-foreground leading-7">{card.copy}</p>
                </div>
              </div>
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
    <div className="arena-chip rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="mt-3 text-lg font-black">{value}</div>
    </div>
  );
}
