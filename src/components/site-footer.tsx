import { Link } from "wouter";

const FOOTER_LINK_GROUPS = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/lobby", label: "Tournament Lobby" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund & Cancellation" },
      { href: "/fair-play", label: "Fair Play Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.32em] text-secondary">Elite Battle India</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.03em]">Built for structured Free Fire competition</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Public tournament rules, support contact, refund terms, and fair-play standards are published here so players, reviewers, and payment teams can understand exactly how the platform operates.
            </p>
            <div className="mt-5 text-sm text-muted-foreground">
              Support: <a href="mailto:vishalkrishan564@gmail.com" className="text-foreground underline decoration-white/20 underline-offset-4">vishalkrishan564@gmail.com</a>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{group.title}</p>
                <div className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
