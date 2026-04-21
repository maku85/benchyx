"use client";

import { ArrowLeftRight, FileCode } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DiffType = "added" | "removed" | "unchanged";

interface DiffLine {
  type: DiffType;
  value: string | null;
}

export function DiffTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const diffResult = useMemo(() => {
    if (!original && !modified) return [];

    const oldLines = original.split("\n");
    const newLines = modified.split("\n");

    const m = oldLines.length;
    const n = newLines.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array(n + 1).fill(0),
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const result: { left: DiffLine; right: DiffLine }[] = [];
    let i = m,
      j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        result.unshift({
          left: { type: "unchanged", value: oldLines[i - 1] },
          right: { type: "unchanged", value: newLines[j - 1] },
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          left: { type: "added", value: null }, // Placeholder for alignment
          right: { type: "added", value: newLines[j - 1] },
        });
        j--;
      } else {
        result.unshift({
          left: { type: "removed", value: oldLines[i - 1] },
          right: { type: "removed", value: null }, // Placeholder for alignment
        });
        i--;
      }
    }
    return result;
  }, [original, modified]);

  const handleCopy = () => {
    const unifiedDiff = diffResult
      .map((line) => {
        if (line.left.type === "unchanged") return `  ${line.left.value}`;
        if (line.left.type === "removed") return `- ${line.left.value}`;
        if (line.right.type === "added") return `+ ${line.right.value}`;
        return null;
      })
      .filter((l) => l !== null)
      .join("\n");

    if (unifiedDiff) {
      navigator.clipboard.writeText(unifiedDiff);
    }
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
  };

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const formatJson = () => {
    try {
      if (original) {
        const parsedOrig = JSON.parse(original);
        setOriginal(JSON.stringify(parsedOrig, null, 2));
      }
      if (modified) {
        const parsedMod = JSON.parse(modified);
        setModified(JSON.stringify(parsedMod, null, 2));
      }
    } catch {
      // If invalid JSON, do nothing (keep as plain text as per requirements)
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={handleCopy}
        onClear={handleClear}
        status={original || modified ? "Comparing" : "Ready"}
      >
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={formatJson}
            className="h-8 gap-1.5 font-medium"
            title="Format both as JSON if valid"
          >
            <FileCode className="w-3.5 h-3.5" />
            Format JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwap}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Swap Inputs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Toolbar>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Input Textareas */}
        <div className="h-1/3 border-b border-border bg-muted/5 flex flex-col">
          <SplitPanel
            left={
              <div className="flex flex-col h-full">
                <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
                  Original
                </div>
                <textarea
                  className="flex-1 w-full p-3 bg-transparent resize-none border-0 focus:outline-none font-mono text-xs leading-relaxed placeholder:text-muted-foreground/20"
                  placeholder="Paste original text here..."
                  value={original}
                  onChange={(e) => setOriginal(e.target.value)}
                  spellCheck={false}
                />
              </div>
            }
            right={
              <div className="flex flex-col h-full">
                <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
                  Modified
                </div>
                <textarea
                  className="flex-1 w-full p-3 bg-transparent resize-none border-0 focus:outline-none font-mono text-xs leading-relaxed placeholder:text-muted-foreground/20"
                  placeholder="Paste modified text here..."
                  value={modified}
                  onChange={(e) => setModified(e.target.value)}
                  spellCheck={false}
                />
              </div>
            }
          />
        </div>

        {/* Diff Result Visualization */}
        <div className="flex-1 min-h-0 bg-background overflow-hidden flex flex-col">
          <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
            Visual Diff
          </div>
          <div className="flex-1 overflow-auto font-mono text-xs leading-relaxed">
            <div className="flex min-w-full">
              {/* Left Side (Removals) */}
              <div className="flex-1 border-r border-border min-w-[50%]">
                {diffResult.map((line, idx) => (
                  <div
                    key={`left-${idx}`}
                    className={cn(
                      "px-4 py-0.5 whitespace-pre min-h-[1.25rem]",
                      line.left.type === "removed" &&
                        "bg-red-500/10 text-red-400 font-medium",
                      line.left.type === "added" && "bg-transparent opacity-50",
                      line.left.type === "unchanged" &&
                        "text-muted-foreground/70",
                    )}
                  >
                    <span className="inline-block w-4 mr-2 select-none opacity-30">
                      {line.left.type === "removed"
                        ? "-"
                        : line.left.type === "unchanged"
                          ? " "
                          : " "}
                    </span>
                    {line.left.value ?? ""}
                  </div>
                ))}
              </div>

              {/* Right Side (Additions) */}
              <div className="flex-1 min-w-[50%]">
                {diffResult.map((line, idx) => (
                  <div
                    key={`right-${idx}`}
                    className={cn(
                      "px-4 py-0.5 whitespace-pre min-h-[1.25rem]",
                      line.right.type === "added" &&
                        "bg-green-500/10 text-green-400 font-medium",
                      line.right.type === "removed" &&
                        "bg-transparent opacity-50",
                      line.right.type === "unchanged" &&
                        "text-muted-foreground/70",
                    )}
                  >
                    <span className="inline-block w-4 mr-2 select-none opacity-30">
                      {line.right.type === "added"
                        ? "+"
                        : line.right.type === "unchanged"
                          ? " "
                          : " "}
                    </span>
                    {line.right.value ?? ""}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
