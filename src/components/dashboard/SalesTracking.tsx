
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, DollarSign, ShoppingCart, Filter } from "lucide-react";

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
  customers: number;
}

export const SalesTracking = () => {
  const [activeFilter, setActiveFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  useEffect(() => {
    // Generate sample data based on filter
    const generateSalesData = () => {
      const data: SalesData[] = [];
      const today = new Date();
      
      if (activeFilter === 'daily') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split('T')[0],
            orders: Math.floor(Math.random() * 50) + 20,
            revenue: Math.floor(Math.random() * 2000) + 500,
            customers: Math.floor(Math.random() * 30) + 15
          });
        }
      } else if (activeFilter === 'weekly') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 7));
          data.push({
            date: `Week of ${date.toISOString().split('T')[0]}`,
            orders: Math.floor(Math.random() * 300) + 150,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            customers: Math.floor(Math.random() * 150) + 80
          });
        }
      } else {
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            orders: Math.floor(Math.random() * 1200) + 600,
            revenue: Math.floor(Math.random() * 50000) + 25000,
            customers: Math.floor(Math.random() * 500) + 300
          });
        }
      }
      return data;
    };

    setSalesData(generateSalesData());
  }, [activeFilter]);

  const totalStats = salesData.reduce(
    (acc, curr) => ({
      orders: acc.orders + curr.orders,
      revenue: acc.revenue + curr.revenue,
      customers: acc.customers + curr.customers
    }),
    { orders: 0, revenue: 0, customers: 0 }
  );

  const averageOrderValue = totalStats.orders > 0 ? totalStats.revenue / totalStats.orders : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Tracking</h2>
          <p className="text-gray-600">Monitor your sales performance</p>
        </div>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? 'bg-brand-orange' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.orders.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-orange/10 text-brand-orange">
              {activeFilter} total
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalStats.revenue.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-green/10 text-brand-green">
              {activeFilter} total
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.customers.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-blue/10 text-brand-blue">
              {activeFilter} active
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <Badge className="mt-2 bg-purple-100 text-purple-600">
              per order
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Sales Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Date/Period</th>
                  <th className="text-left py-3 px-4 font-medium">Orders</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Customers</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Order Value</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((data, index) => {
                  const avgOrderValue = data.orders > 0 ? data.revenue / data.orders : 0;
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{data.date}</td>
                      <td className="py-3 px-4 font-medium">{data.orders}</td>
                      <td className="py-3 px-4 font-medium text-brand-green">
                        ${data.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{data.customers}</td>
                      <td className="py-3 px-4 text-brand-orange">
                        ${avgOrderValue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best performing day</span>
                <span className="font-medium">
                  {salesData.length > 0 && 
                    salesData.reduce((max, curr) => curr.revenue > max.revenue ? curr : max).date
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth trend</span>
                <Badge className="bg-brand-green/10 text-brand-green">
                  ↗ +12.5%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer retention</span>
                <Badge className="bg-brand-blue/10 text-brand-blue">
                  87%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Export Sales Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CalendarDays className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
