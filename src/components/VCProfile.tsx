import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Users, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { VCDetailsView } from "./VCDetailsView";

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
  status?: "Active" | "Inactive";
  foundedDate?: string;
  headquarters?: string;
  investmentStage?: string[];
  portfolioCompanies?: PortfolioCompany[];
}

export function VCProfile({
  name,
  logo,
  description,
  aum,
  focus,
  investments,
  website,
  status = "Active",
  foundedDate,
  headquarters,
  investmentStage = [],
  portfolioCompanies = [],
}: VCProfileProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Mock investment data for the graph
  const mockInvestments = [
    { date: "2023-01", amount: 1000000, round: "Seed", project: "Project A", assetPrice: 2000 },
    { date: "2023-03", amount: 2000000, round: "Series A", project: "Project B", assetPrice: 2200 },
    { date: "2023-06", amount: 3000000, round: "Series B", project: "Project C", assetPrice: 2400 },
    { date: "2023-09", amount: 4000000, round: "Series C", project: "Project D", assetPrice: 2600 },
    { date: "2023-12", amount: 5000000, round: "Series D", project: "Project E", assetPrice: 2800 },
  ];

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt={name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{name}</h3>
                  <Badge variant={status === "Active" ? "default" : "secondary"}>
                    {status}
                  </Badge>
                </div>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center space-x-1"
                >
                  <Globe className="h-3 w-3" />
                  <span>Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assets Under Management</p>
              <p className="text-lg font-semibold tracking-tight">{aum}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Portfolio Companies</p>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{investments} Companies</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] bg-background">
                  <SheetHeader>
                    <SheetTitle>Portfolio Companies</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    {portfolioCompanies.map((company) => (
                      <a
                        key={company.name}
                        href={company.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            View Profile
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {foundedDate && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Founded</p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold tracking-tight">{foundedDate}</p>
                </div>
              </div>
            )}
            {headquarters && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-lg font-semibold tracking-tight">{headquarters}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Investment Focus</p>
            <div className="flex flex-wrap gap-2">
              {focus.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="animate-in"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {investmentStage.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Investment Stages</p>
              <div className="flex flex-wrap gap-2">
                {investmentStage.map((stage) => (
                  <Badge
                    key={stage}
                    variant="outline"
                    className="animate-in"
                  >
                    {stage}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-success">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Active Investor</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => setShowDetails(true)}
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
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