import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ScoreGauge({ score, size = 'md', showLabel = true, animated = true }: ScoreGaugeProps) {
  const { t } = useLanguage();
  
  const getVerdict = () => {
    if (score >= 60) return { label: t('favorable'), color: 'text-success', bgColor: 'bg-success', glowClass: 'glow-success' };
    if (score >= 40) return { label: t('neutral'), color: 'text-warning', bgColor: 'bg-warning', glowClass: 'glow-accent' };
    return { label: t('unfavorable'), color: 'text-destructive', bgColor: 'bg-destructive', glowClass: 'glow-destructive' };
  };

  const verdict = getVerdict();

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  const textSizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn('relative', sizeClasses[size])}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animated ? offset : offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={verdict.color}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className={cn('font-display font-bold', textSizeClasses[size], verdict.color)}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">/100</span>
        </div>
      </div>
      
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={cn(
            'px-4 py-1.5 rounded-full font-display font-bold text-sm uppercase tracking-widest',
            verdict.bgColor,
            'text-background'
          )}
        >
          {verdict.label}
        </motion.div>
      )}
    </div>
  );
}
