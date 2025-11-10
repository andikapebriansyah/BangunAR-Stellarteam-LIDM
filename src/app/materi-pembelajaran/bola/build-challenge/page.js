/**
 * Bola Build Challenge Page - Gelang dari Bola-Bola
 * Uses modular 3D builder components - PERSIS SAMA dengan Tabung
 */

'use client';

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as THREE from 'three';

// Configuration
import { sphereBraceletBlueprint } from '@/components/3d-builder/config/shapeBlueprints';

// Shape Builder
import { SphereBuilder } from '@/components/3d-builder/shape-builders/SphereBuilder';

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
import { BolaInstructionPanel } from '@/components/3d-builder/instruction-panel/BolaInstructionPanel';

export default function BolaBuildChallenge() {
  const router = useRouter();
  const instructionPanelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [customSizes, setCustomSizes] = useState({
    large: { radius: 8 } // 8mm (ukuran realistis untuk manik gelang)
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [sizesConfirmed, setSizesConfirmed] = useState(false); // FALSE - WAJIB konfirmasi dulu!
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0); // Trigger untuk force re-render blueprint
  
  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Validate custom sizes - 5-13mm (ukuran manik gelang realistis)
  useEffect(() => {
    const errors = {};
    
    // Min/Max validation (5-13mm)
    if (customSizes.large.radius < 5 || customSizes.large.radius > 13) {
      errors.radius = 'Jari-jari: 5-13 mm';
    }
    
    setValidationErrors(errors);
  }, [customSizes]);
  
  // Refs for 3D scene
  const sceneRef = useRef(new THREE.Scene());
  const draggableObjectsRef = useRef([]);
  const targetGroupRef = useRef(null);
  
  // Initialize shape builder
  const shapeBuilder = useMemo(() => new SphereBuilder(false), []);
  
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
  } = useBuilderState(sphereBraceletBlueprint);
  
  // Hotspot zones management
  const {
    hotspotZonesRef,
    replacedItemsRef,
    createHotspotZones,
    hideHotspotsForItem
  } = useHotspotZones(
    sceneRef,
    sphereBraceletBlueprint,
    shapeBuilder,
    selectedSize,
    itemParts
  );
  
  // Completion checking
  const { checkCompletion, analyzeBuilding } = useCompletionCheck(
    sphereBraceletBlueprint,
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
  const handleSizeChange = useCallback((sphereType, dimension, value) => {
    setCustomSizes(prev => ({
      ...prev,
      [sphereType]: {
        ...prev[sphereType],
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
      setCompletionMessage('✅ Ukuran dikonfirmasi! Sekarang spawn komponen untuk mulai merakit.');
    }
  }, [validationErrors, setCompletionMessage]);
  
  /**
   * Spawn a sphere component - SAMA dengan spawn tabung
   */
  const handleSpawnComponent = useCallback((componentType, color, partType, params) => {
    // Check if sizes confirmed first - WAJIB!
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
    
    // Create sphere component with wireframe
    const sphereGroup = shapeBuilder.createSphereComponent(
      componentType,
      color,
      params,
      selectedSize
    );
    
    // Get spawn position
    const spawnPos = shapeBuilder.getSpawnPosition(
      partType,
      sphereBraceletBlueprint.spawnConfig
    );
    
    sphereGroup.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    
    // Add to scene
    sceneRef.current.add(sphereGroup);
    draggableObjectsRef.current.push(sphereGroup);
    
    // Mark as spawned
    markComponentSpawned(componentType);
    
    // Clear warning state
    setShowSizeWarning(false);
    
    setCompletionMessage(`✨ Bola ditambahkan. Drag ke posisi di gelang!`);
  }, [shapeBuilder, selectedSize, spawnedComponents, markComponentSpawned, setCompletionMessage, sizesConfirmed]);
  
  /**
   * Handle part filled (after snap animation)
   */
  const handlePartFilled = useCallback((itemIndex, partId) => {
    markPartFilled(itemIndex, partId);
    setCompletionMessage(`✅ Bola #${itemIndex + 1} terpasang di gelang!`);
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
      // Clean up group children
      if (obj.children) {
        obj.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      }
    });
    
    draggableObjectsRef.current = [];
    replacedItemsRef.current.clear();
    
    // Reset state
    resetState();
    
    // CRITICAL: Remove targetGroup dan hotspots untuk force re-render
    if (targetGroupRef.current) {
      sceneRef.current.remove(targetGroupRef.current);
      targetGroupRef.current.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      targetGroupRef.current = null;
    }
    
    // Remove hotspot zones
    if (hotspotZonesRef.current) {
      hotspotZonesRef.current.forEach(zone => {
        sceneRef.current.remove(zone);
        if (zone.geometry) zone.geometry.dispose();
        if (zone.material) zone.material.dispose();
      });
      hotspotZonesRef.current = [];
    }
    
    // Increment reset trigger to force BuilderScene re-render
    setResetTrigger(prev => prev + 1);
  }, [resetState, replacedItemsRef]);
  
  /**
   * Navigate to result page
   */
  const goToLearnResult = useCallback(() => {
    const buildResult = {
      challengeType: 'bracelet-sphere-3d',
      completed: true,
      completedAt: new Date().toISOString(),
      method: '3D Assembly',
      customSizes: customSizes,
      items: itemParts.map((parts, index) => ({
        index,
        sphereNumber: index + 1,
        filled: parts.sphere?.filled || false,
        color: sphereBraceletBlueprint.items[index].color
      }))
    };
    localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    router.push('/materi-pembelajaran/bola/learn-result');
  }, [router, itemParts, customSizes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 font-sans">
      {/* Header - More Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/materi-pembelajaran/bola">
            <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <span className="text-xl">←</span>
              <span className="font-medium hidden sm:inline">Kembali</span>
            </button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-lg sm:text-xl font-bold">🧩 Build Challenge Bola</h1>
            <p className="text-xs text-blue-100 hidden sm:block">Mode Kreatif - Rakit Gelang</p>
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
            
            {/* Target Example - Improved Visual */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <h2 className="font-semibold text-gray-800">Target: Gelang Bola Pelangi</h2>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600 rounded-xl p-8 min-h-[180px] flex items-center justify-center relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="text-center relative z-10">
                  {/* Bracelet Circle Preview */}
                  <div className="relative mx-auto mb-4" style={{ width: '140px', height: '140px' }}>
                    {/* Draw 9 spheres in circle */}
                    {Array.from({ length: 9 }, (_, i) => {
                      const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
                      const radius = 52;
                      const x = 70 + Math.cos(angle) * radius;
                      const y = 70 + Math.sin(angle) * radius;
                      const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#4B0082', '#8B00FF', '#FF1493'];
                      
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            width: '20px',
                            height: '20px',
                            left: `${x - 10}px`,
                            top: `${y - 10}px`,
                            background: `radial-gradient(circle at 30% 30%, ${colors[i]}ee, ${colors[i]}aa, ${colors[i]})`,
                            border: '2px solid rgba(255,255,255,0.4)',
                            boxShadow: `
                              0 3px 10px ${colors[i]}99,
                              inset 0 1px 3px rgba(255,255,255,0.6),
                              inset 0 -2px 4px rgba(0,0,0,0.3)
                            `
                          }}
                        />
                      );
                    })}
                    
                    {/* Floor shadow */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black/25 rounded-full blur-lg"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base drop-shadow-lg">🎯 Gelang 9 Bola Pelangi</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      Susun 9 bola membentuk lingkaran gelang!<br/>
                      <span className="inline-flex items-center gap-1 font-semibold text-red-400">🔴</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-orange-400 mx-0.5">🟠</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-yellow-400 mx-0.5">🟡</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-green-400 mx-0.5">🟢</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-cyan-400 mx-0.5">🔵</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-400 mx-0.5">🔵</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-purple-400 mx-0.5">🟣</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-violet-400 mx-0.5">🟣</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-pink-400"></span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction & Customization Panel */}
            <BolaInstructionPanel
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
                        blueprint={sphereBraceletBlueprint}
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
                    blueprint={sphereBraceletBlueprint}
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
                    resetTrigger={resetTrigger}
                  />
                  
                  {/* Mobile: Dropdown Component Selector at Bottom of Scene */}
                  {isMobile && (
                    <div className="absolute bottom-0 left-0 right-0 z-10">
                      <FloatingComponentMenu
                        blueprint={sphereBraceletBlueprint}
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
                    ✨ Drop di sini untuk pasang bola!
                  </p>
                </div>
              )}
              
              {/* Progress Indicator */}
              <ProgressTracker
                blueprint={sphereBraceletBlueprint}
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
