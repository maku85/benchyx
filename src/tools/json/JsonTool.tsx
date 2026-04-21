"use client";

import { ListTree, Minimize2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";

export function JsonTool() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, 2), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, [input]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch (_) {}
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch (_) {}
  };

  const handleCopy = () => {
    // Requirements: "Copy copies output only"
    // If output is empty but input is valid, we might want to copy input formatted.
    // Given live formatting, output will be pretty-printed input if valid.
    if (output) {
      navigator.clipboard.writeText(output);
    } else if (!error && input) {
      // In case output memo is still catching up or something (though it's sync)
      try {
        const parsed = JSON.parse(input);
        navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
      } catch {}
    }
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={handleCopy}
        onClear={handleClear}
        status={error ? "Invalid JSON" : input ? "Valid JSON" : "Ready"}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormat}
            className="h-8 gap-1.5 font-medium"
            disabled={!!error || !input}
          >
            <ListTree className="w-3.5 h-3.5" />
            Format
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMinify}
            className="h-8 gap-1.5 font-medium"
            disabled={!!error || !input}
          >
            <Minimize2 className="w-3.5 h-3.5" />
            Minify
          </Button>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/50 bg-muted/5">
              Input
            </div>
            <textarea
              className="flex-1 w-full p-4 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/30"
              placeholder='Paste JSON here... e.g. {"name": "Benchyx"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/50 bg-muted/5">
              Output
            </div>
            <div className="flex-1 relative overflow-auto font-mono text-sm leading-relaxed p-4">
              {error ? (
                <div className="text-destructive/80 bg-destructive/5 p-3 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="font-bold">Invalid JSON:</span> {error}
                </div>
              ) : output ? (
                <pre className="text-foreground whitespace-pre-wrap break-all">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/30 italic transition-opacity duration-500">
                  Formatted output will appear here...
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
