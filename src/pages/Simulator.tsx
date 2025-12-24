import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, RotateCcw, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FruitSelect } from '@/components/shared/FruitSelect';
import { WeaponSelect } from '@/components/shared/WeaponSelect';
import { ScoreGauge } from '@/components/shared/ScoreGauge';
import { ReasonList } from '@/components/shared/ReasonList';
import { CounterList } from '@/components/shared/CounterList';
import { TipList } from '@/components/shared/TipList';
import { calculateMatchup } from '@/logic/matchupScorer';
import { Build, MatchupResult } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Simulator() {
  const [myBuild, setMyBuild] = useState<Build>({
    level: 1500,
    fruit: '',
    weapon: '',
    fightingStyle: '',
    statFocus: 'balanced',
  });

  const [rivalBuild, setRivalBuild] = useState<Build>({
    level: 1500,
    fruit: '',
    weapon: '',
    fightingStyle: '',
    statFocus: 'balanced',
  });

  const [result, setResult] = useState<MatchupResult | null>(null);

  const canSimulate = myBuild.fruit && myBuild.weapon && rivalBuild.fruit;

  const handleSimulate = () => {
    if (!canSimulate) return;
    const matchupResult = calculateMatchup(myBuild, rivalBuild);
    setResult(matchupResult);
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      toast({ title: 'Link copied!', description: 'Share it with your friends' });
    } catch {
      toast({ title: 'Share this URL', description: result.shareUrl });
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold flex items-center gap-2">
              <Swords className="w-8 h-8 text-primary" />
              PVP Simulator
            </h1>
            <p className="text-muted-foreground">Compare builds and know your odds</p>
          </div>
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
                <CardHeader><CardTitle className="text-primary">Your Build</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Level: {myBuild.level}</Label>
                    <Slider value={[myBuild.level]} onValueChange={([v]) => setMyBuild({ ...myBuild, level: v })} min={1} max={2550} step={50} className="mt-2" />
                  </div>
                  <div><Label>Fruit *</Label><FruitSelect value={myBuild.fruit} onValueChange={(v) => setMyBuild({ ...myBuild, fruit: v })} /></div>
                  <div><Label>Weapon *</Label><WeaponSelect value={myBuild.weapon} onValueChange={(v) => setMyBuild({ ...myBuild, weapon: v })} category="Sword" placeholder="Select sword/gun..." /></div>
                  <div><Label>Fighting Style</Label><WeaponSelect value={myBuild.fightingStyle} onValueChange={(v) => setMyBuild({ ...myBuild, fightingStyle: v })} category="Fighting Style" placeholder="Select style..." /></div>
                  <div>
                    <Label>Stat Focus</Label>
                    <RadioGroup value={myBuild.statFocus} onValueChange={(v: any) => setMyBuild({ ...myBuild, statFocus: v })} className="flex flex-wrap gap-4 mt-2">
                      {['balanced', 'melee', 'fruit', 'defense'].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                          <RadioGroupItem value={s} id={`my-${s}`} />
                          <Label htmlFor={`my-${s}`} className="capitalize">{s}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Rival Build */}
              <Card>
                <CardHeader><CardTitle className="text-destructive">Rival Build</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Level: {rivalBuild.level}</Label>
                    <Slider value={[rivalBuild.level]} onValueChange={([v]) => setRivalBuild({ ...rivalBuild, level: v })} min={1} max={2550} step={50} className="mt-2" />
                  </div>
                  <div><Label>Fruit *</Label><FruitSelect value={rivalBuild.fruit} onValueChange={(v) => setRivalBuild({ ...rivalBuild, fruit: v })} /></div>
                  <div><Label>Weapon</Label><WeaponSelect value={rivalBuild.weapon} onValueChange={(v) => setRivalBuild({ ...rivalBuild, weapon: v })} category="Sword" placeholder="Select sword/gun..." /></div>
                  <div><Label>Fighting Style</Label><WeaponSelect value={rivalBuild.fightingStyle} onValueChange={(v) => setRivalBuild({ ...rivalBuild, fightingStyle: v })} category="Fighting Style" placeholder="Select style..." /></div>
                </CardContent>
              </Card>

              {/* Simulate Button */}
              <div className="lg:col-span-2">
                <Button onClick={handleSimulate} disabled={!canSimulate} variant="hero" size="xl" className="w-full">
                  <Swords className="w-5 h-5" /> Simulate Matchup
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score */}
              <Card glow className="text-center py-8">
                <ScoreGauge score={result.score} size="lg" />
                <p className="text-muted-foreground mt-4">Confidence: {result.confidence}</p>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card><CardHeader><CardTitle>Why This Score</CardTitle></CardHeader><CardContent><ReasonList reasons={result.reasons} /></CardContent></Card>
                <Card><CardHeader><CardTitle>How to Improve</CardTitle></CardHeader><CardContent><CounterList counters={result.counters} /></CardContent></Card>
              </div>

              {result.tips.length > 0 && (
                <Card><CardHeader><CardTitle>Battle Tips</CardTitle></CardHeader><CardContent><TipList tips={result.tips} /></CardContent></Card>
              )}

              <div className="flex gap-4">
                <Button onClick={handleReset} variant="outline" className="flex-1"><RotateCcw className="w-4 h-4" /> New Simulation</Button>
                <Button onClick={handleShare} variant="default" className="flex-1"><Share2 className="w-4 h-4" /> Share Result</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
