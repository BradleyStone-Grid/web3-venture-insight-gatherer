import { Card } from "@/components/ui/card";

interface VCStatsProps {
  aum: string;
  totalInvestments: number;
}

export function VCStats({ aum, totalInvestments }: VCStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-1">Assets Under Management</h4>
        <p className="text-2xl font-bold">{aum}</p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-1">Total Investments</h4>
        <p className="text-2xl font-bold">{totalInvestments}</p>
      </Card>
    </div>
  );
}