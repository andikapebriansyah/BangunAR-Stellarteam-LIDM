/**
 * Tabung Build Challenge Page - REFACTORED VERSION
 * Uses modular 3D builder components for clean, maintainable code
 * Responsive UI with floating menu for mobile, sidebar for desktop
 */

'use client';

import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as THREE from 'three';

// Configuration
import { cylinderBlueprint } from '@/components/3d-builder/config/shapeBlueprints';

// Shape Builder
import { CylinderBuilder } from '@/components/3d-builder/shape-builders/CylinderBuilder';

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
import { InstructionPanel } from '@/components/3d-builder/instruction-panel/TabungInstructionPanel';

export default function TabungBuildChallenge() {
  const router = useRouter();
  const instructionPanelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [customSizes, setCustomSizes] = useState({
    large: { radius: 5, height: 15 },
    medium: { radius: 4, height: 12 },
    small: { radius: 3, height: 10 }
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [sizesConfirmed, setSizesConfirmed] = useState(false);
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
  
  // Validate custom sizes
  useEffect(() => {
    const errors = {};
    
    // Medium must be smaller than Large
    if (customSizes.medium.radius >= customSizes.large.radius) {
      errors.mediumRadius = 'Jari-jari Sedang harus lebih kecil dari Besar';
    }
    if (customSizes.medium.height >= customSizes.large.height) {
      errors.mediumHeight = 'Tinggi Sedang harus lebih kecil dari Besar';
    }
    
    // Small must be smaller than Medium
    if (customSizes.small.radius >= customSizes.medium.radius) {
      errors.smallRadius = 'Jari-jari Kecil harus lebih kecil dari Sedang';
    }
    if (customSizes.small.height >= customSizes.medium.height) {
      errors.smallHeight = 'Tinggi Kecil harus lebih kecil dari Sedang';
    }
    
    // Min/Max validation (1-20 range)
    if (customSizes.large.radius < 3 || customSizes.large.radius > 20) {
      errors.largeRadius = 'Jari-jari Besar: 3-20';
    }
    if (customSizes.large.height < 5 || customSizes.large.height > 30) {
      errors.largeHeight = 'Tinggi Besar: 5-30';
    }
    if (customSizes.medium.radius < 2 || customSizes.medium.radius > 19) {
      errors.mediumRadiusRange = 'Jari-jari Sedang: 2-19';
    }
    if (customSizes.medium.height < 4 || customSizes.medium.height > 29) {
      errors.mediumHeightRange = 'Tinggi Sedang: 4-29';
    }
    if (customSizes.small.radius < 1 || customSizes.small.radius > 18) {
      errors.smallRadiusRange = 'Jari-jari Kecil: 1-18';
    }
    if (customSizes.small.height < 3 || customSizes.small.height > 28) {
      errors.smallHeightRange = 'Tinggi Kecil: 3-28';
    }
    
    setValidationErrors(errors);
  }, [customSizes]);
  
  // Refs for 3D scene
  const sceneRef = useRef(new THREE.Scene());
  const draggableObjectsRef = useRef([]);
  const targetGroupRef = useRef(null);
  
  // Initialize shape builder
  const shapeBuilder = useMemo(() => new CylinderBuilder(false), []);
  
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
  } = useBuilderState(cylinderBlueprint);
  
  // Hotspot zones management
  const {
    hotspotZonesRef,
    replacedItemsRef,
    createHotspotZones,
    hideHotspotsForItem
  } = useHotspotZones(
    sceneRef,
    cylinderBlueprint,
    shapeBuilder,
    selectedSize,
    itemParts
  );
  
  // Completion checking
  const { checkCompletion, analyzeBuilding } = useCompletionCheck(
    cylinderBlueprint,
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
  const handleSizeChange = useCallback((cylinderType, dimension, value) => {
    setCustomSizes(prev => ({
      ...prev,
      [cylinderType]: {
        ...prev[cylinderType],
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
      cylinderBlueprint.spawnConfig
    );
    
    mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    
    // Add to scene
    sceneRef.current.add(mesh);
    draggableObjectsRef.current.push(mesh);
    
    // Mark as spawned
    markComponentSpawned(componentType);
    
    // Clear warning state
    setShowSizeWarning(false);
    
    const typeName = partType === 'circle' ? 'Lingkaran' : 'Selimut';
    const sizeName = componentType.includes('large') ? 'Besar' : 
                     componentType.includes('medium') ? 'Sedang' : 'Kecil';
    
    setCompletionMessage(`${typeName} ${sizeName} ditambahkan. Drag ke hotspot yang sesuai!`);
  }, [shapeBuilder, selectedSize, spawnedComponents, markComponentSpawned, setCompletionMessage, sizesConfirmed]);
  
  /**
   * Handle part filled (after snap animation)
   */
  const handlePartFilled = useCallback((itemIndex, partId) => {
    markPartFilled(itemIndex, partId);
    setCompletionMessage(`✅ ${
      partId === 'bottom' ? 'Alas' : 
      partId === 'top' ? 'Tutup' : 
      'Selimut'
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
    
    // CRITICAL: Remove targetGroup dan hotspots untuk force re-render
    if (targetGroupRef.current) {
      sceneRef.current.remove(targetGroupRef.current);
      // Dispose geometries and materials
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
      challengeType: 'tower-cylinder-2d',
      completed: true,
      completedAt: new Date().toISOString(),
      method: '2D Assembly',
      customSizes: customSizes, // Include custom sizes
      items: itemParts.map((parts, index) => ({
        index,
        parts: Object.entries(parts).map(([id, data]) => ({
          id,
          filled: data.filled
        }))
      }))
    };
    localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    router.push('/materi-pembelajaran/tabung/learn-result');
  }, [router, itemParts, customSizes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 font-sans">
      {/* Header - More Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/materi-pembelajaran/tabung">
            <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <span className="text-xl">←</span>
              <span className="font-medium hidden sm:inline">Kembali</span>
            </button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-lg sm:text-xl font-bold">🧩 Build Challenge Tabung</h1>
            <p className="text-xs text-blue-100 hidden sm:block">Mode Kreatif - Rakit Menara</p>
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
                <h2 className="font-semibold text-gray-800">Target: Menara Tabung Bertingkat</h2>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-2 border-slate-600 rounded-xl p-8 min-h-[180px] flex items-center justify-center relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="text-center relative z-10">
                  {/* Menara Tabung Polos - Clean Cylinder Stack */}
                  <div className="relative mx-auto mb-4" style={{ width: '90px', height: '165px' }}>
                    
                    {/* Tabung Kecil (Atas) - Red/Merah - Plain Cylinder */}
                    <div className="absolute bottom-[115px] left-1/2 transform -translate-x-1/2">
                      {/* Top Circle */}
                      <div 
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 rounded-full z-10"
                        style={{
                          width: '36px',
                          height: '8px',
                          background: 'radial-gradient(ellipse at 50% 35%, #FF8B7A 0%, #FF5942 50%, #D94532 100%)',
                          boxShadow: '0 2px 6px rgba(255, 89, 66, 0.6)'
                        }}
                      />
                      {/* Cylinder Body */}
                      <div 
                        className="relative overflow-hidden"
                        style={{
                          width: '36px',
                          height: '44px',
                          background: 'linear-gradient(to right, #D94532 0%, #FF5942 45%, #FF5942 55%, #D94532 100%)',
                          boxShadow: `
                            0 6px 14px rgba(255, 89, 66, 0.5),
                            inset -3px 0 6px rgba(0, 0, 0, 0.25),
                            inset 3px 0 6px rgba(255, 255, 255, 0.15)
                          `
                        }}
                      >
                        {/* Highlight stripe */}
                        <div className="absolute inset-y-0 left-[40%] w-[20%] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                      {/* Bottom Circle */}
                      <div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full"
                        style={{
                          width: '36px',
                          height: '7px',
                          background: 'radial-gradient(ellipse at 50% 65%, #D94532 0%, #B8371F 50%, #8B2514 100%)',
                          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)'
                        }}
                      />
                    </div>
                    
                    {/* Tabung Sedang (Tengah) - Blue/Biru - Plain Cylinder */}
                    <div className="absolute bottom-[60px] left-1/2 transform -translate-x-1/2">
                      {/* Top Circle */}
                      <div 
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 rounded-full z-10"
                        style={{
                          width: '52px',
                          height: '10px',
                          background: 'radial-gradient(ellipse at 50% 35%, #6B9FFF 0%, #4169E1 50%, #2E4DB8 100%)',
                          boxShadow: '0 3px 8px rgba(65, 105, 225, 0.6)'
                        }}
                      />
                      {/* Cylinder Body */}
                      <div 
                        className="relative overflow-hidden"
                        style={{
                          width: '52px',
                          height: '50px',
                          background: 'linear-gradient(to right, #2E4DB8 0%, #4169E1 45%, #4169E1 55%, #2E4DB8 100%)',
                          boxShadow: `
                            0 8px 18px rgba(65, 105, 225, 0.5),
                            inset -4px 0 8px rgba(0, 0, 0, 0.25),
                            inset 4px 0 8px rgba(255, 255, 255, 0.15)
                          `
                        }}
                      >
                        {/* Highlight stripe */}
                        <div className="absolute inset-y-0 left-[40%] w-[20%] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                      {/* Bottom Circle */}
                      <div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full"
                        style={{
                          width: '52px',
                          height: '9px',
                          background: 'radial-gradient(ellipse at 50% 65%, #2E4DB8 0%, #1E3A8A 50%, #14285C 100%)',
                          boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.4)'
                        }}
                      />
                    </div>
                    
                    {/* Tabung Besar (Bawah) - Brown/Coklat - Plain Cylinder */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      {/* Top Circle */}
                      <div 
                        className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 rounded-full z-10"
                        style={{
                          width: '70px',
                          height: '13px',
                          background: 'radial-gradient(ellipse at 50% 35%, #B8864D 0%, #8B5A2B 50%, #6B4423 100%)',
                          boxShadow: '0 4px 10px rgba(139, 90, 43, 0.6)'
                        }}
                      />
                      {/* Cylinder Body */}
                      <div 
                        className="relative overflow-hidden"
                        style={{
                          width: '70px',
                          height: '60px',
                          background: 'linear-gradient(to right, #6B4423 0%, #8B5A2B 45%, #8B5A2B 55%, #6B4423 100%)',
                          boxShadow: `
                            0 10px 22px rgba(139, 90, 43, 0.6),
                            inset -5px 0 10px rgba(0, 0, 0, 0.3),
                            inset 5px 0 10px rgba(255, 255, 255, 0.1)
                          `
                        }}
                      >
                        {/* Highlight stripe */}
                        <div className="absolute inset-y-0 left-[40%] w-[20%] bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
                      </div>
                      {/* Bottom Circle */}
                      <div 
                        className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rounded-full"
                        style={{
                          width: '70px',
                          height: '11px',
                          background: 'radial-gradient(ellipse at 50% 65%, #6B4423 0%, #4A2F1A 50%, #2D1B0F 100%)',
                          boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.5)'
                        }}
                      />
                    </div>
                    
                    {/* Floor shadow */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/25 rounded-full blur-lg"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base drop-shadow-lg">🎯 Menara 3 Tingkat</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      Susun dari besar ke kecil:<br/>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-400">🟫 Coklat</span> → 
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-300 mx-1">🟦 Biru</span> → 
                      <span className="inline-flex items-center gap-1 font-semibold text-red-400">🟥 Merah</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction & Customization Panel */}
            <InstructionPanel
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
                        blueprint={cylinderBlueprint}
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
                    blueprint={cylinderBlueprint}
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
                        blueprint={cylinderBlueprint}
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
                      'Selimut'
                    }!
                  </p>
                </div>
              )}
              
              {/* Progress Indicator */}
              <ProgressTracker
                blueprint={cylinderBlueprint}
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
