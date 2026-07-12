import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatAssistant } from "@/components/ChatAssistant";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ResourceDetail from "./pages/ResourceDetail.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import TaxCalculator from "./pages/TaxCalculator.tsx";
import EmiCalculator from "./pages/EmiCalculator.tsx";
import CustomAppDevelopment from "./pages/CustomAppDevelopment.tsx";
import WorkflowAutomation from "./pages/WorkflowAutomation.tsx";
import KnowYourselfLanding from "./pages/know-yourself/KnowYourselfLanding";
import COAPage from "./pages/know-yourself/COAPage";
import TrialBalancePage from "./pages/know-yourself/TrialBalancePage";
import PlatformPage from "./pages/know-yourself/PlatformPage";
import BalanceSheetPage from "./pages/know-yourself/BalanceSheetPage";
import ProfitLossPage from "./pages/know-yourself/ProfitLossPage";
import CashFlowPage from "./pages/know-yourself/CashFlowPage";
import RatiosPage from "./pages/know-yourself/RatiosPage";
import ReportPage from "./pages/know-yourself/ReportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/know-yourself" element={<KnowYourselfLanding />} />
          <Route path="/know-yourself/coa" element={<COAPage />} />
          <Route path="/know-yourself/trial-balance" element={<TrialBalancePage />} />
          <Route path="/know-yourself/platform" element={<PlatformPage />} />
          <Route path="/know-yourself/balance-sheet" element={<BalanceSheetPage />} />
          <Route path="/know-yourself/profit-loss" element={<ProfitLossPage />} />
          <Route path="/know-yourself/cash-flow" element={<CashFlowPage />} />
          <Route path="/know-yourself/ratios" element={<RatiosPage />} />
          <Route path="/know-yourself/report" element={<ReportPage />} />
          <Route path="/custom-app-development" element={<CustomAppDevelopment />} />
          <Route path="/workflow-automation" element={<WorkflowAutomation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
