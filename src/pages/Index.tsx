
import { Button } from "@/components/ui/button";
import { ChefHat, Users, BarChart3, ArrowRight, CheckCircle, Zap } from "lucide-react";

const Index = () => {
  const handleDashboardClick = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              FlavorForge
            </span>
          </div>
          <Button 
            onClick={handleDashboardClick}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2 rounded-lg font-medium transition-colors"
          >
            Dashboard
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Restaurant
              <span className="block text-gray-600">Management</span>
              <span className="block">Simplified</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Powerful tools to manage customers, track sales, and grow your food business. 
              Everything you need in one clean, simple platform.
            </p>
            
            <Button 
              size="lg" 
              onClick={handleDashboardClick}
              className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-lg font-semibold group"
            >
              Start Managing
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Database</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize customer information and track their order history seamlessly.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sales Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time insights into your revenue, orders, and business performance.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Zap className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Orders</h3>
              <p className="text-gray-600 leading-relaxed">
                Fast order entry system to keep your business moving efficiently.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gray-50 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Why Choose FlavorForge?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">No complex setup required</span>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">Works on any device</span>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">Real-time data tracking</span>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <span className="text-lg text-gray-700">Built for food businesses</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
