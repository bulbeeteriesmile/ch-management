
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
      const toastId = toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 11 digits.",
        variant: "destructive",
      });
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
      return;
    }

    // Check if phone number already exists
    const existingCustomer = customers.find(c => c.phone === newCustomer.phone);
    if (existingCustomer) {
      const toastId = toast({
        title: "Customer Already Exists",
        description: `Customer ${existingCustomer.name} already exists with this phone number.`,
        variant: "destructive",
      });
      
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
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

    const toastId = toast({
      title: "Customer Added",
      description: `${customer.name} has been added successfully.`,
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      if (toastId && toastId.dismiss) {
        toastId.dismiss();
      }
    }, 3000);

    setNewCustomer({ name: '', phone: '', address: '' });
    setShowAddForm(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find(c => c.id === customerId);
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));

    const toastId = toast({
      title: "Customer Deleted",
      description: `${customerToDelete?.name} has been deleted successfully.`,
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      if (toastId && toastId.dismiss) {
        toastId.dismiss();
      }
    }, 3000);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.phone.includes(searchTerm) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Customer Management</h2>
          <p className="text-sm sm:text-base text-gray-400">Manage your FlavorForge customer database</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-brand-orange to-brand-green hover:scale-105 transition-all duration-300 hover-glow w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="animate-scale-in bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl">Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300 text-sm sm:text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 text-sm sm:text-base">Phone Number (11 digits)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="03001234567"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                      className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300 text-sm sm:text-base">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter full address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    className="pl-10 transition-all hover:border-brand-orange focus:border-brand-orange bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="bg-brand-green hover:bg-brand-green/90 w-full sm:w-auto">
                  Add Customer
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by phone number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all focus:border-brand-orange bg-gray-700 border-gray-600 text-white text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-3 sm:gap-4">
        {filteredCustomers.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 sm:p-8 text-center">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-base sm:text-lg font-medium">No Data Available</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                {searchTerm ? 'No customers found matching your search.' : 'Add your first customer to get started!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => (
            <Card key={customer.id} className="transition-all duration-300 bg-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{customer.name}</h3>
                      <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/30 w-fit text-xs sm:text-sm">
                        {customer.orderCount} orders
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-all">{customer.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                      <span className="break-words">{customer.address}</span>
                    </div>
                  </div>
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:gap-1 lg:text-right">
                    <div className="flex-1 lg:flex-none">
                      <div className="text-base sm:text-lg font-bold text-brand-orange">
                        PKR {customer.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        Last order: {formatDate(customer.lastOrder)}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 sm:p-2">
                          <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700 mx-2 sm:mx-0 max-w-md sm:max-w-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white text-base sm:text-lg">Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300 text-sm sm:text-base">
                            This action cannot be undone. This will permanently delete the customer "{customer.name}" and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
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
        <Card className="bg-gradient-to-r from-brand-orange/10 to-brand-green/10 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Customer Database Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-brand-orange">{customers.length}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Customers</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-brand-green">
                      {customers.reduce((sum, customer) => sum + customer.orderCount, 0)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Orders</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-brand-blue">
                      PKR {customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Total Revenue</div>
                  </div>
                </div>
              </div>
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-brand-orange/30 mx-auto lg:mx-0" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
