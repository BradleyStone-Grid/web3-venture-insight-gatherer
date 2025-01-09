import { DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Globe } from "lucide-react";

interface VCHeaderProps {
  name: string;
  logo: string;
  website: string;
  description: string;
}

export function VCHeader({ name, logo, website, description }: VCHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img src={logo} alt={name} className="h-12 w-12 rounded-full" />
        <div>
          <DialogTitle>{name}</DialogTitle>
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
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}