
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Menu,
  X
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardLayout = ({ children, activeTab, setActiveTab }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'User';
  const userCompany = localStorage.getItem('userCompany') || 'Your Company';

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'sales', name: 'Sales', icon: ShoppingCart },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCompany');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
              Cheezy Heaven
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="text-sm font-medium text-white">{userName}</div>
          <div className="text-xs text-gray-400">{userCompany}</div>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-orange/20 to-brand-green/20 text-brand-orange border border-brand-orange/30'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full flex items-center space-x-2 text-white border-gray-600 hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold capitalize text-white">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
