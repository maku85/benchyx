"use client";

import {
  AlertCircle,
  Calendar,
  Clock,
  Copy,
  Database,
  FileType,
  Key,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SplitPanel } from "@/components/SplitPanel";
import { Toolbar } from "@/components/Toolbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JwtPayload {
  iat?: number;
  nbf?: number;
  exp?: number;
  [key: string]: unknown;
}

interface DecodedJwt {
  header: Record<string, unknown> | null;
  payload: JwtPayload | null;
  signature: string;
  isExpired: boolean;
  error?: string;
}

/**
 * Decodes a Base64Url encoded string to a UTF-8 string.
 */
function base64UrlDecode(str: string): string {
  try {
    // Replace URL-safe characters and add padding
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    // Decode base64 and handle UTF-8 characters
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
  } catch {
    throw new Error("Invalid token encoding");
  }
}

/**
 * Formats a Unix timestamp into a human-readable date string.
 */
function formatDate(timestamp: number | undefined): string {
  if (timestamp === undefined) return "N/A";
  try {
    return new Date(timestamp * 1000).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return "Invalid Date";
  }
}

export function JwtTool() {
  const [input, setInput] = useState("");

  const decoded = useMemo<DecodedJwt | null>(() => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return null;

    const parts = trimmedInput.split(".");
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: "",
        isExpired: false,
        error: "Invalid JWT format",
      };
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      const now = Math.floor(Date.now() / 1000);
      const isExpired =
        typeof payload.exp === "number" ? payload.exp < now : false;

      return {
        header,
        payload,
        signature,
        isExpired,
      };
    } catch (e) {
      return {
        header: null,
        payload: null,
        signature: "",
        isExpired: false,
        error: e instanceof Error ? e.message : "Invalid token encoding",
      };
    }
  }, [input]);

  const handleCopy = (content: Record<string, unknown> | null | undefined) => {
    if (content) {
      const text =
        typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2);
      navigator.clipboard.writeText(text);
    }
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <Toolbar
        onClear={handleClear}
        status={
          decoded?.error
            ? "Invalid JWT"
            : decoded
              ? decoded.isExpired
                ? "Token Expired"
                : "Valid Format"
              : "Ready"
        }
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(decoded?.header)}
            disabled={!decoded?.header}
            className="h-8 gap-1.5 font-medium"
          >
            <Copy className="w-3.5 h-3.5" />
            Header
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(decoded?.payload)}
            disabled={!decoded?.payload}
            className="h-8 gap-1.5 font-medium"
          >
            <Copy className="w-3.5 h-3.5" />
            Payload
          </Button>
        </div>
      </Toolbar>

      <SplitPanel
        left={
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/50 bg-muted/5">
              Encoded Token
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT here (header.payload.signature)..."
              className="flex-1 w-full p-6 bg-transparent resize-none border-0 focus:outline-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/20 selection:bg-primary/20"
              spellCheck={false}
            />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/50 bg-muted/5">
              Decoded Content
            </div>

            <div className="flex-1 p-6 space-y-8 overflow-auto">
              {!decoded && !input.trim() && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/20 gap-4">
                  <div className="p-4 rounded-full border-2 border-dashed border-muted-foreground/10">
                    <Key className="w-12 h-12" />
                  </div>
                  <p className="italic text-sm">
                    Decoded token parts will appear here...
                  </p>
                </div>
              )}

              {decoded?.error && (
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-4 text-destructive animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-2 bg-destructive/10 rounded-full">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Invalid Token</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {decoded.error}
                    </div>
                  </div>
                </div>
              )}

              {decoded && !decoded.error && (
                <div className="space-y-8 pb-8">
                  {decoded.isExpired && (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-4 text-amber-500 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-2 bg-amber-500/10 rounded-full">
                        <Clock className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Token Expired</div>
                        <div className="text-xs opacity-70 mt-0.5 whitespace-nowrap">
                          This token reached its expiration time at{" "}
                          {formatDate(decoded.payload?.exp)}.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        label: "Issued At",
                        val: decoded.payload?.iat,
                        icon: Calendar,
                        color: "text-blue-400",
                      },
                      {
                        label: "Not Before",
                        val: decoded.payload?.nbf,
                        icon: ShieldCheck,
                        color: "text-indigo-400",
                      },
                      {
                        label: "Expiration",
                        val: decoded.payload?.exp,
                        icon: Clock,
                        color: decoded.isExpired
                          ? "text-amber-500"
                          : "text-emerald-400",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-muted/20 border border-border/50 rounded-xl hover:border-border transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1.5">
                          <item.icon className={cn("w-3 h-3", item.color)} />
                          {item.label}
                        </div>
                        <div className="text-xs font-mono font-medium truncate">
                          {formatDate(item.val)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Header Section */}
                  <section className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                        <FileType className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-widest text-[10px]">
                          Header
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        Algorithm & Token Type
                      </span>
                    </div>
                    <div className="relative group">
                      <pre className="p-4 bg-muted/40 border border-border/50 rounded-xl font-mono text-[13px] leading-relaxed overflow-x-auto selection:bg-rose-500/20">
                        <code className="text-rose-400/90">
                          {JSON.stringify(decoded.header, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* Payload Section */}
                  <section className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <Database className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-widest text-[10px]">
                          Payload
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        Data & Claims
                      </span>
                    </div>
                    <div className="relative group">
                      <pre className="p-4 bg-muted/40 border border-border/50 rounded-xl font-mono text-[13px] leading-relaxed overflow-x-auto selection:bg-indigo-500/20">
                        <code className="text-indigo-400/90">
                          {JSON.stringify(decoded.payload, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </section>

                  {/* Signature Section */}
                  <section className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <Key className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-widest text-[10px]">
                          Signature
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        Verification Hash
                      </span>
                    </div>
                    <div className="p-4 bg-muted/40 border border-border/50 rounded-xl font-mono text-[12px] break-all leading-relaxed text-emerald-400/60 transition-opacity">
                      {decoded.signature}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
