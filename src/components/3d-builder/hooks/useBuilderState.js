/**
 * useBuilderState Hook
 * Centralized state management for 3D builder
 */

import { useState, useCallback } from 'react';

export function useBuilderState(blueprint) {
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih komponen 2D dan rangkai menjadi tabung!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [selectedSize, setSelectedSize] = useState(1);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // Parts tracking (which parts are filled)
  const [itemParts, setItemParts] = useState(() => {
    return blueprint.items.map(item => {
      const parts = {};
      item.parts.forEach(part => {
        parts[part.id] = { filled: false, type: part.accepts };
      });
      return parts;
    });
  });
  
  // Component spawn tracking (prevent duplicates)
  const [spawnedComponents, setSpawnedComponents] = useState(() => {
    const components = {};
    blueprint.items.forEach(item => {
      item.parts.forEach(part => {
        components[part.componentType] = false;
      });
    });
    return components;
  });
  
  // Reset state
  const resetState = useCallback(() => {
    setItemParts(blueprint.items.map(item => {
      const parts = {};
      item.parts.forEach(part => {
        parts[part.id] = { filled: false, type: part.accepts };
      });
      return parts;
    }));
    
    setSpawnedComponents(prev => {
      const reset = {};
      Object.keys(prev).forEach(key => {
        reset[key] = false;
      });
      return reset;
    });
    
    setCompletionMessage('Scene direset. Pilih komponen 2D dan mulai rakit!');
    setIsLevelComplete(false);
    setAnalysisResult(null);
    setHoveredZone(null);
  }, [blueprint]);
  
  // Mark component as spawned
  const markComponentSpawned = useCallback((componentType) => {
    setSpawnedComponents(prev => ({
      ...prev,
      [componentType]: true
    }));
  }, []);
  
  // Mark part as filled
  const markPartFilled = useCallback((itemIndex, partId) => {
    setItemParts(prev => {
      const newParts = JSON.parse(JSON.stringify(prev));
      
      // Debug logging
      console.log('markPartFilled called:', { itemIndex, partId, totalItems: newParts.length });
      console.log('itemParts structure:', newParts);
      
      // Defensive check
      if (!newParts[itemIndex]) {
        console.error(`Invalid itemIndex: ${itemIndex}. Array length: ${newParts.length}`);
        return prev;
      }
      
      if (!newParts[itemIndex][partId]) {
        console.error(`Invalid partId: ${partId} for itemIndex: ${itemIndex}`);
        console.error('Available parts:', Object.keys(newParts[itemIndex]));
        return prev;
      }
      
      newParts[itemIndex][partId].filled = true;
      return newParts;
    });
  }, []);
  
  return {
    // State
    completionMessage,
    isLevelComplete,
    selectedSize,
    analysisResult,
    showAnalysis,
    hoveredZone,
    itemParts,
    spawnedComponents,
    
    // Setters
    setCompletionMessage,
    setIsLevelComplete,
    setSelectedSize,
    setAnalysisResult,
    setShowAnalysis,
    setHoveredZone,
    setItemParts,
    
    // Actions
    resetState,
    markComponentSpawned,
    markPartFilled
  };
}
