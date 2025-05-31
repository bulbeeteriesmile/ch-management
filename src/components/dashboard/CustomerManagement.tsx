
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, User, Phone, MapPin, ShoppingBag, Users, Trash } from "lucide-react";

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
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

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

  const handleDeleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    toast({
      title: "Customer Deleted",
      description: `${customerToDelete?.name} has been deleted successfully.`,
    });
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
          className="bg-gradient-to-r from-brand-orange to-brand-green hover:scale-105 transition-all duration-300 hover-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="animate-scale-in hover-glow">
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
                      className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange"
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
                      placeholder="03001234567"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                      className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange"
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
                    className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button type="submit" className="bg-brand-green hover:bg-brand-green/90 hover-glow">
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
      <Card className="hover-glow">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by phone number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card className="hover-glow bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">No Data Available</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchTerm ? 'No customers found matching your search.' : 'Add your first customer to get started!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-all duration-300 hover-glow bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                      <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/30">
                        {customer.orderCount} orders
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{customer.address}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1 flex items-start space-x-4">
                    <div>
                      <div className="text-lg font-bold text-brand-orange">
                        PKR {customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Last order: {formatDate(customer.lastOrder)}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            This action cannot be undone. This will permanently delete the customer "{customer.name}" and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {customers.length > 0 && (
        <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10 hover-glow">
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
                      PKR {customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </div>
              <ShoppingBag className="h-16 w-16 text-brand-orange/30" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
