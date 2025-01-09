import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface InvestmentChartProps {
  data: any[];
  uniqueProjects: string[];
  selectedInvestments: string[];
  isLoading?: boolean;
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

export function InvestmentChart({ 
  data, 
  uniqueProjects, 
  selectedInvestments,
  isLoading = false,
}: InvestmentChartProps) {
  console.log("Chart Render - Data:", data);
  console.log("Chart Render - Selected Projects:", selectedInvestments);
  
  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4">Investment History</h4>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                month: 'short',
                year: '2-digit'
              })}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `$${(value / 1000000).toFixed(1)}M`;
                }
                return `$${(value / 1000).toFixed(1)}K`;
              }}
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-medium mb-2">
                        {new Date(label).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      {payload.map((entry, index) => {
                        const value = Number(entry.value);
                        return value > 0 ? (
                          <p 
                            key={`${entry.name}-${index}`} 
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium">{entry.name}:</span>
                            <span>{formatCurrency(value)}</span>
                          </p>
                        ) : null;
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            {uniqueProjects.map((project, index) => (
              selectedInvestments.includes(project) && (
                <Line
                  key={project}
                  type="monotone"
                  dataKey={project}
                  name={project}
                  stroke={COLORS[index % COLORS.length]}
                  dot={{ r: 4 }}
                  strokeWidth={2}
                  connectNulls
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}