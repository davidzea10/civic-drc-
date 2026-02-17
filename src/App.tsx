import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Ministeres from "./pages/Ministeres";
import MinistryPublicDashboard from "./pages/MinistryPublicDashboard";
import Provinces from "./pages/Provinces";
import Propositions from "./pages/Propositions";
import ProposalDetail from "./pages/ProposalDetail";
import AdminProposals from "./pages/AdminProposals";
import Dashboard from "./pages/Dashboard";
import MinistryDashboard from "./pages/MinistryDashboard";
import APropos from "./pages/APropos";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function AppRoutes() {
  const { token, authLoading } = useAuth();
  return (
    <Routes>
      <Route path="/" element={token && !authLoading ? <Navigate to="/accueil" replace /> : <Auth />} />
      <Route path="/accueil" element={<RequireAuth><Index /></RequireAuth>} />
      <Route path="/ministeres" element={<RequireAuth><Ministeres /></RequireAuth>} />
      <Route path="/ministeres/:slug" element={<RequireAuth><MinistryPublicDashboard /></RequireAuth>} />
      <Route path="/provinces" element={<RequireAuth><Provinces /></RequireAuth>} />
      <Route path="/propositions" element={<RequireAuth><Propositions /></RequireAuth>} />
      <Route path="/propositions/:id" element={<RequireAuth><ProposalDetail /></RequireAuth>} />
      <Route path="/admin/proposals" element={<RequireAuth><AdminProposals /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/ministry-dashboard" element={<RequireAuth><MinistryDashboard /></RequireAuth>} />
      <Route path="/a-propos" element={<RequireAuth><APropos /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
