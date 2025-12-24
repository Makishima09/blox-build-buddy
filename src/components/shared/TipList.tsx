import { motion } from 'framer-motion';
import { Target, Clock, Zap, Battery } from 'lucide-react';
import { Tip } from '@/types';

interface TipListProps {
  tips: Tip[];
}

export function TipList({ tips }: TipListProps) {
  const getCategoryIcon = (category: Tip['category']) => {
    switch (category) {
      case 'positioning':
        return <Target className="w-5 h-5 text-primary" />;
      case 'timing':
        return <Clock className="w-5 h-5 text-accent" />;
      case 'combo':
        return <Zap className="w-5 h-5 text-success" />;
      case 'resource':
        return <Battery className="w-5 h-5 text-warning" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: Tip['category']) => {
    switch (category) {
      case 'positioning':
        return 'Positioning';
      case 'timing':
        return 'Timing';
      case 'combo':
        return 'Combo';
      case 'resource':
        return 'Resource';
      default:
        return 'Tip';
    }
  };

  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/50 to-transparent"
        >
          <div className="p-2 rounded-lg bg-muted/50">
            {getCategoryIcon(tip.category)}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {getCategoryLabel(tip.category)}
            </p>
            <p className="text-sm">{tip.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
