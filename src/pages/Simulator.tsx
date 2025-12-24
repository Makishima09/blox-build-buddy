import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, RotateCcw, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FruitSelect } from '@/components/shared/FruitSelect';
import { WeaponSelect } from '@/components/shared/WeaponSelect';
import { ScoreGauge } from '@/components/shared/ScoreGauge';
import { ReasonList } from '@/components/shared/ReasonList';
import { CounterList } from '@/components/shared/CounterList';
import { TipList } from '@/components/shared/TipList';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { calculateMatchup } from '@/logic/matchupScorer';
import { Build, MatchupResult } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export default function Simulator() {
  const { t } = useLanguage();
  const [myBuild, setMyBuild] = useState<Build>({
    level: 1500,
    fruit: '',
    weapon: '',
    gun: '',
    fightingStyle: '',
    statFocus: 'balanced',
  });

  const [rivalBuild, setRivalBuild] = useState<Build>({
    level: 1500,
    fruit: '',
    weapon: '',
    gun: '',
    fightingStyle: '',
    statFocus: 'balanced',
  });

  const [result, setResult] = useState<MatchupResult | null>(null);

  const canSimulate = myBuild.fruit && myBuild.weapon && rivalBuild.fruit;

  const handleSimulate = () => {
    if (!canSimulate) return;
    const matchupResult = calculateMatchup(myBuild, rivalBuild, t);
    setResult(matchupResult);
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      toast({ title: '¡Link copiado!', description: 'Compártelo con tus amigos' });
    } catch {
      toast({ title: 'Comparte esta URL', description: result.shareUrl });
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const statOptions = [
    { value: 'balanced', label: t('balanced') },
    { value: 'melee', label: t('melee') },
    { value: 'fruit', label: t('fruit') },
    { value: 'defense', label: t('defense') },
  ];

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
                <Swords className="w-8 h-8 text-primary" />
                {t('simulator.title')}
              </h1>
              <p className="text-muted-foreground">{t('simulator.subtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* My Build */}
              <Card>
                <CardHeader><CardTitle className="text-primary">{t('simulator.your_build')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('simulator.level')}</Label>
                    <div className="flex gap-2 items-center mt-2">
                      <Slider value={[myBuild.level]} onValueChange={([v]) => setMyBuild({ ...myBuild, level: v })} min={1} max={2800} step={50} className="flex-1" />
                      <Input
                        type="number"
                        value={myBuild.level}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const clamped = Math.min(2800, Math.max(1, val));
                          setMyBuild({ ...myBuild, level: clamped });
                        }}
                        min={1}
                        max={2800}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div><Label>{t('simulator.fruit')} *</Label><FruitSelect value={myBuild.fruit} onValueChange={(v) => setMyBuild({ ...myBuild, fruit: v })} /></div>
                  <div><Label>{t('simulator.weapon')} *</Label><WeaponSelect value={myBuild.weapon} onValueChange={(v) => setMyBuild({ ...myBuild, weapon: v })} category="Sword" placeholder={t('select.weapon')} /></div>
                  <div><Label>{t('simulator.gun')}</Label><WeaponSelect value={myBuild.gun || ''} onValueChange={(v) => setMyBuild({ ...myBuild, gun: v })} category="Gun" placeholder={t('select.gun')} /></div>
                  <div><Label>{t('simulator.style')}</Label><WeaponSelect value={myBuild.fightingStyle} onValueChange={(v) => setMyBuild({ ...myBuild, fightingStyle: v })} category="Fighting Style" placeholder={t('select.style')} /></div>
                  <div>
                    <Label>{t('simulator.stats')}</Label>
                    <RadioGroup value={myBuild.statFocus} onValueChange={(v: any) => setMyBuild({ ...myBuild, statFocus: v })} className="flex flex-wrap gap-4 mt-2">
                      {statOptions.map((s) => (
                        <div key={s.value} className="flex items-center gap-2">
                          <RadioGroupItem value={s.value} id={`my-${s.value}`} />
                          <Label htmlFor={`my-${s.value}`}>{s.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Rival Build */}
              <Card>
                <CardHeader><CardTitle className="text-destructive">{t('simulator.rival_build')}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t('simulator.level')}</Label>
                    <div className="flex gap-2 items-center mt-2">
                      <Slider value={[rivalBuild.level]} onValueChange={([v]) => setRivalBuild({ ...rivalBuild, level: v })} min={1} max={2800} step={50} className="flex-1" />
                      <Input
                        type="number"
                        value={rivalBuild.level}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const clamped = Math.min(2800, Math.max(1, val));
                          setRivalBuild({ ...rivalBuild, level: clamped });
                        }}
                        min={1}
                        max={2800}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <div><Label>{t('simulator.fruit')} *</Label><FruitSelect value={rivalBuild.fruit} onValueChange={(v) => setRivalBuild({ ...rivalBuild, fruit: v })} /></div>
                  <div><Label>{t('simulator.weapon')}</Label><WeaponSelect value={rivalBuild.weapon} onValueChange={(v) => setRivalBuild({ ...rivalBuild, weapon: v })} category="Sword" placeholder={t('select.weapon')} /></div>
                  <div><Label>{t('simulator.gun')}</Label><WeaponSelect value={rivalBuild.gun || ''} onValueChange={(v) => setRivalBuild({ ...rivalBuild, gun: v })} category="Gun" placeholder={t('select.gun')} /></div>
                  <div><Label>{t('simulator.style')}</Label><WeaponSelect value={rivalBuild.fightingStyle} onValueChange={(v) => setRivalBuild({ ...rivalBuild, fightingStyle: v })} category="Fighting Style" placeholder={t('select.style')} /></div>
                </CardContent>
              </Card>

              {/* Simulate Button */}
              <div className="lg:col-span-2">
                <Button onClick={handleSimulate} disabled={!canSimulate} variant="hero" size="xl" className="w-full">
                  <Swords className="w-5 h-5" /> {t('simulator.simulate')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score */}
              <Card glow className="text-center py-8">
                <ScoreGauge score={result.score} size="lg" />
                <p className="text-muted-foreground mt-4">{t('simulator.confidence')}: {t(`confidence.${result.confidence}`)}</p>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>{t('simulator.why_score')}</CardTitle></CardHeader><CardContent><ReasonList reasons={result.reasons} /></CardContent></Card>
                <Card><CardHeader><CardTitle>{t('simulator.how_improve')}</CardTitle></CardHeader><CardContent><CounterList counters={result.counters} /></CardContent></Card>
              </div>

              {result.tips.length > 0 && (
                <Card><CardHeader><CardTitle>{t('simulator.tips')}</CardTitle></CardHeader><CardContent><TipList tips={result.tips} /></CardContent></Card>
              )}

              <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline" className="flex-1"><RotateCcw className="w-4 h-4" /> {t('simulator.new')}</Button>
                <Button onClick={handleShare} variant="default" className="flex-1"><Share2 className="w-4 h-4" /> {t('simulator.share')}</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
