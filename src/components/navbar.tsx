import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coins, LogOut, UserCircle, Trophy, Radio } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/lobby", label: "Lobby" },
  { href: "/watch-earn", label: "Watch & Earn" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/history", label: "History" },
  { href: "/coupons", label: "Rewards" },
];

export function Navbar() {
  const { data: me } = useGetMe();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-background/70 backdrop-blur-2xl">
      <div className="container mx-auto flex h-[4.5rem] items-center justify-between gap-6 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="arena-glow grid h-11 w-11 place-items-center rounded-2xl border border-primary/35 bg-primary/10 shadow-[0_0_24px_rgba(34,211,238,0.18)] transition-all group-hover:scale-105">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Elite Battle</div>
              <div className="text-lg font-black tracking-[0.08em] text-foreground">Arena Network</div>
            </div>
          </Link>

          <div className="arena-chip hidden lg:flex items-center gap-1 px-2 py-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-[0_0_18px_rgba(34,211,238,0.1)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/6"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {me?.user ? (
            <>
              <div className="arena-chip hidden md:flex items-center gap-3 border-primary/20 px-4 py-2 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm font-bold text-primary">{me.user.coinBalance}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="arena-chip h-11 px-3">
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
                    <Link href="/watch-earn" className="cursor-pointer w-full">Watch & Earn</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/rewards" className="cursor-pointer w-full">Wallet Activity</Link>
                  </DropdownMenuItem>
                  {me.user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer w-full">Admin Control</Link>
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="arena-chip px-5">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                <Link href="/signup">
                  Deploy
                  <Radio className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
