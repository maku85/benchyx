"use client";

import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { cn } from "@/lib/utils";

export function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const { matches, segments, error } = useMemo(() => {
    if (!pattern)
      return {
        matches: [],
        segments: [{ text: testString, isMatch: false }],
        error: null,
      };

    try {
      const activeFlags = flags.includes("g") ? flags : `${flags}g`;
      const regex = new RegExp(pattern, activeFlags);
      const allMatches = Array.from(testString.matchAll(regex));

      const segs: { text: string; isMatch: boolean }[] = [];
      let lastIndex = 0;

      for (const match of allMatches) {
        if (match.index === undefined) continue;

        if (match.index > lastIndex) {
          segs.push({
            text: testString.slice(lastIndex, match.index),
            isMatch: false,
          });
        }

        segs.push({ text: match[0], isMatch: true });
        lastIndex = match.index + match[0].length;

        if (match[0].length === 0) {
          if (lastIndex >= testString.length) break;
        }
      }

      if (lastIndex < testString.length) {
        segs.push({ text: testString.slice(lastIndex), isMatch: false });
      }

      return {
        matches: allMatches.map((m) => m[0]),
        segments: segs,
        error: null,
      };
    } catch (e) {
      return {
        matches: [],
        segments: [{ text: testString, isMatch: false }],
        error: e instanceof Error ? e.message : "Invalid regular expression",
      };
    }
  }, [pattern, flags, testString]);

  const handleCopyMatches = () => {
    if (matches.length > 0) {
      navigator.clipboard.writeText(matches.join("\n"));
    }
  };

  const handleClearInput = () => {
    setTestString("");
  };

  const handleReset = () => {
    setPattern("");
    setFlags("g");
    setTestString("");
  };

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag,
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={handleCopyMatches}
        onClear={handleClearInput}
        onAction={handleReset}
        actionLabel="Reset"
        status={
          error
            ? "Invalid Regex"
            : matches.length > 0
              ? `${matches.length} matches`
              : "Ready"
        }
      >
        <div className="flex items-center gap-1.5 ml-2">
          <div className="flex items-center p-0.5 bg-muted/30 rounded-md border border-border/50">
            {["g", "i", "m"].map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => toggleFlag(f)}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-sm transition-all uppercase",
                  flags.includes(f)
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20",
                )}
                title={
                  f === "g" ? "Global" : f === "i" ? "Ignore case" : "Multiline"
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="flex flex-col border-b border-border/50">
              <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 bg-muted/5">
                Regex Pattern
              </div>
              <div className="flex items-center px-4 py-3 gap-2 bg-background">
                <span className="text-muted-foreground font-mono text-lg">
                  /
                </span>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-0 focus:outline-none font-mono text-sm py-1 placeholder:text-muted-foreground/20"
                  placeholder="[a-z]+"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  spellCheck={false}
                />
                <span className="text-muted-foreground font-mono text-lg">
                  /
                </span>
                <span className="text-primary font-mono text-sm font-bold min-w-[24px]">
                  {flags}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
                Test String
              </div>
              <textarea
                className="flex-1 w-full p-4 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/20"
                placeholder="Paste your text here to test the regex..."
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        }
        right={
          <div className="flex flex-col h-full bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Highlight Output
            </div>
            <div className="flex-1 relative overflow-auto font-mono text-sm leading-relaxed p-4 whitespace-pre-wrap break-all">
              {error ? (
                <div className="text-destructive/80 bg-destructive/10 p-3 rounded border border-destructive/20 animate-in fade-in duration-200">
                  <div className="font-bold text-[10px] uppercase mb-1">
                    Invalid Regex
                  </div>
                  {error}
                </div>
              ) : pattern ? (
                segments.map((seg, i) => (
                  <span
                    key={i}
                    className={cn(
                      seg.isMatch &&
                        "bg-primary/20 text-primary border-b border-primary/40 rounded-sm",
                    )}
                  >
                    {seg.text}
                  </span>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/20 italic select-none">
                  Enter a regex pattern to see highlights...
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
