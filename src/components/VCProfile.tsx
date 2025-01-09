import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, TrendingUp, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VCDetailsView } from "./VCDetailsView";
import { Badge } from "./ui/badge";

interface PortfolioCompany {
  name: string;
  logo: string;
  profileUrl: string;
}

interface VCProfileProps {
  name: string;
  logo: string;
  description: string;
  aum: string;
  focus: string[];
  investments: number;
  website: string;
  investmentStage?: string[];
  portfolioCompanies?: PortfolioCompany[];
}

export function VCProfile({
  name,
  logo,
  description,
  aum,
  focus = [],
  investments,
  website,
  investmentStage = [],
  portfolioCompanies = [],
}: VCProfileProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Mock investment data with realistic dates, amounts, and projects
  const mockInvestments = [
    { date: "2022-03-15", amount: 2500000, round: "Seed", project: "Innovate Protocol", assetPrice: 3200 },
    { date: "2022-07-20", amount: 8000000, round: "Series A", project: "BlockChain Solutions", assetPrice: 3600 },
    { date: "2022-11-05", amount: 15000000, round: "Series B", project: "Crypto Finance Group", assetPrice: 4100 },
    { date: "2023-02-12", amount: 5000000, round: "Series A", project: "Decentralized Apps Inc.", assetPrice: 4600 },
    { date: "2023-04-28", amount: 12000000, round: "Series B", project: "NFT Marketplace Co.", assetPrice: 5200 },
    { date: "2023-08-10", amount: 20000000, round: "Series C", project: "Web3 Security Solutions", assetPrice: 5600 },
    { date: "2023-12-01", amount: 7000000, round: "Series A", project: "Metaverse Developments", assetPrice: 6200 },
    { date: "2024-02-18", amount: 10000000, round: "Series B", project: "AI Crypto Analytics", assetPrice: 6800 },
    { date: "2024-04-05", amount: 18000000, round: "Series C", project: "Blockchain Gaming Studios", assetPrice: 7200 }
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img src={logo} alt={name} className="h-12 w-12 rounded-full" />
              <div>
                <h3 className="font-semibold">{name}</h3>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Active Investor</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {focus.map((tag) => (
              <span key={tag} className="inline-block bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          {investmentStage.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Investment Stages</h4>
              <div className="flex flex-wrap gap-2">
                {investmentStage.map((stage) => (
                  <span key={stage} className="inline-block bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded">
                    {stage}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/50 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{aum} AUM</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{investments} Investments</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowDetails(true)}>
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>

      <VCDetailsView
        open={showDetails}
        onOpenChange={setShowDetails}
        name={name}
        logo={logo}
        description={description}
        aum={aum}
        website={website}
        investments={mockInvestments}
      />
    </>
  );
}