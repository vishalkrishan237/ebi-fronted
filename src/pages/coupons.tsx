import React, { useState } from "react";
import {
  useGetCouponOptions,
  useGetMyCoupons,
  useRedeemCoupon,
  useGetMe,
  getGetMyCouponsQueryKey,
  getGetMeQueryKey,
  getGetRewardsQueryKey,
  type Coupon,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Ticket,
  Coins,
  Gift,
  Copy,
  Check,
  Sparkles,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CouponsPage() {
  const { data: me } = useGetMe();
  const { data: options } = useGetCouponOptions();
  const { data: myCoupons } = useGetMyCoupons({
    query: { enabled: !!me?.user, queryKey: getGetMyCouponsQueryKey() },
  });
  const redeem = useRedeemCoupon();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [justRedeemed, setJustRedeemed] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const balance = me?.user?.coinBalance ?? 0;

  const handleRedeem = (coinCost: number, valueInr: number) => {
    if (!me?.user) {
      toast({ title: "Login required", description: "Please log in to redeem coupons.", variant: "destructive" });
      return;
    }
    if (balance < coinCost) {
      toast({ title: "Not enough coins", description: `You need ${coinCost - balance} more coins.`, variant: "destructive" });
      return;
    }
    redeem.mutate(
      { data: { coinCost } },
      {
        onSuccess: (coupon) => {
          setJustRedeemed(coupon);
          queryClient.invalidateQueries({ queryKey: getGetMyCouponsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRewardsQueryKey() });
          toast({ title: "Coupon redeemed!", description: `Rs. ${valueInr} coupon ready to use.` });
        },
        onError: (err: any) => {
          toast({
            title: "Redemption failed",
            description: err?.response?.data?.error ?? "Try again later.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Ticket className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-black tracking-tight">Coupon Store</h1>
          <p className="text-muted-foreground">Redeem coins for tournament vouchers with clear rupee values.</p>
        </div>
      </div>

      <Card className="relative mb-8 overflow-hidden border-white/10 bg-[linear-gradient(135deg,rgba(167,46,32,0.18),rgba(15,17,22,0.95)_60%)]">
        <CardContent className="relative flex items-center justify-between p-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Your balance
            </p>
            <div className="flex items-center gap-2">
              <Coins className="h-7 w-7 text-secondary" />
              <span className="font-mono text-4xl font-black text-secondary">
                {balance.toLocaleString()}
              </span>
              <span className="ml-1 text-sm font-medium text-muted-foreground">coins</span>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Coupons owned
            </p>
            <p className="text-3xl font-black text-primary">{myCoupons?.length ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">Ready for tournament entry or promo use.</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Gift className="h-5 w-5 text-primary" /> Available Coupons
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {options?.map((opt, i) => {
            const canAfford = balance >= opt.coinCost;
            const isLoading =
              redeem.isPending && redeem.variables?.data.coinCost === opt.coinCost;
            return (
              <motion.div
                key={opt.coinCost}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`relative overflow-hidden border-white/10 bg-card/80 transition-all hover:border-primary/40 ${
                    canAfford ? "hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(0,0,0,0.32)]" : "opacity-70"
                  }`}
                >
                  <CardContent className="relative flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                        <Ticket className="h-5 w-5 text-primary" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-secondary/40 text-[10px] font-mono text-secondary"
                      >
                        {opt.coinCost.toLocaleString()} <Coins className="ml-0.5 h-2.5 w-2.5" />
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Tournament Coupon
                      </p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <IndianRupee className="h-5 w-5 text-foreground" />
                        <span className="text-3xl font-black tracking-tight">{opt.valueInr}</span>
                        <span className="text-sm text-muted-foreground">value</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {opt.coinCost.toLocaleString()} coins = Rs. {opt.valueInr}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRedeem(opt.coinCost, opt.valueInr)}
                      disabled={!canAfford || isLoading || !me?.user}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : !me?.user ? (
                        "Login to Redeem"
                      ) : !canAfford ? (
                        "Not enough coins"
                      ) : (
                        <>
                          <Sparkles className="mr-1.5 h-4 w-4" /> Redeem
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Ticket className="h-5 w-5 text-secondary" /> My Coupons
        </h2>
        <Card className="overflow-hidden border-white/10 bg-card/50">
          <CardContent className="p-0">
            {!me?.user ? (
              <div className="p-12 text-center text-muted-foreground">
                Log in to view your redeemed coupons.
              </div>
            ) : !myCoupons || myCoupons.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Ticket className="mx-auto mb-4 h-12 w-12 opacity-20" />
                <p>You haven&apos;t redeemed any coupons yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {myCoupons.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-white/5 sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="flex items-center text-lg font-bold">
                            <IndianRupee className="h-4 w-4" />
                            {c.valueInr}
                          </p>
                          <Badge
                            className={
                              c.status === "active"
                                ? "border border-green-500/30 bg-green-500/15 text-[10px] text-green-400"
                                : "border bg-muted text-[10px] text-muted-foreground"
                            }
                          >
                            {c.status.toUpperCase()}
                          </Badge>
                        </div>
                        <button
                          onClick={() => copyCode(c.code)}
                          className="group flex items-center gap-1.5 font-mono text-sm text-foreground/80 transition-colors hover:text-primary"
                          title="Click to copy"
                        >
                          {c.code}
                          {copied === c.code ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                          )}
                        </button>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Redeemed {format(new Date(c.createdAt), "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Cost
                      </p>
                      <p className="flex items-center justify-end gap-1 font-mono font-bold text-secondary">
                        {c.coinCost.toLocaleString()}
                        <Coins className="h-3.5 w-3.5" />
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!justRedeemed} onOpenChange={(o) => !o && setJustRedeemed(null)}>
        <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-secondary" /> Coupon Unlocked!
            </DialogTitle>
            <DialogDescription>
              Your tournament coupon has been generated. Save the code below.
            </DialogDescription>
          </DialogHeader>
          {justRedeemed && (
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-primary/40 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center">
                <div className="mb-3 flex items-baseline justify-center gap-1">
                  <IndianRupee className="h-7 w-7" />
                  <span className="text-5xl font-black">{justRedeemed.valueInr}</span>
                  <span className="ml-2 text-muted-foreground">tournament credit</span>
                </div>
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Coupon Code
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="font-mono text-lg font-bold tracking-wider text-primary">
                    {justRedeemed.code}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(justRedeemed.code)}
                  >
                    {copied === justRedeemed.code ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => setJustRedeemed(null)}
              >
                Awesome
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
