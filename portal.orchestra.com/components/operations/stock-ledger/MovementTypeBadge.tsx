import { Badge } from "@/components/ui/badge";
import { StockMovementType } from "@/types";

interface MovementTypeBadgeProps {
  type: StockMovementType;
}

export function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  const getBadgeVariant = (type: StockMovementType) => {
    switch (type) {
      case StockMovementType.RECEIPT:
        return "default";
      case StockMovementType.TRANSFER:
        return "secondary";
      case StockMovementType.ADJUSTMENT:
        return "outline";
      case StockMovementType.PICK:
        return "destructive";
      case StockMovementType.PACK:
        return "default";
      case StockMovementType.SHIP:
        return "destructive";
      case StockMovementType.RETURN:
        return "secondary";
      case StockMovementType.DAMAGE:
        return "destructive";
      case StockMovementType.EXPIRE:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getDisplayText = (type: StockMovementType) => {
    switch (type) {
      case StockMovementType.RECEIPT:
        return "Receipt";
      case StockMovementType.TRANSFER:
        return "Transfer";
      case StockMovementType.ADJUSTMENT:
        return "Adjustment";
      case StockMovementType.PICK:
        return "Pick";
      case StockMovementType.PACK:
        return "Pack";
      case StockMovementType.SHIP:
        return "Ship";
      case StockMovementType.RETURN:
        return "Return";
      case StockMovementType.DAMAGE:
        return "Damage";
      case StockMovementType.EXPIRE:
        return "Expire";
      default:
        return type;
    }
  };

  return (
    <Badge variant={getBadgeVariant(type)}>
      {getDisplayText(type)}
    </Badge>
  );
}
