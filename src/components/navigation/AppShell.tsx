"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { QuickLumberModal } from "../calculator/QuickLumberModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-industrial-50 dark:bg-industrial-950 text-industrial-900 dark:text-industrial-100">
      <Sidebar onOpenCalculator={() => setIsCalcOpen(true)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <QuickLumberModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
}
