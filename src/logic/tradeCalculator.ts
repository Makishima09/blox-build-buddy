import fruitsData from '@/data/fruits.json';
import { Fruit, Trade, TradeAnalysis } from '@/types';

const fruits: Fruit[] = fruitsData as Fruit[];

export function getFruitById(id: string): Fruit | undefined {
  return fruits.find(f => f.id === id);
}

/**
 * Calcula si un trade es justo basado en los valores proporcionados
 */
export function calculateTradeFairness(trade: Trade, t: (key: string) => string): TradeAnalysis {
  // Calcular valores totales sumando todas las frutas
  const myValue = trade.myFruits.reduce((sum, item) => sum + item.value, 0);
  const theirValue = trade.theirFruits.reduce((sum, item) => sum + item.value, 0);

  // Calcular valores de mercado totales
  const myMarketValue = trade.myFruits.reduce((sum, item) => {
    const fruit = getFruitById(item.fruitId);
    return sum + (fruit?.value?.money || 0);
  }, 0);
  
  const theirMarketValue = trade.theirFruits.reduce((sum, item) => {
    const fruit = getFruitById(item.fruitId);
    return sum + (fruit?.value?.money || 0);
  }, 0);

  // Calcular diferencia
  const difference = theirValue - myValue;
  const totalValue = myValue + theirValue;
  const differencePercentage = totalValue > 0 ? (Math.abs(difference) / totalValue) * 100 : 0;

  // Calcular fairness score (0-100)
  // 100 = completamente justo, 0 = muy injusto
  let fairnessScore = 100;
  
  if (totalValue > 0) {
    // Penalizar por diferencia porcentual
    fairnessScore = Math.max(0, 100 - (differencePercentage * 2));
  }

  // Ajustar score basado en valores de mercado si están disponibles
  if (myMarketValue > 0 && theirMarketValue > 0) {
    const marketDifference = Math.abs(theirMarketValue - myMarketValue);
    const marketTotal = myMarketValue + theirMarketValue;
    const marketDiffPercentage = (marketDifference / marketTotal) * 100;
    
    // Si los valores del usuario difieren mucho del mercado, ajustar
    const userMarketDiff = Math.abs((myValue - myMarketValue) / myMarketValue) * 100;
    const theirMarketDiff = Math.abs((theirValue - theirMarketValue) / theirMarketValue) * 100;
    
    if (userMarketDiff > 20 || theirMarketDiff > 20) {
      fairnessScore = Math.max(0, fairnessScore - 10);
    }
  }

  // Determinar veredicto
  let verdict: TradeAnalysis['verdict'] = 'very_fair';
  if (fairnessScore >= 90) verdict = 'very_fair';
  else if (fairnessScore >= 75) verdict = 'fair';
  else if (fairnessScore >= 60) verdict = 'slightly_unfair';
  else if (fairnessScore >= 40) verdict = 'unfair';
  else verdict = 'very_unfair';

  // Generar recomendaciones
  const recommendations: TradeAnalysis['recommendations'] = [];

  if (differencePercentage > 15) {
    if (difference > 0) {
      recommendations.push({
        type: 'warning',
        text: t('trader.recommendation.you_losing_value')
      });
    } else {
      recommendations.push({
        type: 'info',
        text: t('trader.recommendation.you_gaining_value')
      });
    }
  }

  if (myMarketValue > 0 && theirMarketValue > 0) {
    const marketDiff = Math.abs(myMarketValue - theirMarketValue);
    if (marketDiff > myMarketValue * 0.2) {
      recommendations.push({
        type: 'suggestion',
        text: t('trader.recommendation.market_value_difference')
      });
    }
  }

  if (fairnessScore < 60) {
    recommendations.push({
      type: 'warning',
      text: t('trader.recommendation.consider_negotiating')
    });
  }

  // Calcular rango de valor justo
  const fairValueRange = {
    min: Math.max(0, myValue - (myValue * 0.1)),
    max: myValue + (myValue * 0.1),
    recommended: myValue
  };

  // Si hay diferencia significativa, ajustar el rango recomendado
  if (Math.abs(difference) > myValue * 0.1) {
    fairValueRange.recommended = myValue + (difference / 2);
  }

  // Encontrar frutas equivalentes basadas en la primera fruta del usuario
  const firstMyFruit = trade.myFruits[0];
  const equivalentFruits = firstMyFruit ? findEquivalentFruits(firstMyFruit.fruitId, firstMyFruit.value) : [];

  return {
    isFair: fairnessScore >= 75,
    fairnessScore: Math.round(fairnessScore),
    verdict,
    difference,
    differencePercentage: Math.round(differencePercentage * 10) / 10,
    recommendations,
    fairValueRange,
    equivalentFruits,
    marketValue: {
      myFruit: myMarketValue,
      theirFruit: theirMarketValue
    }
  };
}

/**
 * Encuentra frutas de valor similar para sugerencias
 */
function findEquivalentFruits(fruitId: string, value: number): string[] {
  const currentFruit = getFruitById(fruitId);
  if (!currentFruit) return [];

  // Buscar frutas del mismo tier con valor similar (±20%)
  const similarFruits = fruits
    .filter(f => {
      if (f.id === fruitId) return false;
      if (f.tier !== currentFruit.tier) return false;
      
      const fruitValue = f.value?.money || 0;
      if (fruitValue === 0) return false;
      
      const diffPercentage = Math.abs((fruitValue - value) / value) * 100;
      return diffPercentage <= 20;
    })
    .sort((a, b) => {
      const aValue = a.value?.money || 0;
      const bValue = b.value?.money || 0;
      const aDiff = Math.abs(aValue - value);
      const bDiff = Math.abs(bValue - value);
      return aDiff - bDiff;
    })
    .slice(0, 5)
    .map(f => f.id);

  return similarFruits;
}

/**
 * Obtiene el valor de mercado de una fruta
 */
export function getFruitMarketValue(fruitId: string): number {
  const fruit = getFruitById(fruitId);
  return fruit?.value?.money || 0;
}

/**
 * Calcula el valor justo recomendado para un trade
 */
export function calculateFairValue(myFruitId: string, theirFruitId: string, myValue: number): number {
  const myFruit = getFruitById(myFruitId);
  const theirFruit = getFruitById(theirFruitId);

  const myMarketValue = myFruit?.value?.money || 0;
  const theirMarketValue = theirFruit?.value?.money || 0;

  // Si ambos tienen valores de mercado, usar esos
  if (myMarketValue > 0 && theirMarketValue > 0) {
    // Calcular proporción
    const ratio = theirMarketValue / myMarketValue;
    return Math.round(myValue * ratio);
  }

  // Si solo uno tiene valor de mercado, ajustar proporcionalmente
  if (myMarketValue > 0 && theirMarketValue === 0) {
    // Asumir que la otra fruta tiene un valor similar basado en tier
    const tierMultiplier: Record<string, number> = {
      'S': 1.5,
      'A': 1.0,
      'B': 0.6,
      'C': 0.3
    };
    
    const myTierMultiplier = tierMultiplier[myFruit?.tier || 'C'] || 1;
    const theirTierMultiplier = tierMultiplier[theirFruit?.tier || 'C'] || 1;
    
    const ratio = theirTierMultiplier / myTierMultiplier;
    return Math.round(myValue * ratio);
  }

  // Si no hay valores de mercado, retornar el valor proporcionado
  return myValue;
}

