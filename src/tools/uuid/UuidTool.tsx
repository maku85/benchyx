"use client";

import { Copy, Dices } from "lucide-react";
import { useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MIN_COUNT = 1;
const MAX_COUNT = 50;

export function UuidTool() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const format = (uuid: string) => {
    const value = noHyphens ? uuid.replace(/-/g, "") : uuid;
    return uppercase ? value.toUpperCase() : value;
  };

  const handleGenerate = () => {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyAll = () => {
    if (uuids.length) handleCopy(uuids.map(format).join("\n"));
  };

  const handleClear = () => setUuids([]);

  const toggles = [
    {
      key: "uppercase",
      label: "UPPER",
      active: uppercase,
      onClick: () => setUppercase((v) => !v),
    },
    {
      key: "noHyphens",
      label: "NO DASHES",
      active: noHyphens,
      onClick: () => setNoHyphens((v) => !v),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={handleCopyAll}
        onClear={handleClear}
        status={uuids.length ? `${uuids.length} generated` : "Ready"}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-0.5 bg-muted/30 rounded-md border border-border/50">
            {toggles.map((opt) => (
              <button
                type="button"
                key={opt.key}
                onClick={opt.onClick}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all whitespace-nowrap",
                  opt.active
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Options
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center gap-6">
              <label className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                  Quantity
                </span>
                <input
                  type="number"
                  min={MIN_COUNT}
                  max={MAX_COUNT}
                  value={count}
                  onChange={(e) =>
                    setCount(
                      Math.min(
                        MAX_COUNT,
                        Math.max(
                          MIN_COUNT,
                          Number(e.target.value) || MIN_COUNT,
                        ),
                      ),
                    )
                  }
                  className="w-24 text-center px-3 py-2 bg-muted/30 border border-border/50 rounded-md font-mono text-lg focus:outline-none focus:ring-1 focus:ring-border"
                />
              </label>

              <Button onClick={handleGenerate} className="gap-2">
                <Dices className="w-4 h-4" />
                Generate UUIDs
              </Button>
            </div>
          </div>
        }
        right={
          <div className="flex flex-col h-full bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Output
            </div>
            <div className="flex-1 p-4 space-y-2 overflow-auto">
              {uuids.length ? (
                <div className="space-y-2 animate-in slide-in-from-right-2 duration-300">
                  {uuids.map((uuid, i) => (
                    <OutputItem
                      key={uuid}
                      label={`#${i + 1}`}
                      value={format(uuid)}
                      onCopy={() => handleCopy(format(uuid))}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 space-y-4 select-none">
                  <Dices className="w-12 h-12 stroke-[1px]" />
                  <p className="italic text-sm">
                    Click "Generate UUIDs" to begin...
                  </p>
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}

function OutputItem({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="group relative flex flex-col p-3 bg-muted/30 rounded border border-border/50 transition-colors hover:bg-muted/50 hover:border-border">
      <span className="text-[9px] uppercase font-semibold text-muted-foreground/60 mb-1 leading-none">
        {label}
      </span>
      <div className="font-mono text-sm text-foreground break-all pr-8 select-all">
        {value}
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="absolute right-2 bottom-2.5 p-1.5 rounded-md bg-background border border-border/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:text-foreground hover:border-border shadow-sm"
        title="Copy"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
