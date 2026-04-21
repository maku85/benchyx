"use client";

import { Calendar, Clock, Copy, Globe, Hash } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { cn } from "@/lib/utils";

/**
 * Heuristic to detect if a number is seconds or milliseconds.
 * Threshold: 30,000,000,000 (roughly Jan 1st, 2919 in seconds)
 */
const SECONDS_THRESHOLD = 30000000000;

function parseDate(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try parsing as a number
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed);
    if (num < SECONDS_THRESHOLD) {
      return new Date(num * 1000);
    }
    return new Date(num);
  }

  // Try parsing as a date string
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    return date;
  }

  return null;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff > 0;

  const seconds = Math.floor(absDiff / 1000);
  if (seconds < 60) return isFuture ? "in a few seconds" : "a few seconds ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isFuture ? `in ${minutes}m` : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isFuture ? `in ${hours}h` : `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return isFuture ? `in ${days}d` : `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return isFuture ? `in ${months}mo` : `${months}mo ago`;

  const years = Math.floor(months / 12);
  return isFuture ? `in ${years}y` : `${years}y ago`;
}

export function TimeTool() {
  const [input, setInput] = useState<string>("");
  const [timezone, setTimezone] = useState<"UTC" | "Local">("Local");

  const date = useMemo(() => parseDate(input), [input]);
  const error = input.trim() !== "" && date === null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setInput("");
  };

  const isoString = date ? date.toISOString() : "";
  const localString = date
    ? timezone === "UTC"
      ? date.toLocaleString(undefined, { timeZone: "UTC" })
      : date.toLocaleString()
    : "";
  const timestampS = date ? Math.floor(date.getTime() / 1000).toString() : "";
  const timestampMs = date ? date.getTime().toString() : "";
  const relativeTime = date ? getRelativeTime(date) : "";

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={() => date && handleCopy(isoString)}
        onClear={handleClear}
        status={error ? "Invalid date format" : date ? "Parsed" : "Ready"}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-0.5 bg-muted/30 rounded-md border border-border/50">
            {(["Local", "UTC"] as const).map((tz) => (
              <button
                type="button"
                key={tz}
                onClick={() => setTimezone(tz)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all whitespace-nowrap",
                  timezone === tz
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20",
                )}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5 flex items-center justify-between">
              <span>Input</span>
            </div>
            <textarea
              className="flex-1 w-full p-4 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/20"
              placeholder="Enter Unix timestamp, ISO string or human date..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
        }
        right={
          <div className="flex flex-col h-full bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Output
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-auto">
              {error ? (
                <div className="text-destructive/80 bg-destructive/10 p-4 rounded border border-destructive/20 animate-in fade-in duration-200">
                  <div className="font-bold text-[10px] uppercase mb-1">
                    Error
                  </div>
                  Invalid date format. Please check your input.
                </div>
              ) : date ? (
                <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                  {/* Parsed Dates */}
                  <section>
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-3 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Parsed Date
                    </h3>
                    <div className="space-y-2">
                      <OutputItem
                        label="ISO 8601"
                        value={isoString}
                        onCopy={() => handleCopy(isoString)}
                      />
                      <OutputItem
                        label={`${timezone} Format`}
                        value={localString}
                        onCopy={() => handleCopy(localString)}
                      />
                    </div>
                  </section>

                  {/* Unix Timestamps */}
                  <section>
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-3 flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      Unix Timestamps
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <OutputItem
                        label="Seconds"
                        value={timestampS}
                        onCopy={() => handleCopy(timestampS)}
                      />
                      <OutputItem
                        label="Milliseconds"
                        value={timestampMs}
                        onCopy={() => handleCopy(timestampMs)}
                      />
                    </div>
                  </section>

                  {/* Relative Time */}
                  <section>
                    <h3 className="text-[10px] uppercase font-bold text-muted-foreground/50 mb-3 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Relative Time
                    </h3>
                    <div className="p-3 bg-muted/30 rounded border border-border/50 font-mono text-sm text-foreground">
                      {relativeTime}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 space-y-4 select-none">
                  <Globe className="w-12 h-12 stroke-[1px]" />
                  <p className="italic text-sm">
                    Enter a date to see conversions...
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
