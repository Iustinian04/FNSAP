
import React from 'react';
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <ChartBarIcon className="h-16 w-16 text-muted animate-pulse" />
      <h3 className="text-xl font-medium">Loading Financial Data...</h3>
      <p className="text-muted-foreground max-w-md">
        Please wait while we fetch the latest information.
      </p>
    </div>
  );
};

export default LoadingIndicator;
