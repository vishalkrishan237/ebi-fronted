import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

type PolicySection = {
  title: string;
  body: string[];
};

export function PolicyShell({
  eyebrow,
  title,
  summary,
  sections,
  sideNote,
  supportEmail = "vishalkrishan564@gmail.com",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  sections: PolicySection[];
  sideNote?: React.ReactNode;
  supportEmail?: string;
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="arena-card p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.03em] md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">{summary}</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-[28px] border border-white/8 bg-background/35 p-5 md:p-6">
                <h2 className="text-xl font-black uppercase tracking-[0.03em] md:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="arena-shell p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/25 bg-primary/12">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Reviewer note</p>
                <h2 className="text-xl font-black uppercase tracking-[0.03em]">Skill-based platform</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Elite Battle India is structured as a competitive Free Fire tournament platform. Match outcomes are decided by player performance, room results, and published tournament rules.
            </p>
          </div>

          <div className="arena-card p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Support contact</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.03em]">Need help?</h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-background/35 p-4">
              <Mail className="h-5 w-5 text-secondary" />
              <div>
                <div className="font-semibold">{supportEmail}</div>
                <div className="text-xs text-muted-foreground">Support, disputes, compliance queries</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
              <p>Response target for account and tournament issues: within 24 to 48 working hours.</p>
              <p>For payment disputes or tournament appeals, include your username, Free Fire UID, match name, and screenshots if relevant.</p>
            </div>
          </div>

          {sideNote ? <div className="arena-card p-6">{sideNote}</div> : null}
        </aside>
      </div>
    </div>
  );
}
