
import React from 'react';
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";

interface EmptyStateProps {
  loadDefaultAsset: () => void;
  defaultAssetSymbol?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ loadDefaultAsset, defaultAssetSymbol }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <ChartBarIcon className="h-16 w-16 text-muted" />
      <h3 className="text-xl font-medium">Search for an asset to begin</h3>
      <p className="text-muted-foreground max-w-md">
        Enter a stock symbol, index, or forex pair to analyze.
      </p>
      {defaultAssetSymbol && (
        <button
          onClick={loadDefaultAsset}
          className="text-primary hover:underline"
        >
          Or try with a sample asset ({defaultAssetSymbol})
        </button>
      )}
    </div>
  );
};

export default EmptyState;
