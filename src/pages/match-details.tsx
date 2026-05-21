import React, { useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetMatch,
  useJoinMatch,
  useGetMe,
  usePreviewCoupon,
  type CouponPreview,
  getGetMatchQueryKey,
  getGetMeQueryKey,
  getListMatchesQueryKey,
  getGetMyCouponsQueryKey,
  getGetProfileQueryKey,
  getGetRewardsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateMatchEntryOrder,
  useRegisterSquadMatch,
  useVerifyMatchEntryPayment,
} from "@/lib/platform-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Sword,
  Ticket,
  Check,
  X,
  IndianRupee,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  getDetailsHeroText,
  getLobbyEntryFeeText,
  getScoringRuleText,
  getSoloCashPayoutLines,
  getSoloCashPrizePoolInr,
  isFreeRulesMatch,
  isPaidCashSolo,
  isPaidSquadCashMatch,
  SQUAD_CASH_PRIZE_INR,
} from "@/lib/match-display";
import { loadRazorpayScript } from "@/lib/razorpay";

export default function MatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);
  const { data: me } = useGetMe();
  const registerSquadMutation = useRegisterSquadMatch();
  const previewCoupon = usePreviewCoupon();
  const createMatchEntryOrder = useCreateMatchEntryOrder();
  const verifyMatchEntryPayment = useVerifyMatchEntryPayment();
  const { data: match, isLoading } = useGetMatch(matchId, {
    query: { enabled: !!matchId, queryKey: getGetMatchQueryKey(matchId) },
  });
  const joinMutation = useJoinMatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [teamName, setTeamName] = useState("");
  const [teammateUids, setTeammateUids] = useState(["", "", ""]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponPreview | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

  const isFull = match.slotsTaken >= match.slots;
  const isCompleted = match.status === "completed";
  const originalEntryFeeInr = match.type === "paid" ? match.entryFeeInr : 0;
  const couponDiscountInr = appliedCoupon
    ? Math.min(appliedCoupon.valueInr, originalEntryFeeInr)
    : 0;
  const finalEntryFeeInr = Math.max(0, originalEntryFeeInr - couponDiscountInr);
  const myCaptainSquad =
    match.squads?.find((squad) => squad.captainUserId === me?.user?.id) ?? null;
  const isSquadInviteMatch = match.isCaptainEntryOnly;
  const registeredSquads = match.squads?.length ?? 0;
  const isPaidEntry = match.type === "paid";
  const isEntryBusy =
    joinMutation.isPending ||
    registerSquadMutation.isPending ||
    createMatchEntryOrder.isPending ||
    verifyMatchEntryPayment.isPending;

  const refreshEntryQueries = () => {
    queryClient.invalidateQueries({ queryKey: getGetMatchQueryKey(matchId) });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRewardsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetMyCouponsQueryKey() });
  };

  const resetCouponState = () => {
    setCouponInput("");
    setAppliedCoupon(null);
  };

  const validateSquadForm = () => {
    if (!teamName.trim()) {
      toast({
        variant: "destructive",
        title: "Team name required",
        description: "Set a squad name before registering.",
      });
      return null;
    }

    const cleanedUids = teammateUids.map((value) => value.trim());
    if (cleanedUids.some((value) => value.length === 0)) {
      toast({
        variant: "destructive",
        title: "Teammate UIDs required",
        description: "Enter all 3 teammate Free Fire UIDs before registering the squad.",
      });
      return null;
    }

    return {
      teamName: teamName.trim(),
      teammateUids: cleanedUids,
    };
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      toast({
        variant: "destructive",
        title: "Enter a code",
        description: "Type your coupon code first.",
      });
      return;
    }

    previewCoupon.mutate(
      { data: { code } },
      {
        onSuccess: (preview) => {
          setAppliedCoupon(preview);
          toast({
            title: "Coupon applied",
            description: `INR ${preview.valueInr} discount added to this match entry.`,
          });
        },
        onError: (error: any) => {
          setAppliedCoupon(null);
          toast({
            variant: "destructive",
            title: "Coupon invalid",
            description: error?.response?.data?.error ?? error.message ?? "Could not apply that code.",
          });
        },
      },
    );
  };

  const handleRemoveCoupon = () => {
    resetCouponState();
  };

  const handleJoin = () => {
    if (!me?.user) {
      toast({ title: "Login required", description: "Please log in to join matches." });
      return;
    }

    joinMutation.mutate(
      { id: matchId, data: {} },
      {
        onSuccess: () => {
          refreshEntryQueries();
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

  const handleRegisterFreeSquad = () => {
    const squadData = validateSquadForm();
    if (!squadData) {
      return;
    }

    registerSquadMutation.mutate(
      {
        matchId,
        teamName: squadData.teamName,
        teammateUids: squadData.teammateUids,
      },
      {
        onSuccess: (result) => {
          refreshEntryQueries();
          toast({
            title: "Team locked",
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

  const handlePaidEntry = async () => {
    if (!me?.user) {
      toast({ title: "Login required", description: "Please log in to join matches." });
      return;
    }

    const squadData = isSquadInviteMatch ? validateSquadForm() : null;
    if (isSquadInviteMatch && !squadData) {
      return;
    }

    if (finalEntryFeeInr > 0) {
      const hasSdk = await loadRazorpayScript();
      if (!hasSdk || !window.Razorpay) {
        toast({
          title: "Checkout unavailable",
          description: "Razorpay checkout could not load.",
          variant: "destructive",
        });
        return;
      }
    }

    createMatchEntryOrder.mutate(
      {
        matchId,
        couponCode: appliedCoupon?.code,
        teamName: squadData?.teamName,
        teammateUids: squadData?.teammateUids,
      },
      {
        onSuccess: (result) => {
          if (!result.requiresPayment) {
            refreshEntryQueries();
            toast({
              title: isSquadInviteMatch ? "Team locked" : "Match Joined",
              description: result.couponCodeUsed
                ? `${match.name} registered using coupon ${result.couponCodeUsed}.`
                : `You have successfully registered for ${match.name}.`,
            });
            resetCouponState();
            return;
          }

          const razorpay = new window.Razorpay!({
            key: result.keyId,
            amount: result.amountPaise,
            currency: result.currency,
            name: "Elite Battle India",
            description: isSquadInviteMatch
              ? `${result.match.name} squad captain entry`
              : `${result.match.name} tournament entry`,
            order_id: result.orderId,
            prefill: result.prefill,
            theme: {
              color: "#a72e20",
            },
            handler: (response: Record<string, unknown>) => {
              verifyMatchEntryPayment.mutate(
                {
                  matchId,
                  razorpayOrderId: String(response["razorpay_order_id"] ?? ""),
                  razorpayPaymentId: String(response["razorpay_payment_id"] ?? ""),
                  razorpaySignature: String(response["razorpay_signature"] ?? ""),
                },
                {
                  onSuccess: (verified) => {
                    refreshEntryQueries();
                    toast({
                      title: isSquadInviteMatch ? "Team locked" : "Match Joined",
                      description: verified.couponCodeUsed
                        ? `${verified.match.name} registered with coupon ${verified.couponCodeUsed}.`
                        : `Payment confirmed for ${verified.match.name}.`,
                    });
                    resetCouponState();
                  },
                  onError: (error: any) => {
                    toast({
                      title: "Verification failed",
                      description:
                        error?.message ?? "Payment completed but match entry verification failed.",
                      variant: "destructive",
                    });
                  },
                },
              );
            },
          });

          razorpay.open();
        },
        onError: (error: any) => {
          toast({
            title: "Unable to start payment",
            description: error?.message ?? "Could not create match entry payment.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-6 pl-0 text-muted-foreground hover:text-foreground">
        <Link href="/lobby">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lobby
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-card/70">
            <div className="absolute inset-0 z-0">
              <img src="/tournament-bg.png" alt="Tournament" className="h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.95))]" />
            </div>

            <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-8 md:p-12">
              <div className="mb-4 flex gap-2">
                <Badge variant={match.type === "paid" ? "default" : "secondary"} className="px-3 py-1 text-sm font-bold uppercase tracking-wider">
                  {match.type}
                </Badge>
                <Badge variant={isCompleted ? "destructive" : "outline"} className="bg-background/50 px-3 py-1 text-sm backdrop-blur-md">
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
                <Sword className="h-5 w-5 text-primary" />
                {isSquadInviteMatch
                  ? `Clash Squad Teams (${registeredSquads}/2)`
                  : `Participants (${match.participants.length})`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isSquadInviteMatch ? (
                !match.squads || match.squads.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    No captain has locked a team yet. The first payment fills 4 seats for team one.
                  </div>
                ) : (
                  <div className="grid gap-px bg-white/5 md:grid-cols-2">
                    {match.squads.map((squad) => (
                      <div key={squad.id} className="bg-card/60 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              Team {squad.side}
                            </p>
                            <h3 className="mt-2 text-2xl font-black">{squad.teamName}</h3>
                          </div>
                          <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
                            {squad.members.length} / 4 players
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-3">
                          {squad.members.map((member, index) => (
                            <div
                              key={member.userId}
                              className="flex items-center justify-between rounded-2xl border border-white/8 bg-background/55 px-4 py-3"
                            >
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
                              {index === 0 && (
                                <Badge className="border-primary/30 bg-primary/10 text-primary">
                                  Captain
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : match.participants.length === 0 ? (
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
                      className="flex items-center justify-between p-4 transition-colors hover:bg-white/5"
                    >
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
                        <Badge className="flex items-center gap-1 border-yellow-500/50 bg-yellow-500/20 px-3 py-1 text-yellow-500">
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
                  <div className="rounded-2xl border border-white/5 bg-background/60 p-4 text-center">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Match Rules</p>
                    <div className="flex items-center justify-center gap-2 text-xl font-black text-yellow-500">
                      <Trophy className="h-6 w-6" /> {getScoringRuleText(match)}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/5 bg-background/60 p-4 text-center">
                    <p className="mb-1 text-sm font-medium text-muted-foreground">Prize Pool</p>
                    <div className="flex items-center justify-center gap-2 text-4xl font-black text-yellow-500">
                      <Trophy className="h-8 w-8" />
                      {isPaidCashSolo(match)
                        ? `INR ${getSoloCashPrizePoolInr(match)}`
                        : isPaidSquadCashMatch(match)
                          ? `INR ${SQUAD_CASH_PRIZE_INR}`
                          : "Cash Prize"}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-white/5 py-4">
                  <span className="font-medium text-muted-foreground">Entry Fee</span>
                  <span className="flex items-center gap-1.5 text-lg font-bold">
                    {match.type === "free" ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      <>{getLobbyEntryFeeText(match)}</>
                    )}
                  </span>
                </div>

                {isPaidEntry && !match.joinedByMe && !isCompleted && !(isSquadInviteMatch && registeredSquads >= 2) && (
                  <div className="space-y-4 rounded-2xl border border-primary/15 bg-background/35 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Entry Checkout</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Pay the match fee directly in INR. If you have a coupon, apply it here before checkout.
                      </p>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                            <Check className="h-4 w-4" />
                            <span className="truncate">{appliedCoupon.code}</span>
                          </div>
                          <p className="mt-1 text-xs text-emerald-100/80">
                            INR {appliedCoupon.valueInr} coupon discount applied
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={handleRemoveCoupon}
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={couponInput}
                            onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="border-white/10 bg-background/50 font-mono uppercase"
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleApplyCoupon();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleApplyCoupon}
                            disabled={previewCoupon.isPending || !couponInput.trim()}
                            className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                          >
                            {previewCoupon.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Need one first? Redeem it from the rewards page, then apply it here before payment.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 rounded-xl border border-white/8 bg-background/45 p-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Match fee</span>
                        <span>INR {originalEntryFeeInr}</span>
                      </div>
                      {couponDiscountInr > 0 && (
                        <div className="flex items-center justify-between text-sm text-emerald-300">
                          <span className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Coupon discount
                          </span>
                          <span>- INR {couponDiscountInr}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-white/8 pt-3 text-base font-bold text-foreground">
                        <span>Pay now</span>
                        <span className="flex items-center gap-1 text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {finalEntryFeeInr}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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
                        {getSoloCashPayoutLines(match).map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ) : isPaidSquadCashMatch(match) ? (
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p>Captain 1 pays once and submits 3 teammate UIDs to lock the first 4 seats.</p>
                      <p>Captain 2 pays once and locks the other 4 seats for the opposite team in the same Clash Squad match.</p>
                      <p>Total prize pool for the match: INR {SQUAD_CASH_PRIZE_INR}.</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">{match.description}</p>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">
                    Minimum players before start: {match.minPlayersToStart}. Format: {match.mode.toUpperCase()} {match.teamSize > 1 ? `${match.teamSize}v${match.teamSize}` : ""}
                  </p>
                </div>

                {isSquadInviteMatch && (
                  <div className="space-y-4 rounded-2xl border border-secondary/20 bg-secondary/10 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">4v4 Captain Flow</p>
                    <p className="text-sm text-muted-foreground">
                      One captain payment covers the full 4-player team. After team one is locked, the next captain payment creates team two in the same Clash Squad room.
                    </p>
                    <div className="rounded-xl border border-white/10 bg-background/45 p-3 text-sm text-muted-foreground">
                      Team slots locked: <span className="font-semibold text-foreground">{registeredSquads} / 2 captains</span>
                    </div>

                    {myCaptainSquad ? (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-white/10 bg-background/50 p-3 text-sm text-muted-foreground">
                          Squad registered successfully. Your 4 seats are locked:
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
                    ) : registeredSquads >= 2 ? (
                      <div className="rounded-xl border border-white/10 bg-background/50 p-3 text-sm text-muted-foreground">
                        Both captains have already paid and both teams are ready for this match.
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
                          onClick={isPaidEntry ? handlePaidEntry : handleRegisterFreeSquad}
                          disabled={isEntryBusy}
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          {isEntryBusy
                            ? "Processing..."
                            : isPaidEntry
                              ? `Pay INR ${finalEntryFeeInr} and Lock Team`
                              : "Lock Team"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-white/5 py-4">
                  <span className="font-medium text-muted-foreground">Status</span>
                  <Badge variant={isCompleted ? "destructive" : "outline"} className="font-bold">
                    {match.status.toUpperCase()}
                  </Badge>
                </div>

                {isCompleted && match.winnerUsername && (
                  <div className="space-y-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-yellow-500">Tournament Winner</p>
                    <p className="text-xl font-bold text-foreground">{match.winnerUsername}</p>
                  </div>
                )}

                <div className="pt-4">
                  {!me?.user ? (
                    <Button asChild className="h-12 w-full text-base font-bold">
                      <Link href="/login">Log in to Join</Link>
                    </Button>
                  ) : match.joinedByMe ? (
                    <Button disabled className="h-12 w-full border border-green-500/50 bg-green-500/20 text-base font-bold text-green-500 opacity-100">
                      You are registered
                    </Button>
                  ) : isCompleted ? (
                    <Button disabled variant="secondary" className="h-12 w-full text-base font-bold">
                      Match Finished
                    </Button>
                  ) : isFull ? (
                    <Button disabled variant="secondary" className="h-12 w-full text-base font-bold">
                      Match Full
                    </Button>
                  ) : isSquadInviteMatch ? (
                    <Button
                      onClick={isPaidEntry ? handlePaidEntry : handleRegisterFreeSquad}
                      disabled={isEntryBusy || registeredSquads >= 2}
                      className="h-12 w-full bg-secondary text-base font-bold text-secondary-foreground hover:bg-secondary/90"
                    >
                      {isEntryBusy ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : registeredSquads >= 2 ? (
                        "Both Teams Ready"
                      ) : isPaidEntry ? (
                        `Pay INR ${finalEntryFeeInr} and Lock Team`
                      ) : (
                        "Lock Team"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={isPaidEntry ? handlePaidEntry : handleJoin}
                      disabled={isEntryBusy}
                      className="h-12 w-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      {isEntryBusy ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isPaidEntry ? (
                        `Pay INR ${finalEntryFeeInr} and Join`
                      ) : (
                        "Join Tournament"
                      )}
                    </Button>
                  )}
                </div>

                {isSquadInviteMatch && registeredSquads === 1 && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldAlert className="h-4 w-4" />
                      Waiting for second captain
                    </div>
                    <p className="mt-2 text-amber-100/80">
                      Team one is ready. Once the second captain pays for the other 4-player squad, this Clash Squad match becomes a full 8-seat battle.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
