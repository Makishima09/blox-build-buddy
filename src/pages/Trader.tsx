import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, TrendingUp, Share2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FruitSelect } from '@/components/shared/FruitSelect';
import { FruitSlot } from '@/components/shared/FruitSlot';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { calculateTradeFairness, getFruitMarketValue } from '@/logic/tradeCalculator';
import { Trade, TradeAnalysis, TradeItem } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const MAX_FRUITS = 4;

export default function Trader() {
  const { t } = useLanguage();
  const [trade, setTrade] = useState<Trade>({
    myFruits: Array(MAX_FRUITS).fill(null) as (TradeItem | null)[],
    theirFruits: Array(MAX_FRUITS).fill(null) as (TradeItem | null)[],
  });

  const [selectedSlot, setSelectedSlot] = useState<{ side: 'my' | 'their'; index: number } | null>(null);
  const [selectedFruitId, setSelectedFruitId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calcular valores totales
  const myTotalValue = trade.myFruits
    .filter((item): item is TradeItem => item !== null)
    .reduce((sum, item) => sum + item.value, 0);
  
  const theirTotalValue = trade.theirFruits
    .filter((item): item is TradeItem => item !== null)
    .reduce((sum, item) => sum + item.value, 0);
  
  const profit = theirTotalValue - myTotalValue;
  const profitPercentage = myTotalValue > 0 ? ((profit / myTotalValue) * 100) : 0;

  const myFruitsArray = trade.myFruits.filter((item): item is TradeItem => item !== null);
  const theirFruitsArray = trade.theirFruits.filter((item): item is TradeItem => item !== null);
  const canCalculate = myFruitsArray.length > 0 && theirFruitsArray.length > 0;

  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);

  const handleSlotClick = (side: 'my' | 'their', index: number) => {
    setSelectedSlot({ side, index });
    setSelectedFruitId('');
    setDialogOpen(true);
  };

  const handleAddFruit = () => {
    if (!selectedSlot || !selectedFruitId) {
      toast({ title: t('trader.error'), description: t('trader.error_select_fruit') });
      return;
    }

    const marketValue = getFruitMarketValue(selectedFruitId);
    if (marketValue <= 0) {
      toast({ title: t('trader.error'), description: t('trader.error_no_value') });
      return;
    }

    setTrade(prev => {
      const newFruits = [...prev[selectedSlot.side === 'my' ? 'myFruits' : 'theirFruits']];
      newFruits[selectedSlot.index] = {
        fruitId: selectedFruitId,
        value: marketValue,
        isPerm: false,
      };
      return {
        ...prev,
        [selectedSlot.side === 'my' ? 'myFruits' : 'theirFruits']: newFruits,
      };
    });

    setDialogOpen(false);
    setSelectedSlot(null);
    setSelectedFruitId('');
  };

  const handleRemoveFruit = (side: 'my' | 'their', index: number) => {
    setTrade(prev => {
      const newFruits = [...prev[side === 'my' ? 'myFruits' : 'theirFruits']];
      newFruits[index] = null;
      return {
        ...prev,
        [side === 'my' ? 'myFruits' : 'theirFruits']: newFruits,
      };
    });
  };

  const handleCalculate = () => {
    if (!canCalculate) return;
    const tradeForCalculation: Trade = {
      myFruits: myFruitsArray,
      theirFruits: theirFruitsArray,
    };
    const result = calculateTradeFairness(tradeForCalculation, t);
    setAnalysis(result);
  };

  const handleReset = () => {
    setAnalysis(null);
    setTrade({
      myFruits: Array(MAX_FRUITS).fill(null) as (TradeItem | null)[],
      theirFruits: Array(MAX_FRUITS).fill(null) as (TradeItem | null)[],
    });
  };

  const handleShare = async () => {
    const shareText = `Trade: ${myFruitsArray.length} frutas (${myTotalValue.toLocaleString()} oro) por ${theirFruitsArray.length} frutas (${theirTotalValue.toLocaleString()} oro)`;
    try {
      await navigator.clipboard.writeText(shareText);
      toast({ title: t('trader.share_success'), description: t('trader.share_copied') });
    } catch {
      toast({ title: t('trader.share_title'), description: shareText });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
              <h1 className="font-display text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                {t('trader.title')}
              </h1>
              <p className="text-muted-foreground">{t('trader.subtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* You Section */}
              <Card className="border-success/30 bg-success/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-success">{t('trader.you')}</CardTitle>
                      {myFruitsArray.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('trader.value')}: <span className="font-bold text-success">${myTotalValue.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                    {myFruitsArray.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setTrade(prev => ({ ...prev, myFruits: Array(MAX_FRUITS).fill(null) }))}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {t('trader.reset')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {trade.myFruits.map((item, index) => (
                      <FruitSlot
                        key={index}
                        item={item}
                        onAdd={() => handleSlotClick('my', index)}
                        onRemove={() => handleRemoveFruit('my', index)}
                        variant="my"
                        index={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Profit Display */}
              {myFruitsArray.length > 0 && theirFruitsArray.length > 0 && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">{t('trader.profit')}</p>
                      <div className={cn(
                        'text-3xl font-bold',
                        profit > 0 ? 'text-success' : profit < 0 ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        ${Math.abs(profit).toLocaleString()} 
                        {profit !== 0 && (
                          <span className="text-lg ml-2">
                            ({profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(1)}%)
                            {profit > 0 ? ' ↑' : ' ↓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Them Section */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-destructive">{t('trader.them')}</CardTitle>
                      {theirFruitsArray.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('trader.value')}: <span className="font-bold text-destructive">${theirTotalValue.toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                    {theirFruitsArray.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setTrade(prev => ({ ...prev, theirFruits: Array(MAX_FRUITS).fill(null) }))}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {t('trader.reset')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {trade.theirFruits.map((item, index) => (
                      <FruitSlot
                        key={index}
                        item={item}
                        onAdd={() => handleSlotClick('their', index)}
                        onRemove={() => handleRemoveFruit('their', index)}
                        variant="their"
                        index={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleCalculate}
                  disabled={!canCalculate}
                  size="lg"
                  className="min-w-[200px] bg-success hover:bg-success/90"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {t('trader.create_trade')}
                </Button>
                {canCalculate && (
                  <Button
                    onClick={handleShare}
                    size="lg"
                    variant="destructive"
                    className="min-w-[200px]"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    {t('trader.share_trade')}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Resultado Principal */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('trader.analysis_result')}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Fairness Score */}
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2" style={{
                        color: analysis.fairnessScore >= 75 ? 'var(--success)' : 
                               analysis.fairnessScore >= 60 ? 'var(--warning)' : 
                               'var(--destructive)'
                      }}>
                        {analysis.fairnessScore}/100
                      </div>
                      <p className="text-sm text-muted-foreground">{t('trader.fairness_score')}</p>
                    </div>

                    {/* Veredicto */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {analysis.verdict === 'very_fair' || analysis.verdict === 'fair' ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        )}
                        <Badge variant="outline" className={cn('border-2', 
                          analysis.verdict === 'very_fair' || analysis.verdict === 'fair' ? 'text-success border-success' :
                          analysis.verdict === 'slightly_unfair' ? 'text-warning border-warning' :
                          'text-destructive border-destructive'
                        )}>
                          {t(`trader.verdict.${analysis.verdict}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{t('trader.verdict_label')}</p>
                    </div>

                    {/* Diferencia */}
                    <div className="text-center">
                      <div className={cn(
                        'text-2xl font-bold mb-2',
                        analysis.difference > 0 ? 'text-success' : 
                        analysis.difference < 0 ? 'text-destructive' : 
                        'text-muted-foreground'
                      )}>
                        {analysis.difference > 0 ? '+' : ''}
                        ${analysis.difference.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('trader.difference')} ({analysis.differencePercentage}%)
                      </p>
                    </div>
                  </div>

                  {/* Profit destacado */}
                  <Card className={cn(
                    'mb-6',
                    profit > 0 ? 'bg-success/10 border-success/30' :
                    profit < 0 ? 'bg-destructive/10 border-destructive/30' :
                    'bg-muted/10 border-muted/30'
                  )}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">{t('trader.profit')}</p>
                        <div className={cn(
                          'text-3xl font-bold',
                          profit > 0 ? 'text-success' : profit < 0 ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                          ${Math.abs(profit).toLocaleString()} 
                          {profit !== 0 && (
                            <span className="text-lg ml-2">
                              ({profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(1)}%)
                              {profit > 0 ? ' ↑' : ' ↓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recomendaciones */}
                  {analysis.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold mb-2">{t('trader.recommendations')}</h3>
                      {analysis.recommendations.map((rec, idx) => (
                        <Alert key={idx} variant={
                          rec.type === 'warning' ? 'destructive' : 'default'
                        }>
                          {rec.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                          {rec.type === 'suggestion' && <Info className="h-4 w-4" />}
                          {rec.type === 'info' && <CheckCircle2 className="h-4 w-4" />}
                          <AlertTitle>{t(`trader.recommendation_type.${rec.type}`)}</AlertTitle>
                          <AlertDescription>{rec.text}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialog para seleccionar fruta */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('trader.select_fruit')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FruitSelect
                value={selectedFruitId}
                onValueChange={setSelectedFruitId}
                placeholder={t('trader.select_fruit')}
              />
              {selectedFruitId && (
                <p className="text-sm text-muted-foreground">
                  {t('trader.market_value')}: ${getFruitMarketValue(selectedFruitId).toLocaleString()}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('trader.cancel')}
                </Button>
                <Button onClick={handleAddFruit} disabled={!selectedFruitId}>
                  {t('trader.add')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
