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

export type PaymentPackage = {
  inr: number;
  coins: number;
};

export type PaymentPackageConfig = {
  provider: "cashfree";
  environment: "sandbox" | "production" | null;
  packages: PaymentPackage[];
};

export type CashfreeOrderPayload = {
  ok: true;
  orderId: string;
  cfOrderId: string;
  paymentSessionId: string;
  amountInr: number;
  currency: string;
  package: PaymentPackage;
  paymentId: number;
  environment: "sandbox" | "production";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

export type CashfreeVerifyPayload = {
  ok: true;
  status: string;
  packageInr: number;
  packageCoins: number;
};

export type MatchEntryOrderInput = {
  matchId: number;
  couponCode?: string;
  teamName?: string;
  teammateUids?: string[];
};

export type MatchEntryOrderPayload =
  | {
      ok: true;
      requiresPayment: false;
      match: {
        id: number;
        name: string;
      };
      couponCodeUsed: string | null;
      finalAmountInr: number;
    }
  | {
      ok: true;
      requiresPayment: true;
      environment: "sandbox" | "production";
      orderId: string;
      cfOrderId: string;
      paymentSessionId: string;
      amountInr: number;
      currency: string;
      match: {
        id: number;
        name: string;
      };
      originalAmountInr: number;
      finalAmountInr: number;
      discountInr: number;
      couponCodeUsed: string | null;
    };

export type MatchEntryVerifyInput = {
  matchId: number;
  orderId: string;
};

export type MatchEntryVerifyPayload = {
  ok: true;
  status: string;
  match: {
    id: number;
    name: string;
  };
  couponCodeUsed: string | null;
};

export type PaymentHistoryEntry = {
  id: number;
  provider: string;
  status: string;
  packageInr: number;
  packageCoins: number;
  amountPaise: number;
  providerOrderId: string;
  providerPaymentId: string | null;
  createdAt: string;
  verifiedAt: string | null;
};

export type AdminPaymentEntry = {
  id: number;
  username: string;
  email: string;
  provider: string;
  purpose: "wallet_topup" | "match_entry";
  status: string;
  packageInr: number;
  packageCoins: number;
  amountPaise: number;
  providerOrderId: string;
  providerPaymentId: string | null;
  matchId: number | null;
  matchName: string | null;
  couponCode: string | null;
  joinMode: "solo" | "squad" | null;
  createdAt: string;
  verifiedAt: string | null;
};

export type AdminPaymentSummary = {
  total: number;
  captured: number;
  pending: number;
  failed: number;
  topupRevenueInr: number;
  matchRevenueInr: number;
};

export type AdminPaymentsPayload = {
  summary: AdminPaymentSummary;
  payments: AdminPaymentEntry[];
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

export function usePaymentPackages(enabled = true) {
  return useQuery({
    queryKey: ["payment-packages"],
    queryFn: () => apiFetch<PaymentPackageConfig>("/api/payments/packages"),
    enabled,
  });
}

export function usePaymentHistory(enabled = true) {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: () => apiFetch<PaymentHistoryEntry[]>("/api/payments/history"),
    enabled,
  });
}

export function useCreateCashfreeOrder() {
  return useMutation({
    mutationFn: (packageInr: number) =>
      apiFetch<CashfreeOrderPayload>("/api/payments/cashfree/order", {
        method: "POST",
        body: JSON.stringify({ packageInr }),
      }),
  });
}

export function useVerifyCashfreePayment() {
  return useMutation({
    mutationFn: (input: { orderId: string }) =>
      apiFetch<CashfreeVerifyPayload>("/api/payments/cashfree/verify", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  });
}

export function useCreateMatchEntryOrder() {
  return useMutation({
    mutationFn: (input: MatchEntryOrderInput) =>
      apiFetch<MatchEntryOrderPayload>(`/api/payments/matches/${input.matchId}/cashfree/order`, {
        method: "POST",
        body: JSON.stringify({
          couponCode: input.couponCode,
          teamName: input.teamName,
          teammateUids: input.teammateUids,
        }),
      }),
  });
}

export function useVerifyMatchEntryPayment() {
  return useMutation({
    mutationFn: (input: MatchEntryVerifyInput) =>
      apiFetch<MatchEntryVerifyPayload>(`/api/payments/matches/${input.matchId}/cashfree/verify`, {
        method: "POST",
        body: JSON.stringify({
          orderId: input.orderId,
        }),
      }),
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

export function useAdminPayments(enabled = true) {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => apiFetch<AdminPaymentsPayload>("/api/admin/payments"),
    enabled,
  });
}
