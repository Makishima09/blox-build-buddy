import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradeItem } from '@/types';
import { getFruitById } from '@/logic/tradeCalculator';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface FruitSlotProps {
  item: TradeItem | null;
  onAdd: () => void;
  onRemove: () => void;
  variant?: 'my' | 'their';
  index: number;
}

export const FruitSlot = ({ item, onAdd, onRemove, variant = 'my', index }: FruitSlotProps) => {
  const { t } = useLanguage();
  const fruit = item ? getFruitById(item.fruitId) : null;

  const bgColor = variant === 'my' 
    ? 'bg-success/10 border-success/30 hover:border-success/50' 
    : 'bg-destructive/10 border-destructive/30 hover:border-destructive/50';

  const emptyBgColor = variant === 'my'
    ? 'bg-success/5 border-dashed border-success/30 hover:bg-success/10'
    : 'bg-destructive/5 border-dashed border-destructive/30 hover:bg-destructive/10';

  if (!item || !fruit) {
    return (
      <Card 
        className={cn('h-32 flex items-center justify-center cursor-pointer transition-all', emptyBgColor)}
        onClick={onAdd}
      >
        <div className="text-center">
          <Plus className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{t('trader.add')}</p>
        </div>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-accent border-accent';
      case 'A': return 'text-primary border-primary';
      case 'B': return 'text-success border-success';
      default: return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <Card className={cn('h-32 p-2 relative transition-all', bgColor)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-5 w-5 text-muted-foreground hover:text-destructive z-10"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <div className="w-10 h-10 rounded bg-muted/50 p-1 flex items-center justify-center">
          {fruit.image ? (
            <img 
              src={fruit.image} 
              alt={fruit.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<span class="text-lg">🍇</span>';
                }
              }}
            />
          ) : (
            <span className="text-lg">🍇</span>
          )}
        </div>
        <div className="text-center">
          <Badge variant="outline" className={cn('border text-[10px] px-1 py-0 mb-0.5', getTierColor(fruit.tier))}>
            {fruit.tier}
          </Badge>
          <p className="font-semibold text-xs leading-tight">
            {item.isPerm ? `Perm ${fruit.name}` : fruit.name}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground mt-0.5">
            ${item.value.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

