import sponsorFile from "@/data/sponsor-tiers.json";

export type SponsorTier = {
  id: string;
  name: string;
  amount: string;
  description: string;
  benefits: string[];
  highlight: boolean;
};

export const sponsorTiers = (sponsorFile as { tiers: SponsorTier[] }).tiers;
