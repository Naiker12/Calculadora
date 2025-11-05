import type { RootFindingResult, RootFindingIteration } from '../types';

export function fixedPoint(
  g: (x: number) => number,
  p0: number,
  tolerance: number,
  maxIterations: number
): RootFindingResult {
  const iterations: RootFindingIteration[] = [];
  let p = p0;

  for (let i = 1; i <= maxIterations; i++) {
    const p_prev = p;
    p = g(p_prev);
    const error = Math.abs(p - p_prev);
    
    iterations.push({ iteration: i, p, fp: p, error });

    if (error < tolerance) {
      return { iterations, root: p, error: null };
    }
  }

  return {
    iterations,
    root: p,
    error: 'Method failed to converge within the maximum number of iterations.',
  };
}
