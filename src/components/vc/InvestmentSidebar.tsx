import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";

interface Investment {
  date: string;
  amount: number;
  round: string;
  project: string;
}

interface InvestmentSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investments: Investment[];
  selectedInvestment: string | null;
  onInvestmentSelect: (project: string) => void;
}

export function InvestmentSidebar({
  open,
  onOpenChange,
  investments,
  selectedInvestment,
  onInvestmentSelect,
}: InvestmentSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Investment Details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="pr-4">
            {investments.map((investment) => (
              <div
                key={`${investment.date}-${investment.project}`}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedInvestment === investment.project
                    ? "bg-primary/10"
                    : "hover:bg-muted"
                }`}
                onClick={() => onInvestmentSelect(investment.project)}
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}