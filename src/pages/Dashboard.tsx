import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, ShoppingCart, TrendingUp, DollarSign, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomerManagement } from "@/components/dashboard/CustomerManagement";
import { SalesTracking } from "@/components/dashboard/SalesTracking";
import { Analytics } from "@/components/dashboard/Analytics";
import { OrderEntry } from "@/components/dashboard/OrderEntry";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [customers, setCustomers] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [showOrderEntry, setShowOrderEntry] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const { toast } = useToast();

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

  const handleDeleteAllData = () => {
    if (confirmText.toLowerCase() === 'clear data') {
      // Clear all localStorage data
      localStorage.removeItem('customers');
      localStorage.removeItem('salesData');
      
      // Reset state
      setCustomers([]);
      setSalesData([]);
      
      // Show success toast
      const toastId = toast({
        title: "All Data Cleared",
        description: "All customer and sales data has been permanently deleted.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
      
      // Reset dialog state
      setShowDeleteDialog(false);
      setConfirmText('');
    } else {
      const toastId = toast({
        title: "Incorrect Confirmation",
        description: "Please type 'clear data' exactly to confirm deletion.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
    }
  };

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
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Overview</h2>
                <p className="text-gray-400">Welcome to Cheezy Heaven Dashboard</p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShowOrderEntry(true)}
                  className="bg-gradient-to-r from-brand-orange to-brand-green hover:scale-105 transition-all duration-300 hover-glow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Enter New Order
                </Button>
                
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        This action cannot be undone. This will permanently delete all customers, orders, and sales data.
                        <br /><br />
                        Type <span className="font-bold text-red-400">"clear data"</span> below to confirm:
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="confirmText" className="text-gray-300">Confirmation Text</Label>
                      <Input
                        id="confirmText"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type 'clear data' to confirm"
                        className="mt-2 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        onClick={() => {
                          setShowDeleteDialog(false);
                          setConfirmText('');
                        }}
                        className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAllData}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Order Entry Modal */}
            <OrderEntry 
              isOpen={showOrderEntry} 
              onClose={() => setShowOrderEntry(false)} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-brand-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
                  <p className="text-xs text-gray-400">
                    {stats.totalCustomers === 0 ? 'Add your first customer!' : 'Active customers'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-brand-orange" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
                  <p className="text-xs text-gray-400">
                    {stats.totalOrders === 0 ? 'No orders yet' : 'Orders placed'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-brand-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">PKR {stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-400">
                    {stats.monthlyRevenue === 0 ? 'Start earning!' : 'Total earned'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Avg Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-brand-purple" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">PKR {stats.avgOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-gray-400">Per order average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {customers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No activity yet. Add your first customer to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customers.slice(-3).reverse().map((customer, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">Customer added: {customer.name}</p>
                            <p className="text-xs text-gray-400">Phone: {customer.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-left group"
                    >
                      <Users className="h-6 w-6 text-brand-green mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium text-white">Add Customer</p>
                      <p className="text-xs text-gray-400">Manage customer data</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all text-left group"
                    >
                      <TrendingUp className="h-6 w-6 text-brand-orange mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-medium text-white">View Analytics</p>
                      <p className="text-xs text-gray-400">Business insights</p>
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
