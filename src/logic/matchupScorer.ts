import fruitsData from '@/data/fruits.json';
import weaponsData from '@/data/weapons.json';
import matchupsData from '@/data/matchups.json';
import presetsData from '@/data/presets.json';
import { Fruit, Weapon, Matchup, Build, MatchupResult, ScoreBreakdown, Reason, Counter, Tip } from '@/types';

const fruits: Fruit[] = fruitsData as Fruit[];
const weapons: Weapon[] = weaponsData as Weapon[];
const matchups: Matchup[] = matchupsData as Matchup[];

export function getFruitById(id: string): Fruit | undefined {
  return fruits.find(f => f.id === id);
}

export function getWeaponById(id: string): Weapon | undefined {
  return weapons.find(w => w.id === id);
}

function findMatchupAdvantage(fruit1: string, fruit2: string, t?: (key: string) => string): { advantage: number; reason: string } | null {
  const translate = t || ((key: string) => key);
  const direct = matchups.find(m => m.fruit1 === fruit1 && m.fruit2 === fruit2);
  if (direct) return { advantage: direct.advantage, reason: direct.reason };
  
  const reverse = matchups.find(m => m.fruit1 === fruit2 && m.fruit2 === fruit1);
  if (reverse) {
    return { advantage: -reverse.advantage, reason: `${translate('reason.opponent')}: ${reverse.reason}` };
  }
  
  return null;
}

function calculateWeaponSynergy(fruitId: string, weaponId: string): number {
  const weapon = getWeaponById(weaponId);
  if (!weapon) return 0;
  
  if (weapon.synergies.perfect.includes(fruitId)) return 10;
  if (weapon.synergies.good.includes(fruitId)) return 6;
  if (weapon.synergies.acceptable.includes(fruitId)) return 2;
  if (weapon.synergies.poor.includes(fruitId)) return -5;
  
  return 0;
}

function calculateStatMatch(build: Build, fruit: Fruit | undefined): number {
  if (!fruit) return 0;
  
  const statMap: Record<string, 'melee' | 'defense' | 'fruit'> = {
    'balanced': 'fruit',
    'melee': 'melee',
    'fruit': 'fruit',
    'defense': 'defense'
  };
  
  const focus = statMap[build.statFocus] || 'fruit';
  
  if (focus === fruit.optimalStats.primary) return 8;
  if (focus === fruit.optimalStats.secondary) return 4;
  return -3;
}

function getTierValue(tier: string): number {
  const tiers: Record<string, number> = { 'S': 4, 'A': 3, 'B': 2, 'C': 1 };
  return tiers[tier] || 0;
}

export function calculateMatchup(myBuild: Build, rivalBuild: Build, t?: (key: string) => string): MatchupResult {
  const translate = t || ((key: string) => key);
  let score = 50;
  const breakdown: ScoreBreakdown = {
    fruitAdvantage: 0,
    weaponSynergy: 0,
    styleSynergy: 0,
    statMatch: 0,
    levelDiff: 0
  };
  
  const myFruit = getFruitById(myBuild.fruit);
  const rivalFruit = getFruitById(rivalBuild.fruit);
  const myWeapon = getWeaponById(myBuild.weapon);
  const myStyle = getWeaponById(myBuild.fightingStyle);
  
  const reasons: Reason[] = [];
  
  // 1. Fruit advantage (weight: 40%)
  const fruitMatchup = findMatchupAdvantage(myBuild.fruit, rivalBuild.fruit, translate);
  if (fruitMatchup) {
    breakdown.fruitAdvantage = fruitMatchup.advantage;
    reasons.push({
      type: fruitMatchup.advantage > 0 ? 'advantage' : 'disadvantage',
      text: fruitMatchup.reason,
      impact: Math.abs(fruitMatchup.advantage)
    });
  } else if (myFruit && rivalFruit) {
    const tierDiff = getTierValue(myFruit.tier) - getTierValue(rivalFruit.tier);
    breakdown.fruitAdvantage = tierDiff * 5;
    if (tierDiff !== 0) {
      reasons.push({
        type: tierDiff > 0 ? 'advantage' : 'disadvantage',
        text: `${myFruit.name} ${tierDiff > 0 ? translate('reason.tier_higher') : translate('reason.tier_lower')} ${rivalFruit.name}`,
        impact: Math.abs(tierDiff * 5)
      });
    }
  }
  score += breakdown.fruitAdvantage;
  
  // 2. Weapon synergy (weight: 20%)
  breakdown.weaponSynergy = calculateWeaponSynergy(myBuild.fruit, myBuild.weapon);
  if (myWeapon && myFruit) {
    if (breakdown.weaponSynergy >= 8) {
      reasons.push({
        type: 'advantage',
        text: `${myWeapon.name} ${translate('reason.perfect_synergy')} ${myFruit.name}`,
        impact: breakdown.weaponSynergy
      });
    } else if (breakdown.weaponSynergy < 0) {
      reasons.push({
        type: 'disadvantage',
        text: `${myWeapon.name} ${translate('reason.poor_synergy')} ${myFruit.name}`,
        impact: Math.abs(breakdown.weaponSynergy)
      });
    }
  }
  score += breakdown.weaponSynergy;
  
  // 3. Style synergy (weight: 15%)
  breakdown.styleSynergy = calculateWeaponSynergy(myBuild.fruit, myBuild.fightingStyle);
  if (myStyle && myFruit) {
    if (breakdown.styleSynergy >= 8) {
      reasons.push({
        type: 'advantage',
        text: `${myStyle.name} ${translate('reason.maximizes_combo').replace('{name}', myFruit.name)}`,
        impact: breakdown.styleSynergy
      });
    } else if (breakdown.styleSynergy < 0) {
      reasons.push({
        type: 'disadvantage',
        text: `${translate('reason.better_style')} ${myFruit.name}`,
        impact: Math.abs(breakdown.styleSynergy)
      });
    }
  }
  score += breakdown.styleSynergy;
  
  // 4. Stat match (weight: 15%)
  breakdown.statMatch = calculateStatMatch(myBuild, myFruit);
  if (breakdown.statMatch > 5) {
    reasons.push({
      type: 'advantage',
      text: `${translate('reason.optimal_stats')} ${myFruit?.name || translate('reason.your_fruit')}`,
      impact: breakdown.statMatch
    });
  } else if (breakdown.statMatch < 0) {
    reasons.push({
      type: 'disadvantage',
      text: translate('reason.stats_not_optimized'),
      impact: Math.abs(breakdown.statMatch)
    });
  }
  score += breakdown.statMatch;
  
  // 5. Level difference (weight: 10%)
  const levelDiff = (myBuild.level - rivalBuild.level) / 30;
  breakdown.levelDiff = Math.round(Math.min(10, Math.max(-10, levelDiff)));
  if (Math.abs(breakdown.levelDiff) > 3) {
    reasons.push({
      type: breakdown.levelDiff > 0 ? 'advantage' : 'disadvantage',
      text: `${breakdown.levelDiff > 0 ? translate('reason.level_advantage') : translate('reason.level_disadvantage')} (${Math.abs(myBuild.level - rivalBuild.level)} ${translate('reason.levels')})`,
      impact: Math.abs(breakdown.levelDiff)
    });
  }
  score += breakdown.levelDiff;
  
  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  // Generate counters
  const counters: Counter[] = [];
  
  if (breakdown.fruitAdvantage < -5 && rivalFruit) {
    const betterFruits = fruits.filter(f => 
      f.counters.strong_against.includes(rivalBuild.fruit) && f.tier <= 'A'
    ).slice(0, 2);
    
    betterFruits.forEach(bf => {
      counters.push({
        type: 'fruit',
        suggestion: translate('counter.switch_fruit').replace('{name}', bf.name),
        expectedImprovement: 15,
        priority: 'high'
      });
    });
  }
  
  if (breakdown.weaponSynergy < 3 && myFruit) {
    const betterWeapons = weapons.filter(w => 
      w.synergies.perfect.includes(myBuild.fruit) || w.synergies.good.includes(myBuild.fruit)
    ).slice(0, 2);
    
    betterWeapons.forEach(bw => {
      counters.push({
        type: 'weapon',
        suggestion: translate('counter.try_weapon').replace('{name}', bw.name),
        expectedImprovement: 8,
        priority: 'medium'
      });
    });
  }
  
  if (breakdown.styleSynergy < 3 && myFruit) {
    const betterStyles = weapons.filter(w => 
      w.category === 'Fighting Style' && 
      (w.synergies.perfect.includes(myBuild.fruit) || w.synergies.good.includes(myBuild.fruit))
    ).slice(0, 1);
    
    betterStyles.forEach(bs => {
      counters.push({
        type: 'style',
        suggestion: translate('counter.switch_style').replace('{name}', bs.name),
        expectedImprovement: 6,
        priority: 'medium'
      });
    });
  }
  
  if (breakdown.statMatch < 0 && myFruit) {
    const statKey = myFruit.optimalStats.primary === 'melee' ? 'melee' : 
                    myFruit.optimalStats.primary === 'defense' ? 'defense' : 'fruit';
    counters.push({
      type: 'stat',
      suggestion: translate('counter.respec_stats').replace('{stat}', translate(statKey)),
      expectedImprovement: 5,
      priority: 'medium'
    });
  }
  
  // Generate tips based on matchup
  const tips: Tip[] = [];
  
  if (myFruit?.tags.includes('mobility')) {
    tips.push({
      category: 'positioning',
      text: translate('tip.mobility')
    });
  }
  
  if (rivalFruit?.tags.includes('zoning')) {
    tips.push({
      category: 'positioning',
      text: translate('tip.zoning')
    });
  }
  
  if (myFruit?.tags.includes('combo')) {
    tips.push({
      category: 'combo',
      text: translate('tip.combo_full')
    });
  }
  
  if (myFruit?.tags.includes('burst')) {
    tips.push({
      category: 'timing',
      text: translate('tip.burst')
    });
  }
  
  if (rivalFruit?.tags.includes('tankiness')) {
    tips.push({
      category: 'resource',
      text: translate('tip.tankiness')
    });
  }
  
  // Determine verdict
  let verdict: 'favorable' | 'neutral' | 'unfavorable';
  if (score >= 60) verdict = 'favorable';
  else if (score >= 40) verdict = 'neutral';
  else verdict = 'unfavorable';
  
  // Calculate confidence
  const completeness = [
    myBuild.fruit, myBuild.weapon, myBuild.fightingStyle,
    rivalBuild.fruit, rivalBuild.weapon
  ].filter(Boolean).length / 5;
  
  let confidence: 'high' | 'medium' | 'low';
  if (completeness >= 0.8) confidence = 'high';
  else if (completeness >= 0.6) confidence = 'medium';
  else confidence = 'low';
  
  // Generate share URL
  const shareUrl = `${window.location.origin}/simulator?my=${myBuild.fruit},${myBuild.weapon},${myBuild.fightingStyle},${myBuild.level}&rival=${rivalBuild.fruit},${rivalBuild.weapon}`;
  
  return {
    score,
    verdict,
    confidence,
    breakdown,
    reasons: reasons.sort((a, b) => b.impact - a.impact),
    counters: counters.sort((a, b) => b.expectedImprovement - a.expectedImprovement),
    tips,
    shareUrl
  };
}

export { fruits, weapons, matchups, presetsData };
