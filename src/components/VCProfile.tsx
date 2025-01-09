import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Users } from "lucide-react";

interface VCProfileProps {
  name: string;
  logo: string;
  description: string;
  aum: string;
  focus: string[];
  investments: number;
  website: string;
}

export function VCProfile({
  name,
  logo,
  description,
  aum,
  focus,
  investments,
  website,
}: VCProfileProps) {
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt={name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary inline-flex items-center space-x-1"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">AUM</p>
            <p className="text-lg font-semibold tracking-tight">{aum}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Investments</p>
            <p className="text-lg font-semibold tracking-tight">{investments}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Portfolio</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}