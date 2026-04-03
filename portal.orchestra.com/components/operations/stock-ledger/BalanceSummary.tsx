import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface StockBalance {
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationId?: string;
  locationName?: string;
  uomId: string;
  uomName: string;
  quantity: number;
}

interface BalanceSummaryProps {
  balances: StockBalance[];
}

export function BalanceSummary({ balances }: BalanceSummaryProps) {
  // Calculate summary statistics
  const totalItems = new Set(balances.map(b => b.itemId)).size;
  const totalQuantity = balances.reduce((sum, b) => sum + b.quantity, 0);
  const lowStockItems = balances.filter(b => b.quantity < 10).length;
  const negativeStockItems = balances.filter(b => b.quantity < 0).length;

  const summaryCards = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Quantity",
      value: totalQuantity.toFixed(2),
      icon: TrendingUp,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Low Stock",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Negative Stock",
      value: negativeStockItems.toString(),
      icon: TrendingDown,
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Balance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Warehouse</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((balance, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{balance.itemName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {balance.itemId}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{balance.warehouseName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {balance.warehouseId}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      {balance.locationName ? (
                        <div>
                          <div className="font-medium">{balance.locationName}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {balance.locationId}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      <div className="font-mono">
                        {balance.quantity.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {balance.uomName}
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <StockStatusBadge quantity={balance.quantity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {balances.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No stock balances found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StockStatusBadge({ quantity }: { quantity: number }) {
  if (quantity < 0) {
    return <Badge variant="destructive">Negative</Badge>;
  }
  if (quantity < 10) {
    return <Badge variant="secondary">Low Stock</Badge>;
  }
  return <Badge variant="default">Normal</Badge>;
}
