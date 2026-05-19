import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, useSignup, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Mail, Lock, User, Hash, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginFormSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

const SignupFormSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[A-Za-z0-9_]+$/),
  email: z.string().email().max(254),
  freeFireUid: z.string().min(6).max(15).regex(/^[0-9]+$/),
  password: z.string().min(6).max(128),
  referralCode: z
    .string()
    .trim()
    .max(64)
    .transform((value) => value.toUpperCase())
    .optional()
    .or(z.literal("")),
});

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const loginForm = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      freeFireUid: "",
      password: "",
      referralCode: "",
    },
  });

  const onLogin = (data: any) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Access granted", description: "Welcome back to the arena." });
          setLocation("/lobby");
        },
        onError: (err: any) => {
          toast({ variant: "destructive", title: "Login failed", description: err.message || "Invalid credentials." });
        },
      },
    );
  };

  const onSignup = (data: any) => {
    signupMutation.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "Operator created", description: "Your wallet and referral code are ready." });
          setLocation("/watch-earn");
        },
        onError: (err: any) => {
          toast({ variant: "destructive", title: "Signup failed", description: err.message || "Could not create account." });
        },
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid place-items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="arena-shell arena-scan overflow-hidden border-white/10 bg-card/75">
          <CardHeader className="border-b border-white/6 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(2,6,23,0))] text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-primary/35 bg-primary/10 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
              <Trophy className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black">Arena Access</CardTitle>
            <CardDescription>Secure wallet identity, verified tournament access, and referral growth in one account.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-full border border-white/8 bg-background/40 p-1">
                <TabsTrigger value="login" className="rounded-full">Login</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FieldWithIcon
                      control={loginForm.control}
                      name="email"
                      label="Email"
                      placeholder="operator@example.com"
                      icon={Mail}
                    />
                    <FieldWithIcon
                      control={loginForm.control}
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      icon={Lock}
                      type="password"
                    />
                    <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loginMutation.isPending}>
                      {loginMutation.isPending ? "Connecting..." : "Enter Arena"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FieldWithIcon control={signupForm.control} name="username" label="Username" placeholder="ProCaptain" icon={User} />
                    <FieldWithIcon control={signupForm.control} name="email" label="Email" placeholder="operator@example.com" icon={Mail} />
                    <FieldWithIcon control={signupForm.control} name="freeFireUid" label="Free Fire UID" placeholder="123456789" icon={Hash} />
                    <FieldWithIcon control={signupForm.control} name="password" label="Password" placeholder="Set a strong password" icon={Lock} type="password" />
                    <FieldWithIcon control={signupForm.control} name="referralCode" label="Referral Code" placeholder="Optional invite code" icon={Gift} />
                    <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={signupMutation.isPending}>
                      {signupMutation.isPending ? "Provisioning..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function FieldWithIcon({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className="h-12 rounded-2xl border-white/10 bg-background/45 pl-10 focus-visible:ring-primary/40"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
