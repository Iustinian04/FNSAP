
import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div>
          <p>© 2025 FinSenti. Financial Sentiment Analysis Platform</p>
        </div>
        <div className="flex gap-4">
          <button className="hover:text-foreground">About</button>
          <button className="hover:text-foreground">Terms</button>
          <button className="hover:text-foreground">Privacy</button>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
