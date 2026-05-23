import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import LobbyPage from "@/pages/lobby";
import MatchDetailsPage from "@/pages/match-details";
import ProfilePage from "@/pages/profile";
import RewardsPage from "@/pages/rewards";
import LeaderboardPage from "@/pages/leaderboard";
import HistoryPage from "@/pages/history";
import CouponsPage from "@/pages/coupons";
import AdminPage from "@/pages/admin";
import WatchEarnPage from "@/pages/watch-earn";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import RefundPolicyPage from "@/pages/refund-policy";
import FairPlayPage from "@/pages/fair-play";
import SupportPage from "@/pages/support";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={AuthPage} />
        <Route path="/signup" component={AuthPage} />
        <Route path="/lobby" component={LobbyPage} />
        <Route path="/matches/:id" component={MatchDetailsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/rewards" component={RewardsPage} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/coupons" component={CouponsPage} />
        <Route path="/watch-earn" component={WatchEarnPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/refund-policy" component={RefundPolicyPage} />
        <Route path="/fair-play" component={FairPlayPage} />
        <Route path="/support" component={SupportPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
