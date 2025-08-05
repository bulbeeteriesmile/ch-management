
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Users, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { InactiveCustomersPopup } from './InactiveCustomersPopup';

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

interface SalesRecord {
  date: string;
  amount: number;
  customerPhone: string;
}

export const Analytics = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [showInactivePopup, setShowInactivePopup] = useState(false);

  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    const savedSalesData = localStorage.getItem('salesData');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    }
  }, []);

  // Generate sales growth data based on actual sales data
  const generateSalesGrowthData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Get actual sales for this date
      const dailySales = salesData
        .filter(sale => sale.date === dateString)
        .reduce((sum, sale) => sum + sale.amount, 0);
      
      const orderCount = salesData.filter(sale => sale.date === dateString).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
        sales: dailySales,
        orders: orderCount
      });
    }
    return last7Days;
  };

  // Generate monthly revenue data based on actual data
  const generateMonthlyData = () => {
    const monthlyRevenue: { [key: string]: number } = {};
    const currentDate = new Date();
    
    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyRevenue[monthKey] = 0;
    }
    
    // Add actual sales data
    salesData.forEach(sale => {
      const saleDate = new Date(sale.date);
      const monthKey = saleDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyRevenue.hasOwnProperty(monthKey)) {
        monthlyRevenue[monthKey] += sale.amount;
      }
    });
    
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue: Math.round(revenue)
    }));
  };

  const salesGrowthData = generateSalesGrowthData();
  const monthlyData = generateMonthlyData();

  // Calculate inactive customers (no orders in 14+ days)
  const getInactiveCustomers = () => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    return customers.filter(customer => {
      if (!customer.lastOrder) return true;
      const lastOrderDate = new Date(customer.lastOrder);
      return lastOrderDate < fourteenDaysAgo;
    });
  };

  const inactiveCustomers = getInactiveCustomers();

  // Calculate business insights
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = customers.reduce((sum, customer) => sum + customer.orderCount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate growth percentages based on actual data
  const calculateGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100);
  };

  // Get previous month data for growth calculation
  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;
  const revenueGrowth = calculateGrowthPercentage(currentMonthRevenue, previousMonthRevenue);

  // Customer distribution data for pie chart
  const customerDistribution = [
    { name: 'Active', value: customers.length - inactiveCustomers.length, color: '#22c55e' },
    { name: 'Inactive', value: inactiveCustomers.length, color: '#ef4444' }
  ];

  // Calculate customer engagement percentage
  const customerEngagement = customers.length > 0 ? 
    ((customers.length - inactiveCustomers.length) / customers.length * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">FlavorForge Analytics</h2>
          <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-orange">PKR {totalRevenue.toLocaleString()}</div>
            <p className={`text-xs mt-1 ${revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {revenueGrowth >= 0 ? '↗' : '↘'} {Math.abs(revenueGrowth).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-green">{totalOrders}</div>
            <p className="text-xs text-gray-400 mt-1">Total orders placed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">PKR {avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-gray-400 mt-1">Per order average</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-purple">{customers.length - inactiveCustomers.length}</div>
            <p className="text-xs text-gray-400 mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Growth Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Sales Growth Trend</CardTitle>
            <p className="text-sm text-gray-400">Daily sales performance over the last 7 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue</CardTitle>
            <p className="text-sm text-gray-400">Revenue progression over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Customer Distribution</CardTitle>
            <p className="text-sm text-gray-400">Active vs inactive customer breakdown</p>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No customer data available yet</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={customerDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {customerDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {customerDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Smart Notifications */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Smart Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inactiveCustomers.length > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-400">Inactive Customers</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {inactiveCustomers.length} customers haven't ordered in 14+ days
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => setShowInactivePopup(true)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Customers
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {revenueGrowth > 0 && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Growth Trending</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Sales are up {revenueGrowth.toFixed(1)}% this month. Great work!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Customer Engagement</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {customerEngagement.toFixed(1)}% of customers are active
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inactive Customers Popup */}
      <InactiveCustomersPopup
        isOpen={showInactivePopup}
        onClose={() => setShowInactivePopup(false)}
        customers={inactiveCustomers}
      />
    </div>
  );
};
