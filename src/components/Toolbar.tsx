"use client";

import { Copy, Trash2, Zap } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  onCopy?: () => void;
  onClear?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  status?: string;
  children?: React.ReactNode;
}

export function Toolbar({
  onCopy,
  onClear,
  onAction,
  actionLabel = "Action",
  status = "Ready",
  children,
}: ToolbarProps) {
  return (
    <div className="h-12 border-b border-border bg-background/50 flex items-center justify-between px-2 sm:px-4 shrink-0 overflow-hidden">
      <div className="flex-1 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="h-8 gap-1.5 font-medium shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{actionLabel}</span>
          </Button>
        )}

        {children && (
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {children}
          </div>
        )}

        <div className="h-4 w-[1px] bg-border mx-1 shrink-0" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Copy</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          title="Clear"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Clear</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground ml-2 shrink-0 bg-background/50 pl-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status.toLowerCase().includes("invalid") ||
              status.toLowerCase().includes("error") ||
              status.toLowerCase().includes("expired")
              ? "bg-red-500/50"
              : "bg-green-500/50",
          )}
        />
        <span className="hidden sm:inline whitespace-nowrap">{status}</span>
      </div>
    </div>
  );
}
