
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Users, TrendingUp, Shield, BarChart3, Clock, CheckCircle } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Customer Management",
      description: "Centralized customer database with quick search and retrieval by phone number"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Live sales tracking with daily, weekly, and monthly insights"
    },
    {
      icon: BarChart3,
      title: "Business Intelligence",
      description: "Advanced analytics on customer patterns and order trends"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control for different team members"
    },
    {
      icon: Clock,
      title: "Smart Notifications",
      description: "Automated alerts for customer retention and business insights"
    },
    {
      icon: CheckCircle,
      title: "Offline Support",
      description: "Continue operations even without internet connectivity"
    }
  ];

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />;
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-brand-orange" />
            <span className="text-xl font-bold bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
              FoodBrand Pro
            </span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowLogin(true)} className="hover:scale-105 transition-transform">
              Login
            </Button>
            <Button onClick={() => setShowSignup(true)} className="bg-gradient-to-r from-brand-orange to-brand-green hover:scale-105 transition-transform">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg pt-24 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Next-Generation Food Business Management
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your Food Business
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Operations
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline customer management, track sales in real-time, and gain powerful insights 
              that help your food brand grow faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowSignup(true)}
                className="bg-white text-brand-orange hover:bg-gray-50 hover:scale-105 transition-all duration-200 text-lg px-8 py-3"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowLogin(true)}
                className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-200 text-lg px-8 py-3"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for food brands, our platform combines powerful features 
              with an intuitive interface that your team will love.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-orange to-brand-green rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-brand-orange mb-2">500+</div>
              <div className="text-gray-600">Food Brands Using Our Platform</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-brand-green mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-brand-blue mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of food brands already using FoodBrand Pro to streamline 
            their operations and boost their growth.
          </p>
          <Button 
            size="lg"
            onClick={() => setShowSignup(true)}
            className="bg-white text-brand-orange hover:bg-gray-50 hover:scale-105 transition-all duration-200 text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-6 w-6 text-brand-orange" />
            <span className="text-lg font-bold">FoodBrand Pro</span>
          </div>
          <p className="text-gray-400">
            © 2024 FoodBrand Pro. All rights reserved. Built for the food industry.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
