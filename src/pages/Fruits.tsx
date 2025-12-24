import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageToggle } from '@/components/shared/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import fruitsData from '@/data/fruits.json';
import { Fruit } from '@/types';

const fruits = fruitsData as Fruit[];

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S': return 'bg-accent/20 text-accent border-accent';
    case 'A': return 'bg-primary/20 text-primary border-primary';
    case 'B': return 'bg-success/20 text-success border-success';
    case 'C': return 'bg-muted text-muted-foreground border-muted-foreground';
    default: return 'bg-muted text-muted-foreground border-muted-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Paramecia': return '🍎';
    case 'Logia': return '⚡';
    case 'Zoan': return '🐉';
    default: return '🍇';
  }
};

const FruitCard = ({ fruit, index, t }: { fruit: Fruit; index: number; t: (key: string) => string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Card className="hover:border-primary/50 transition-all duration-300 hover:glow-primary h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{fruit.name}</CardTitle>
            <CardDescription className="mt-1">{fruit.type}</CardDescription>
          </div>
          <Badge className={cn('border', getTierColor(fruit.tier))}>
            {fruit.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {fruit.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {t(`fruits.tag.${tag}`) || tag}
              </Badge>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('fruits.optimal_stats')}</p>
            <div className="flex gap-2 text-xs">
              <Badge variant="outline" className="text-primary">
                {t(fruit.optimalStats.primary)}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {t(fruit.optimalStats.secondary)}
              </Badge>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-border">
            {fruit.counters.strong_against.length > 0 && (
              <div>
                <p className="text-xs text-success mb-1">✓ {t('fruits.strong_against')}</p>
                <div className="flex flex-wrap gap-1">
                  {fruit.counters.strong_against.slice(0, 3).map(id => {
                    const counterFruit = fruits.find(f => f.id === id);
                    return counterFruit ? (
                      <Badge key={id} variant="outline" className="text-xs text-success">
                        {counterFruit.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            {fruit.counters.weak_against.length > 0 && (
              <div>
                <p className="text-xs text-destructive mb-1">✗ {t('fruits.weak_against')}</p>
                <div className="flex flex-wrap gap-1">
                  {fruit.counters.weak_against.slice(0, 3).map(id => {
                    const counterFruit = fruits.find(f => f.id === id);
                    return counterFruit ? (
                      <Badge key={id} variant="outline" className="text-xs text-destructive">
                        {counterFruit.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Fruits() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredFruits = useMemo(() => {
    return fruits.filter(fruit => {
      const matchesSearch = fruit.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = selectedTier === 'all' || fruit.tier === selectedTier;
      const matchesType = selectedType === 'all' || fruit.type === selectedType;
      return matchesSearch && matchesTier && matchesType;
    });
  }, [searchQuery, selectedTier, selectedType]);

  const groupedByType = useMemo(() => {
    const groups: Record<string, Fruit[]> = {
      'Paramecia': [],
      'Logia': [],
      'Zoan': [],
    };
    filteredFruits.forEach(fruit => {
      if (groups[fruit.type]) {
        groups[fruit.type].push(fruit);
      }
    });
    // Ordenar cada grupo por tier
    Object.keys(groups).forEach(type => {
      groups[type].sort((a, b) => {
        const tierOrder: Record<string, number> = { 'S': 0, 'A': 1, 'B': 2, 'C': 3 };
        const diff = (tierOrder[a.tier] ?? 4) - (tierOrder[b.tier] ?? 4);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
      });
    });
    return groups;
  }, [filteredFruits]);

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { all: fruits.length, S: 0, A: 0, B: 0, C: 0 };
    fruits.forEach(fruit => {
      counts[fruit.tier] = (counts[fruit.tier] || 0) + 1;
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
                🍇 {t('fruits.title')}
              </h1>
              <p className="text-muted-foreground">{t('fruits.subtitle')}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('fruits.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedTier === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier('all')}
                >
                  {t('fruits.all_tiers')} ({tierCounts.all})
                </Button>
                <Button
                  variant={selectedTier === 'S' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier('S')}
                  className="text-accent"
                >
                  S ({tierCounts.S})
                </Button>
                <Button
                  variant={selectedTier === 'A' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier('A')}
                  className="text-primary"
                >
                  A ({tierCounts.A})
                </Button>
                <Button
                  variant={selectedTier === 'B' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier('B')}
                  className="text-success"
                >
                  B ({tierCounts.B})
                </Button>
                <Button
                  variant={selectedTier === 'C' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier('C')}
                >
                  C ({tierCounts.C})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fruits by Type */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full" defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">{t('fruits.all_types')}</TabsTrigger>
            <TabsTrigger value="Paramecia">🍎 Paramecia</TabsTrigger>
            <TabsTrigger value="Logia">⚡ Logia</TabsTrigger>
            <TabsTrigger value="Zoan">🐉 Zoan</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-8">
            {Object.entries(groupedByType).map(([type, typeFruits]) => {
              if (typeFruits.length === 0) return null;
              return (
                <div key={type} className="mb-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                      {getTypeIcon(type)} {type}
                      <Badge variant="outline" className="ml-2">{typeFruits.length}</Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">{t(`fruits.type_desc.${type.toLowerCase()}`)}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeFruits.map((fruit, index) => (
                      <FruitCard key={fruit.id} fruit={fruit} index={index} t={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="Paramecia" className="mt-0">
            {selectedType === 'Paramecia' && groupedByType['Paramecia'] && groupedByType['Paramecia'].length > 0 && (
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                    {getTypeIcon(selectedType)} {selectedType}
                    <Badge variant="outline" className="ml-2">{groupedByType[selectedType].length}</Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{t(`fruits.type_desc.${selectedType.toLowerCase()}`)}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByType[selectedType].map((fruit, index) => (
                    <FruitCard key={fruit.id} fruit={fruit} index={index} t={t} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Logia" className="mt-0">
            {selectedType === 'Logia' && groupedByType['Logia'] && groupedByType['Logia'].length > 0 && (
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                    {getTypeIcon('Logia')} Logia
                    <Badge variant="outline" className="ml-2">{groupedByType['Logia'].length}</Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{t('fruits.type_desc.logia')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByType['Logia'].map((fruit, index) => (
                    <motion.div
                      key={fruit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:border-primary/50 transition-all duration-300 hover:glow-primary h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{fruit.name}</CardTitle>
                              <CardDescription className="mt-1">{fruit.type}</CardDescription>
                            </div>
                            <Badge className={cn('border', getTierColor(fruit.tier))}>
                              {fruit.tier}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {fruit.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {t(`fruits.tag.${tag}`) || tag}
                                </Badge>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{t('fruits.optimal_stats')}</p>
                              <div className="flex gap-2 text-xs">
                                <Badge variant="outline" className="text-primary">
                                  {t(fruit.optimalStats.primary)}
                                </Badge>
                                <Badge variant="outline" className="text-muted-foreground">
                                  {t(fruit.optimalStats.secondary)}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-border">
                              {fruit.counters.strong_against.length > 0 && (
                                <div>
                                  <p className="text-xs text-success mb-1">✓ {t('fruits.strong_against')}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {fruit.counters.strong_against.slice(0, 3).map(id => {
                                      const counterFruit = fruits.find(f => f.id === id);
                                      return counterFruit ? (
                                        <Badge key={id} variant="outline" className="text-xs text-success">
                                          {counterFruit.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                              {fruit.counters.weak_against.length > 0 && (
                                <div>
                                  <p className="text-xs text-destructive mb-1">✗ {t('fruits.weak_against')}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {fruit.counters.weak_against.slice(0, 3).map(id => {
                                      const counterFruit = fruits.find(f => f.id === id);
                                      return counterFruit ? (
                                        <Badge key={id} variant="outline" className="text-xs text-destructive">
                                          {counterFruit.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Zoan" className="mt-0">
            {selectedType === 'Zoan' && groupedByType['Zoan'] && groupedByType['Zoan'].length > 0 && (
              <div className="mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
                    {getTypeIcon('Zoan')} Zoan
                    <Badge variant="outline" className="ml-2">{groupedByType['Zoan'].length}</Badge>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">{t('fruits.type_desc.zoan')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByType['Zoan'].map((fruit, index) => (
                    <motion.div
                      key={fruit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:border-primary/50 transition-all duration-300 hover:glow-primary h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{fruit.name}</CardTitle>
                              <CardDescription className="mt-1">{fruit.type}</CardDescription>
                            </div>
                            <Badge className={cn('border', getTierColor(fruit.tier))}>
                              {fruit.tier}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {fruit.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {t(`fruits.tag.${tag}`) || tag}
                                </Badge>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">{t('fruits.optimal_stats')}</p>
                              <div className="flex gap-2 text-xs">
                                <Badge variant="outline" className="text-primary">
                                  {t(fruit.optimalStats.primary)}
                                </Badge>
                                <Badge variant="outline" className="text-muted-foreground">
                                  {t(fruit.optimalStats.secondary)}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-border">
                              {fruit.counters.strong_against.length > 0 && (
                                <div>
                                  <p className="text-xs text-success mb-1">✓ {t('fruits.strong_against')}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {fruit.counters.strong_against.slice(0, 3).map(id => {
                                      const counterFruit = fruits.find(f => f.id === id);
                                      return counterFruit ? (
                                        <Badge key={id} variant="outline" className="text-xs text-success">
                                          {counterFruit.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                              {fruit.counters.weak_against.length > 0 && (
                                <div>
                                  <p className="text-xs text-destructive mb-1">✗ {t('fruits.weak_against')}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {fruit.counters.weak_against.slice(0, 3).map(id => {
                                      const counterFruit = fruits.find(f => f.id === id);
                                      return counterFruit ? (
                                        <Badge key={id} variant="outline" className="text-xs text-destructive">
                                          {counterFruit.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filteredFruits.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">{t('fruits.no_results')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

