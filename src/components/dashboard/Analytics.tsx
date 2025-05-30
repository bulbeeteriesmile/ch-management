
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  AlertTriangle, 
  Download,
  Calendar,
  PieChart,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

export const Analytics = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage
    const savedCustomers = localStorage.getItem('customers');
    const savedSalesData = localStorage.getItem('salesData');
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    }
  }, []);

  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 4);

  const chartColors = ['#e74c3c', '#27ae60', '#3498db', '#f39c12', '#9b59b6'];

  const revenueChartData = salesData.map(item => ({
    date: item.date,
    revenue: item.revenue,
    orders: item.orders
  }));

  const customerDistributionData = customers.map((customer, index) => ({
    name: customer.name,
    value: customer.totalSpent,
    color: chartColors[index % chartColors.length]
  })).slice(0, 5);

  const alerts = [];
  
  // Generate smart alerts based on actual data
  const inactiveCustomers = customers.filter(customer => {
    const lastOrderDate = new Date(customer.lastOrder);
    const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastOrder > 14 && customer.orderCount > 0;
  });

  if (inactiveCustomers.length > 0) {
    alerts.push({
      type: 'warning',
      message: `${inactiveCustomers.length} customers haven't ordered in 14+ days`,
      action: 'View customers'
    });
  }

  if (salesData.length > 1) {
    const recentRevenue = salesData[salesData.length - 1]?.revenue || 0;
    const previousRevenue = salesData[salesData.length - 2]?.revenue || 0;
    const change = ((recentRevenue - previousRevenue) / (previousRevenue || 1)) * 100;
    
    if (change > 10) {
      alerts.push({
        type: 'success',
        message: `Revenue increased by ${change.toFixed(1)}% recently`,
        action: 'View report'
      });
    } else if (change < -10) {
      alerts.push({
        type: 'warning',
        message: `Revenue decreased by ${Math.abs(change).toFixed(1)}% recently`,
        action: 'View details'
      });
    }
  }

  const exportAnalytics = () => {
    if (customers.length === 0 && salesData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Add some data first to export analytics.",
        variant: "destructive",
      });
      return;
    }

    const analyticsData = [
      { Metric: 'Total Customers', Value: customers.length },
      { Metric: 'Total Orders', Value: customers.reduce((sum, c) => sum + c.orderCount, 0) },
      { Metric: 'Total Revenue (PKR)', Value: customers.reduce((sum, c) => sum + c.totalSpent, 0) },
      { Metric: 'Average Order Value (PKR)', Value: customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.orderCount, 0) || 0).toFixed(2) : 0 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(analyticsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics_Report');
    
    if (customers.length > 0) {
      const customerSheet = XLSX.utils.json_to_sheet(customers.map(c => ({
        Name: c.name,
        Phone: c.phone,
        'Total Spent (PKR)': c.totalSpent,
        'Order Count': c.orderCount,
        'Last Order': c.lastOrder
      })));
      XLSX.utils.book_append_sheet(workbook, customerSheet, 'Top_Customers');
    }
    
    XLSX.writeFile(workbook, `analytics_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Analytics data has been exported to Excel file.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-gray-600">Deep insights into your business performance</p>
        </div>
        <Button 
          onClick={exportAnalytics}
          className="bg-gradient-to-r from-brand-orange to-brand-green hover-glow"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Smart Notifications */}
      {alerts.length > 0 && (
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-brand-orange" />
              <span>Smart Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {alert.type === 'info' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                    {alert.type === 'success' && <Star className="h-4 w-4 text-green-500" />}
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <Button variant="outline" size="sm" className="hover-glow">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {salesData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-brand-blue" />
                <span>Revenue Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`PKR ${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#e74c3c" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-brand-green" />
                <span>Orders Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#27ae60" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-brand-green" />
              <span>Top Customers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No customer data available yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-orange">PKR {customer.totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {customerDistributionData.length > 0 && (
          <Card className="hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-brand-purple" />
                <span>Customer Revenue Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={customerDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: PKR ${value}`}
                  >
                    {customerDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`PKR ${value}`, 'Revenue']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Business Insights */}
        <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10 hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-brand-green" />
              <span>Business Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Total Customers</h4>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-brand-green" />
                  <span className="text-2xl font-bold text-brand-green">{customers.length}</span>
                  <span className="text-sm text-gray-500">registered</span>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Total Revenue</h4>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-brand-blue" />
                  <span className="text-2xl font-bold text-brand-blue">
                    PKR {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Average Order Value</h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  <span className="text-lg font-bold text-brand-orange">
                    PKR {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / Math.max(customers.reduce((sum, c) => sum + c.orderCount, 0), 1)).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {customers.length > 0 && (
        <Card className="hover-glow">
          <CardHeader>
            <CardTitle>AI-Powered Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-brand-orange mb-2">Customer Retention</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {inactiveCustomers.length > 0 
                    ? `Reach out to ${inactiveCustomers.length} inactive customers with special offers.`
                    : 'Great! All your customers are active. Keep up the good work!'
                  }
                </p>
                <Button size="sm" variant="outline" className="hover-glow">
                  {inactiveCustomers.length > 0 ? 'Create Campaign' : 'View Details'}
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-brand-green mb-2">Revenue Growth</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {customers.length < 10 
                    ? 'Focus on acquiring new customers to grow your business.'
                    : 'Consider launching loyalty programs for your top customers.'
                  }
                </p>
                <Button size="sm" variant="outline" className="hover-glow">
                  View Strategy
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-brand-blue mb-2">Data Insights</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Export your data regularly to track trends and make informed decisions.
                </p>
                <Button size="sm" variant="outline" className="hover-glow" onClick={exportAnalytics}>
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
