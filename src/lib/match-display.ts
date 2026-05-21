type DisplayMatch = {
  type: "paid" | "free";
  mode: string;
  entryFee: number;
  entryFeeInr: number;
  payoutPerKill: number;
  booyahBonus: number;
};

export const SOLO_CASH_PRIZE_POOL_INR = 750;
export const SOLO_CASH_PAYOUT_LINES = [
  "1st: INR 300",
  "2nd: INR 200",
  "3rd: INR 100",
  "4th: INR 50",
  "5th: INR 50",
];
export const SQUAD_CASH_PRIZE_INR = 170;

export function isPaidCashSolo(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "solo";
}

export function isFreeRulesMatch(match: DisplayMatch): boolean {
  return match.type === "free";
}

export function isPaidSquadCashMatch(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "squad";
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
    return `INR ${SOLO_CASH_PRIZE_POOL_INR}`;
  }

  if (isPaidSquadCashMatch(match)) {
    return `INR ${SQUAD_CASH_PRIZE_INR}`;
  }

  return "Cash Prize";
}

export function getLobbyPrizeSubtext(match: DisplayMatch): string | null {
  if (isPaidCashSolo(match)) {
    return SOLO_CASH_PAYOUT_LINES.join(" • ");
  }

  return null;
}

export function getDetailsHeroText(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return getScoringRuleText(match);
  }

  if (isPaidCashSolo(match)) {
    return `Cash payout to Top 5 players: ${SOLO_CASH_PAYOUT_LINES.join(", ")}.`;
  }

  if (isPaidSquadCashMatch(match)) {
    return "Captain 1 pays once and submits 3 teammate UIDs to create the first team. Captain 2 does the same for the second team. Total Clash Squad prize pool: INR 170.";
  }

  return getScoringRuleText(match);
}
