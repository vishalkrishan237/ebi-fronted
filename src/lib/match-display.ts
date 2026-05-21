type DisplayMatch = {
  type: "paid" | "free";
  mode: string;
  entryFee: number;
  entryFeeInr: number;
  payoutPerKill: number;
  booyahBonus: number;
};

export const SQUAD_CASH_PRIZE_INR = 170;

const SOLO_PAYOUT_CONFIG: Record<
  number,
  {
    prizePoolInr: number;
    payoutLines: string[];
    compactPayout: string;
  }
> = {
  10: {
    prizePoolInr: 200,
    payoutLines: ["1st: INR 100", "2nd: INR 50", "3rd: INR 50"],
    compactPayout: "INR 100 / 50 / 50",
  },
  20: {
    prizePoolInr: 750,
    payoutLines: [
      "1st: INR 300",
      "2nd: INR 200",
      "3rd: INR 100",
      "4th: INR 50",
      "5th: INR 50",
    ],
    compactPayout: "INR 300 / 200 / 100 / 50 / 50",
  },
  25: {
    prizePoolInr: 900,
    payoutLines: [
      "1st: INR 350",
      "2nd: INR 200",
      "3rd: INR 150",
      "4th: INR 100",
      "5th: INR 100",
    ],
    compactPayout: "INR 350 / 200 / 150 / 100 / 100",
  },
};

export function isPaidCashSolo(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "solo";
}

export function isFreeRulesMatch(match: DisplayMatch): boolean {
  return match.type === "free";
}

export function isPaidSquadCashMatch(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "squad";
}

export function getSoloCashPrizePoolInr(match: DisplayMatch): number {
  return SOLO_PAYOUT_CONFIG[match.entryFeeInr]?.prizePoolInr ?? 0;
}

export function getSoloCashPayoutLines(match: DisplayMatch): string[] {
  return SOLO_PAYOUT_CONFIG[match.entryFeeInr]?.payoutLines ?? [];
}

export function getSoloCashCompactPayout(match: DisplayMatch): string {
  return SOLO_PAYOUT_CONFIG[match.entryFeeInr]?.compactPayout ?? "Cash payout";
}

export function getScoringRuleText(match: DisplayMatch): string {
  return `1 kill = ${match.payoutPerKill} coins, Booyah = ${match.booyahBonus} coins.`;
}

export function getLobbySummaryText(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return getScoringRuleText(match);
  }

  if (isPaidCashSolo(match)) {
    return "Cash tournament for Top 5 players. Entry is shown in INR and payouts are listed on the card.";
  }

  if (isPaidSquadCashMatch(match)) {
    return "Captain 1 pays once to lock 4 seats. Captain 2 pays once to lock the other 4 seats. One match starts with 2 full Clash Squad teams.";
  }

  return getScoringRuleText(match);
}

export function getLobbyEntryFeeText(match: DisplayMatch): string {
  if (match.type === "free") {
    return "FREE";
  }

  return match.entryFeeInr > 0 ? `INR ${match.entryFeeInr}` : "Paid";
}

export function getLobbyPrizeTitle(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return "Match Rules";
  }

  return "Prize Pool";
}

export function getLobbyPrizeText(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return getScoringRuleText(match);
  }

  if (isPaidCashSolo(match)) {
    return `INR ${getSoloCashPrizePoolInr(match)}`;
  }

  if (isPaidSquadCashMatch(match)) {
    return `INR ${SQUAD_CASH_PRIZE_INR}`;
  }

  return "Cash Prize";
}

export function getLobbyPrizeSubtext(match: DisplayMatch): string | null {
  if (isPaidCashSolo(match)) {
    return getSoloCashPayoutLines(match).join(" • ");
  }

  return null;
}

export function getDetailsHeroText(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return getScoringRuleText(match);
  }

  if (isPaidCashSolo(match)) {
    return `Cash payout for this room: ${getSoloCashPayoutLines(match).join(", ")}.`;
  }

  if (isPaidSquadCashMatch(match)) {
    return "Captain 1 pays once and submits 3 teammate UIDs to create the first team. Captain 2 does the same for the second team. Total Clash Squad prize pool: INR 170.";
  }

  return getScoringRuleText(match);
}
