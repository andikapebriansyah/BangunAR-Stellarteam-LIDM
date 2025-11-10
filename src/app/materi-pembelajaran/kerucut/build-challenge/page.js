/**
 * Kerucut Build Challenge Page - MATCHES TABUNG UI 100%
 * Uses modular 3D builder components for clean, maintainable code
 * Responsive UI with floating menu for mobile, sidebar for desktop
 */

'use client';

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as THREE from 'three';

// Configuration
import { rocketBaseBlueprint } from '@/components/3d-builder/config/shapeBlueprints';

// Shape Builder
import { ConeBuilder } from '@/components/3d-builder/shape-builders/ConeBuilder';

// Core Components
import { BuilderScene } from '@/components/3d-builder/core/BuilderScene';

// Hooks
import { useBuilderState } from '@/components/3d-builder/hooks/useBuilderState';
import { useHotspotZones } from '@/components/3d-builder/hooks/useHotspotZones';
import { useCompletionCheck } from '@/components/3d-builder/hooks/useCompletionCheck';

// UI Components
import { ComponentPanel } from '@/components/3d-builder/ui/ComponentPanel';
import { FloatingComponentMenu } from '@/components/3d-builder/ui/FloatingComponentMenu';
import { ProgressTracker } from '@/components/3d-builder/ui/ProgressTracker';
import { AnalysisModal } from '@/components/3d-builder/ui/AnalysisModal';
import { BuilderControls } from '@/components/3d-builder/ui/BuilderControls';
import { KerucutInstructionPanel } from '@/components/3d-builder/instruction-panel/KerucutInstructionPanel';

export default function KerucutBuildChallenge() {
  const router = useRouter();
  const instructionPanelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [customSizes, setCustomSizes] = useState({
    base: { radius: 12, height: 10 },
    body: { radius: 5, height: 25 },
    nose: { radius: 5, height: 12 }
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [sizesConfirmed, setSizesConfirmed] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  
  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Validate custom sizes
  useEffect(() => {
    const errors = {};
    
    // Base radius must be larger than body/nose
    if (customSizes.base.radius <= customSizes.body.radius) {
      errors.baseRadius = 'Jari-jari kerucut dasar harus lebih besar dari badan roket!';
    }
    if (customSizes.base.radius <= customSizes.nose.radius) {
      errors.baseRadius2 = 'Jari-jari kerucut dasar harus lebih besar dari hidung roket!';
    }
    
    // Body and nose radius should match
    if (customSizes.body.radius !== customSizes.nose.radius) {
      errors.alignment = 'Jari-jari badan roket dan hidung harus sama untuk struktur stabil!';
    }
    
    // Reasonable height ratios
    if (customSizes.body.height < customSizes.base.height + customSizes.nose.height) {
      errors.proportion = 'Tinggi badan roket harus lebih besar dari total tinggi kedua kerucut!';
    }
    
    setValidationErrors(errors);
  }, [customSizes]);
  
  // Refs for 3D scene
  const sceneRef = useRef(new THREE.Scene());
  const draggableObjectsRef = useRef([]);
  const targetGroupRef = useRef(null);
  
  // Initialize shape builder
  const shapeBuilder = useMemo(() => new ConeBuilder(false), []);
  
  // State management
  const {
    completionMessage,
    isLevelComplete,
    selectedSize,
    analysisResult,
    showAnalysis,
    hoveredZone,
    itemParts,
    spawnedComponents,
    setCompletionMessage,
    setIsLevelComplete,
    setAnalysisResult,
    setShowAnalysis,
    setHoveredZone,
    resetState,
    markComponentSpawned,
    markPartFilled
  } = useBuilderState(rocketBaseBlueprint);
  
  // Hotspot zones management
  const {
    hotspotZonesRef,
    replacedItemsRef,
    createHotspotZones,
    hideHotspotsForItem
  } = useHotspotZones(
    sceneRef,
    rocketBaseBlueprint,
    shapeBuilder,
    selectedSize,
    itemParts
  );
  
  // Completion checking
  const { checkCompletion, analyzeBuilding } = useCompletionCheck(
    rocketBaseBlueprint,
    itemParts,
    shapeBuilder,
    selectedSize,
    setCompletionMessage,
    setIsLevelComplete,
    setAnalysisResult
  );
  
  /**
   * Handle custom size change
   */
  const handleSizeChange = useCallback((componentType, dimension, value) => {
    setCustomSizes(prev => ({
      ...prev,
      [componentType]: {
        ...prev[componentType],
        [dimension]: value
      }
    }));
  }, []);
  
  /**
   * Confirm sizes and enable spawning
   */
  const handleConfirmSizes = useCallback(() => {
    if (Object.keys(validationErrors).length === 0) {
      setSizesConfirmed(true);
      setCompletionMessage('✅ Ukuran dikonfirmasi! Sekarang spawn komponen untuk mulai merakit roket.');
    }
  }, [validationErrors, setCompletionMessage]);
  
  /**
   * Spawn a 2D component
   */
  const handleSpawnComponent = useCallback((componentType, color, partType, params) => {
    // Check if sizes confirmed first
    if (!sizesConfirmed) {
      setCompletionMessage('⚠️ HARAP ATUR UKURAN CUSTOM TERLEBIH DAHULU!');
      setShowSizeWarning(true);
      
      // Scroll to instruction panel
      if (instructionPanelRef.current) {
        instructionPanelRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      // Stop blinking after 5 seconds
      setTimeout(() => setShowSizeWarning(false), 5000);
      return;
    }
    
    // Check if already spawned
    if (spawnedComponents[componentType]) {
      setCompletionMessage('⚠️ Komponen ini sudah di-spawn! Tidak bisa spawn lagi.');
      return;
    }
    
    // Create 2D component mesh
    const mesh = shapeBuilder.create2DComponent(
      componentType,
      partType,
      color,
      params,
      selectedSize
    );
    
    // Get spawn position
    const spawnPos = shapeBuilder.getSpawnPosition(
      partType,
      rocketBaseBlueprint.spawnConfig
    );
    
    mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    
    // Add to scene
    sceneRef.current.add(mesh);
    draggableObjectsRef.current.push(mesh);
    
    // Mark as spawned
    markComponentSpawned(componentType);
    
    // Clear warning state
    setShowSizeWarning(false);
    
    const typeName = partType === 'circle' ? 'Lingkaran' : 
                     partType === 'sector' ? 'Juring' : 'Selimut';
    const itemName = componentType.includes('base') ? 'Kerucut Dasar' : 
                     componentType.includes('body') ? 'Badan Roket' : 'Hidung Roket';
    
    setCompletionMessage(`${typeName} ${itemName} ditambahkan. Drag ke hotspot yang sesuai!`);
  }, [shapeBuilder, selectedSize, spawnedComponents, markComponentSpawned, setCompletionMessage, sizesConfirmed]);
  
  /**
   * Handle part filled (after snap animation)
   */
  const handlePartFilled = useCallback((itemIndex, partId) => {
    markPartFilled(itemIndex, partId);
    setCompletionMessage(`✅ ${
      partId === 'bottom' ? 'Alas' : 
      partId === 'top' ? 'Tutup' : 
      partId === 'side' ? 'Selimut' :
      'Komponen'
    } terpasang!`);
  }, [markPartFilled, setCompletionMessage]);
  
  /**
   * Reset scene
   */
  const handleReset = useCallback(() => {
    // Remove all draggable objects
    draggableObjectsRef.current.forEach(obj => {
      sceneRef.current.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    
    draggableObjectsRef.current = [];
    replacedItemsRef.current.clear();
    
    // Reset state
    resetState();
    
    // Trigger re-render of blueprint
    if (targetGroupRef.current) {
      sceneRef.current.remove(targetGroupRef.current);
      targetGroupRef.current = null;
    }
    
    // Will be re-created by BuilderScene
  }, [resetState, replacedItemsRef]);
  
  /**
   * Navigate to result page
   */
  const goToLearnResult = useCallback(() => {
    const buildResult = {
      challengeType: 'rocket-cone-2d',
      completed: true,
      completedAt: new Date().toISOString(),
      method: '2D Assembly',
      customSizes: customSizes,
      items: itemParts.map((parts, index) => ({
        index,
        parts: Object.entries(parts).map(([id, data]) => ({
          id,
          filled: data.filled
        }))
      }))
    };
    localStorage.setItem('kerucutBuildResult', JSON.stringify(buildResult));
    router.push('/materi-pembelajaran/kerucut/learn-result');
  }, [router, itemParts, customSizes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 font-sans">
      {/* Header - More Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/materi-pembelajaran">
            <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <span className="text-xl">←</span>
              <span className="font-medium hidden sm:inline">Kembali</span>
            </button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-lg sm:text-xl font-bold">🚀 Build Challenge Roket</h1>
            <p className="text-xs text-blue-100 hidden sm:block">Mode Kreatif - Rakit Peluncur</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className={`${isMobile ? 'px-3 py-4' : 'px-4 py-6 max-w-[1920px] mx-auto'}`}>
        
        {/* Desktop: Full Width | Mobile: Stacked */}
        <div className="space-y-4">
          
          {/* Main Content Area */}
          <div className="space-y-4">
            
            {/* Target Example - Rocket Visual */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <h2 className="font-semibold text-gray-800">Target: Roket Peluncur Mini</h2>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600 rounded-xl p-8 min-h-[180px] flex items-center justify-center relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="text-center relative z-10">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base drop-shadow-lg">🚀 Roket 3 Bagian</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      Susun dari bawah ke atas:<br/>
                      <span className="inline-flex items-center gap-1 font-semibold text-orange-400">🟧 Kerucut Dasar</span> → 
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-300 mx-1">⬜ Badan Tabung</span> → 
                      <span className="inline-flex items-center gap-1 font-semibold text-red-400">🟥 Hidung Kerucut</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction & Customization Panel */}
            <KerucutInstructionPanel
              ref={instructionPanelRef}
              customSizes={customSizes}
              onSizeChange={handleSizeChange}
              validationErrors={validationErrors}
              onConfirmSizes={handleConfirmSizes}
              shouldBlink={showSizeWarning}
              sizesConfirmed={sizesConfirmed}
            />

            {/* Construction Area with Integrated Sidebar (Desktop) */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏗️</span>
                  </div>
                  <h2 className="font-semibold text-gray-800">Area Konstruksi 3D</h2>
                </div>
                {isMobile && (
                  <div className="text-xs text-gray-500">
                    Drag & Drop
                  </div>
                )}
              </div>
              
              {/* Scene with responsive height + Sidebar Layout for Desktop */}
              <div className={`relative ${isMobile ? 'h-[60vh]' : 'h-[600px] flex gap-3'}`}>
                
                {/* Desktop: Left Sidebar for Component Panel (20%) */}
                {!isMobile && (
                  <div className="w-[280px] flex-shrink-0">
                    <div className="h-full">
                      <ComponentPanel
                        blueprint={rocketBaseBlueprint}
                        spawnedComponents={spawnedComponents}
                        onSpawnComponent={handleSpawnComponent}
                        compact={true}
                      />
                    </div>
                  </div>
                )}
                
                {/* Main 3D Scene Area (80% desktop, 100% mobile) */}
                <div className={`${isMobile ? 'w-full h-full' : 'flex-1'} relative`}>
                  <BuilderScene
                    blueprint={rocketBaseBlueprint}
                    shapeBuilder={shapeBuilder}
                    sceneRef={sceneRef}
                    draggableObjectsRef={draggableObjectsRef}
                    targetGroupRef={targetGroupRef}
                    hotspotZonesRef={hotspotZonesRef}
                    replacedItemsRef={replacedItemsRef}
                    createHotspotZones={createHotspotZones}
                    selectedSize={selectedSize}
                    itemParts={itemParts}
                    onPartFilled={handlePartFilled}
                    setHoveredZone={setHoveredZone}
                  />
                  
                  {/* Mobile: Dropdown Component Selector at Bottom of Scene */}
                  {isMobile && (
                    <div className="absolute bottom-0 left-0 right-0 z-10">
                      <FloatingComponentMenu
                        blueprint={rocketBaseBlueprint}
                        spawnedComponents={spawnedComponents}
                        onSpawnComponent={handleSpawnComponent}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hovering Zone Info */}
              {hoveredZone && (
                <div className="mt-3 bg-green-50 border border-green-300 rounded-lg p-2 animate-pulse">
                  <p className="text-xs text-green-800 text-center font-medium">
                    ✨ Drop di sini untuk pasang {
                      hoveredZone.zoneType === 'bottom' ? 'Alas' : 
                      hoveredZone.zoneType === 'top' ? 'Tutup' : 
                      hoveredZone.zoneType === 'side' ? 'Selimut' :
                      'Komponen'
                    }!
                  </p>
                </div>
              )}
              
              {/* Progress Indicator */}
              <ProgressTracker
                blueprint={rocketBaseBlueprint}
                itemParts={itemParts}
              />
              
              {/* Status Message & Controls */}
              <div className="mt-4 space-y-3">
                {showSizeWarning ? (
                  <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 animate-pulse shadow-lg">
                    <p className="text-base font-bold text-red-900 text-center flex items-center justify-center">
                      <span className="text-2xl mr-2 animate-bounce">⚠️</span>
                      HARAP ATUR UKURAN CUSTOM TERLEBIH DAHULU!
                    </p>
                    <p className="text-sm text-red-700 text-center mt-2">
                      Scroll ke atas → Klik tab <strong>&quot;⚙️ Ukuran Custom&quot;</strong> → Atur ukuran → Klik <strong>&quot;Konfirmasi&quot;</strong>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center">{completionMessage}</p>
                )}
                
                <BuilderControls
                  onCheck={checkCompletion}
                  onReset={handleReset}
                  isMobile={isMobile}
                  performanceMode={false}
                  onTogglePerformance={() => {}}
                />
              </div>
            </div>

            {/* Completion Button */}
            <button 
              onClick={isLevelComplete ? goToLearnResult : checkCompletion}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all
                ${isLevelComplete 
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
            >
              {isLevelComplete ? '✅ Lihat Hasil Pembelajaran' : '🧩 Cek Kemajuan Rakit'}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <AnalysisModal
          analysisResult={analysisResult}
          onClose={() => setShowAnalysis(false)}
        />
      )}
    </div>
  );
}
