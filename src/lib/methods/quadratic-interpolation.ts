
import type { InterpolationResult, FunctionData } from '../types';

export function quadraticInterpolation(
  points: FunctionData[],
  x: number
): InterpolationResult {
  if (points.length !== 3) {
    return {
      x,
      y: null,
      polynomial: null,
      error: 'Se requieren exactamente 3 puntos para la interpolación cuadrática.',
    };
  }

  const [p0, p1, p2] = points;

  // Check for duplicate x values
  if (p0.x === p1.x || p0.x === p2.x || p1.x === p2.x) {
    return {
      x,
      y: null,
      polynomial: null,
      error: 'Los valores de x de los puntos no pueden ser iguales.',
    };
  }

  const L0_num = (x - p1.x) * (x - p2.x);
  const L0_den = (p0.x - p1.x) * (p0.x - p2.x);
  const L0 = L0_num / L0_den;

  const L1_num = (x - p0.x) * (x - p2.x);
  const L1_den = (p1.x - p0.x) * (p1.x - p2.x);
  const L1 = L1_num / L1_den;

  const L2_num = (x - p0.x) * (x - p1.x);
  const L2_den = (p2.x - p0.x) * (p2.x - p1.x);
  const L2 = L2_num / L2_den;

  const y = p0.y * L0 + p1.y * L1 + p2.y * L2;
  
  const b0 = p0.y;
  const b1 = (p1.y - p0.y) / (p1.x - p0.x);
  const b2 = ((p2.y - p1.y) / (p2.x - p1.x) - b1) / (p2.x - p0.x);

  const term1 = b0.toFixed(4);
  const term2 = `${b1.toFixed(4)} * (x - ${p0.x})`;
  const term3 = `${b2.toFixed(4)} * (x - ${p0.x}) * (x - ${p1.x})`;
  
  const polynomial = `P(x) = ${term1} + ${term2} + ${term3}`;

  const interpolatedFunction = (val: number) => {
    return b0 + b1 * (val - p0.x) + b2 * (val - p0.x) * (val - p1.x);
  }

  return {
    x,
    y,
    polynomial,
    interpolatedFunction,
    error: null,
  };
}
