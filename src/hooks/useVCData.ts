import { useQuery } from "@tanstack/react-query";
import { fetchCryptoRankData } from "@/lib/cryptorank";

interface FundingRound {
  date: string;
  amount: number;
  round: string;
  project: string;
}

interface VC {
  name: string;
  logo: string;
  description: string;
  aum: string;
  focus: string[];
  website: string;
  investments: FundingRound[];
}

export function useVCData() {
  return useQuery({
    queryKey: ["vc-data"],
    queryFn: async (): Promise<VC[]> => {
      try {
        console.log("Fetching VC data from CryptoRank...");
        const response = await fetchCryptoRankData("/funds", {
          limit: 10,
          sortBy: "aum",
          sortDirection: "desc",
        });

        console.log("Raw CryptoRank response:", response);

        // Transform the API response to match our VC interface
        return response.data.map((fund: any) => ({
          name: fund.name,
          logo: fund.image?.small || "https://picsum.photos/200", // Fallback image
          description: fund.description || "Investment firm focused on blockchain and crypto projects.",
          aum: `${(fund.aum / 1e9).toFixed(1)}B`, // Convert to billions
          focus: fund.categories || ["Crypto", "Blockchain"],
          website: fund.links?.website || "#",
          investments: (fund.investments || []).map((inv: any) => ({
            date: new Date(inv.date).toISOString(),
            amount: inv.amount,
            round: inv.stage || "Undisclosed",
            project: inv.project.name,
          })),
        }));
      } catch (error) {
        console.error("Error fetching VC data:", error);
        throw error;
      }
    },
    enabled: Boolean(localStorage.getItem("cryptorank_api_key")),
  });
}