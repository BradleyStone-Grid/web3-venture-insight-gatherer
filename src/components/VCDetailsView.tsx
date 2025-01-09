import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ExternalLink, Globe } from "lucide-react";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
  assetPrice?: number;
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

const mockData = [
  { date: "2023-01", amount: 1000000, round: "Seed", project: "Project A", assetPrice: 2000 },
  { date: "2023-03", amount: 2000000, round: "Series A", project: "Project B", assetPrice: 2200 },
  { date: "2023-06", amount: 3000000, round: "Series B", project: "Project C", assetPrice: 2400 },
  { date: "2023-09", amount: 4000000, round: "Series C", project: "Project D", assetPrice: 2600 },
  { date: "2023-12", amount: 5000000, round: "Series D", project: "Project E", assetPrice: 2800 },
];

export function VCDetailsView({
  open,
  onOpenChange,
  name,
  logo,
  description,
  aum,
  website,
  investments = mockData,
}: VCDetailsViewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
                  data={investments}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.project}</p>
                            <p className="text-sm text-muted-foreground">
                              Amount: {formatCurrency(data.amount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Asset Price: {formatCurrency(data.assetPrice || 0)}
                            </p>
                            <Badge variant="secondary" className="mt-1">
                              {data.round}
                            </Badge>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    name="Investment Amount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="assetPrice"
                    name="Asset Price"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-medium mb-4">Investment Details</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Project</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Round</th>
                    <th className="text-left py-2">Asset Price</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={`${investment.date}-${investment.project}`} className="border-b">
                      <td className="py-2">{investment.date}</td>
                      <td className="py-2">{investment.project}</td>
                      <td className="py-2">{formatCurrency(investment.amount)}</td>
                      <td className="py-2">{investment.round}</td>
                      <td className="py-2">{formatCurrency(investment.assetPrice || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}