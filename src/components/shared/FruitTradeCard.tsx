import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeItem } from '@/types';
import { getFruitById } from '@/logic/tradeCalculator';
import { cn } from '@/lib/utils';

interface FruitTradeCardProps {
  item: TradeItem;
  onRemove: () => void;
  variant?: 'my' | 'their';
}

export const FruitTradeCard = ({ item, onRemove, variant = 'my' }: FruitTradeCardProps) => {
  const fruit = getFruitById(item.fruitId);
  
  if (!fruit) return null;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-accent border-accent';
      case 'A': return 'text-primary border-primary';
      case 'B': return 'text-success border-success';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  const bgColor = variant === 'my' 
    ? 'bg-success/10 border-success/30' 
    : 'bg-destructive/10 border-destructive/30';

  return (
    <Card className={cn('p-3 relative', bgColor)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex items-center justify-between pr-6">
        <div className="flex items-center gap-3 flex-1">
          {fruit.image && (
            <img 
              src={fruit.image} 
              alt={fruit.name}
              className="w-12 h-12 object-contain rounded bg-muted/50 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex items-center gap-2 flex-1">
            <Badge variant="outline" className={cn('border', getTierColor(fruit.tier))}>
              {fruit.tier}
            </Badge>
            <div>
              <p className="font-semibold text-sm">
                {item.isPerm ? `Perm ${fruit.name}` : fruit.name}
              </p>
              {item.isPerm && (
                <Badge variant="secondary" className="text-xs mt-1">
                  Permanent
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm">
            ${item.value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

