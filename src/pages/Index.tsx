import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Wrench, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-hero-pattern">
      {/* Hero Section */}
      <header className="container pt-16 pb-12 text-center">
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
            Know your odds before you fight. Optimize your build in seconds, not hours.
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
              Simulate PVP
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link to="/optimizer">
              <Wrench className="w-5 h-5" />
              Optimize Build
            </Link>
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <Card className="text-left hover:border-primary/50 transition-all duration-300 hover:glow-primary">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                <Swords className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>PVP Matchup Simulator</CardTitle>
              <CardDescription>
                Enter your build and your rival's to get instant matchup analysis with win probability, strengths, and counter strategies.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-left hover:border-accent/50 transition-all duration-300 hover:glow-accent">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-2">
                <Wrench className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Build Optimizer</CardTitle>
              <CardDescription>
                Tell us your goal (PVP, Farming, or Boss) and get a personalized upgrade path with the best fruit, weapon, and stats.
              </CardDescription>
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
            <p className="text-sm text-muted-foreground">Fruits</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-accent">15+</p>
            <p className="text-sm text-muted-foreground">Weapons</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-success">100%</p>
            <p className="text-sm text-muted-foreground">Free</p>
          </div>
        </motion.div>
      </header>

      {/* Footer */}
      <footer className="container py-8 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Fan-made tool. Not affiliated with Blox Fruits or Roblox.
        </p>
      </footer>
    </div>
  );
};

export default Index;
