import React, { useState } from "react";
import { useListMatches } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageCircle, ShieldCheck, Sword, Trophy, Users } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CommunityAccessCard } from "@/components/community-access-card";
import {
  getLobbyEntryFeeText,
  getLobbyPrizeSubtext,
  getLobbyPrizeText,
  getLobbyPrizeTitle,
  getLobbySummaryText,
  isTwoVTwoLoneWolfMatch,
} from "@/lib/match-display";
import { EBI_WHATSAPP_COMMUNITY_URL } from "@/lib/community";

export default function LobbyPage() {
  const { data: matches, isLoading } = useListMatches();
  const [filter, setFilter] = useState<"all" | "solo" | "squad">("all");

  const filteredMatches = matches?.filter((match) => {
    if (filter === "all") return true;
    return match.mode === filter;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Tournament Lobby</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every room is confirmed through the EBI WhatsApp community. Join the community, follow the channel, then DM the admin personally to confirm your slot. Paid rooms need manual UPI confirmation, and free rooms still need admin slot approval.
          </p>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="w-full lg:w-auto">
          <TabsList className="grid w-full grid-cols-3 lg:w-[320px]">
            <TabsTrigger value="all">All Rooms</TabsTrigger>
            <TabsTrigger value="solo">Solo</TabsTrigger>
            <TabsTrigger value="squad">Clash Squad</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="arena-shell p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/12">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Manual entry flow</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-[0.03em]">WhatsApp first, match next</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                Room entries are handled manually for now. You join the community, check the channel updates, DM the admin with your username and Free Fire UID, then confirm payment on UPI for paid rooms before room details are shared.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <InfoStrip label="Solo rooms" value="Free and paid slots" icon={Trophy} />
            <InfoStrip label="Clash Squad" value="2 captains lock 8 seats" icon={Users} />
            <InfoStrip label="Support" value="WhatsApp DM confirmation" icon={ShieldCheck} />
          </div>
        </div>

        <CommunityAccessCard summary="Use the EBI WhatsApp community for every room. Follow the channel, DM the admin, pay manually on UPI for paid rooms, and wait for your slot confirmation before match time." />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="h-64 animate-pulse border-white/5 bg-card/50" />
          ))}
        </div>
      ) : filteredMatches?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 py-20 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-muted">
            <Sword className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-bold">No matches found</h3>
          <p className="mt-2 text-muted-foreground">Check back in the community for the next room drop.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMatches?.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-card/55 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[0_24px_44px_rgba(0,0,0,0.32)]">
                <div className="h-2 w-full bg-gradient-to-r from-primary/50 to-secondary/50" />
                <CardContent className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="font-bold uppercase tracking-wider">
                      {match.type === "free" ? "Free" : "Paid"}
                    </Badge>
                    <Badge variant={match.status === "open" ? "outline" : "destructive"} className="border-white/10">
                      {match.status}
                    </Badge>
                  </div>

                  <h3 className="line-clamp-1 text-xl font-bold transition-colors group-hover:text-primary">{match.name}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {getLobbySummaryText(match)}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        Entry
                      </div>
                      <div className="text-lg font-bold">{getLobbyEntryFeeText(match)}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {getLobbyPrizeTitle(match)}
                      </div>
                      <div className="text-lg font-bold text-yellow-500">{getLobbyPrizeText(match)}</div>
                      {getLobbyPrizeSubtext(match) && (
                        <div className="text-xs leading-5 text-muted-foreground">{getLobbyPrizeSubtext(match)}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between rounded-md bg-background/50 p-2">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Slots
                      </span>
                      <span className="font-medium text-foreground">
                        {match.slotsTaken} / {match.slots}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-background/50 p-2">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Starts
                      </span>
                      <span className="font-medium text-foreground">
                        {format(new Date(match.startsAt), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-background/50 p-2">
                      <span>Format</span>
                      <span className="font-medium uppercase text-foreground">
                        {match.mode} {match.teamSize > 1 ? `${match.teamSize}v${match.teamSize}` : ""}
                      </span>
                    </div>
                    {match.isCaptainEntryOnly && (
                      <div className="flex items-center justify-between rounded-md bg-background/50 p-2">
                        <span>Captain Flow</span>
                        <span className="font-medium text-foreground">2 captains x 4 seats</span>
                      </div>
                    )}
                    {isTwoVTwoLoneWolfMatch(match) && (
                      <div className="flex items-center justify-between rounded-md bg-background/50 p-2">
                        <span>Room Style</span>
                        <span className="font-medium text-foreground">2 teams x 2 slots</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="mt-auto grid gap-3 p-6 pt-0">
                  <Button asChild className="w-full font-bold">
                    <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
                      Join on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-white/10 bg-background/45">
                    <Link href={`/matches/${match.id}`}>View Match Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoStrip({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-background/35 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-4 w-4 text-secondary" />
        {label}
      </div>
      <div className="mt-3 text-lg font-black">{value}</div>
    </div>
  );
}
