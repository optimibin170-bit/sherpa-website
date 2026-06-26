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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
