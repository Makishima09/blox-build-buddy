import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wrench, Swords, TreePine, Crown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FruitSelect } from '@/components/shared/FruitSelect';
import { WeaponSelect } from '@/components/shared/WeaponSelect';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { optimizeBuild } from '@/logic/buildOptimizer';
import { OptimizerInput, OptimizerResult } from '@/types';
import { getFruitById, getWeaponById } from '@/logic/matchupScorer';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

export default function Optimizer() {
  const { t } = useLanguage();
  const [objective, setObjective] = useState<'pvp' | 'farm' | 'boss' | null>(null);
  const [currentBuild, setCurrentBuild] = useState({ fruit: '', weapon: '', fightingStyle: '' });
  const [constraints, setConstraints] = useState({ keepFruit: false, keepWeapon: false });
  const [result, setResult] = useState<OptimizerResult | null>(null);

  const handleOptimize = () => {
    if (!objective) return;
    const input: OptimizerInput = { currentLevel: 1500, currentBuild, objective, constraints };
    setResult(optimizeBuild(input, t));
  };

  const objectives = [
    { id: 'pvp', label: t('optimizer.pvp'), icon: Swords, color: 'text-primary', desc: t('optimizer.pvp_desc') },
    { id: 'farm', label: t('optimizer.farm'), icon: TreePine, color: 'text-success', desc: t('optimizer.farm_desc') },
    { id: 'boss', label: t('optimizer.boss'), icon: Crown, color: 'text-accent', desc: t('optimizer.boss_desc') },
  ] as const;

  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild><Link to="/"><ArrowLeft className="w-5 h-5" /></Link></Button>
            <div>
              <h1 className="font-display text-3xl font-bold flex items-center gap-2"><Wrench className="w-8 h-8 text-accent" />{t('optimizer.title')}</h1>
              <p className="text-muted-foreground">{t('optimizer.subtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Objective Selection */}
              <Card>
                <CardHeader><CardTitle>{t('optimizer.goal')}</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                  {objectives.map((obj) => (
                    <button key={obj.id} onClick={() => setObjective(obj.id)} className={cn('p-4 rounded-xl border-2 transition-all text-left', objective === obj.id ? 'border-primary bg-primary/10 glow-primary' : 'border-border hover:border-primary/50')}>
                      <obj.icon className={cn('w-8 h-8 mb-2', obj.color)} />
                      <p className="font-display font-bold">{obj.label}</p>
                      <p className="text-sm text-muted-foreground">{obj.desc}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Current Build */}
              <Card>
                <CardHeader><CardTitle>{t('optimizer.current')}</CardTitle><CardDescription>{t('optimizer.current_desc')}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div><Label>{t('optimizer.current_fruit')}</Label><FruitSelect value={currentBuild.fruit} onValueChange={(v) => setCurrentBuild({ ...currentBuild, fruit: v })} placeholder={t('none_selected')} /></div>
                  <div><Label>{t('optimizer.current_weapon')}</Label><WeaponSelect value={currentBuild.weapon} onValueChange={(v) => setCurrentBuild({ ...currentBuild, weapon: v })} placeholder={t('none_selected')} /></div>
                  <div className="flex gap-6 pt-2">
                    <div className="flex items-center gap-2"><Switch checked={constraints.keepFruit} onCheckedChange={(v) => setConstraints({ ...constraints, keepFruit: v })} /><Label>{t('optimizer.keep_fruit')}</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={constraints.keepWeapon} onCheckedChange={(v) => setConstraints({ ...constraints, keepWeapon: v })} /><Label>{t('optimizer.keep_weapon')}</Label></div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleOptimize} disabled={!objective} variant="accent" size="xl" className="w-full"><Wrench className="w-5 h-5" />{t('optimizer.optimize')}</Button>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Recommended Build */}
              <Card glow>
                <CardHeader><CardTitle className="text-accent">{t('optimizer.recommended')}</CardTitle><CardDescription>{t('optimizer.tier')} {result.targetBuild.tier} - {result.targetBuild.tags.join(', ')}</CardDescription></CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/30"><p className="text-2xl mb-1">🍇</p><p className="font-display font-bold">{getFruitById(result.targetBuild.fruit)?.name || result.targetBuild.fruit}</p><p className="text-xs text-muted-foreground">{t('fruit')}</p></div>
                  <div className="p-4 rounded-lg bg-muted/30"><p className="text-2xl mb-1">⚔️</p><p className="font-display font-bold">{getWeaponById(result.targetBuild.weapon)?.name || result.targetBuild.weapon}</p><p className="text-xs text-muted-foreground">{t('simulator.weapon')}</p></div>
                  <div className="p-4 rounded-lg bg-muted/30"><p className="text-2xl mb-1">👊</p><p className="font-display font-bold">{getWeaponById(result.targetBuild.style)?.name || result.targetBuild.style}</p><p className="text-xs text-muted-foreground">{t('simulator.style')}</p></div>
                </CardContent>
              </Card>

              {/* Expected Improvement */}
              <Card><CardContent className="py-6 text-center"><p className="text-muted-foreground">{result.expectedImprovement.metric}</p><p className="font-display text-3xl font-bold text-success">{result.expectedImprovement.change}</p></CardContent></Card>

              {/* Upgrade Path */}
              <Card>
                <CardHeader><CardTitle>{t('optimizer.upgrade_path')}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {result.upgradePath.map((step) => (
                    <div key={step.step} className={cn('p-4 rounded-lg border-l-4', step.priority === 'critical' ? 'border-l-destructive bg-destructive/10' : step.priority === 'high' ? 'border-l-accent bg-accent/10' : 'border-l-muted-foreground bg-muted/30')}>
                      <div className="flex justify-between items-start"><p className="font-medium">{step.action}</p><span className="text-xs uppercase px-2 py-0.5 rounded bg-muted">{t(`priority.${step.priority}`)}</span></div>
                      <p className="text-sm text-muted-foreground mt-1">{step.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">⏱️ {step.estimatedTime}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => setResult(null)} variant="outline" className="flex-1"><RotateCcw className="w-4 h-4" />{t('optimizer.new')}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
