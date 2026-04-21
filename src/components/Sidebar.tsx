"use client";

import {
  ArrowLeftRight,
  Clock,
  Hash,
  Key,
  Regex,
  SquareTerminal,
  Terminal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTool: string;
  onToolSelect: (toolId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const tools = [
  { id: "json", name: "JSON", icon: SquareTerminal },
  { id: "jwt", name: "JWT", icon: Key },
  { id: "encode", name: "Encode", icon: Hash },
  { id: "regex", name: "Regex", icon: Regex },
  { id: "time", name: "Time", icon: Clock },
  { id: "diff", name: "Diff", icon: ArrowLeftRight },
];

export function Sidebar({
  activeTool,
  onToolSelect,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay, ESC handled at document level */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: same */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={onClose}
          />
        </>
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex md:flex-col h-full",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
              Benchyx
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                type="button"
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {tool.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/30 font-bold px-3">
            Workspace v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
