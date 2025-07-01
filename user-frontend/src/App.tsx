
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";
import DarkModeProvider from "./components/DarkModeProvider";
import CompleteProfile from "./pages/CompleteProfile";
import RelaxationQuiz from "./components/quiz/RelaxationQuiz";
import RelaxationMusic from "./components/music/RelaxationMusic";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/games" element={<Games />} />
            <Route path="/quiz" element={<RelaxationQuiz />} />
            <Route path="/music" element={<RelaxationMusic />} />
            


            <Route path="/complete-profile" element={<CompleteProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
