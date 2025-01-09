import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Users, Globe, Calendar, DollarSign } from "lucide-react";

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
}: VCProfileProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-4">
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
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Assets Under Management</p>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-semibold tracking-tight">{aum}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Portfolio Companies</p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-semibold tracking-tight">{investments}</p>
            </div>
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
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center space-x-1"
          >
            <span>View Details</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}