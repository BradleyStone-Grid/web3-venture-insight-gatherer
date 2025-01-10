import { useQuery } from "@tanstack/react-query";
import { fetchCryptoRankData } from "@/lib/cryptorank";

interface FundingRound {
  date: string;
  amount: number;
  round: string;
  project: string;
}

interface PortfolioCompany {
  name: string;
  logo: string;
  profileUrl: string;
  sector: string[];
  investmentDate: string | null;
  investmentStage: string;
}

interface VC {
  name: string;
  logo: string;
  description: string;
  aum: string;
  focus: string[];
  website: string;
  investments: FundingRound[];
  investmentStage?: string[];
  portfolioCompanies?: PortfolioCompany[];
  status?: string;
  jurisdiction?: string;
}

export function useVCData() {
  return useQuery({
    queryKey: ["vc-data"],
    queryFn: async (): Promise<VC[]> => {
      try {
        console.log("Fetching VC data from CryptoRank...");
        const response = await fetchCryptoRankData("/v1/fund", {
          limit: 10,
        });

        console.log("Raw CryptoRank response:", response);

        // Transform the API response to match our VC interface
        return response.data.map((fund: any) => {
          // Process investments data
          const investments = (fund.investments || []).map((inv: any) => ({
            date: new Date(inv.date).toISOString(),
            amount: inv.amount || 0,
            round: inv.stage || "Undisclosed",
            project: inv.project?.name || "Unknown Project",
          }));

          // Process portfolio companies with additional metadata
          const portfolioCompanies = (fund.portfolio || []).map((company: any) => ({
            name: company.name || "Unknown Company",
            logo: company.image?.small || "https://picsum.photos/200",
            profileUrl: company.links?.website || "#",
            sector: company.categories || [],
            investmentDate: company.investmentDate || null,
            investmentStage: company.stage || "Undisclosed"
          }));

          // Extract investment stages from both portfolio and direct data
          const investmentStage = Array.from(new Set([
            ...(fund.investmentStages || []),
            ...portfolioCompanies.map(pc => pc.investmentStage)
          ])).filter(Boolean);

          // Calculate and format AUM with proper scaling
          const aumValue = typeof fund.aum === 'number' ? fund.aum : 0;
          const formattedAum = aumValue >= 1e9 
            ? `$${(aumValue / 1e9).toFixed(1)}B`
            : aumValue >= 1e6
            ? `$${(aumValue / 1e6).toFixed(1)}M`
            : `$${(aumValue / 1e3).toFixed(1)}K`;

          // Calculate investment metrics
          const totalInvestments = investments.length;
          const activeStatus = totalInvestments > 0 ? "Active Investor" : "Inactive";

          return {
            name: fund.name || "Unnamed Fund",
            logo: fund.image?.small || "https://picsum.photos/200",
            description: fund.description || "Investment firm focused on blockchain and crypto projects.",
            aum: formattedAum,
            focus: fund.categories || ["Crypto", "Blockchain"],
            website: fund.links?.website || "#",
            investments,
            investmentStage,
            portfolioCompanies,
            status: fund.status || activeStatus,
            jurisdiction: fund.location || "Unknown Location"
          };
        });
      } catch (error) {
        console.error("Error fetching VC data:", error);
        throw error;
      }
    },
    enabled: Boolean(localStorage.getItem("cryptorank_api_key")),
  });
}