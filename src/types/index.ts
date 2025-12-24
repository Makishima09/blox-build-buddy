export interface Fruit {
  id: string;
  name: string;
  type: 'Paramecia' | 'Logia' | 'Zoan';
  tier: 'S' | 'A' | 'B' | 'C';
  tags: string[];
  counters: {
    strong_against: string[];
    weak_against: string[];
  };
  optimalStats: {
    primary: 'melee' | 'defense' | 'sword' | 'gun' | 'fruit';
    secondary: 'melee' | 'defense' | 'sword' | 'gun' | 'fruit';
    distribution: [number, number, number, number, number];
  };
}

export interface Weapon {
  id: string;
  name: string;
  category: 'Sword' | 'Gun' | 'Fighting Style';
  tier: 'S' | 'A' | 'B' | 'C';
  tags: string[];
  synergies: {
    perfect: string[];
    good: string[];
    acceptable: string[];
    poor: string[];
  };
}

export interface Matchup {
  fruit1: string;
  fruit2: string;
  advantage: number;
  reason: string;
}

export interface Build {
  level: number;
  fruit: string;
  weapon: string;
  fightingStyle: string;
  statFocus: 'balanced' | 'melee' | 'fruit' | 'defense';
  playstyle?: 'aggressive' | 'zoner' | 'hitandrun' | 'tank';
}

export interface ScoreBreakdown {
  fruitAdvantage: number;
  weaponSynergy: number;
  styleSynergy: number;
  statMatch: number;
  levelDiff: number;
}

export interface Reason {
  type: 'advantage' | 'disadvantage' | 'neutral';
  text: string;
  impact: number;
}

export interface Counter {
  type: 'fruit' | 'weapon' | 'style' | 'stat';
  suggestion: string;
  expectedImprovement: number;
  priority: 'high' | 'medium' | 'low';
}

export interface Tip {
  category: 'positioning' | 'timing' | 'combo' | 'resource';
  text: string;
}

export interface MatchupResult {
  score: number;
  verdict: 'favorable' | 'neutral' | 'unfavorable';
  confidence: 'high' | 'medium' | 'low';
  breakdown: ScoreBreakdown;
  reasons: Reason[];
  counters: Counter[];
  tips: Tip[];
  shareUrl: string;
}

export interface RecommendedBuild {
  tier: 'S' | 'A' | 'B' | 'C';
  fruit: string;
  weapon: string;
  style: string;
  stats: [number, number, number, number, number];
  tags: string[];
  reason: string;
}

export interface OptimizerInput {
  currentLevel: number;
  currentBuild: {
    fruit?: string;
    weapon?: string;
    fightingStyle?: string;
  };
  objective: 'pvp' | 'farm' | 'boss';
  constraints: {
    keepFruit: boolean;
    keepWeapon: boolean;
  };
}

export interface UpgradeStep {
  step: number;
  action: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedTime: string;
  reason: string;
}

export interface OptimizerResult {
  targetBuild: RecommendedBuild;
  upgradePath: UpgradeStep[];
  alternatives: {
    scenario: string;
    build: RecommendedBuild;
    tradeoffs: string;
  }[];
  justification: string[];
  expectedImprovement: {
    metric: string;
    change: string;
  };
}
