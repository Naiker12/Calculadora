
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
    sum += 2 * f(a + i * h);
  }

  const integral = (h / 2) * sum;

  if (isNaN(integral)) {
    return {
        integral: null,
        error: 'El cálculo resultó en un valor no numérico. Verifique la función y el intervalo.'
    }
  }

  return {
    integral,
    error: null,
  };
}
