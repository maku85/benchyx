"use client";

import { Calculator, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { cn } from "@/lib/utils";

type Base = "bin" | "oct" | "dec" | "hex";

const BASES: { value: Base; label: string; radix: number }[] = [
  { value: "bin", label: "BIN", radix: 2 },
  { value: "oct", label: "OCT", radix: 8 },
  { value: "dec", label: "DEC", radix: 10 },
  { value: "hex", label: "HEX", radix: 16 },
];

function parseBigInt(digits: string, radix: number): bigint | null {
  const trimmed = digits.trim();
  if (!trimmed) return null;

  let value = BigInt(0);
  const r = BigInt(radix);
  for (const ch of trimmed.toLowerCase()) {
    const digit = Number.parseInt(ch, radix);
    if (Number.isNaN(digit)) return null;
    value = value * r + BigInt(digit);
  }
  return value;
}

export function NumberBaseTool() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState<Base>("dec");

  const radix = BASES.find((b) => b.value === base)?.radix ?? 10;
  const value = useMemo(() => parseBigInt(input, radix), [input, radix]);
  const error = input.trim() !== "" && value === null;

  const results =
    value !== null
      ? {
          bin: value.toString(2),
          oct: value.toString(8),
          dec: value.toString(10),
          hex: value.toString(16).toUpperCase(),
        }
      : null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => setInput("");

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={() => results && handleCopy(results.dec)}
        onClear={handleClear}
        status={
          error ? "Invalid digits" : value !== null ? "Converted" : "Ready"
        }
      >
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-0.5 bg-muted/30 rounded-md border border-border/50">
            {BASES.map((b) => (
              <button
                type="button"
                key={b.value}
                onClick={() => setBase(b.value)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-sm transition-all whitespace-nowrap",
                  base === b.value
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/20",
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Input ({BASES.find((b) => b.value === base)?.label})
            </div>
            <textarea
              className="flex-1 w-full p-4 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/20"
              placeholder={`Enter a ${base === "dec" ? "decimal" : base === "hex" ? "hexadecimal" : base === "bin" ? "binary" : "octal"} number...`}
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
              {error ? (
                <div className="text-destructive/80 bg-destructive/10 p-4 rounded border border-destructive/20 animate-in fade-in duration-200">
                  <div className="font-bold text-[10px] uppercase mb-1">
                    Error
                  </div>
                  Invalid digits for the selected base.
                </div>
              ) : results ? (
                <div className="space-y-2 animate-in slide-in-from-right-2 duration-300">
                  <OutputItem
                    label="Binary"
                    value={results.bin}
                    onCopy={() => handleCopy(results.bin)}
                  />
                  <OutputItem
                    label="Octal"
                    value={results.oct}
                    onCopy={() => handleCopy(results.oct)}
                  />
                  <OutputItem
                    label="Decimal"
                    value={results.dec}
                    onCopy={() => handleCopy(results.dec)}
                  />
                  <OutputItem
                    label="Hexadecimal"
                    value={results.hex}
                    onCopy={() => handleCopy(results.hex)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 space-y-4 select-none">
                  <Calculator className="w-12 h-12 stroke-[1px]" />
                  <p className="italic text-sm">
                    Enter a number to see conversions...
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
