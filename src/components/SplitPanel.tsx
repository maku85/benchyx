"use client";

import type { ReactNode } from "react";

interface SplitPanelProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitPanel({ left, right }: SplitPanelProps) {
  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
      <div className="flex-1 border-b md:border-b-0 md:border-r border-border relative overflow-hidden bg-background">
        <div className="absolute inset-0 overflow-auto">{left}</div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 overflow-auto">{right}</div>
      </div>
    </div>
  );
}
