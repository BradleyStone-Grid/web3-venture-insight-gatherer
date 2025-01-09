import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvestmentControlsProps {
  showAll: boolean;
  onShowAllChange: (value: boolean) => void;
  uniqueProjects: string[];
  selectedInvestment: string;
  onInvestmentSelect: (value: string) => void;
}

export function InvestmentControls({
  showAll,
  onShowAllChange,
  uniqueProjects,
  selectedInvestment,
  onInvestmentSelect,
}: InvestmentControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={showAll}
          onCheckedChange={onShowAllChange}
          id="show-all"
        />
        <Label htmlFor="show-all">Show All Investments</Label>
      </div>
      
      {!showAll && (
        <Select
          value={selectedInvestment}
          onValueChange={onInvestmentSelect}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select investment" />
          </SelectTrigger>
          <SelectContent>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}