import { motion } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Counter } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';

interface CounterListProps {
  counters: Counter[];
}

export function CounterList({ counters }: CounterListProps) {
  const { t } = useLanguage();
  const getPriorityColor = (priority: Counter['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-accent/20 border-accent text-accent';
      case 'medium':
        return 'bg-primary/20 border-primary text-primary';
      default:
        return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  const getTypeIcon = (type: Counter['type']) => {
    switch (type) {
      case 'fruit':
        return '🍇';
      case 'weapon':
        return '⚔️';
      case 'style':
        return '👊';
      case 'stat':
        return '📊';
      default:
        return '💡';
    }
  };

  if (counters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        {t('counter.no_improvements')}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {counters.map((counter, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getTypeIcon(counter.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{counter.suggestion}</p>
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-bold uppercase rounded border',
                        getPriorityColor(counter.priority)
                      )}
                    >
                      {t(`priority.${counter.priority}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-success text-sm">
                    <ArrowUp className="w-4 h-4" />
                    <span>+{counter.expectedImprovement} {t('counter.points')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
