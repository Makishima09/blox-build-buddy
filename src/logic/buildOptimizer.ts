import { OptimizerInput, OptimizerResult, UpgradeStep } from '@/types';
import { getFruitById, getWeaponById, presetsData } from './matchupScorer';
import weaponsData from '@/data/weapons.json';

interface RecommendedBuildData {
  tier: string;
  fruit: string;
  weapon: string;
  style: string;
  stats: number[];
  tags: string[];
  reason: string;
}

interface PresetData {
  objective: string;
  priorities: string[];
  recommendedBuilds: RecommendedBuildData[];
}

const presets = presetsData as Record<string, PresetData>;

export function optimizeBuild(input: OptimizerInput): OptimizerResult {
  const { objective, currentBuild, constraints } = input;
  const preset = presets[objective];
  
  if (!preset) {
    throw new Error(`Unknown objective: ${objective}`);
  }
  
  let recommendedBuilds = [...preset.recommendedBuilds];
  
  // Apply constraints
  if (constraints.keepFruit && currentBuild.fruit) {
    recommendedBuilds = recommendedBuilds.filter(b => b.fruit === currentBuild.fruit);
    
    // If no builds match, create a custom one
    if (recommendedBuilds.length === 0) {
      const fruit = getFruitById(currentBuild.fruit);
      const bestWeapon = weaponsData.find(w => 
        w.synergies.perfect.includes(currentBuild.fruit!) || 
        w.synergies.good.includes(currentBuild.fruit!)
      );
      const bestStyle = weaponsData.find(w => 
        w.category === 'Fighting Style' && 
        (w.synergies.perfect.includes(currentBuild.fruit!) || w.synergies.good.includes(currentBuild.fruit!))
      );
      
      recommendedBuilds = [{
        tier: fruit?.tier || 'A',
        fruit: currentBuild.fruit!,
        weapon: bestWeapon?.id || 'cursed_dual_katana',
        style: bestStyle?.id || 'godhuman',
        stats: fruit?.optimalStats.distribution || [25, 25, 0, 0, 50],
        tags: ['custom'],
        reason: `Optimized build for ${fruit?.name || currentBuild.fruit} focusing on ${objective}`
      }];
    }
  }
  
  if (constraints.keepWeapon && currentBuild.weapon) {
    const filtered = recommendedBuilds.filter(b => b.weapon === currentBuild.weapon);
    if (filtered.length > 0) {
      recommendedBuilds = filtered;
    }
  }
  
  // Select best build
  const targetBuildData = recommendedBuilds[0];
  const targetBuild = {
    tier: targetBuildData.tier as 'S' | 'A' | 'B' | 'C',
    fruit: targetBuildData.fruit,
    weapon: targetBuildData.weapon,
    style: targetBuildData.style,
    stats: targetBuildData.stats as [number, number, number, number, number],
    tags: targetBuildData.tags,
    reason: targetBuildData.reason
  };
  
  const alternatives = recommendedBuilds.slice(1, 3).map((build, idx) => ({
    scenario: idx === 0 
      ? `If you can't get ${getFruitById(targetBuild.fruit)?.name || targetBuild.fruit}...`
      : 'Another solid option...',
    build: {
      tier: build.tier as 'S' | 'A' | 'B' | 'C',
      fruit: build.fruit,
      weapon: build.weapon,
      style: build.style,
      stats: build.stats as [number, number, number, number, number],
      tags: build.tags,
      reason: build.reason
    },
    tradeoffs: compareBuilds(targetBuildData, build)
  }));
  
  // Generate upgrade path
  const upgradePath = generateUpgradePath(currentBuild, targetBuild, objective);
  
  // Generate justification
  const justification = [
    targetBuild.reason,
    `This build prioritizes: ${preset.priorities.slice(0, 3).join(', ')}`,
    `Tier ${targetBuild.tier} build - ${targetBuild.tier === 'S' ? 'Top meta choice' : 'Strong and reliable'}`
  ];
  
  // Expected improvement
  const improvements: Record<string, { metric: string; change: string }> = {
    pvp: { metric: 'Win Rate', change: '+30-50% in ranked matches' },
    farm: { metric: 'Clear Speed', change: '+40% faster mob clearing' },
    boss: { metric: 'Boss Kill Time', change: '-30% time per boss' }
  };
  
  return {
    targetBuild,
    upgradePath,
    alternatives,
    justification,
    expectedImprovement: improvements[objective]
  };
}

function compareBuilds(a: RecommendedBuildData, b: RecommendedBuildData): string {
  const aFruit = getFruitById(a.fruit);
  const bFruit = getFruitById(b.fruit);
  
  if (!aFruit || !bFruit) return 'Similar performance expected';
  
  const tierDiff = ['S', 'A', 'B', 'C'].indexOf(a.tier) - ['S', 'A', 'B', 'C'].indexOf(b.tier);
  
  if (tierDiff < 0) {
    return `Slightly lower tier but ${b.tags.includes('beginner_friendly') ? 'easier to use' : 'still very effective'}`;
  }
  
  const aHasMobility = aFruit.tags.includes('mobility');
  const bHasMobility = bFruit.tags.includes('mobility');
  
  if (aHasMobility && !bHasMobility) {
    return 'Less mobile but potentially more damage';
  }
  
  return 'Alternative playstyle with similar effectiveness';
}

function generateUpgradePath(
  current: OptimizerInput['currentBuild'],
  target: { fruit: string; weapon: string; style: string },
  objective: string
): UpgradeStep[] {
  const steps: UpgradeStep[] = [];
  let stepNum = 1;
  
  // Fruit change (if needed)
  if (current.fruit !== target.fruit) {
    const targetFruit = getFruitById(target.fruit);
    steps.push({
      step: stepNum++,
      action: `Obtain ${targetFruit?.name || target.fruit}`,
      priority: 'critical',
      estimatedTime: '1-2 weeks (trading/hunting)',
      reason: `${targetFruit?.name || target.fruit} is the core of this ${objective} build`
    });
  }
  
  // Weapon change
  if (current.weapon !== target.weapon) {
    const targetWeapon = getWeaponById(target.weapon);
    steps.push({
      step: stepNum++,
      action: `Get ${targetWeapon?.name || target.weapon}`,
      priority: 'high',
      estimatedTime: '3-7 days',
      reason: `Perfect synergy with your fruit for maximum ${objective === 'pvp' ? 'burst' : objective === 'farm' ? 'AoE' : 'DPS'}`
    });
  }
  
  // Fighting style change
  if (current.fightingStyle !== target.style) {
    const targetStyle = getWeaponById(target.style);
    steps.push({
      step: stepNum++,
      action: `Unlock ${targetStyle?.name || target.style}`,
      priority: 'high',
      estimatedTime: '1-2 weeks',
      reason: 'Completes your build\'s combo potential'
    });
  }
  
  // Stats respec
  steps.push({
    step: stepNum++,
    action: 'Respec stats to optimal distribution',
    priority: 'high',
    estimatedTime: 'Instant (requires stat reset)',
    reason: 'Optimized stat distribution for your build'
  });
  
  // Mastery
  const targetFruit = getFruitById(target.fruit);
  if (targetFruit) {
    steps.push({
      step: stepNum++,
      action: `Max ${targetFruit.name} mastery to 600`,
      priority: 'medium',
      estimatedTime: '2-4 weeks of grinding',
      reason: 'Unlock all moves and maximize damage'
    });
  }
  
  // Awakening (if applicable)
  if (targetFruit?.tags.includes('awakened')) {
    steps.push({
      step: stepNum++,
      action: `Awaken ${targetFruit.name} (complete raid)`,
      priority: 'medium',
      estimatedTime: '1-2 weeks',
      reason: 'Awakened moves are significantly stronger'
    });
  }
  
  return steps;
}
