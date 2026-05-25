import React from "react";
import { useGetMatch } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, MessageCircle, ShieldCheck, Trophy, Users } from "lucide-react";
import { format } from "date-fns";
import {
  getDetailsHeroText,
  getLobbyEntryFeeText,
  getLobbyPrizeSubtext,
  getLobbyPrizeText,
  isPaidSquadCashMatch,
} from "@/lib/match-display";
import { EBI_WHATSAPP_COMMUNITY_URL } from "@/lib/community";

export default function MatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);
  const { data: match, isLoading } = useGetMatch(matchId);

  if (isLoading) {
    return <div className="p-8 text-center">Loading match...</div>;
  }

  if (!match) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Match not found</h2>
        <Button asChild variant="outline">
          <Link href="/lobby">Back to Lobby</Link>
        </Button>
      </div>
    );
  }

  const isSquadFlow = isPaidSquadCashMatch(match) || match.isCaptainEntryOnly;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 pl-0 text-muted-foreground hover:text-foreground">
        <Link href="/lobby">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lobby
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card/70">
            <div className="absolute inset-0 z-0">
              <img src="/tournament-bg.png" alt="Tournament" className="h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.95))]" />
            </div>

            <div className="relative z-10 flex min-h-[320px] flex-col justify-end p-8 md:p-12">
              <div className="mb-4 flex gap-2">
                <Badge className="px-3 py-1 text-sm font-bold uppercase tracking-wider">Paid</Badge>
                <Badge variant={match.status === "completed" ? "destructive" : "outline"} className="bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
                  {match.status}
                </Badge>
              </div>

              <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">{match.name}</h1>
              <p className="mb-4 max-w-3xl text-sm leading-7 text-muted-foreground">{getDetailsHeroText(match)}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-background/50 px-4 py-2 backdrop-blur-md">
                  <Calendar className="h-5 w-5 text-primary" />
                  {format(new Date(match.startsAt), "PPpp")}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-background/50 px-4 py-2 backdrop-blur-md">
                  <Users className="h-5 w-5 text-secondary" />
                  {match.slotsTaken} / {match.slots} Players
                </div>
              </div>
            </div>
          </div>

          <Card className="border-white/10 bg-card/50">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {isSquadFlow ? "Registered Teams" : `Participants (${match.participants.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isSquadFlow ? (
                !match.squads || match.squads.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    No captain has confirmed a team yet. The first captain fills 4 seats after manual WhatsApp and UPI confirmation.
                  </div>
                ) : (
                  <div className="grid gap-px bg-white/5 md:grid-cols-2">
                    {match.squads.map((squad) => (
                      <div key={squad.id} className="bg-card/60 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Team {squad.side}</p>
                            <h3 className="mt-2 text-2xl font-black">{squad.teamName}</h3>
                          </div>
                          <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
                            {squad.members.length} / 4 players
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-3">
                          {squad.members.map((member, index) => (
                            <div key={member.userId} className="flex items-center justify-between rounded-2xl border border-white/8 bg-background/55 px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-white/10">
                                  <AvatarFallback className="bg-primary/20 font-bold text-primary">
                                    {member.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-foreground">{member.username}</p>
                                  <p className="font-mono text-xs text-muted-foreground">UID: {member.freeFireUid}</p>
                                </div>
                              </div>
                              {index === 0 && <Badge className="border-primary/30 bg-primary/10 text-primary">Captain</Badge>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : match.participants.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No players are listed here yet. WhatsApp confirmations are handled manually by the admin.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {match.participants.map((participant) => (
                    <div key={participant.userId} className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarFallback className="bg-primary/20 font-bold text-primary">
                            {participant.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground">{participant.username}</p>
                          <p className="font-mono text-xs text-muted-foreground">UID: {participant.freeFireUid}</p>
                        </div>
                      </div>
                      {match.winnerUserId === participant.userId && (
                        <Badge className="border-yellow-500/50 bg-yellow-500/20 text-yellow-500">Winner</Badge>
                      )}
                    </div>
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
                <div className="rounded-2xl border border-white/5 bg-background/60 p-4 text-center">
                  <p className="mb-1 text-sm font-medium text-muted-foreground">Prize Pool</p>
                  <div className="flex items-center justify-center gap-2 text-4xl font-black text-yellow-500">
                    <Trophy className="h-8 w-8" />
                    {getLobbyPrizeText(match)}
                  </div>
                  {getLobbyPrizeSubtext(match) && (
                    <p className="mt-3 text-sm text-muted-foreground">{getLobbyPrizeSubtext(match)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between border-b border-white/5 py-4">
                  <span className="font-medium text-muted-foreground">Entry Fee</span>
                  <span className="text-lg font-bold">{getLobbyEntryFeeText(match)}</span>
                </div>

                <div className="rounded-2xl border border-white/8 bg-background/35 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">How to Join</p>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
                    <p>1. Join the EBI WhatsApp community with the button below.</p>
                    <p>2. Follow the channel updates so you do not miss room details and deadlines.</p>
                    <p>
                      3. DM the admin personally with your username, Free Fire UID, and match name.
                      {isSquadFlow
                        ? " Captains should also send their squad name and 3 teammate UIDs."
                        : ""}
                    </p>
                    <p>4. Pay manually on UPI after the admin confirms your slot.</p>
                    <p>5. Wait for your room confirmation before match time.</p>
                  </div>
                </div>

                {isSquadFlow && (
                  <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-muted-foreground">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Clash Squad captain note</p>
                    <p className="mt-2">
                      Captain 1 pays and locks the first 4 seats. Captain 2 pays next and locks the other 4 seats. One Clash Squad room becomes active once both captains are confirmed.
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-primary/15 bg-primary/10 p-4 text-sm text-foreground">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Manual confirmation is active
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Payment gateway onboarding is paused, so every slot is approved manually through the WhatsApp community and direct UPI confirmation.
                  </p>
                </div>

                <Button asChild className="h-12 w-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90">
                  <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Join EBI WhatsApp Community
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
