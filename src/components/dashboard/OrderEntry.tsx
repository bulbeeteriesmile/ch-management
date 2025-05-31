
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

interface OrderEntryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderEntry = ({ isOpen, onClose }: OrderEntryProps) => {
  const [orderAmount, setOrderAmount] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(orderAmount);
    if (isNaN(amount) || amount <= 0) {
      const toastId = toast({
        title: "Invalid Amount",
        description: "Please enter a valid order amount.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
      return;
    }

    if (customerPhone.length !== 11) {
      const toastId = toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 11 digits.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
      return;
    }

    // Get existing customers
    const savedCustomers = localStorage.getItem('customers');
    let customers = savedCustomers ? JSON.parse(savedCustomers) : [];
    
    // Find customer or create new one
    let customerIndex = customers.findIndex((c: any) => c.phone === customerPhone);
    
    if (customerIndex === -1) {
      const toastId = toast({
        title: "Customer Not Found",
        description: "Please add the customer first before entering an order.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        if (toastId && toastId.dismiss) {
          toastId.dismiss();
        }
      }, 3000);
      return;
    }

    // Update customer data
    customers[customerIndex].orderCount += 1;
    customers[customerIndex].totalSpent += amount;
    customers[customerIndex].lastOrder = new Date().toISOString().split('T')[0];
    
    // Save updated customers
    localStorage.setItem('customers', JSON.stringify(customers));

    // Save sales data for analytics
    const salesData = JSON.parse(localStorage.getItem('salesData') || '[]');
    salesData.push({
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      customerPhone: customerPhone
    });
    localStorage.setItem('salesData', JSON.stringify(salesData));

    const toastId = toast({
      title: "Order Added",
      description: `Order of PKR ${amount.toLocaleString()} has been recorded successfully.`,
    });

    setTimeout(() => {
      if (toastId && toastId.dismiss) {
        toastId.dismiss();
      }
    }, 3000);

    setOrderAmount('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Enter New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-gray-300">Customer Phone Number</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="03001234567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderAmount" className="text-gray-300">Order Amount (PKR)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="orderAmount"
                type="number"
                placeholder="0"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-brand-green hover:bg-brand-green/90">
              Add Order
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
