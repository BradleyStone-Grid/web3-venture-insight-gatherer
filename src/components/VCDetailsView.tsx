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
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Generate mock price data based on investment dates
  const mockPriceData = useMemo(() => {
    if (!investments.length) return [];
    
    const startDate = new Date(investments[0].date);
    const endDate = new Date(investments[investments.length - 1].date);
    const priceData = [];
    
    let currentDate = startDate;
    let basePrice = 3000; // Starting price
    
    while (currentDate <= endDate) {
      basePrice = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      
      priceData.push({
        date: currentDate.toISOString().split('T')[0],
        price: Math.round(basePrice),
      });
      
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    
    return priceData;
  }, [investments]);

  // Create individual time series for each project
  const projectTimeSeries = useMemo(() => {
    if (!investments.length) return {};

    const series: { [key: string]: any[] } = {};
    
    // Initialize series for each project
    investments.forEach(inv => {
      if (!series[inv.project]) {
        series[inv.project] = mockPriceData.map(pd => ({
          date: pd.date,
          price: null
        }));
      }
    });

    // Add investment amounts to the correct dates
    investments.forEach(inv => {
      const seriesIndex = series[inv.project].findIndex(d => d.date === inv.date);
      if (seriesIndex !== -1) {
        series[inv.project][seriesIndex].price = inv.amount;
      }
    });

    return series;
  }, [investments, mockPriceData]);

  // Combine all data for the chart
  const combinedChartData = useMemo(() => {
    return mockPriceData.map(pricePoint => {
      const dataPoint: any = { date: pricePoint.date };
      
      // Add data points for each project
      Object.entries(projectTimeSeries).forEach(([project, series]) => {
        const matchingPoint = series.find(s => s.date === pricePoint.date);
        if (matchingPoint?.price) {
          dataPoint[project] = matchingPoint.price;
        }
      });
      
      return dataPoint;
    });
  }, [mockPriceData, projectTimeSeries]);

  const uniqueProjects = useMemo(() => 
    [...new Set(investments.map(inv => inv.project))],
    [investments]
  );

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
          
          {combinedChartData.length > 0 && (
            <InvestmentChart
              data={combinedChartData}
              uniqueProjects={uniqueProjects}
              selectedInvestment={selectedInvestment}
            />
          )}
        </div>

        <InvestmentSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          investments={investments}
          selectedInvestment={selectedInvestment}
          onInvestmentSelect={setSelectedInvestment}
        />
      </DialogContent>
    </Dialog>
  );
}