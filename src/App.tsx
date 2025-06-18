import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Calendar from "./pages/Calendar";
import Appointments from "./pages/Appointments";
import Statistics from "./pages/Statistics";
import Tests from "./pages/Tests";
import Tips from "./pages/Tips";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthGuard from "@/components/AuthGuard";
import HealthDiary from "./pages/HealthDiary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={
            <AuthGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/history" element={<History />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/tips" element={<Tips />} />
                <Route path="/support" element={<Support />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/diary" element={<HealthDiary />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
