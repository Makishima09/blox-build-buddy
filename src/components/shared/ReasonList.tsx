import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reason } from '@/types';

interface ReasonListProps {
  reasons: Reason[];
}

export function ReasonList({ reasons }: ReasonListProps) {
  const getIcon = (type: Reason['type']) => {
    switch (type) {
      case 'advantage':
        return <CheckCircle className="w-5 h-5 text-success shrink-0" />;
      case 'disadvantage':
        return <XCircle className="w-5 h-5 text-destructive shrink-0" />;
      default:
        return <MinusCircle className="w-5 h-5 text-muted-foreground shrink-0" />;
    }
  };

  const getBorderColor = (type: Reason['type']) => {
    switch (type) {
      case 'advantage':
        return 'border-l-success';
      case 'disadvantage':
        return 'border-l-destructive';
      default:
        return 'border-l-muted-foreground';
    }
  };

  return (
    <div className="space-y-3">
      {reasons.map((reason, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg bg-muted/30 border-l-4',
            getBorderColor(reason.type)
          )}
        >
          {getIcon(reason.type)}
          <div className="flex-1">
            <p className="text-sm">{reason.text}</p>
            <span className="text-xs text-muted-foreground">
              Impact: {reason.impact > 0 ? '+' : ''}{reason.impact}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
