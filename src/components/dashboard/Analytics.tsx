
import { useState } from 'react';
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
  PieChart
} from "lucide-react";

export const Analytics = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const topCustomers = [
    { name: 'John Smith', orders: 24, spent: 1240.50, phone: '12345678901' },
    { name: 'Sarah Johnson', orders: 18, spent: 980.75, phone: '09876543210' },
    { name: 'Mike Wilson', orders: 15, spent: 875.25, phone: '11122233344' },
    { name: 'Emma Davis', orders: 12, spent: 720.00, phone: '55566677788' },
  ];

  const peakTimes = [
    { time: '12:00 PM - 1:00 PM', orders: 45, percentage: 25 },
    { time: '6:00 PM - 7:00 PM', orders: 38, percentage: 21 },
    { time: '7:00 PM - 8:00 PM', orders: 32, percentage: 18 },
    { time: '1:00 PM - 2:00 PM', orders: 28, percentage: 16 },
  ];

  const popularItems = [
    { name: 'Chicken Burger', orders: 156, revenue: 2340.00 },
    { name: 'Margherita Pizza', orders: 142, revenue: 2130.00 },
    { name: 'Caesar Salad', orders: 98, revenue: 980.00 },
    { name: 'Fish & Chips', orders: 87, revenue: 1305.00 },
  ];

  const alerts = [
    { type: 'warning', message: 'Sarah Johnson hasn\'t ordered in 14 days', action: 'Send reminder' },
    { type: 'info', message: 'Lunch orders down 8% this week', action: 'View details' },
    { type: 'success', message: 'New customer retention up 15%', action: 'View report' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-gray-600">Deep insights into your business performance</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-orange to-brand-green">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Smart Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-brand-orange" />
            <span>Smart Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {alert.type === 'info' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                  {alert.type === 'success' && <Star className="h-4 w-4 text-green-500" />}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button variant="outline" size="sm">
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMetric('customers')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-brand-green" />
              <span>Top Customers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-orange">${customer.spent.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{customer.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMetric('times')}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-brand-blue" />
              <span>Peak Order Times</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakTimes.map((time, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{time.time}</span>
                    <Badge variant="outline">{time.orders} orders</Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-orange to-brand-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${time.percentage * 4}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items & Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-brand-orange" />
              <span>Most Popular Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-brand-orange">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-green">${item.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-brand-green" />
              <span>Business Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Average Order Value Trend</h4>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold text-brand-green">+12.5%</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Customer Retention Rate</h4>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-brand-blue" />
                  <span className="text-2xl font-bold text-brand-blue">87%</span>
                  <span className="text-sm text-gray-500">returning customers</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium mb-2">Peak Performance Day</h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  <span className="text-lg font-bold text-brand-orange">Saturday</span>
                  <span className="text-sm text-gray-500">highest revenue</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-brand-orange mb-2">Marketing Opportunity</h4>
              <p className="text-sm text-gray-600 mb-3">
                Launch a loyalty program for your top 10 customers who spend over $500/month.
              </p>
              <Button size="sm" variant="outline">
                Create Campaign
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-brand-green mb-2">Operational Insight</h4>
              <p className="text-sm text-gray-600 mb-3">
                Consider extending lunch hours. Your 2-3 PM slot shows growing demand.
              </p>
              <Button size="sm" variant="outline">
                Schedule Review
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-brand-blue mb-2">Menu Optimization</h4>
              <p className="text-sm text-gray-600 mb-3">
                Fish & Chips has the highest profit margin. Consider promoting it more.
              </p>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
