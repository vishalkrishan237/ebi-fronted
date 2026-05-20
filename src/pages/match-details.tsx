import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetMatch, useJoinMatch, useGetMe, getGetMatchQueryKey, getGetMeQueryKey, getListMatchesQueryKey, getGetProfileQueryKey, getGetRewardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRegisterSquadMatch } from "@/lib/platform-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Trophy, Users, Calendar, ArrowLeft, Loader2, Sword } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  getDetailsHeroText,
  getLobbyEntryFeeText,
  getScoringRuleText,
  isFreeRulesMatch,
  isPaidCashSolo,
  isPaidSquadCashMatch,
  SOLO_CASH_PAYOUT_LINES,
  SOLO_CASH_PRIZE_POOL_INR,
  SQUAD_CASH_PRIZE_INR,
} from "@/lib/match-display";

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = Number(params.id);
  const { data: me } = useGetMe();
  const registerSquadMutation = useRegisterSquadMatch();
  const { data: match, isLoading } = useGetMatch(matchId, {
    query: { enabled: !!matchId, queryKey: getGetMatchQueryKey(matchId) },
  });
  const joinMutation = useJoinMatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [teamName, setTeamName] = useState("");
  const [teammateUids, setTeammateUids] = useState(["", "", ""]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Match not found</h2>
        <Button asChild variant="outline"><Link href="/lobby">Back to Lobby</Link></Button>
      </div>
    );
  }

  const isFull = match.slotsTaken >= match.slots;
  const isCompleted = match.status === "completed";
  const finalFee = match.type === "paid" ? match.entryFee : 0;
  const myCaptainSquad = match.squads?.find((squad) => squad.captainUserId === me?.user?.id) ?? null;
  const isSquadInviteMatch = match.isCaptainEntryOnly;

  const handleJoin = () => {
    if (!me?.user) {
      toast({ title: "Login required", description: "Please log in to join matches." });
      return;
    }

    if (me.user.coinBalance < finalFee) {
      toast({
        variant: "destructive",
        title: "Insufficient Coins",
        description: `You need ${finalFee} coins to join this match.`,
      });
      return;
    }

    joinMutation.mutate(
      { id: matchId, data: {} },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMatchQueryKey(matchId) });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRewardsQueryKey() });
          toast({
            title: "Match Joined",
            description: `You have successfully registered for ${match.name}.`,
          });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to join",
            description: err?.response?.data?.error ?? err.message ?? "An error occurred.",
          });
        },
      },
    );
  };

  const handleRegisterSquad = () => {
    if (!teamName.trim()) {
      toast({ variant: "destructive", title: "Team name required", description: "Set a squad name before registering." });
      return;
    }

    const cleanedUids = teammateUids.map((value) => value.trim());
    if (cleanedUids.some((value) => value.length === 0)) {
      toast({
        variant: "destructive",
        title: "Teammate UIDs required",
        description: "Enter all 3 teammate Free Fire UIDs before registering the squad.",
      });
      return;
    }

    registerSquadMutation.mutate(
      { matchId, teamName: teamName.trim(), teammateUids: cleanedUids },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: getGetMatchQueryKey(matchId) });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          toast({
            title: "Squad registered",
            description: `${result.teamName} locked in with ${result.members.length} verified players.`,
          });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Unable to register squad",
            description: err.message,
          });
        },
      },
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6 pl-0 text-muted-foreground hover:text-foreground">
        <Link href="/lobby"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Lobby</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card/70">
            <div className="absolute inset-0 z-0">
              <img src="/tournament-bg.png" alt="Tournament" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.95))]" />
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[300px]">
              <div className="flex gap-2 mb-4">
                <Badge variant={match.type === "paid" ? "default" : "secondary"} className="text-sm px-3 py-1 uppercase tracking-wider font-bold">
                  {match.type}
                </Badge>
                <Badge variant={isCompleted ? "destructive" : "outline"} className="text-sm px-3 py-1 bg-background/50 backdrop-blur-md">
                  {match.status}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{match.name}</h1>
              <p className="mb-4 max-w-3xl text-sm leading-7 text-muted-foreground">{getDetailsHeroText(match)}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                  <Calendar className="h-5 w-5 text-primary" />
                  {format(new Date(match.startsAt), "PPpp")}
                </div>
                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                  <Users className="h-5 w-5 text-secondary" />
                  {match.slotsTaken} / {match.slots} Players
                </div>
              </div>
            </div>
          </div>

          <Card className="border-white/10 bg-card/50">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-primary" />
                Participants ({match.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {match.participants.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No players have joined yet. Be the first.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {match.participants.map((participant, index) => (
                    <motion.div
                      key={participant.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">
                            {participant.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground">{participant.username}</p>
                          <p className="text-xs text-muted-foreground font-mono">UID: {participant.freeFireUid}</p>
                        </div>
                      </div>
                      {match.winnerUserId === participant.userId && (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50 flex items-center gap-1 px-3 py-1">
                          <Trophy className="h-3 w-3" /> Winner
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24 border-white/10 bg-card/75 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <CardContent className="p-6">
              <div className="space-y-6">
                {isFreeRulesMatch(match) ? (
                  <div className="p-4 rounded-2xl bg-background/60 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Match Rules</p>
                    <div className="text-xl font-black text-yellow-500 flex items-center justify-center gap-2">
                      <Trophy className="h-6 w-6" /> {getScoringRuleText(match)}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-background/60 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1 font-medium">Prize Pool</p>
                    <div className="text-4xl font-black text-yellow-500 flex items-center justify-center gap-2">
                      <Trophy className="h-8 w-8" />
                      {isPaidCashSolo(match)
                        ? `INR ${SOLO_CASH_PRIZE_POOL_INR}`
                        : isPaidSquadCashMatch(match)
                          ? `INR ${SQUAD_CASH_PRIZE_INR}`
                          : "Cash Prize"}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-muted-foreground font-medium">Entry Fee</span>
                  <span className="font-bold text-lg flex items-center gap-1.5">
                    {match.type === "free" ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      <>{getLobbyEntryFeeText(match)}</>
                    )}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/8 bg-background/35 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {isFreeRulesMatch(match) ? "Scoring Rules" : "Tournament Rules"}
                  </p>
                  {isFreeRulesMatch(match) ? (
                    <p className="mt-2 text-sm text-muted-foreground">{getScoringRuleText(match)}</p>
                  ) : isPaidCashSolo(match) ? (
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p>Top 5 cash payout for this match:</p>
                      <div className="space-y-1">
                        {SOLO_CASH_PAYOUT_LINES.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ) : isPaidSquadCashMatch(match) ? (
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p>Captain pays once and submits 3 teammate Free Fire UIDs.</p>
                      <p>Every teammate must already be signed up in the system before the squad can be accepted.</p>
                      <p>Cash prize for the squad: INR {SQUAD_CASH_PRIZE_INR}.</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">{match.description}</p>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">
                    Minimum players before start: {match.minPlayersToStart}. Format: {match.mode.toUpperCase()} {match.teamSize > 1 ? `${match.teamSize}v${match.teamSize}` : ""}
                  </p>
                </div>

                {isSquadInviteMatch && (
                  <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4 space-y-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">4v4 Captain Flow</p>
                    <p className="text-sm text-muted-foreground">
                      Captain pays INR {match.entryFeeInr}, then enters 3 teammate Free Fire UIDs. We verify each UID against signed-up players before adding the squad to the match.
                    </p>

                    {myCaptainSquad ? (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-white/10 bg-background/50 p-3 text-sm text-muted-foreground">
                          Squad registered successfully. Verified roster:
                        </div>
                        <div className="space-y-2">
                          {myCaptainSquad.members.map((member) => (
                            <div
                              key={member.userId}
                              className="rounded-xl border border-white/10 bg-background/50 px-3 py-2 text-sm"
                            >
                              <div className="font-semibold text-foreground">{member.username}</div>
                              <div className="text-xs text-muted-foreground">UID: {member.freeFireUid}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : !match.joinedByMe ? (
                      <div className="space-y-3">
                        <Input
                          value={teamName}
                          onChange={(event) => setTeamName(event.target.value)}
                          placeholder="Enter your squad name"
                          className="border-white/10 bg-background/50"
                        />
                        {teammateUids.map((uid, index) => (
                          <Input
                            key={index}
                            value={uid}
                            onChange={(event) => {
                              const next = [...teammateUids];
                              next[index] = event.target.value;
                              setTeammateUids(next);
                            }}
                            placeholder={`Teammate ${index + 1} Free Fire UID`}
                            className="border-white/10 bg-background/50"
                          />
                        ))}
                        <Button
                          onClick={handleRegisterSquad}
                          disabled={registerSquadMutation.isPending}
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          {registerSquadMutation.isPending ? "Registering squad..." : "Pay and Register Squad"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <Badge variant={isCompleted ? "destructive" : "outline"} className="font-bold">
                    {match.status.toUpperCase()}
                  </Badge>
                </div>

                {isCompleted && match.winnerUsername && (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center space-y-2">
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Tournament Winner</p>
                    <p className="text-xl font-bold text-foreground">{match.winnerUsername}</p>
                  </div>
                )}

                <div className="pt-4">
                  {!me?.user ? (
                    <Button asChild className="w-full h-12 text-base font-bold">
                      <Link href="/login">Log in to Join</Link>
                    </Button>
                  ) : match.joinedByMe ? (
                    <Button disabled className="w-full h-12 text-base font-bold bg-green-500/20 text-green-500 border border-green-500/50 opacity-100">
                      You are registered
                    </Button>
                  ) : isCompleted ? (
                    <Button disabled variant="secondary" className="w-full h-12 text-base font-bold">
                      Match Finished
                    </Button>
                  ) : isFull ? (
                    <Button disabled variant="secondary" className="w-full h-12 text-base font-bold">
                      Match Full
                    </Button>
                  ) : isSquadInviteMatch ? (
                    <Button
                      onClick={handleRegisterSquad}
                      disabled={registerSquadMutation.isPending}
                      className="w-full h-12 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      {registerSquadMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pay and Register Squad"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoin}
                      disabled={joinMutation.isPending}
                      className="w-full h-12 text-base font-bold bg-primary text-primary-foreground shadow-[0_0_24px_rgba(34,211,238,0.18)] hover:bg-primary/90"
                    >
                      {joinMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Join Tournament"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
