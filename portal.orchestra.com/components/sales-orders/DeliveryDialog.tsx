import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SalesOrderItem, DeliverItemRequest } from '@/store/api/salesOrdersApi';

interface DeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SalesOrderItem[];
  onConfirm: (deliveredItems: DeliverItemRequest[], notes: string) => void;
  onCancel: () => void;
}

export function DeliveryDialog({ open, onOpenChange, items, onConfirm, onCancel }: DeliveryDialogProps) {
  const [quantityOverrides, setQuantityOverrides] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState('');

  // Derive delivered items from items and overrides
  const deliveredItems = items.map((item) => {
    const remainingQuantity = item.quantity - item.deliveredQuantity;
    const override = quantityOverrides[item.id];
    return {
      orderItemId: item.id,
      deliveredQuantity: override !== undefined ? override : remainingQuantity,
    };
  });

  const handleQuantityChange = (orderItemId: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const item = items.find((i) => i.id === orderItemId);
    const remainingQuantity = item ? item.quantity - item.deliveredQuantity : 0;

    setQuantityOverrides((prev) => ({
      ...prev,
      [orderItemId]: Math.min(numValue, remainingQuantity),
    }));
  };

  const handleConfirm = () => {
    const validItems = deliveredItems.filter((di) => di.deliveredQuantity > 0);
    if (validItems.length === 0) {
      return;
    }
    onConfirm(validItems, notes);
    onOpenChange(false);
    setNotes('');
    setQuantityOverrides({});
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
    setNotes('');
    setQuantityOverrides({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deliver Items</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {items.map((item) => {
            const remainingQuantity = item.quantity - item.deliveredQuantity;
            const deliveredItem = deliveredItems.find((di) => di.orderItemId === item.id);
            const currentQuantity = deliveredItem?.deliveredQuantity || remainingQuantity;

            return (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.itemName}</div>
                  <div className="text-sm text-muted-foreground">
                    Ordered: {item.quantity} | Delivered: {item.deliveredQuantity} | Remaining: {remainingQuantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                    Deliver:
                  </Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    max={remainingQuantity}
                    step="0.01"
                    value={currentQuantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-24"
                  />
                </div>
              </div>
            );
          })}
          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes</Label>
            <Input
              id="notes"
              placeholder="Enter delivery notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Delivery
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
