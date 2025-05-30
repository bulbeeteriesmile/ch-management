
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomerManagement } from "@/components/dashboard/CustomerManagement";
import { SalesTracking } from "@/components/dashboard/SalesTracking";
import { Analytics } from "@/components/dashboard/Analytics";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customers, setCustomers] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    // Load real data from localStorage
    const savedCustomers = localStorage.getItem('customers');
    const savedSalesData = localStorage.getItem('salesData');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    }

    // Listen for data changes
    const interval = setInterval(() => {
      const currentCustomers = localStorage.getItem('customers');
      const currentSalesData = localStorage.getItem('salesData');
      
      if (currentCustomers) {
        setCustomers(JSON.parse(currentCustomers));
      }
      if (currentSalesData) {
        setSalesData(JSON.parse(currentSalesData));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    totalCustomers: customers.length,
    totalOrders: customers.reduce((sum, customer) => sum + customer.orderCount, 0),
    monthlyRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    avgOrderValue: customers.length > 0 && customers.reduce((sum, customer) => sum + customer.orderCount, 0) > 0 ? 
      customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
      customers.reduce((sum, customer) => sum + customer.orderCount, 0) : 0
  };

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
              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-brand-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalCustomers === 0 ? 'Add your first customer!' : 'Active customers'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-brand-orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalOrders === 0 ? 'No orders yet' : 'Orders placed'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-brand-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">PKR {stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.monthlyRevenue === 0 ? 'Start earning!' : 'Total earned'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-brand-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">PKR {stats.avgOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Per order average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {customers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No activity yet. Add your first customer to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customers.slice(-3).reverse().map((customer, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">Customer added: {customer.name}</p>
                            <p className="text-xs text-gray-500">Phone: {customer.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left hover-glow group"
                    >
                      <Users className="h-6 w-6 text-brand-green mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium">Add Customer</p>
                      <p className="text-xs text-gray-500">Manage customer data</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-all text-left hover-glow group"
                    >
                      <TrendingUp className="h-6 w-6 text-brand-orange mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium">View Analytics</p>
                      <p className="text-xs text-gray-500">Business insights</p>
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
