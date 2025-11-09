/**
 * AR Capability Detector
 * Checks if device is truly AR-capable (mobile with ARKit/ARCore)
 */

/**
 * Check if device is desktop/PC (not mobile)
 */
export function isDesktopDevice() {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check if mobile device
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Check if tablet (sometimes need special handling)
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
  
  const isDesktop = !isMobile || isTablet;
  
  console.log(`[Device Check] User Agent: ${userAgent}`);
  console.log(`[Device Check] isMobile: ${isMobile}, isTablet: ${isTablet}, isDesktop: ${isDesktop}`);
  
  return isDesktop;
}

/**
 * Check if device has camera support
 */
export function hasCameraSupport() {
  if (typeof window === 'undefined') {
    console.log('[Camera Check] ❌ Not in browser environment');
    return false;
  }

  const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
  console.log(`[Camera Check] Camera API available: ${hasCamera}`);
  
  return hasCamera;
}

/**
 * Request camera access for Pseudo-AR
 */
export async function requestCameraAccess() {
  console.log('[Camera] Requesting camera access...');
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });
    
    console.log('[Camera] ✅ Camera access granted');
    
    // Stop the test stream
    stream.getTracks().forEach(track => track.stop());
    
    return { success: true, error: null };
  } catch (error) {
    console.error('[Camera] ❌ Camera access denied:', error);
    return { 
      success: false, 
      error: error.name === 'NotAllowedError' 
        ? 'Izin kamera ditolak. Silakan aktifkan di pengaturan browser.' 
        : error.name === 'NotFoundError'
        ? 'Kamera tidak ditemukan di perangkat Anda.'
        : 'Tidak dapat mengakses kamera. Pastikan kamera tersedia.'
    };
  }
}
