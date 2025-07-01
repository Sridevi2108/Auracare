import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

// Dashboard Layout + Pages
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import ContentManagement from "./pages/ContentManagement";
import QuizManagement from "./pages/QuizManagement";
import NotFound from "./pages/NotFound";
import MusicManagement from "./pages/MusicManagement";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Dashboard + nested pages */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="quiz" element={<QuizManagement />} />
                  <Route path="music" element={<MusicManagement />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Redirect & 404 */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
