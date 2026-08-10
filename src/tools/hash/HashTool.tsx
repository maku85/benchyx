"use client";

import { Binary, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";

const ALGORITHMS = [
  { id: "SHA-1", label: "SHA-1" },
  { id: "SHA-256", label: "SHA-256" },
  { id: "SHA-384", label: "SHA-384" },
  { id: "SHA-512", label: "SHA-512" },
] as const;

async function digestHex(algorithm: string, data: BufferSource) {
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function HashTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }

    let cancelled = false;
    const data = new TextEncoder().encode(input);

    Promise.all(
      ALGORITHMS.map(
        async (algo) => [algo.id, await digestHex(algo.id, data)] as const,
      ),
    ).then((results) => {
      if (!cancelled) setHashes(Object.fromEntries(results));
    });

    return () => {
      cancelled = true;
    };
  }, [input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => setInput("");

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={() => hashes["SHA-256"] && handleCopy(hashes["SHA-256"])}
        onClear={handleClear}
        status={input ? "Hashed" : "Ready"}
      />

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Input
            </div>
            <textarea
              className="flex-1 w-full p-4 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/20"
              placeholder="Enter text to hash..."
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
            <div className="flex-1 p-4 space-y-2 overflow-auto">
              {input ? (
                <div className="space-y-2 animate-in slide-in-from-right-2 duration-300">
                  {ALGORITHMS.map((algo) => (
                    <OutputItem
                      key={algo.id}
                      label={algo.label}
                      value={hashes[algo.id] ?? "computing..."}
                      onCopy={() =>
                        hashes[algo.id] && handleCopy(hashes[algo.id])
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 space-y-4 select-none">
                  <Binary className="w-12 h-12 stroke-[1px]" />
                  <p className="italic text-sm">
                    Enter text to generate hashes...
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
