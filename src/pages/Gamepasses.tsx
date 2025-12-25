import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, X, Coins, Zap, Wrench, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import gamepassesData from '@/data/gamepasses.json';
import { Gamepass } from '@/types';

const gamepasses = gamepassesData as Gamepass[];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Currency': return <Coins className="w-5 h-5" />;
    case 'Boost': return <Zap className="w-5 h-5" />;
    case 'Utility': return <Wrench className="w-5 h-5" />;
    case 'Permanent Fruit': return <Gift className="w-5 h-5" />;
    default: return <Coins className="w-5 h-5" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Currency': return 'bg-primary/20 text-primary border-primary';
    case 'Boost': return 'bg-accent/20 text-accent border-accent';
    case 'Utility': return 'bg-success/20 text-success border-success';
    case 'Permanent Fruit': return 'bg-warning/20 text-warning border-warning';
    default: return 'bg-muted text-muted-foreground border-muted-foreground';
  }
};

const getSeaColor = (sea: string) => {
  switch (sea) {
    case '1st Sea': return 'text-blue-400';
    case '2nd Sea': return 'text-purple-400';
    case '3rd Sea': return 'text-orange-400';
    default: return 'text-muted-foreground';
  }
};

const GamepassCard = ({ gamepass, index, t }: { gamepass: Gamepass; index: number; t: (key: string) => string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="hover:border-primary/50 transition-all duration-300 hover:glow-primary h-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-lg bg-muted/50 p-2 flex items-center justify-center flex-shrink-0">
            {gamepass.image ? (
              <img 
                src={gamepass.image} 
                alt={gamepass.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            {!gamepass.image && (
              <div className="text-2xl">{getCategoryIcon(gamepass.category)}</div>
            )}
          </div>
          <div className="flex-1 flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{gamepass.name}</CardTitle>
              <CardDescription className="mt-1">{gamepass.description}</CardDescription>
            </div>
            <Badge className={cn('border', getCategoryColor(gamepass.category))}>
              {t(`gamepass.category.${gamepass.category.toLowerCase().replace(' ', '_')}`)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('gamepass.cost')}</p>
              <p className="text-2xl font-bold text-accent">{gamepass.cost.toLocaleString()} {t('gamepass.robux')}</p>
            </div>
            <Badge variant="outline" className={getSeaColor(gamepass.sea)}>
              {gamepass.sea}
            </Badge>
          </div>
          
          {gamepass.benefits.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('gamepass.benefits')}</p>
              <div className="space-y-1">
                {gamepass.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-success">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Gamepasses() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSea, setSelectedSea] = useState<string>('all');

  const filteredGamepasses = useMemo(() => {
    return gamepasses.filter(gamepass => {
      const matchesSearch = gamepass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           gamepass.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || gamepass.category === selectedCategory;
      const matchesSea = selectedSea === 'all' || gamepass.sea === selectedSea;
      return matchesSearch && matchesCategory && matchesSea;
    });
  }, [searchQuery, selectedCategory, selectedSea]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Gamepass[]> = {
      'Currency': [],
      'Boost': [],
      'Utility': [],
      'Permanent Fruit': [],
    };
    filteredGamepasses.forEach(gamepass => {
      if (groups[gamepass.category]) {
        groups[gamepass.category].push(gamepass);
      }
    });
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.cost - b.cost);
    });
    return groups;
  }, [filteredGamepasses]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: gamepasses.length };
    gamepasses.forEach(gamepass => {
      counts[gamepass.category] = (counts[gamepass.category] || 0) + 1;
    });
    return counts;
  }, []);

  const seaCounts = useMemo(() => {
    const counts: Record<string, number> = { all: gamepasses.length };
    gamepasses.forEach(gamepass => {
      counts[gamepass.sea] = (counts[gamepass.sea] || 0) + 1;
    });
    return counts;
  }, []);

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
                🎮 {t('gamepass.title')}
              </h1>
              <p className="text-muted-foreground">{t('gamepass.subtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('gamepass.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  {t('gamepass.all_categories')} ({categoryCounts.all})
                </Button>
                <Button
                  variant={selectedCategory === 'Currency' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('Currency')}
                  className="text-primary"
                >
                  {t('gamepass.category.currency')} ({categoryCounts['Currency'] || 0})
                </Button>
                <Button
                  variant={selectedCategory === 'Boost' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('Boost')}
                  className="text-accent"
                >
                  {t('gamepass.category.boost')} ({categoryCounts['Boost'] || 0})
                </Button>
                <Button
                  variant={selectedCategory === 'Utility' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('Utility')}
                  className="text-success"
                >
                  {t('gamepass.category.utility')} ({categoryCounts['Utility'] || 0})
                </Button>
                <Button
                  variant={selectedCategory === 'Permanent Fruit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('Permanent Fruit')}
                  className="text-warning"
                >
                  {t('gamepass.category.permanent_fruit')} ({categoryCounts['Permanent Fruit'] || 0})
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedSea === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSea('all')}
                >
                  {t('gamepass.all_seas')} ({seaCounts.all})
                </Button>
                <Button
                  variant={selectedSea === '1st Sea' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSea('1st Sea')}
                  className="text-blue-400"
                >
                  1st Sea ({seaCounts['1st Sea'] || 0})
                </Button>
                <Button
                  variant={selectedSea === '2nd Sea' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSea('2nd Sea')}
                  className="text-purple-400"
                >
                  2nd Sea ({seaCounts['2nd Sea'] || 0})
                </Button>
                <Button
                  variant={selectedSea === 'All Seas' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSea('All Seas')}
                  className="text-muted-foreground"
                >
                  {t('gamepass.all_seas_option')} ({seaCounts['All Seas'] || 0})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full" defaultValue="all">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">{t('gamepass.all_categories')}</TabsTrigger>
            <TabsTrigger value="Currency">
              <Coins className="w-4 h-4 mr-2" />
              {t('gamepass.category.currency')}
            </TabsTrigger>
            <TabsTrigger value="Boost">
              <Zap className="w-4 h-4 mr-2" />
              {t('gamepass.category.boost')}
            </TabsTrigger>
            <TabsTrigger value="Utility">
              <Wrench className="w-4 h-4 mr-2" />
              {t('gamepass.category.utility')}
            </TabsTrigger>
            <TabsTrigger value="Permanent Fruit">
              <Gift className="w-4 h-4 mr-2" />
              {t('gamepass.category.permanent_fruit')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-8">
            {Object.entries(groupedByCategory).map(([category, categoryGamepasses]) => {
              if (categoryGamepasses.length === 0) return null;
              return (
                <div key={category} className="mb-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {t(`gamepass.category.${category.toLowerCase().replace(' ', '_')}`)}
                      <Badge variant="outline" className="ml-2">{categoryGamepasses.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">{t(`gamepass.category_desc.${category.toLowerCase().replace(' ', '_')}`)}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryGamepasses.map((gamepass, index) => (
                      <GamepassCard key={gamepass.id} gamepass={gamepass} index={index} t={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {['Currency', 'Boost', 'Utility', 'Permanent Fruit'].map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              {groupedByCategory[category] && groupedByCategory[category].length > 0 && (
                <div className="mb-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {t(`gamepass.category.${category.toLowerCase().replace(' ', '_')}`)}
                      <Badge variant="outline" className="ml-2">{groupedByCategory[category].length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">{t(`gamepass.category_desc.${category.toLowerCase().replace(' ', '_')}`)}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedByCategory[category].map((gamepass, index) => (
                      <GamepassCard key={gamepass.id} gamepass={gamepass} index={index} t={t} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {filteredGamepasses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">{t('gamepass.no_results')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

