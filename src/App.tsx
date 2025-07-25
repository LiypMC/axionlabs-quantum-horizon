
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import AccountUpdate from "./pages/AccountUpdate";
import Settings from "./pages/Settings";
import ApiTest from "./pages/ApiTest";
import Gideon from "./pages/Gideon";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { Suspense } from "react";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/gideon" element={<Gideon />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/account/update" element={<AccountUpdate />} />
                <Route path="/api-test" element={<ApiTest />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
