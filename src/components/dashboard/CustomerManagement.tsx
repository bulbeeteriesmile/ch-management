import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, User, Phone, MapPin, ShoppingBag, Users } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing customers from localStorage
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Demo data
      const demoCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Smith',
          phone: '12345678901',
          address: '123 Main St, City, State',
          orderCount: 15,
          totalSpent: 450.50,
          lastOrder: '2024-01-20'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          phone: '09876543210',
          address: '456 Oak Ave, City, State',
          orderCount: 8,
          totalSpent: 320.00,
          lastOrder: '2024-01-18'
        }
      ];
      setCustomers(demoCustomers);
      localStorage.setItem('customers', JSON.stringify(demoCustomers));
    }
  }, []);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newCustomer.phone.length !== 11) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 11 digits.",
        variant: "destructive",
      });
      return;
    }

    // Check if phone number already exists
    const existingCustomer = customers.find(c => c.phone === newCustomer.phone);
    if (existingCustomer) {
      toast({
        title: "Customer Already Exists",
        description: `Customer ${existingCustomer.name} already exists with this phone number.`,
        variant: "destructive",
      });
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      ...newCustomer,
      orderCount: 0,
      totalSpent: 0,
      lastOrder: new Date().toISOString().split('T')[0]
    };

    const updatedCustomers = [...customers, customer];
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    toast({
      title: "Customer Added",
      description: `${customer.name} has been added successfully.`,
    });

    setNewCustomer({ name: '', phone: '', address: '' });
    setShowAddForm(false);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.phone.includes(searchTerm) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-brand-orange to-brand-green hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (11 digits)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="12345678901"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter full address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="bg-brand-green hover:bg-brand-green/90">
                  Add Customer
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by phone number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      <Badge variant="outline" className="bg-brand-green/10 text-brand-green">
                        {customer.orderCount} orders
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{customer.address}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-lg font-bold text-brand-orange">
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last order: {customer.lastOrder}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Database Stats</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-brand-orange">{customers.length}</div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-green">
                    {customers.reduce((sum, customer) => sum + customer.orderCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-blue">
                    ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </div>
            <ShoppingBag className="h-16 w-16 text-brand-orange/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
