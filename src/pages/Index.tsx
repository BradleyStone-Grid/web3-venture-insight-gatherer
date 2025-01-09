import { useState } from "react";
import { VCProfile } from "@/components/VCProfile";
import { SearchBar } from "@/components/SearchBar";

// Mock data - replace with real API data later
const vcData = [
  {
    name: "Andreessen Horowitz",
    logo: "https://picsum.photos/200",
    description: "Pioneering venture fund focused on technology companies across all stages.",
    aum: "35B",
    focus: ["Web3", "DeFi", "Infrastructure"],
    investments: 124,
    website: "https://a16z.com",
    portfolioCompanies: [
      {
        name: "Uniswap",
        logo: "https://picsum.photos/203",
        profileUrl: "https://uniswap.org"
      },
      {
        name: "OpenSea",
        logo: "https://picsum.photos/204",
        profileUrl: "https://opensea.io"
      }
    ]
  },
  {
    name: "Paradigm",
    logo: "https://picsum.photos/201",
    description: "Investment firm focused on supporting crypto/Web3 entrepreneurs.",
    aum: "15B",
    focus: ["DeFi", "NFTs", "Gaming"],
    investments: 87,
    website: "https://paradigm.xyz",
    portfolioCompanies: [
      {
        name: "Optimism",
        logo: "https://picsum.photos/205",
        profileUrl: "https://optimism.io"
      },
      {
        name: "Magic Eden",
        logo: "https://picsum.photos/206",
        profileUrl: "https://magiceden.io"
      }
    ]
  },
  {
    name: "Polychain Capital",
    logo: "https://picsum.photos/202",
    description: "Leading cryptocurrency investment firm.",
    aum: "4B",
    focus: ["Crypto", "DeFi", "Layer 1"],
    investments: 56,
    website: "https://polychain.capital",
    portfolioCompanies: [
      {
        name: "Compound",
        logo: "https://picsum.photos/207",
        profileUrl: "https://compound.finance"
      },
      {
        name: "dYdX",
        logo: "https://picsum.photos/208",
        profileUrl: "https://dydx.exchange"
      }
    ]
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVCs = vcData.filter((vc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vc.name.toLowerCase().includes(searchLower) ||
      vc.focus.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Web3 VC Explorer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track investments and discover opportunities in the Web3 ecosystem
          </p>
        </div>
        
        <SearchBar onSearch={setSearchQuery} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVCs.map((vc) => (
            <VCProfile key={vc.name} {...vc} />
          ))}
        </div>

        {filteredVCs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No VCs found matching your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;