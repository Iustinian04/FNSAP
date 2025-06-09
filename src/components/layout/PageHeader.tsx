
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartBarIcon } from "@/components/icons/ChartBarIcon";
import { LogOut } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface PageHeaderProps {
  user: User | null;
  signOut: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ user, signOut }) => {
  return (
    <header className="border-b">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">FinSenti</h1>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>}
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
