import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { getCryptoRankApiKey, setCryptoRankApiKey, removeCryptoRankApiKey } from "@/lib/cryptorank";

export function CryptoRankKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = getCryptoRankApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setCryptoRankApiKey(apiKey.trim());
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleRemove = () => {
    removeCryptoRankApiKey();
    setApiKey("");
    toast({
      title: "Success",
      description: "API key removed",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-medium">CryptoRank API Key</h3>
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your CryptoRank API key"
          className="flex-1"
        />
        <Button onClick={handleSave}>Save Key</Button>
        {apiKey && <Button variant="destructive" onClick={handleRemove}>Remove</Button>}
      </div>
      <p className="text-sm text-muted-foreground">
        Your API key will be stored locally in your browser.{" "}
        <a
          href="https://cryptorank.io/profile/api"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Get your API key
        </a>
      </p>
    </div>
  );
}