import type { IntegrationResult } from '../types';

export function trapezoidalRule(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number
): IntegrationResult {
  if (n <= 0) {
    return {
      integral: null,
      error: 'El número de subintervalos (n) debe ser un entero positivo.',
    };
  }

  const h = (b - a) / n;
  let sum = f(a) + f(b);

  for (let i = 1; i < n; i++) {
    sum += f(a + i * h);
  }
  return {
    integral: (h / 2) * sum,
    error: null,
  };
}
