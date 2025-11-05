import type { LinearSystemResult, LinearSystemIteration } from '../types';

function isDiagonallyDominant(matrix: number[][]): boolean {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    let diagonal = Math.abs(matrix[i][i]);
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        rowSum += Math.abs(matrix[i][j]);
      }
    }
    if (diagonal <= rowSum) {
      return false;
    }
  }
  return true;
}

export function jacobi(
  matrix: number[][],
  vector: number[],
  initialGuess: number[],
  tolerance: number,
  maxIterations: number
): LinearSystemResult {
  if (!isDiagonallyDominant(matrix)) {
    return {
      solution: null,
      error: 'The matrix is not strictly diagonally dominant. Convergence is not guaranteed.',
    };
  }

  const n = matrix.length;
  const iterations: LinearSystemIteration[] = [];
  let x = [...initialGuess];

  for (let k = 1; k <= maxIterations; k++) {
    const x_prev = [...x];
    const x_new = Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sigma = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sigma += matrix[i][j] * x_prev[j];
        }
      }
      x_new[i] = (vector[i] - sigma) / matrix[i][i];
    }
    
    x = [...x_new];
    
    let error = 0;
    for (let i = 0; i < n; i++) {
      error = Math.max(error, Math.abs(x[i] - x_prev[i]));
    }
    
    iterations.push({ iteration: k, values: [...x], error });

    if (error < tolerance) {
      return { iterations, solution: x, error: null };
    }
  }

  return {
    iterations,
    solution: x,
    error: 'Method failed to converge within the maximum number of iterations.',
  };
}
