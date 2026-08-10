"use client";

import { DiffTool } from "@/tools/diff/DiffTool";
import { EncodeTool } from "@/tools/encode/EncodeTool";
import { HashTool } from "@/tools/hash/HashTool";
import { JsonTool } from "@/tools/json/JsonTool";
import { JwtTool } from "@/tools/jwt/JwtTool";
import { RegexTool } from "@/tools/regex/RegexTool";
import { TimeTool } from "@/tools/time/TimeTool";
import { UuidTool } from "@/tools/uuid/UuidTool";

interface WorkspaceProps {
  activeTool: string;
}

export function Workspace({ activeTool }: WorkspaceProps) {
  const renderTool = () => {
    switch (activeTool) {
      case "json":
        return <JsonTool />;
      case "jwt":
        return <JwtTool />;
      case "encode":
        return <EncodeTool />;
      case "time":
        return <TimeTool />;
      case "diff":
        return <DiffTool />;
      case "regex":
        return <RegexTool />;
      case "uuid":
        return <UuidTool />;
      case "hash":
        return <HashTool />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
            Select a tool from the sidebar to begin.
          </div>
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {renderTool()}
    </main>
  );
}
