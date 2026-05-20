import { useMutation, useQuery } from "@tanstack/react-query";
import { resolveApiUrl } from "./api-base";

type ApiErrorShape = {
  error?: string;
  message?: string;
};

async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveApiUrl(input), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    try {
      const data = (await response.json()) as ApiErrorShape;
      message = data.error ?? data.message ?? message;
    } catch {
      // ignore parse error
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export type WatchVideo = {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number;
  rewardCoins: number;
  cooldownHours: number;
  nextEligibleAt: string | null;
  availableNow: boolean;
};

export type WatchSessionStart = {
  sessionId: number;
  sessionToken: string;
  unlocksAt: string;
};

export type WatchSessionComplete = {
  ok: true;
  rewardCoins: number;
  balanceAfter: number;
  completedAt: string;
};

export type ReferralSummary = {
  referralCode: string;
  referredCount: number;
  totalEarnedCoins: number;
  referrals: Array<{
    id: number;
    referredUserId: number;
    username: string;
    rewardCoins: number;
    createdAt: string;
  }>;
};

export type EconomyConfig = {
  signupBonusCoins: number;
  dailyLoginRewardCoins: number;
  packages: Array<{ inr: number; coins: number }>;
  payoutRules: {
    perKillCoins: number;
    booyahCoins: number;
  };
};

export type SquadRegistration = {
  ok: true;
  squadId: number;
  teamName: string;
  side: string;
  members: Array<{
    userId: number;
    username: string;
    freeFireUid: string;
  }>;
  match: {
    id: number;
    name: string;
  };
};

export function useWatchRewardVideos(enabled = true) {
  return useQuery({
    queryKey: ["watch-reward-videos"],
    queryFn: () => apiFetch<WatchVideo[]>("/api/engagement/watch-videos"),
    enabled,
  });
}

export function useStartWatchRewardSession() {
  return useMutation({
    mutationFn: (videoId: number) =>
      apiFetch<WatchSessionStart>(`/api/engagement/watch-videos/${videoId}/start`, {
        method: "POST",
      }),
  });
}

export function useCompleteWatchRewardSession() {
  return useMutation({
    mutationFn: (input: { videoId: number; sessionId: number; sessionToken: string }) =>
      apiFetch<WatchSessionComplete>(`/api/engagement/watch-videos/${input.videoId}/complete`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: input.sessionId,
          sessionToken: input.sessionToken,
        }),
      }),
  });
}

export function useReferralSummary(enabled = true) {
  return useQuery({
    queryKey: ["referral-summary"],
    queryFn: () => apiFetch<ReferralSummary>("/api/referrals/me"),
    enabled,
  });
}

export function useEconomyConfig() {
  return useQuery({
    queryKey: ["economy-config"],
    queryFn: () => apiFetch<EconomyConfig>("/api/economy"),
  });
}

export function useRegisterSquadMatch() {
  return useMutation({
    mutationFn: (input: { matchId: number; teamName: string; teammateUids: string[] }) =>
      apiFetch<SquadRegistration>(`/api/matches/${input.matchId}/squad/register`, {
        method: "POST",
        body: JSON.stringify({
          teamName: input.teamName,
          teammateUids: input.teammateUids,
        }),
      }),
  });
}

export function useJoinSquadMatch() {
  return useMutation({
    mutationFn: (input: { matchId: number; inviteCode: string }) =>
      apiFetch<{ ok: true; match: { id: number; name: string } }>(`/api/matches/${input.matchId}/squad/join`, {
        method: "POST",
        body: JSON.stringify({ inviteCode: input.inviteCode }),
      }),
  });
}

export function useBootstrapEbiMatches() {
  return useMutation({
    mutationFn: () =>
      apiFetch<{
        created: number;
        updated: number;
        packages: Array<{ inr: number; coins: number }>;
      }>("/api/admin/matches/bootstrap-ebi", {
        method: "POST",
      }),
  });
}
