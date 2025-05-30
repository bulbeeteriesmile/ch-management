
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, DollarSign, ShoppingCart, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
  customers: number;
}

export const SalesTracking = () => {
  const [activeFilter, setActiveFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load sales data from localStorage
    const savedSalesData = localStorage.getItem('salesData');
    if (savedSalesData) {
      setSalesData(JSON.parse(savedSalesData));
    } else {
      setSalesData([]);
    }
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

  const exportToExcel = () => {
    if (salesData.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Add some sales data first to export.",
        variant: "destructive",
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(salesData.map(data => ({
      'Date/Period': data.date,
      'Orders': data.orders,
      'Revenue (PKR)': data.revenue,
      'Customers': data.customers,
      'Avg Order Value (PKR)': data.orders > 0 ? (data.revenue / data.orders).toFixed(2) : '0.00'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeFilter}_sales_data`);
    
    XLSX.writeFile(workbook, `sales_report_${activeFilter}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Sales data has been exported to Excel file.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Tracking</h2>
          <p className="text-gray-600">Monitor your sales performance</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="hover-glow"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? 'bg-brand-orange hover-glow' : 'hover-glow'}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.orders.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-orange/10 text-brand-orange border-brand-orange/30">
              {activeFilter} total
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {totalStats.revenue.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-green/10 text-brand-green border-brand-green/30">
              {activeFilter} total
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.customers.toLocaleString()}</div>
            <Badge className="mt-2 bg-brand-blue/10 text-brand-blue border-brand-blue/30">
              {activeFilter} active
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CalendarDays className="h-4 w-4 text-brand-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {averageOrderValue.toFixed(2)}</div>
            <Badge className="mt-2 bg-brand-purple/10 text-brand-purple border-brand-purple/30">
              per order
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="hover-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>{activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Sales Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesData.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sales data available. Start adding customers and orders to see your sales analytics.</p>
            </div>
          ) : (
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
                          PKR {data.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">{data.customers}</td>
                        <td className="py-3 px-4 text-brand-orange">
                          PKR {avgOrderValue.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {salesData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10 hover-glow">
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
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <Badge className="bg-brand-green/10 text-brand-green border-brand-green/30">
                    {totalStats.orders}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/30">
                    PKR {totalStats.revenue.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-glow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover-glow" onClick={exportToExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Sales Report
                </Button>
                <Button variant="outline" className="w-full justify-start hover-glow">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start hover-glow">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
