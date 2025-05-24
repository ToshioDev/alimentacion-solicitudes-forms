
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import PatientForm from "./pages/PatientForm";
import StaffForm from "./pages/StaffForm";
import DataManagement from "./pages/DataManagement";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={
                  <AuthGuard requireAuth={false}>
                    <Auth />
                  </AuthGuard>
                } />
                <Route path="/formulario-paciente" element={
                  <AuthGuard requireAuth={true}>
                    <PatientForm />
                  </AuthGuard>
                } />
                <Route path="/formulario-personal" element={
                  <AuthGuard requireAuth={true}>
                    <StaffForm />
                  </AuthGuard>
                } />
                <Route path="/gestion-datos" element={
                  <AuthGuard requireAuth={true}>
                    <DataManagement />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
