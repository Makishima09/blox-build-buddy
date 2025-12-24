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

export function optimizeBuild(input: OptimizerInput, t?: (key: string) => string): OptimizerResult {
  const translate = t || ((key: string) => key);
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
        reason: translate('optimizer.optimized_for').replace('{name}', fruit?.name || currentBuild.fruit).replace('{objective}', translate(`optimizer.${objective}`))
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
      ? translate('optimizer.if_cant_get').replace('{name}', getFruitById(targetBuild.fruit)?.name || targetBuild.fruit)
      : translate('optimizer.another_option'),
    build: {
      tier: build.tier as 'S' | 'A' | 'B' | 'C',
      fruit: build.fruit,
      weapon: build.weapon,
      style: build.style,
      stats: build.stats as [number, number, number, number, number],
      tags: build.tags,
      reason: build.reason
    },
    tradeoffs: compareBuilds(targetBuildData, build, translate)
  }));
  
  // Generate upgrade path
  const upgradePath = generateUpgradePath(currentBuild, targetBuild, objective, translate);
  
  // Generate justification
  const justification = [
    targetBuild.reason,
    translate('optimizer.build_prioritizes').replace('{priorities}', preset.priorities.slice(0, 3).join(', ')),
    targetBuild.tier === 'S' 
      ? translate('optimizer.tier_meta').replace('{tier}', targetBuild.tier)
      : translate('optimizer.tier_reliable').replace('{tier}', targetBuild.tier)
  ];
  
  // Expected improvement
  const improvements: Record<string, { metric: string; change: string }> = {
    pvp: { metric: translate('optimizer.win_rate'), change: translate('optimizer.improvement_pvp') },
    farm: { metric: translate('optimizer.clear_speed'), change: translate('optimizer.improvement_farm') },
    boss: { metric: translate('optimizer.boss_kill_time'), change: translate('optimizer.improvement_boss') }
  };
  
  return {
    targetBuild,
    upgradePath,
    alternatives,
    justification,
    expectedImprovement: improvements[objective]
  };
}

function compareBuilds(a: RecommendedBuildData, b: RecommendedBuildData, t?: (key: string) => string): string {
  const translate = t || ((key: string) => key);
  const aFruit = getFruitById(a.fruit);
  const bFruit = getFruitById(b.fruit);
  
  if (!aFruit || !bFruit) return translate('optimizer.similar_performance');
  
  const tierDiff = ['S', 'A', 'B', 'C'].indexOf(a.tier) - ['S', 'A', 'B', 'C'].indexOf(b.tier);
  
  if (tierDiff < 0) {
    return b.tags.includes('beginner_friendly') 
      ? translate('optimizer.lower_tier_easier')
      : translate('optimizer.lower_tier_effective');
  }
  
  const aHasMobility = aFruit.tags.includes('mobility');
  const bHasMobility = bFruit.tags.includes('mobility');
  
  if (aHasMobility && !bHasMobility) {
    return translate('optimizer.less_mobile');
  }
  
  return translate('optimizer.alternative_playstyle');
}

function generateUpgradePath(
  current: OptimizerInput['currentBuild'],
  target: { fruit: string; weapon: string; style: string },
  objective: string,
  t?: (key: string) => string
): UpgradeStep[] {
  const translate = t || ((key: string) => key);
  const steps: UpgradeStep[] = [];
  let stepNum = 1;
  
  // Fruit change (if needed)
  if (current.fruit !== target.fruit) {
    const targetFruit = getFruitById(target.fruit);
    steps.push({
      step: stepNum++,
      action: translate('optimizer.obtain').replace('{name}', targetFruit?.name || target.fruit),
      priority: 'critical',
      estimatedTime: translate('optimizer.time_trading'),
      reason: translate('optimizer.reason_core').replace('{name}', targetFruit?.name || target.fruit).replace('{objective}', translate(`optimizer.${objective}`))
    });
  }
  
  // Weapon change
  if (current.weapon !== target.weapon) {
    const targetWeapon = getWeaponById(target.weapon);
    const synergyType = objective === 'pvp' ? 'burst' : objective === 'farm' ? 'aoe' : 'dps';
    steps.push({
      step: stepNum++,
      action: translate('optimizer.get').replace('{name}', targetWeapon?.name || target.weapon),
      priority: 'high',
      estimatedTime: translate('optimizer.time_days'),
      reason: translate('optimizer.reason_synergy').replace('{type}', translate(`optimizer.${synergyType}`))
    });
  }
  
  // Fighting style change
  if (current.fightingStyle !== target.style) {
    const targetStyle = getWeaponById(target.style);
    steps.push({
      step: stepNum++,
      action: translate('optimizer.unlock').replace('{name}', targetStyle?.name || target.style),
      priority: 'high',
      estimatedTime: translate('optimizer.time_weeks'),
      reason: translate('optimizer.reason_combo')
    });
  }
  
  // Stats respec
  steps.push({
    step: stepNum++,
    action: translate('optimizer.respec_stats'),
    priority: 'high',
    estimatedTime: translate('optimizer.time_instant'),
    reason: translate('optimizer.reason_stats')
  });
  
  // Mastery
  const targetFruit = getFruitById(target.fruit);
  if (targetFruit) {
    steps.push({
      step: stepNum++,
      action: translate('optimizer.max_mastery').replace('{name}', targetFruit.name),
      priority: 'medium',
      estimatedTime: translate('optimizer.time_grinding'),
      reason: translate('optimizer.reason_mastery')
    });
  }
  
  // Awakening (if applicable)
  if (targetFruit?.tags.includes('awakened')) {
    steps.push({
      step: stepNum++,
      action: translate('optimizer.awaken').replace('{name}', targetFruit.name),
      priority: 'medium',
      estimatedTime: translate('optimizer.time_weeks'),
      reason: translate('optimizer.reason_awakened')
    });
  }
  
  return steps;
}
