type DisplayMatch = {
  type: "paid" | "free";
  mode: string;
  entryFee: number;
  entryFeeInr: number;
  payoutPerKill: number;
  booyahBonus: number;
  prize: number;
  teamSize: number;
  isCaptainEntryOnly?: boolean;
};

export const SQUAD_CASH_PRIZE_INR = 170;
const DEFAULT_SOLO_ENTRY_FEE_INR = 10;
const FREE_ENTRY_BONUS_PRIZE_INR = 50;
const LONE_WOLF_ENTRY_FEE_INR = 15;
const LONE_WOLF_PRIZE_POOL_INR = 60;

const SOLO_PAYOUT_CONFIG = {
  10: ["1st: INR 100", "2nd: INR 50", "3rd: INR 50"],
  20: ["1st: INR 300", "2nd: INR 200", "3rd: INR 100", "4th: INR 50", "5th: INR 50"],
  25: ["1st: INR 350", "2nd: INR 200", "3rd: INR 150", "4th: INR 100", "5th: INR 100"],
} as const;

const COMMUNITY_ENTRY_TEXT =
  "Join the EBI WhatsApp community, follow the channel, then DM the admin personally to confirm your slot and UPI payment.";
const FREE_ENTRY_TEXT =
  "Join the EBI WhatsApp community, follow the channel, then DM the admin personally to confirm your free-entry slot before room lock.";

export function isFreeRulesMatch(match: DisplayMatch): boolean {
  return match.type === "free";
}

export function isPaidCashSolo(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "solo";
}

export function isPaidSquadCashMatch(match: DisplayMatch): boolean {
  return match.type === "paid" && match.mode === "squad";
}

export function isTwoVTwoLoneWolfMatch(match: DisplayMatch): boolean {
  return isPaidSquadCashMatch(match) && match.teamSize === 2 && !match.isCaptainEntryOnly;
}

function getEffectiveEntryFeeInr(match: DisplayMatch): number {
  if (isFreeRulesMatch(match)) {
    return 0;
  }

  if (match.entryFeeInr > 0) {
    return match.entryFeeInr;
  }

  if (match.isCaptainEntryOnly) {
    return 100;
  }

  if (isTwoVTwoLoneWolfMatch(match)) {
    return LONE_WOLF_ENTRY_FEE_INR;
  }

  return DEFAULT_SOLO_ENTRY_FEE_INR;
}

export function getSoloCashPrizePoolInr(match: DisplayMatch): number {
  const entryFeeInr = getEffectiveEntryFeeInr(match);
  if (entryFeeInr === 10) return 200;
  if (entryFeeInr === 20) return 750;
  if (entryFeeInr === 25) return 900;
  return match.prize || 0;
}

export function getSoloCashPayoutLines(match: DisplayMatch): string[] {
  if (isFreeRulesMatch(match)) {
    return ["1st: INR 30", "2nd: INR 20"];
  }

  const entryFeeInr = getEffectiveEntryFeeInr(match);
  if (entryFeeInr === 10) return [...SOLO_PAYOUT_CONFIG[10]];
  if (entryFeeInr === 20) return [...SOLO_PAYOUT_CONFIG[20]];
  if (entryFeeInr === 25) return [...SOLO_PAYOUT_CONFIG[25]];
  return ["Prize confirmed by admin in WhatsApp"];
}

export function getSoloCashCompactPayout(match: DisplayMatch): string {
  return getSoloCashPayoutLines(match).join(" • ");
}

export function getScoringRuleText(match: DisplayMatch): string {
  return `1 kill = ${match.payoutPerKill} coins, Booyah = ${match.booyahBonus} coins.`;
}

export function getLobbySummaryText(match: DisplayMatch): string {
  if (match.isCaptainEntryOnly) {
    return "Captain 1 locks 4 seats after manual UPI payment in WhatsApp. Captain 2 pays next and fills the other 4 seats for the same Clash Squad room.";
  }

  if (isTwoVTwoLoneWolfMatch(match)) {
    return "2v2 Lone Wolf room. DM the admin with both player UIDs, confirm INR 15 entry per slot, and lock all 4 seats before match time.";
  }

  if (isPaidCashSolo(match)) {
    return COMMUNITY_ENTRY_TEXT;
  }

  return FREE_ENTRY_TEXT;
}

export function getLobbyEntryFeeText(match: DisplayMatch): string {
  if (isFreeRulesMatch(match)) {
    return "FREE";
  }

  return `INR ${getEffectiveEntryFeeInr(match)}`;
}

export function getLobbyPrizeTitle(_match: DisplayMatch): string {
  return "Prize Pool";
}

export function getLobbyPrizeText(match: DisplayMatch): string {
  if (match.isCaptainEntryOnly) {
    return `INR ${SQUAD_CASH_PRIZE_INR}`;
  }

  if (isTwoVTwoLoneWolfMatch(match)) {
    return `INR ${LONE_WOLF_PRIZE_POOL_INR}`;
  }

  if (isFreeRulesMatch(match)) {
    return `INR ${FREE_ENTRY_BONUS_PRIZE_INR}`;
  }

  if (isPaidCashSolo(match)) {
    return `INR ${getSoloCashPrizePoolInr(match)}`;
  }

  return "Manual confirmation";
}

export function getLobbyPrizeSubtext(match: DisplayMatch): string | null {
  if (isFreeRulesMatch(match)) {
    return "1st: INR 30 • 2nd: INR 20";
  }

  if (isTwoVTwoLoneWolfMatch(match)) {
    return "4 slots • 2 teams • winner payout confirmed by admin";
  }

  if (isPaidCashSolo(match)) {
    return getSoloCashPayoutLines(match).join(" • ");
  }

  if (match.isCaptainEntryOnly) {
    return "Two captains, two teams, one 4v4 room.";
  }

  return null;
}

export function getDetailsHeroText(match: DisplayMatch): string {
  if (match.isCaptainEntryOnly) {
    return "Join the EBI WhatsApp community, DM the admin with your squad name and 3 teammate UIDs, then confirm manual UPI payment to lock your 4-player team.";
  }

  if (isTwoVTwoLoneWolfMatch(match)) {
    return "Join the EBI WhatsApp community, DM the admin with both player UIDs, confirm the INR 15 entry, and lock your 2v2 Lone Wolf side before the room closes.";
  }

  if (isPaidCashSolo(match)) {
    return `Join through WhatsApp community. DM the admin personally, confirm your manual UPI payment, and play for ${getSoloCashCompactPayout(match)}.`;
  }

  return "Join through WhatsApp community. DM the admin personally to confirm your free-entry slot and play for INR 30 to 1st place and INR 20 to 2nd place.";
}
