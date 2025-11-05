import type { RootFindingResult, RootFindingIteration } from '../types';

export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  tolerance: number,
  maxIterations: number
): RootFindingResult {
  const iterations: RootFindingIteration[] = [];
  let fa = f(a);
  let fb = f(b);

  if (Math.sign(fa) === Math.sign(fb)) {
    return {
      iterations,
      root: null,
      error: 'The function has the same sign at points a and b. Bisection method cannot proceed.',
    };
  }

  let p = a;
  let error = Infinity;
  for (let i = 1; i <= maxIterations; i++) {
    const p_prev = p;
    p = a + (b - a) / 2;
    const fp = f(p);
    error = Math.abs(p - p_prev);

    iterations.push({ iteration: i, a, b, p, fp, error });

    if (error < tolerance || fp === 0) {
      return { iterations, root: p, error: null };
    }

    if (Math.sign(fa) === Math.sign(fp)) {
      a = p;
      fa = fp;
    } else {
      b = p;
    }
  }

  return {
    iterations,
    root: p,
    error: 'Method failed to converge within the maximum number of iterations.',
  };
}
