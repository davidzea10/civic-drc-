import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Ministeres from "./pages/Ministeres";
import MinistryPublicDashboard from "./pages/MinistryPublicDashboard";
import Provinces from "./pages/Provinces";
import Propositions from "./pages/Propositions";
import ProposalDetail from "./pages/ProposalDetail";
import AdminProposals from "./pages/AdminProposals";
import Dashboard from "./pages/Dashboard";
import APropos from "./pages/APropos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/accueil" element={<Index />} />
          <Route path="/ministeres" element={<Ministeres />} />
          <Route path="/ministeres/:slug" element={<MinistryPublicDashboard />} />
          <Route path="/provinces" element={<Provinces />} />
          <Route path="/propositions" element={<Propositions />} />
          <Route path="/propositions/:id" element={<ProposalDetail />} />
          <Route path="/admin/propositions" element={<AdminProposals />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
