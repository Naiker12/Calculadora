import type { InterpolationResult } from '../types';

export function linearInterpolation(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x: number
): InterpolationResult {
  if (x1 - x0 === 0) {
    return {
      x,
      y: null,
      error: 'Los puntos x₀ y x₁ no pueden ser iguales (división por cero).',
    };
  }
  
  const y = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);

  return {
    x,
    y,
    error: null,
  };
}
