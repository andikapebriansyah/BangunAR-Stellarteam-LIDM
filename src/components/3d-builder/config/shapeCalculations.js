/**
 * Shape Calculation Formulas
 * Provides volume and surface area calculations for different shapes
 */

/**
 * Cylinder calculations
 * @param {number} radius - Radius of the cylinder
 * @param {number} height - Height of the cylinder
 * @returns {object} - Volume and surface area
 */
export function calculateCylinder(radius, height) {
  // Volume = π × r² × t
  const volume = Math.PI * radius * radius * height;
  
  // Surface Area = 2πr(r + t)
  const surfaceArea = 2 * Math.PI * radius * (radius + height);
  
  return {
    volume: volume.toFixed(2),
    surfaceArea: surfaceArea.toFixed(2),
    radius: radius.toFixed(2),
    height: height.toFixed(2)
  };
}

/**
 * Cone calculations (for future use)
 * @param {number} radius - Radius of the cone base
 * @param {number} height - Height of the cone
 * @returns {object} - Volume and surface area
 */
export function calculateCone(radius, height) {
  // Volume = (1/3) × π × r² × t
  const volume = (1/3) * Math.PI * radius * radius * height;
  
  // Slant height = √(r² + h²)
  const slantHeight = Math.sqrt(radius * radius + height * height);
  
  // Surface Area = πr(r + s)
  const surfaceArea = Math.PI * radius * (radius + slantHeight);
  
  return {
    volume: volume.toFixed(2),
    surfaceArea: surfaceArea.toFixed(2),
    radius: radius.toFixed(2),
    height: height.toFixed(2),
    slantHeight: slantHeight.toFixed(2)
  };
}

/**
 * Sphere calculations (for future use)
 * @param {number} radius - Radius of the sphere
 * @returns {object} - Volume and surface area
 */
export function calculateSphere(radius) {
  // Volume = (4/3) × π × r³
  const volume = (4/3) * Math.PI * radius * radius * radius;
  
  // Surface Area = 4πr²
  const surfaceArea = 4 * Math.PI * radius * radius;
  
  return {
    volume: volume.toFixed(2),
    surfaceArea: surfaceArea.toFixed(2),
    radius: radius.toFixed(2)
  };
}

/**
 * Shape calculation dispatcher
 * @param {string} shapeType - Type of shape ('cylinder', 'cone', 'sphere')
 * @param {object} params - Shape parameters
 * @returns {object} - Calculation results
 */
export function calculateShape(shapeType, params) {
  switch (shapeType) {
    case 'cylinder':
      return calculateCylinder(params.radius, params.height);
    case 'cone':
      return calculateCone(params.radius, params.height);
    case 'sphere':
      return calculateSphere(params.radius);
    default:
      throw new Error(`Unknown shape type: ${shapeType}`);
  }
}
