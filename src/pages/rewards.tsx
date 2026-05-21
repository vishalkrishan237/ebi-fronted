import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe, useGetRewards, getGetMeQueryKey, getGetRewardsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, TrendingDown, Clock, Wallet, Loader2, IndianRupee, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateRazorpayOrder,
  usePaymentHistory,
  usePaymentPackages,
  useVerifyRazorpayPayment,
} from "@/lib/platform-api";
import { loadRazorpayScript } from "@/lib/razorpay";

export default function RewardsPage() {
  const { data: me } = useGetMe();
  const { data: transactions, isLoading } = useGetRewards();
  const { data: paymentPackages } = usePaymentPackages(!!me?.user);
  const { data: paymentHistory } = usePaymentHistory(!!me?.user);
  const createOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activePackageInr, setActivePackageInr] = useState<number | null>(null);

  const startTopUp = async (packageInr: number) => {
    if (!me?.user) {
      toast({ title: "Login required", description: "Please log in to add wallet balance.", variant: "destructive" });
      return;
    }

    setActivePackageInr(packageInr);
    const hasSdk = await loadRazorpayScript();
    if (!hasSdk || !window.Razorpay) {
      setActivePackageInr(null);
      toast({ title: "Checkout unavailable", description: "Razorpay checkout could not load.", variant: "destructive" });
      return;
    }

    createOrder.mutate(packageInr, {
      onSuccess: (order) => {
        const razorpay = new window.Razorpay({
          key: order.keyId,
          amount: order.amountPaise,
          currency: order.currency,
          name: "Elite Battle India",
          description: `${order.package.coins} coin top-up`,
          order_id: order.orderId,
          prefill: order.prefill,
          theme: {
            color: "#22d3ee",
          },
          handler: (response: Record<string, unknown>) => {
            verifyPayment.mutate(
              {
                razorpayOrderId: String(response["razorpay_order_id"] ?? ""),
                razorpayPaymentId: String(response["razorpay_payment_id"] ?? ""),
                razorpaySignature: String(response["razorpay_signature"] ?? ""),
              },
              {
                onSuccess: (result) => {
                  queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
                  queryClient.invalidateQueries({ queryKey: getGetRewardsQueryKey() });
                  queryClient.invalidateQueries({ queryKey: ["payment-history"] });
                  toast({
                    title: "Top-up successful",
                    description: `${result.packageCoins} coins added to your wallet.`,
                  });
                  setActivePackageInr(null);
                },
                onError: (error: any) => {
                  toast({
                    title: "Verification failed",
                    description: error.message ?? "Payment completed but verification failed.",
                    variant: "destructive",
                  });
                  setActivePackageInr(null);
                },
              },
            );
          },
          modal: {
            ondismiss: () => setActivePackageInr(null),
          },
        });

        razorpay.open();
      },
      onError: (error: any) => {
        toast({
          title: "Unable to start payment",
          description: error.message ?? "Could not create payment order.",
          variant: "destructive",
        });
        setActivePackageInr(null);
      },
    });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Wallet & Payments</h1>
          <p className="text-muted-foreground">Top up coins for rewards and coupon redemption. Paid tournament entry now checks out directly in INR.</p>
        </div>

        <Card className="border-white/10 bg-card/65">
          <CardContent className="flex items-center gap-3 px-5 py-4">
            <Wallet className="h-6 w-6 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Balance</div>
              <div className="font-mono text-2xl font-black text-primary">{me?.user?.coinBalance ?? 0} coins</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Card className="border-white/10 bg-card/60 shadow-xl">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Buy Coin Packages
              </CardTitle>
              <CardDescription>Real INR payment through Razorpay. Successful payment credits your server wallet automatically.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!me?.user ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-muted-foreground">
                  Log in first to buy wallet balance.
                </div>
              ) : !paymentPackages?.keyId ? (
                <div className="rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center text-sm text-amber-200">
                  Razorpay keys are not configured in the backend yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {paymentPackages.packages.map((pkg, index) => {
                    const isBusy =
                      activePackageInr === pkg.inr &&
                      (createOrder.isPending || verifyPayment.isPending);

                    return (
                      <motion.div
                        key={pkg.inr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-[1.75rem] border border-white/10 bg-background/45 p-5 shadow-[0_12px_32px_rgba(2,6,23,0.15)]"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className="rounded-full border border-primary/20 bg-primary/10 text-primary">
                            INR {pkg.inr}
                          </Badge>
                          <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Wallet top-up</div>
                        </div>

                        <div className="mt-5 text-3xl font-black">{pkg.coins.toLocaleString()} coins</div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Add tournament balance instantly after Razorpay confirms your payment.
                        </p>

                        <Button
                          className="mt-5 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => startTopUp(pkg.inr)}
                          disabled={isBusy}
                        >
                          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay INR ${pkg.inr}`}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/50 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-background/30">
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-secondary" />
                Wallet Ledger
              </CardTitle>
              <CardDescription>All coin credits and debits in one place.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {!transactions || transactions.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No coin transactions found.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.map((tx, i) => {
                    const isEarn = tx.amount > 0;
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                              isEarn ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}
                          >
                            {isEarn ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{tx.reason}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                              </span>
                              {tx.matchName && (
                                <>
                                  <span className="text-muted-foreground text-xs">•</span>
                                  <Badge variant="outline" className="text-[10px] border-white/10 font-normal">
                                    {tx.matchName}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={`font-mono font-bold text-lg flex items-center gap-1 ${isEarn ? "text-green-500" : "text-red-500"}`}>
                          {isEarn ? "+" : ""}
                          {tx.amount}
                          <Coins className="h-4 w-4" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/10 bg-card/60">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Payment History
              </CardTitle>
              <CardDescription>Razorpay orders created and verified for your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!me?.user ? (
                <div className="text-sm text-muted-foreground">Log in to view payment history.</div>
              ) : !paymentHistory || paymentHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
                  No top-up payments yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="rounded-2xl border border-white/10 bg-background/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold">INR {payment.packageInr} top-up</div>
                          <div className="text-xs text-muted-foreground">{payment.packageCoins.toLocaleString()} coins</div>
                        </div>
                        <Badge
                          className={
                            payment.status === "captured"
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : payment.status === "failed"
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : "bg-white/5 text-muted-foreground border border-white/10"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Created {format(new Date(payment.createdAt), "MMM d, yyyy HH:mm")}
                      </div>
                      {payment.providerPaymentId && (
                        <div className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
                          Payment ID: {payment.providerPaymentId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-card/60">
            <CardHeader className="border-b border-white/5">
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
              <p>1. Choose a package and open Razorpay checkout.</p>
              <p>2. After successful payment, the backend verifies the payment signature.</p>
              <p>3. Verified payments credit coins through the existing wallet ledger.</p>
              <p>4. Those coins can be used for wallet rewards and coupon redemption, while paid match entry now uses direct checkout.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
