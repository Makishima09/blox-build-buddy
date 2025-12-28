import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Simulator from "./pages/Simulator";
import Optimizer from "./pages/Optimizer";
import Fruits from "./pages/Fruits";
import Trader from "./pages/Trader";
import Gamepasses from "./pages/Gamepasses";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/fruits" element={<Fruits />} />
            <Route path="/trader" element={<Trader />} />
            <Route path="/gamepasses" element={<Gamepasses />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
