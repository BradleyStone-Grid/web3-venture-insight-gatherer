import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { List } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { VCHeader } from "./vc/VCHeader";
import { VCStats } from "./vc/VCStats";
import { InvestmentChart } from "./vc/InvestmentChart";
import { InvestmentSidebar } from "./vc/InvestmentSidebar";
import { InvestmentControls } from "./vc/InvestmentControls";
import { useInvestmentData } from "@/hooks/useInvestmentData";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

interface VCDetailsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  logo: string;
  description: string;
  aum: string;
  website: string;
  investments?: Investment[];
}

export function VCDetailsView({
  open,
  onOpenChange,
  name,
  logo,
  description,
  aum,
  website,
  investments = [],
}: VCDetailsViewProps) {
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { uniqueProjects, getCombinedChartData } = useInvestmentData(investments);

  const combinedChartData = getCombinedChartData(showAll, selectedInvestments);

  console.log("Chart Data:", combinedChartData);
  console.log("Unique Projects:", uniqueProjects);
  console.log("Selected Investments:", selectedInvestments);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <VCHeader
              name={name}
              logo={logo}
              website={website}
              description={description}
            />
            <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <VCStats aum={aum} totalInvestments={investments.length} />
          
          <InvestmentControls
            showAll={showAll}
            onShowAllChange={setShowAll}
            uniqueProjects={uniqueProjects}
            selectedInvestment={selectedInvestments[0]}
            onInvestmentSelect={(value) => setSelectedInvestments([value])}
          />
          
          {combinedChartData.length > 0 && (
            <InvestmentChart
              data={combinedChartData}
              uniqueProjects={uniqueProjects}
              selectedInvestments={showAll ? uniqueProjects : selectedInvestments}
            />
          )}
        </div>

        <InvestmentSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          investments={investments}
          selectedInvestment={selectedInvestments[0]}
          onInvestmentSelect={(investment) => setSelectedInvestments([investment])}
        />
      </DialogContent>
    </Dialog>
  );
}