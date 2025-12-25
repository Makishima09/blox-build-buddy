import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Wrench, BookOpen, TrendingUp, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      {/* Top Bar */}
      <div className="container flex justify-end py-4">
        <LanguageToggle />
      </div>

      {/* Hero Section */}
      <header className="container pt-8 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-primary">BLOX FRUITS</span>
            <br />
            <span className="text-foreground">COMPANION</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
        </motion.div>

        {/* Main CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button asChild variant="hero" size="xl">
            <Link to="/simulator">
              <Swords className="w-5 h-5" />
              {t('cta.simulate')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link to="/optimizer">
              <Wrench className="w-5 h-5" />
              {t('cta.optimize')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link to="/fruits">
              <BookOpen className="w-5 h-5" />
              {t('cta.fruits')}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="xl">
            <Link to="/trader">
              <TrendingUp className="w-5 h-5" />
              {t('cta.trader')}
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link to="/gamepasses">
              <Gift className="w-5 h-5" />
              {t('cta.gamepasses')}
            </Link>
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          <Card className="text-left hover:border-primary/50 transition-all duration-300 hover:glow-primary">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                <Swords className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('feature.simulator.title')}</CardTitle>
              <CardDescription>{t('feature.simulator.desc')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-left hover:border-accent/50 transition-all duration-300 hover:glow-accent">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>{t('feature.optimizer.title')}</CardTitle>
              <CardDescription>{t('feature.optimizer.desc')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-left hover:border-success/50 transition-all duration-300 hover:glow-success">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <CardTitle>{t('feature.fruits.title')}</CardTitle>
              <CardDescription>{t('feature.fruits.desc')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-left hover:border-warning/50 transition-all duration-300 hover:glow-warning">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <CardTitle>{t('feature.trader.title')}</CardTitle>
              <CardDescription>{t('feature.trader.desc')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-left hover:border-primary/50 transition-all duration-300 hover:glow-primary">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('feature.gamepasses.title')}</CardTitle>
              <CardDescription>{t('feature.gamepasses.desc')}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 flex justify-center gap-8 text-center"
        >
          <div>
            <p className="text-3xl font-display font-bold text-primary">20+</p>
            <p className="text-sm text-muted-foreground">{t('stats.fruits')}</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-accent">15+</p>
            <p className="text-sm text-muted-foreground">{t('stats.weapons')}</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-success">100%</p>
            <p className="text-sm text-muted-foreground">{t('stats.free')}</p>
          </div>
        </motion.div>
      </header>

      {/* Footer */}
      <footer className="container py-8 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">{t('footer.disclaimer')}</p>
      </footer>
    </div>
  );
};

export default Index;
