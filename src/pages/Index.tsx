
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, TrendingUp, Shield, Star } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-brand-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-orange to-brand-yellow rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Cheezy Heaven
            </span>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowLogin(true)} 
              className="hover-glow border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Login
            </Button>
            <Button 
              onClick={() => setShowSignup(true)} 
              className="bg-gradient-to-r from-brand-orange to-brand-yellow hover:from-brand-orange/90 hover:to-brand-yellow/90 text-white hover-glow shadow-lg"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <Badge className="mb-8 bg-gradient-to-r from-white/20 to-white/10 text-white border-white/30 animate-glow backdrop-blur-sm px-6 py-2 text-lg">
              <Sparkles className="h-5 w-5 mr-3" />
              Next-Generation Food Business Management
            </Badge>
            
            <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-pulse">
                Food Business
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Streamline customer management, track sales in real-time, and gain powerful insights 
              that help your food brand grow faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
              <Button 
                size="lg" 
                onClick={() => setShowSignup(true)}
                className="bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white hover-glow text-xl px-16 py-6 rounded-full group shadow-2xl font-semibold"
              >
                Get Started Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              
              <div className="text-gray-400 text-lg flex items-center space-x-4">
                <Shield className="h-5 w-5" />
                <span>No credit card required • Free setup</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-green to-brand-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Customer Management</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Keep track of all your customers with detailed profiles and purchase history.
                </p>
              </div>

              <div className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-orange to-brand-yellow rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Real-time Analytics</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Get instant insights into your sales performance and business growth.
                </p>
              </div>

              <div className="glass-effect p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover-glow">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-purple to-brand-blue rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Growth Insights</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Make data-driven decisions to accelerate your business growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
