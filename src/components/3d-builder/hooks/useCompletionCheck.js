/**
 * useCompletionCheck Hook
 * Handles completion validation and analysis
 */

import { useCallback } from 'react';

export function useCompletionCheck(
  blueprint,
  itemParts,
  shapeBuilder,
  selectedSize,
  setCompletionMessage,
  setIsLevelComplete,
  setAnalysisResult
) {
  /**
   * Check if all parts are completed
   */
  const checkCompletion = useCallback(() => {
    let totalParts = 0;
    let filledParts = 0;
    
    itemParts.forEach((parts, index) => {
      blueprint.items[index].parts.forEach(part => {
        totalParts++;
        if (parts[part.id]?.filled) {
          filledParts++;
        }
      });
    });
    
    if (filledParts === totalParts) {
      setCompletionMessage('🎉 Selamat! Semua tabung berhasil dirakit dengan sempurna!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = blueprint.challengeId;
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result
      const buildResult = {
        challengeId: challengeId,
        challengeName: blueprint.name,
        completedAt: new Date().toISOString(),
        totalParts: totalParts,
        method: '2D Assembly'
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Progress: ${filledParts}/${totalParts} komponen terpasang. ${totalParts - filledParts} komponen tersisa.`);
      setIsLevelComplete(false);
    }
  }, [itemParts, blueprint, setCompletionMessage, setIsLevelComplete]);
  
  /**
   * Analyze completed items and calculate totals
   */
  const analyzeBuilding = useCallback(() => {
    let totalVolume = 0;
    let totalSurfaceArea = 0;
    const breakdown = [];
    
    blueprint.items.forEach((item, index) => {
      // Check if all parts are filled
      const allFilled = item.parts.every(part => itemParts[index][part.id]?.filled);
      
      if (allFilled) {
        const scaledParams = {
          radius: item.params.radius * selectedSize,
          height: item.params.height * selectedSize
        };
        
        const calculations = shapeBuilder.calculate(scaledParams);
        
        totalVolume += parseFloat(calculations.volume);
        totalSurfaceArea += parseFloat(calculations.surfaceArea);
        
        breakdown.push({
          id: index + 1,
          type: item.type,
          volume: calculations.volume,
          surfaceArea: calculations.surfaceArea,
          radius: calculations.radius,
          height: calculations.height,
          name: item.displayName
        });
      }
    });

    if (breakdown.length === 0) {
      setCompletionMessage("Belum ada tabung yang selesai dirakit untuk dianalisis.");
      return;
    }

    setAnalysisResult({ 
      totalVolume: totalVolume.toFixed(2), 
      totalSurfaceArea: totalSurfaceArea.toFixed(2), 
      breakdown 
    });
    setCompletionMessage("Analisis menara tabung selesai.");
  }, [itemParts, blueprint, shapeBuilder, selectedSize, setCompletionMessage, setAnalysisResult]);
  
  return {
    checkCompletion,
    analyzeBuilding
  };
}
