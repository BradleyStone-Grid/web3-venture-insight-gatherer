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
  
  // Calculate the value range from the data
  const values = data.flatMap(entry => 
    Object.entries(entry)
      .filter(([key]) => key !== 'date' && selectedInvestments.includes(key))
      .map(([, value]) => typeof value === 'number' ? value : 0)
  );
  
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  
  // Calculate domain with padding and smoothing
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1; // 10% padding
  const domainMax = Math.ceil((maxValue + padding) / 100000) * 100000;
  const domainMin = Math.floor((minValue - padding) / 100000) * 100000;
  
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
                if (typeof value === 'number') {
                  const absValue = Math.abs(value);
                  if (absValue >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`;
                  }
                  return `$${(value / 1000).toFixed(1)}K`;
                }
                return '0';
              }}
              width={80}
              domain={[domainMin, domainMax]}
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
                      {payload
                        .filter(entry => typeof entry.value === 'number')
                        .sort((a, b) => {
                          const aValue = typeof a.value === 'number' ? a.value : 0;
                          const bValue = typeof b.value === 'number' ? b.value : 0;
                          return bValue - aValue;
                        })
                        .map((entry, index) => (
                          <p 
                            key={`${entry.name}-${index}`} 
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium">{entry.name}:</span>
                            <span>{formatCurrency(entry.value as number)}</span>
                          </p>
                        ))}
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
                  connectNulls={false}
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