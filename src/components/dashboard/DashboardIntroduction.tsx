
import React from 'react';

const DashboardIntroduction: React.FC = () => {
  return (
    <div className="space-y-2 max-w-2xl">
      <h2 className="text-3xl font-bold">Sentiment Analysis Dashboard</h2>
      <p className="text-muted-foreground">
        Analyze financial news sentiment for stocks, indices, and forex pairs to inform your investment decisions.
      </p>
    </div>
  );
};

export default DashboardIntroduction;
