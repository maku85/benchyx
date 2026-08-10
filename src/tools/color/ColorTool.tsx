"use client";

import { Copy, Palette } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";

type Rgb = { r: number; g: number; b: number };

function clamp255(n: number) {
  return Math.min(255, Math.max(0, Math.round(n)));
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;

  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: clamp255((r + m) * 255),
    g: clamp255((g + m) * 255),
    b: clamp255((b + m) * 255),
  };
}

function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();

  const hexMatch = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const num = Number.parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  const rgbMatch = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: clamp255(Number(rgbMatch[1])),
      g: clamp255(Number(rgbMatch[2])),
      b: clamp255(Number(rgbMatch[3])),
    };
  }

  const hslMatch = value.match(
    /^hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%/,
  );
  if (hslMatch) {
    return hslToRgb(
      Number(hslMatch[1]),
      Number(hslMatch[2]),
      Number(hslMatch[3]),
    );
  }

  return null;
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }: Rgb) {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  const delta = max - min;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rN:
        h = ((gN - bN) / delta) % 6;
        break;
      case gN:
        h = (bN - rN) / delta + 2;
        break;
      default:
        h = (rN - gN) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ColorTool() {
  const [input, setInput] = useState("#38bdf8");

  const rgb = useMemo(() => parseColor(input), [input]);
  const error = input.trim() !== "" && rgb === null;

  const hex = rgb ? rgbToHex(rgb) : "";
  const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hslString = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => setInput("");

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        onCopy={() => hex && handleCopy(hex)}
        onClear={handleClear}
        status={error ? "Invalid color" : rgb ? "Parsed" : "Ready"}
      />

      <SplitPanel
        left={
          <div className="flex flex-col h-full bg-background">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Input
            </div>
            <div className="p-4 flex items-center gap-3">
              <input
                type="color"
                value={rgb ? rgbToHex(rgb) : "#000000"}
                onChange={(e) => setInput(e.target.value)}
                className="w-10 h-10 rounded border border-border/50 bg-transparent cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="#38bdf8, rgb(56, 189, 248), hsl(199, 94%, 60%)..."
                spellCheck={false}
                className="flex-1 px-3 py-2 bg-muted/30 border border-border/50 rounded-md font-mono text-sm focus:outline-none focus:ring-1 focus:ring-border"
              />
            </div>
          </div>
        }
        right={
          <div className="flex flex-col h-full bg-muted/5">
            <div className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 border-b border-border/50 bg-muted/5">
              Output
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-auto">
              {error ? (
                <div className="text-destructive/80 bg-destructive/10 p-4 rounded border border-destructive/20 animate-in fade-in duration-200">
                  <div className="font-bold text-[10px] uppercase mb-1">
                    Error
                  </div>
                  Unrecognized color format.
                </div>
              ) : rgb ? (
                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                  <div
                    className="h-20 rounded-md border border-border/50"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="space-y-2">
                    <OutputItem
                      label="HEX"
                      value={hex}
                      onCopy={() => handleCopy(hex)}
                    />
                    <OutputItem
                      label="RGB"
                      value={rgbString}
                      onCopy={() => handleCopy(rgbString)}
                    />
                    <OutputItem
                      label="HSL"
                      value={hslString}
                      onCopy={() => handleCopy(hslString)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 space-y-4 select-none">
                  <Palette className="w-12 h-12 stroke-[1px]" />
                  <p className="italic text-sm">
                    Enter a color to see conversions...
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
