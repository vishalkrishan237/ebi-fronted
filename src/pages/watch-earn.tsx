import React, { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { PlayCircle, Video, Coins, TimerReset, Gift, Copy, CheckCircle2, Users } from "lucide-react";
import { useGetMe, getGetMeQueryKey, getGetRewardsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  useCompleteWatchRewardSession,
  useReferralSummary,
  useStartWatchRewardSession,
  useWatchRewardVideos,
} from "@/lib/platform-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function WatchEarnPage() {
  const { data: me } = useGetMe();
  const { data: videos, isLoading: loadingVideos } = useWatchRewardVideos(!!me?.user);
  const { data: referrals } = useReferralSummary(!!me?.user);
  const startSession = useStartWatchRewardSession();
  const completeSession = useCompleteWatchRewardSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [activeSessionToken, setActiveSessionToken] = useState<string | null>(null);
  const [unlocksAt, setUnlocksAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeVideo = useMemo(
    () => videos?.find((video) => video.id === activeVideoId) ?? videos?.[0] ?? null,
    [videos, activeVideoId],
  );

  useEffect(() => {
    if (!activeVideoId && videos && videos.length > 0) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos, activeVideoId]);

  useEffect(() => {
    if (!unlocksAt) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const next = Math.max(
        0,
        Math.ceil((new Date(unlocksAt).getTime() - Date.now()) / 1000),
      );
      setSecondsLeft(next);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [unlocksAt]);

  const startWatching = () => {
    if (!activeVideo) return;

    startSession.mutate(activeVideo.id, {
      onSuccess: (session) => {
        setActiveSessionId(session.sessionId);
        setActiveSessionToken(session.sessionToken);
        setUnlocksAt(session.unlocksAt);
        setHasEnded(false);
        toast({
          title: "Session started",
          description: "Watch the full video to unlock your coin reward.",
        });
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Unable to start session",
          description: error.message,
        });
      },
    });
  };

  const claimReward = () => {
    if (!activeVideo || !activeSessionId || !activeSessionToken) return;

    completeSession.mutate(
      {
        videoId: activeVideo.id,
        sessionId: activeSessionId,
        sessionToken: activeSessionToken,
      },
      {
        onSuccess: (result) => {
          setActiveSessionId(null);
          setActiveSessionToken(null);
          setUnlocksAt(null);
          setHasEnded(false);
          queryClient.invalidateQueries({ queryKey: ["watch-reward-videos"] });
          queryClient.invalidateQueries({ queryKey: ["referral-summary"] });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRewardsQueryKey() });
          toast({
            title: "Reward claimed",
            description: `${result.rewardCoins} coins credited to your wallet.`,
          });
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Claim failed",
            description: error.message,
          });
        },
      },
    );
  };

  const copyReferralCode = async () => {
    if (!referrals?.referralCode) return;
    await navigator.clipboard.writeText(referrals.referralCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const readyToClaim = !!activeSessionId && secondsLeft === 0 && hasEnded;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary/80 mb-2">Engagement Hub</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Watch. Earn. Recruit.</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Spend a minute with sponsored content, collect verified wallet rewards, and grow your squad through referral bonuses.
          </p>
        </div>
        <div className="arena-chip arena-glow rounded-xl border-primary/20 px-4 py-3 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Wallet Balance</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-black text-primary">
            <Coins className="h-6 w-6" />
            {me?.user?.coinBalance ?? 0}
          </div>
        </div>
      </motion.div>

      {!me?.user ? (
        <Card className="arena-shell border-white/10 bg-card/75">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-black">Login required</h2>
            <p className="mt-3 text-muted-foreground">
              Sign in to start timed watch sessions and open your referral vault.
            </p>
            <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="arena-shell border-white/10 bg-card/75">
          <CardHeader className="border-b border-white/6">
            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-primary" />Watch & Earn</CardTitle>
            <CardDescription>Each reward session is timed and credited by the server after the watch window unlocks.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {loadingVideos ? (
              <div className="text-muted-foreground">Loading reward videos...</div>
            ) : !videos || videos.length === 0 ? (
              <div className="arena-chip rounded-2xl border-dashed p-10 text-center text-muted-foreground">
                No active reward videos are configured yet.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => {
                        setActiveVideoId(video.id);
                        setActiveSessionId(null);
                        setActiveSessionToken(null);
                        setUnlocksAt(null);
                        setHasEnded(false);
                      }}
                      className={`min-w-[180px] rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                        activeVideo?.id === video.id
                          ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(34,211,238,0.12)] -translate-y-0.5"
                          : "border-white/8 bg-background/30 hover:border-primary/25 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold">{video.title}</span>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          +{video.rewardCoins}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {video.durationSeconds}s video
                      </div>
                    </button>
                  ))}
                </div>

                {activeVideo && (
                  <motion.div
                    key={activeVideo.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <div className="arena-scan overflow-hidden rounded-3xl border border-white/10 bg-black">
                      <video
                        key={`${activeVideo.id}-${activeSessionId ?? "idle"}`}
                        controls
                        playsInline
                        preload="metadata"
                        poster={activeVideo.thumbnailUrl ?? undefined}
                        className="aspect-video w-full bg-black"
                        src={activeVideo.videoUrl}
                        onEnded={() => setHasEnded(true)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <StatBlock label="Reward" value={`${activeVideo.rewardCoins} coins`} icon={Coins} />
                      <StatBlock
                        label="Cooldown"
                        value={`${activeVideo.cooldownHours}h`}
                        icon={TimerReset}
                      />
                      <StatBlock
                        label="Availability"
                        value={
                          activeVideo.availableNow
                            ? "Ready now"
                            : activeVideo.nextEligibleAt
                              ? `In ${formatDistanceToNowStrict(new Date(activeVideo.nextEligibleAt))}`
                              : "Unavailable"
                        }
                        icon={PlayCircle}
                      />
                    </div>

                    <div className="arena-chip rounded-2xl p-5">
                      <h2 className="text-2xl font-black">{activeVideo.title}</h2>
                      <p className="text-muted-foreground mt-2">{activeVideo.description}</p>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Button
                          onClick={startWatching}
                          disabled={!activeVideo.availableNow || startSession.isPending}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Start timed session
                        </Button>

                        {activeSessionId && (
                          <Badge variant="outline" className="border-secondary/30 text-secondary">
                            Unlock in {secondsLeft}s
                          </Badge>
                        )}

                        {hasEnded && secondsLeft > 0 && (
                          <Badge variant="outline" className="border-white/10 text-muted-foreground">
                            Video finished. Reward unlocks when server timer completes.
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={claimReward}
                          disabled={!readyToClaim || completeSession.isPending}
                          className="border-secondary/40 text-secondary hover:bg-secondary/10"
                        >
                          Claim reward
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="arena-shell border-white/10 bg-card/75">
            <CardHeader className="border-b border-white/6">
              <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-secondary" />Referral Vault</CardTitle>
              <CardDescription>Earn 25 coins once per verified friend who signs up with your code.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="arena-chip rounded-2xl border-secondary/20 bg-secondary/10 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your code</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <code className="text-2xl font-black tracking-[0.18em] text-secondary">
                    {referrals?.referralCode ?? "------"}
                  </code>
                  <Button size="icon" variant="ghost" onClick={copyReferralCode} disabled={!referrals?.referralCode}>
                    {copied ? <CheckCircle2 className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatBlock label="Friends invited" value={String(referrals?.referredCount ?? 0)} icon={Users} />
                <StatBlock label="Coins earned" value={String(referrals?.totalEarnedCoins ?? 0)} icon={Coins} />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Recent referrals</h3>
                {!referrals || referrals.referrals.length === 0 ? (
                  <div className="arena-chip rounded-2xl border-dashed p-6 text-sm text-muted-foreground">
                    No successful referrals yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.referrals.map((referral) => (
                      <div key={referral.id} className="arena-chip rounded-2xl p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold">{referral.username}</div>
                            <div className="text-xs text-muted-foreground">
                              Joined {formatDistanceToNowStrict(new Date(referral.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                          <Badge variant="outline" className="border-secondary/30 text-secondary">
                            +{referral.rewardCoins}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}

function StatBlock({
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
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="mt-3 text-lg font-black">{value}</div>
    </div>
  );
}
