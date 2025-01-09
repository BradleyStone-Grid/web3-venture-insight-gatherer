import { useState, useEffect } from "react";
import { VCProfile } from "@/components/VCProfile";
import { SearchBar } from "@/components/SearchBar";
import { CryptoRankKeyInput } from "@/components/CryptoRankKeyInput";
import { useVCData } from "@/hooks/useVCData";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vcData, isLoading, error } = useVCData();
  const { toast } = useToast();

  // Handle error with useEffect instead of in render
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch VC data. Please check your API key.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredVCs = vcData?.filter((vc) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vc.name.toLowerCase().includes(searchLower) ||
      vc.focus.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Web3 VC Explorer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track investments and discover opportunities in the Web3 ecosystem
          </p>
        </div>
        
        <CryptoRankKeyInput />
        <SearchBar onSearch={setSearchQuery} />

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading VC data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVCs.map((vc) => (
              <VCProfile 
                key={vc.name} 
                {...vc}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredVCs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No VCs found matching your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;