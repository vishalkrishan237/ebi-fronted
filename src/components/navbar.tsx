import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coins, Gift, History, Home, LogOut, Menu, PlaySquare, Shield, Trophy, UserCircle } from "lucide-react";
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

const NAV_ITEMS = [
  { href: "/lobby", label: "Lobby" },
  { href: "/watch-earn", label: "Watch & Earn" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
  { href: "/coupons", label: "Rewards" },
];

const MOBILE_MENU_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/lobby", label: "Lobby", icon: Trophy },
  { href: "/watch-earn", label: "Watch & Earn", icon: PlaySquare },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/coupons", label: "Rewards", icon: Gift },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const MOBILE_GUEST_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/lobby", label: "Lobby", icon: Trophy },
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
        { href: "/watch-earn", label: "Earn", icon: PlaySquare },
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
              <div className="arena-glow grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/35 bg-primary/10 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition-all group-hover:scale-105">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]">Elite Battle</div>
                <div className="truncate text-base font-black tracking-[0.05em] text-foreground sm:text-lg sm:tracking-[0.08em]">
                  Arena Network
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
                        ? "bg-primary/15 text-primary shadow-[0_0_18px_rgba(34,211,238,0.1)]"
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
            {me?.user ? (
              <>
                <div className="arena-chip hidden items-center gap-3 border-primary/20 px-4 py-2 shadow-[0_0_20px_rgba(34,211,238,0.08)] md:flex">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm font-bold text-primary">{me.user.coinBalance}</span>
                </div>

                <div className="arena-chip flex items-center gap-2 border-primary/15 px-3 py-2 md:hidden">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-primary">{me.user.coinBalance}</span>
                </div>

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
                      <Link href="/watch-earn" className="w-full cursor-pointer">
                        Watch & Earn
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rewards" className="w-full cursor-pointer">
                        Wallet Activity
                      </Link>
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
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" asChild className="arena-chip px-5">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_rgba(34,211,238,0.18)] hover:bg-primary/90">
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
                    Fast access to matches, rewards, profile, and the rest of the arena from your phone.
                  </SheetDescription>
                </SheetHeader>

                {me?.user ? (
                  <div className="mt-5 rounded-3xl border border-primary/15 bg-background/70 p-4 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-lg font-black">{me.user.username}</div>
                        <div className="truncate text-xs text-muted-foreground">{me.user.email}</div>
                      </div>
                      <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                        {me.user.coinBalance} coins
                      </div>
                    </div>
                    <div className="mt-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-muted-foreground">
                      Profile and account pages now work best from here on mobile.
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl border border-white/8 bg-background/70 p-4 text-sm text-muted-foreground">
                    Log in to open your account, watch-and-earn, rewards, and match history on mobile.
                  </div>
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
