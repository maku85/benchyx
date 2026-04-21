"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Workspace } from "@/components/Workspace";

export default function Home() {
  const [activeTool, setActiveTool] = useState("json");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-full overflow-hidden relative">
      {/* Mobile Header */}
      <header className="flex md:hidden items-center px-4 h-14 border-b border-border bg-background z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="mr-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-bold text-lg tracking-tight">Benchyx</span>
      </header>

      <Sidebar
        activeTool={activeTool}
        onToolSelect={(tool) => {
          setActiveTool(tool);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <Workspace activeTool={activeTool} />
    </div>
  );
}
