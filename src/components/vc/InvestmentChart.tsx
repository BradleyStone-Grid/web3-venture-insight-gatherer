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
  isLoading?: boolean; // Added optional isLoading prop
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
  isLoading = false, // Added with default value
}: InvestmentChartProps) {
  console.log("Chart Data:", data);
  console.log("Unique Projects:", uniqueProjects);
  console.log("Selected Investments:", selectedInvestments);
  
  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4">Investment History</h4>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-medium">{label}</p>
                      {payload.map((entry, index) => {
                        const value = Number(entry.value);
                        return value > 0 ? (
                          <p key={index} className="text-sm text-muted-foreground">
                            {entry.name}: {formatCurrency(value)}
                          </p>
                        ) : null;
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
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
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}