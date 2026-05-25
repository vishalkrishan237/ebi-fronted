import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bot, Headset, History, Home, LogOut, Menu, MessageCircle, Shield, Sparkles, Trophy, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EBI_WHATSAPP_COMMUNITY_URL } from "@/lib/community";

const NAV_ITEMS = [
  { href: "/lobby", label: "Lobby" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
  { href: "/support", label: "Support" },
];

const MOBILE_MENU_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/lobby", label: "Lobby", icon: Trophy },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/support", label: "Support", icon: Headset },
];

const MOBILE_GUEST_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/lobby", label: "Lobby", icon: Trophy },
  { href: "/support", label: "Support", icon: Headset },
  { href: "/login", label: "Log In", icon: UserCircle },
  { href: "/signup", label: "Sign Up", icon: Shield },
];

function isRouteActive(location: string, href: string) {
  if (href === "/") {
    return location === href;
  }

  return location === href || location.startsWith(`${href}/`);
}

export function Navbar() {
  const { data: me } = useGetMe();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const isAuthRoute = location === "/login" || location === "/signup";
  const mobileMenuItems = me?.user
    ? [...MOBILE_MENU_ITEMS, ...(me.user.isAdmin ? [{ href: "/admin", label: "Admin Control", icon: Shield }] : [])]
    : MOBILE_GUEST_ITEMS;
  const mobileQuickLinks = me?.user
    ? [
        { href: "/", label: "Home", icon: Home },
        { href: "/lobby", label: "Lobby", icon: Trophy },
        { href: "/support", label: "Support", icon: Headset },
        { href: "/profile", label: "Profile", icon: UserCircle },
      ]
    : MOBILE_GUEST_ITEMS;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      },
    });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto flex min-h-[4.5rem] items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="arena-glow grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/35 bg-primary/10 shadow-[0_0_24px_rgba(167,46,32,0.18)] transition-all group-hover:scale-105">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]">Elite Battle</div>
                <div className="truncate text-base font-black tracking-[0.05em] text-foreground sm:text-lg sm:tracking-[0.08em]">
                  India
                </div>
              </div>
            </Link>

            <div className="arena-chip hidden items-center gap-1 px-2 py-1 lg:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = isRouteActive(location, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary shadow-[0_0_18px_rgba(167,46,32,0.1)]"
                        : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button asChild variant="outline" className="hidden rounded-full border-primary/20 bg-background/50 text-foreground hover:bg-primary/10 lg:flex">
              <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4 text-primary" />
                WhatsApp Community
              </a>
            </Button>

            {me?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="arena-chip hidden h-11 px-3 lg:flex">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 border-white/8 bg-card/95" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{me.user.username}</p>
                      <p className="text-xs text-muted-foreground">{me.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/support" className="w-full cursor-pointer">
                      Support & Appeals
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={EBI_WHATSAPP_COMMUNITY_URL} target="_blank" rel="noreferrer" className="w-full cursor-pointer">
                      WhatsApp Community
                    </a>
                  </DropdownMenuItem>
                  {me.user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="w-full cursor-pointer">
                        Admin Control
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" asChild className="arena-chip px-5">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_rgba(167,46,32,0.18)] hover:bg-primary/90">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="arena-chip h-11 px-3 lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] border-white/10 bg-card/96 px-4 pb-8 pt-12 sm:max-w-sm">
                <SheetHeader className="border-b border-white/8 pb-4 text-left">
                  <SheetTitle className="text-left text-xl font-black tracking-tight">Mobile Command Deck</SheetTitle>
                  <SheetDescription className="text-left">
                    Fast access to matches, support, profile, and the WhatsApp community from your phone.
                  </SheetDescription>
                </SheetHeader>

                {me?.user ? (
                  <MobileAssistantCard
                    eyebrow="Arena AI"
                    title={me.user.username}
                    subtitle={me.user.email}
                    badge="Community flow"
                    message="Every room is confirmed through WhatsApp now, so the fastest path is lobby, community link, support, and your player profile."
                  />
                ) : (
                  <MobileAssistantCard
                    eyebrow="Arena AI"
                    title="Guest mode"
                    subtitle="Mobile onboarding"
                    message="Create your player account, open the lobby, then jump into the WhatsApp community to reserve your room and talk to the admin."
                  />
                )}

                <div className="mt-5 grid gap-2">
                  {mobileMenuItems.map((item) => {
                    const isActive = isRouteActive(location, item.href);
                    const Icon = item.icon;

                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all ${
                            isActive
                              ? "border-primary/25 bg-primary/10 text-primary"
                              : "border-white/8 bg-background/70 text-foreground hover:border-primary/15 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span className="font-semibold">{item.label}</span>
                          </div>
                          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Open</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>

                <a
                  href={EBI_WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary transition-all hover:bg-primary/15"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-semibold">Join WhatsApp Community</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.24em]">Open</span>
                </a>

                {me?.user ? (
                  <Button
                    variant="outline"
                    className="mt-5 h-12 w-full rounded-2xl border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                ) : (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <SheetClose asChild>
                      <Button variant="outline" asChild className="h-12 rounded-2xl border-white/10 bg-background/70">
                        <Link href="/login">Log In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {!isAuthRoute && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-2">
            {mobileQuickLinks.map((item) => {
              const isActive = isRouteActive(location, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all ${
                    isActive ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="mb-1 h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function MobileAssistantCard({
  eyebrow,
  title,
  subtitle,
  message,
  badge,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  message: string;
  badge?: string;
}) {
  return (
    <div className="arena-shell arena-scan mt-5 overflow-hidden border-primary/15 bg-[linear-gradient(180deg,rgba(18,21,28,0.96),rgba(10,12,16,0.92))] p-4 shadow-[0_0_30px_rgba(167,46,32,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="arena-glow mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/12 shadow-[0_0_24px_rgba(167,46,32,0.16)]">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">{eyebrow}</p>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]" />
            </div>
            <div className="mt-1 truncate text-lg font-black text-foreground">{title}</div>
            <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
          </div>
        </div>
        {badge ? (
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary">
            {badge}
          </div>
        ) : (
          <div className="rounded-full border border-secondary/20 bg-secondary/10 p-2 text-secondary">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary/12 text-secondary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Smart mobile note</p>
            <p className="mt-1 text-sm leading-6 text-foreground/92">{message}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1">Fast routes</span>
        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1">WhatsApp flow</span>
        <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1">Touch friendly</span>
      </div>
    </div>
  );
}
