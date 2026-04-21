"use client";

import { ArrowLeftRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "base64-encode" | "base64-decode" | "url-encode" | "url-decode";

export function EncodeTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("base64-encode");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };

    try {
      let result = "";
      switch (mode) {
        case "base64-encode": {
          const bytes = new TextEncoder().encode(input);
          const binString = Array.from(bytes, (byte) =>
            String.fromCharCode(byte),
          ).join("");
          result = btoa(binString);
          break;
        }
        case "base64-decode": {
          const decodedBin = atob(input.trim());
          const decodedBytes = Uint8Array.from(decodedBin, (char) =>
            char.charCodeAt(0),
          );
          result = new TextDecoder().decode(decodedBytes);
          break;
        }
        case "url-encode":
          result = encodeURIComponent(input);
          break;
        case "url-decode":
          result = decodeURIComponent(input);
          break;
      }
      return { output: result, error: null };
    } catch (_) {
      let errorMsg = "Transformation failed";
      if (mode === "base64-decode") errorMsg = "Invalid Base64 input";
      else if (mode === "url-decode") errorMsg = "Invalid URL encoding";
      return { output: "", error: errorMsg };
    }
  }, [input, mode]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleSwap = () => {
    if (!output || error) return;

    const nextInput = output;
    let nextMode = mode;

    if (mode === "base64-encode") nextMode = "base64-decode";
    else if (mode === "base64-decode") nextMode = "base64-encode";
    else if (mode === "url-encode") nextMode = "url-decode";
    else if (mode === "url-decode") nextMode = "url-encode";

    setMode(nextMode);
    setInput(nextInput);
  };

  const modes: { value: Mode; label: string }[] = [
    { value: "base64-encode", label: "B64 Encode" },
    { value: "base64-decode", label: "B64 Decode" },
    { value: "url-encode", label: "URL Encode" },
    { value: "url-decode", label: "URL Decode" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={handleCopy}
        onClear={handleClear}
        status={error || (input ? "Transformed" : "Ready")}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-0.5 bg-muted/30 rounded-md border border-border/50">
            {modes.map((m) => (
              <button
                type="button"
                key={m.value}
                onClick={() => setMode(m.value)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all whitespace-nowrap",
                  mode === m.value
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="h-4 w-[1px] bg-border/60 mx-0.5" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwap}
            disabled={!output || !!error}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Swap input and output"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </Button>
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
              placeholder="Paste text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
        }
        right={
          <div className="flex flex-col h-full bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5 flex items-center justify-between">
              <span>Output</span>
              {mode.includes("base64") && !error && (
                <span className="text-[9px] font-normal lowercase opacity-40">
                  {mode === "base64-encode" ? "base64" : "plain text"}
                </span>
              )}
            </div>
            <div className="flex-1 relative overflow-auto font-mono text-sm leading-relaxed p-4">
              {error ? (
                <div className="text-destructive/80 bg-destructive/10 p-3 rounded border border-destructive/20 animate-in fade-in duration-200">
                  <div className="font-bold text-[10px] uppercase mb-1">
                    Error
                  </div>
                  {error}
                </div>
              ) : output ? (
                <pre className="text-foreground whitespace-pre-wrap break-all selection:bg-primary/20">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/20 italic select-none">
                  Output will appear here...
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
