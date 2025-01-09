import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ExternalLink, Globe, List } from "lucide-react";
import { useMemo, useState } from 'react';
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

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
  investments: Investment[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

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

  // Generate mock price data that aligns with investment dates
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
      const dataPoint: any = { date: pricePoint.date, basePrice: pricePoint.price };
      
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
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Investment Details</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {investments.map((investment) => (
                    <div
                      key={`${investment.date}-${investment.project}`}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                        selectedInvestment === investment.project
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedInvestment(investment.project)}
                    >
                      <h4 className="font-medium">{investment.project}</h4>
                      <p className="text-sm text-muted-foreground">
                        {investment.date}
                      </p>
                      <p className="text-sm">
                        {formatCurrency(Number(investment.amount))}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {investment.round}
                      </Badge>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">{description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-1">Assets Under Management</h4>
              <p className="text-2xl font-bold">{aum}</p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-1">Total Investments</h4>
              <p className="text-2xl font-bold">{investments.length}</p>
            </Card>
          </div>

          <Card className="p-4">
            <h4 className="text-sm font-medium mb-4">Investment History</h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={combinedChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry, index) => (
                              entry.value && (
                                <p key={index} className="text-sm text-muted-foreground">
                                  {entry.name}: {formatCurrency(Number(entry.value))}
                                </p>
                              )
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {uniqueProjects.map((project, index) => (
                    <Line
                      key={project}
                      yAxisId="left"
                      type="monotone"
                      dataKey={project}
                      name={project}
                      stroke={COLORS[index % COLORS.length]}
                      dot={{ r: 6 }}
                      strokeWidth={selectedInvestment === project ? 3 : 1}
                      opacity={selectedInvestment ? (selectedInvestment === project ? 1 : 0.3) : 1}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
