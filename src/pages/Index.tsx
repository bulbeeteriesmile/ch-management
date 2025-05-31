
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />;
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />;
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              Cheezy Heaven
            </span>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowLogin(true)} 
              className="hover-glow border-white/30 text-white hover:bg-white/20"
            >
              Login
            </Button>
            <Button 
              onClick={() => setShowSignup(true)} 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white hover-glow"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 animate-glow">
              <Sparkles className="h-4 w-4 mr-2" />
              Next-Generation Food Business Management
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent animate-pulse">
                Food Business
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline customer management, track sales in real-time, and gain powerful insights 
              that help your food brand grow faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => setShowSignup(true)}
                className="bg-white text-brand-orange hover:bg-gray-50 hover-glow text-xl px-12 py-4 rounded-full group"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="text-white/80 text-sm">
                No credit card required • Free setup
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
