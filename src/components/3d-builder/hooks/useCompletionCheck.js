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
      // Check shape type for appropriate message
      const isRocket = blueprint.shapeType === 'rocket';
      const isSphere = blueprint.shapeType === 'sphere';
      
      let successMessage;
      if (isRocket) {
        successMessage = '🎉 Selamat! Roket berhasil dirakit dengan sempurna!';
      } else if (isSphere) {
        successMessage = '🎉 Selamat! Gelang bola berhasil dirakit dengan sempurna!';
      } else {
        successMessage = '🎉 Selamat! Semua tabung berhasil dirakit dengan sempurna!';
      }
      
      setCompletionMessage(successMessage);
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
      const isRocket = blueprint.shapeType === 'rocket';
      const isSphere = blueprint.shapeType === 'sphere';
      
      let emptyMessage;
      if (isRocket) {
        emptyMessage = "Belum ada komponen roket yang selesai dirakit untuk dianalisis.";
      } else if (isSphere) {
        emptyMessage = "Belum ada bola yang selesai dirakit untuk dianalisis.";
      } else {
        emptyMessage = "Belum ada tabung yang selesai dirakit untuk dianalisis.";
      }
      
      setCompletionMessage(emptyMessage);
      return;
    }

    setAnalysisResult({ 
      totalVolume: totalVolume.toFixed(2), 
      totalSurfaceArea: totalSurfaceArea.toFixed(2), 
      breakdown 
    });
    
    const isRocket = blueprint.shapeType === 'rocket';
    const isSphere = blueprint.shapeType === 'sphere';
    
    let analysisMessage;
    if (isRocket) {
      analysisMessage = "Analisis roket selesai.";
    } else if (isSphere) {
      analysisMessage = "Analisis gelang bola selesai.";
    } else {
      analysisMessage = "Analisis menara tabung selesai.";
    }
    
    setCompletionMessage(analysisMessage);
  }, [itemParts, blueprint, shapeBuilder, selectedSize, setCompletionMessage, setAnalysisResult]);
  
  return {
    checkCompletion,
    analyzeBuilding
  };
}
