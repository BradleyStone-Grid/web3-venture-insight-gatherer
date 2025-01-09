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
  const dateRange = useMemo(() => {
    if (!investments || investments.length === 0) return [];
    
    const startDate = new Date(Math.min(...investments.map(inv => new Date(inv.date).getTime())));
    const endDate = new Date();
    const dates = [];
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    
    return dates;
  }, [investments]);

  // Create project time series with accumulated investments and growth
  const projectTimeSeries = useMemo(() => {
    const series: { [key: string]: { date: string; price: number }[] } = {};
    
    // Initialize series for each project
    uniqueProjects.forEach(project => {
      series[project] = dateRange.map(date => ({
        date,
        price: 0
      }));

      // Get all investments for this project
      const projectInvestments = investments
        .filter(inv => inv.project === project)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let accumulatedValue = 0;
      
      // Process each date in the range
      dateRange.forEach((date, index) => {
        // Find any investments made on this date
        const investmentsOnDate = projectInvestments.filter(inv => inv.date === date);
        
        // Add new investments to accumulated value
        if (investmentsOnDate.length > 0) {
          accumulatedValue += investmentsOnDate.reduce((sum, inv) => sum + inv.amount, 0);
        }
        
        // Set the value for this date
        if (accumulatedValue > 0) {
          series[project][index].price = Math.round(accumulatedValue);
          
          // Apply growth only if we're not on the last date
          if (index < dateRange.length - 1) {
            // Generate consistent growth based on the date
            const growthSeed = new Date(date).getTime();
            const randomGrowth = (Math.sin(growthSeed) + 1) * 0.1; // 0% to 20% growth
            accumulatedValue *= (1 + randomGrowth);
          }
        }
      });
    });

    console.log("Project Time Series:", series);
    return series;
  }, [uniqueProjects, dateRange, investments]);

  // Combine project data for the chart
  const combinedChartData = useMemo(() => {
    const activeProjects = showAll ? uniqueProjects : selectedInvestments;
    
    return dateRange.map(date => {
      const dataPoint: any = { date };
      
      activeProjects.forEach(project => {
        const projectData = projectTimeSeries[project];
        const matchingPoint = projectData.find(d => d.date === date);
        dataPoint[project] = matchingPoint?.price || 0;
      });
      
      return dataPoint;
    });
  }, [dateRange, projectTimeSeries, showAll, selectedInvestments, uniqueProjects]);

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