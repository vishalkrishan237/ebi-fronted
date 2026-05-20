import React from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Hash, Mail, Sword, Trophy, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function formatMatchFee(entryFee: number) {
  return entryFee === 0 ? "Free" : `${entryFee.toLocaleString()} coins`;
}

function formatMatchPrize(prize: number) {
  return prize === 0 ? "Rule-based" : `${prize.toLocaleString()} coins`;
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center">Profile not found</div>;

  const { user, joinedMatches } = profile;
  const matchesWon = joinedMatches.filter((match) => match.wonByMe).length;
  const totalWinnings = joinedMatches.filter((match) => match.wonByMe).reduce((sum, match) => sum + match.prize, 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-6 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/80">Player Account</div>
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Profile Control Room</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Your mobile account view now keeps UID, balance, winnings, and match activity easy to read without horizontal squeezing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
        <div className="space-y-4 md:col-span-1">
          <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-card shadow-xl">
            <div className="h-20 bg-gradient-to-r from-primary via-cyan-400/70 to-secondary sm:h-24" />
            <CardContent className="relative px-4 pb-5 pt-0 sm:px-6 sm:pb-6">
              <Avatar className="absolute -top-10 h-20 w-20 border-4 border-card bg-background sm:-top-12 sm:h-24 sm:w-24">
                <AvatarFallback className="bg-primary/10 text-xl font-black text-primary sm:text-2xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="pt-12 sm:pt-16">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{user.username}</h2>
                  <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-primary">
                    Active
                  </Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-white/8 bg-background/60 p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      Email
                    </div>
                    <div className="break-all text-sm font-medium text-foreground">{user.email}</div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-background/60 p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                      <Hash className="h-3.5 w-3.5 text-secondary" />
                      Free Fire UID
                    </div>
                    <div className="font-mono text-sm font-semibold text-foreground">{user.freeFireUid}</div>
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/90">
                      <Coins className="h-3.5 w-3.5" />
                      Wallet Balance
                    </div>
                    <div className="text-lg font-black text-primary">{user.coinBalance.toLocaleString()} coins</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-3xl border-white/10 bg-card/60 px-4 py-5 text-center">
              <Trophy className="mx-auto mb-2 h-7 w-7 text-yellow-500" />
              <div className="text-3xl font-black">{matchesWon}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Wins</div>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-card/60 px-4 py-5 text-center">
              <Sword className="mx-auto mb-2 h-7 w-7 text-primary" />
              <div className="text-3xl font-black">{joinedMatches.length}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Matches</div>
            </Card>
          </div>

          <Card className="rounded-3xl border-white/10 bg-card/60">
            <CardContent className="p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Total Winnings</div>
              <div className="mt-2 text-2xl font-black text-yellow-500">{totalWinnings.toLocaleString()} coins</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Winning rewards from completed matches show up here so mobile players can check progress quickly.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full rounded-[2rem] border-white/10 bg-card/50">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xl font-black sm:text-2xl">Match History</CardTitle>
              <p className="text-sm text-muted-foreground">Every joined match is grouped into mobile-sized cards with the important details first.</p>
            </CardHeader>
            <CardContent className="p-0">
              {joinedMatches.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground sm:p-12">
                  <Sword className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p>You haven&apos;t joined any matches yet.</p>
                  <Button asChild className="mt-4 rounded-full" variant="outline">
                    <Link href="/lobby">Browse Lobby</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 sm:p-6">
                  {joinedMatches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-[1.75rem] border border-white/8 bg-background/55 p-4 shadow-[0_12px_32px_rgba(2,6,23,0.18)] transition-colors hover:bg-white/5 sm:p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-white/10 text-[10px] uppercase tracking-[0.2em]">
                          {match.status}
                        </Badge>
                        <Badge variant="outline" className="border-primary/15 bg-primary/10 text-[10px] uppercase tracking-[0.2em] text-primary">
                          {match.type}
                        </Badge>
                        {match.wonByMe && (
                          <Badge className="border border-yellow-500/50 bg-yellow-500/20 text-[10px] uppercase tracking-[0.2em] text-yellow-500">
                            <Trophy className="mr-1 h-3 w-3" />
                            Winner
                          </Badge>
                        )}
                      </div>

                      <Link href={`/matches/${match.id}`} className="mt-3 block text-xl font-black tracking-tight transition-colors hover:text-primary sm:text-2xl">
                        {match.name}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground sm:text-sm">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Joined {format(new Date(match.joinedAt), "MMM d, yyyy")}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/8 bg-card/60 p-3">
                          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Entry</div>
                          <div className="mt-1 font-semibold text-foreground">{formatMatchFee(match.entryFee)}</div>
                        </div>
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3">
                          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-yellow-500/80">Prize</div>
                          <div className="mt-1 font-semibold text-yellow-500">{formatMatchPrize(match.prize)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button asChild variant="outline" className="rounded-full border-white/10 bg-background/70">
                          <Link href={`/matches/${match.id}`}>
                            Open Match
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
