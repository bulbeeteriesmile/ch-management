
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Calendar, X } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

interface InactiveCustomersPopupProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

export const InactiveCustomersPopup = ({ isOpen, onClose, customers }: InactiveCustomersPopupProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getDaysSinceLastOrder = (lastOrderDate: string) => {
    const date = new Date(lastOrderDate);
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Inactive Customers</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-600">Customers who haven't ordered in 14+ days</p>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No inactive customers found.</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{customer.name}</h3>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {getDaysSinceLastOrder(customer.lastOrder)} days inactive
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{customer.address}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Last order: {formatDate(customer.lastOrder)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Total spent: </span>
                          <span className="text-brand-orange font-bold">PKR {customer.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Total orders: </span>
                          <span className="text-brand-green font-bold">{customer.orderCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
