
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomerManagement } from "@/components/dashboard/CustomerManagement";
import { SalesTracking } from "@/components/dashboard/SalesTracking";
import { Analytics } from "@/components/dashboard/Analytics";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    dailyOrders: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setStats(prev => ({
        totalCustomers: prev.totalCustomers + Math.floor(Math.random() * 2),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 3),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 1000),
        dailyOrders: Math.floor(Math.random() * 50) + 20
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'customers':
        return <CustomerManagement />;
      case 'sales':
        return <SalesTracking />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-brand-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-brand-orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12.3% from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-brand-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8.7% from last month</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                  <TrendingUp className="h-4 w-4 text-brand-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.dailyOrders}</div>
                  <p className="text-xs text-muted-foreground">+3.2% from yesterday</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New customer registered: John Smith</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Order #12345 completed</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Monthly report generated</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <Users className="h-6 w-6 text-brand-green mb-2" />
                      <p className="font-medium">Add Customer</p>
                      <p className="text-xs text-gray-500">Manage customer data</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('sales')}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <ShoppingCart className="h-6 w-6 text-brand-orange mb-2" />
                      <p className="font-medium">View Sales</p>
                      <p className="text-xs text-gray-500">Track sales data</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
