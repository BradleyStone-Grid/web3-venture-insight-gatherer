import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { List } from "lucide-react";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import { VCHeader } from "./vc/VCHeader";
import { VCStats } from "./vc/VCStats";
import { InvestmentChart } from "./vc/InvestmentChart";
import { InvestmentSidebar } from "./vc/InvestmentSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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

  // Calculate unique projects
  const uniqueProjects = useMemo(() => 
    [...new Set(investments.map(inv => inv.project))],
    [investments]
  );

  // Generate complete date range for the chart
  const mockPriceData = useMemo(() => {
    if (!investments || investments.length === 0) return [];
    
    // Find the earliest investment date
    const startDate = new Date(Math.min(...investments.map(inv => new Date(inv.date).getTime())));
    const endDate = new Date();
    const priceData = [];
    
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      priceData.push({
        date: currentDate.toISOString().split('T')[0],
      });
      
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    
    return priceData;
  }, [investments]);

  // Create individual time series for each project
  const projectTimeSeries = useMemo(() => {
    if (!investments || investments.length === 0) return {};

    const series: { [key: string]: any[] } = {};
    
    // Initialize series for each project with zero values
    uniqueProjects.forEach(project => {
      series[project] = mockPriceData.map(pd => ({
        date: pd.date,
        price: 0
      }));

      // Find all investments for this project
      const projectInvestments = investments
        .filter(inv => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Process each investment date
      projectInvestments.forEach(inv => {
        const startIndex = series[project].findIndex(d => d.date === inv.date);
        
        if (startIndex !== -1) {
          let currentValue = inv.amount;
          
          // If there was a previous value, add to it instead of replacing
          if (startIndex > 0 && series[project][startIndex - 1].price > 0) {
            currentValue += series[project][startIndex - 1].price;
          }
          
          // Fill in values from this investment date onwards
          for (let i = startIndex; i < series[project].length; i++) {
            series[project][i].price = Math.round(currentValue);
            // Add random growth between -5% to +15%
            currentValue = currentValue * (1 + (Math.random() * 0.20 - 0.05));
          }
        }
      });
    });

    return series;
  }, [investments, mockPriceData, uniqueProjects]);

  // Combine project data for the chart
  const combinedChartData = useMemo(() => {
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    
    return mockPriceData.map(pricePoint => {
      const dataPoint: any = { date: pricePoint.date };
      
      activeProjects.forEach(project => {
        const series = projectTimeSeries[project];
        if (series) {
          const matchingPoint = series.find(s => s.date === pricePoint.date);
          dataPoint[project] = matchingPoint?.price || 0;
        }
      });
      
      return dataPoint;
    });
  }, [mockPriceData, projectTimeSeries, showAll, selectedInvestments, uniqueProjects]);

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
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={showAll}
                onCheckedChange={setShowAll}
                id="show-all"
              />
              <Label htmlFor="show-all">Show All Investments</Label>
            </div>
            
            {!showAll && (
              <Select
                value={selectedInvestments[0]}
                onValueChange={(value) => setSelectedInvestments([value])}
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