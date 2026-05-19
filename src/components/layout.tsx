import React from "react";
import { Navbar } from "@/components/navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.13),_transparent_28%),radial-gradient(circle_at_80%_18%,_rgba(244,114,182,0.09),_transparent_24%),linear-gradient(180deg,_rgba(2,6,23,0.92),_rgba(3,7,18,1))]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="arena-float absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="arena-float absolute bottom-10 right-[-7rem] h-56 w-56 rounded-full bg-secondary/10 blur-3xl [animation-delay:1.2s]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>
      <Navbar />
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
