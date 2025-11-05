import type { LinearSystemResult, MatrixStep } from '../types';

export function gaussJordan(matrix: number[][]): LinearSystemResult {
  const steps: MatrixStep[] = [];
  let stepCounter = 0;
  const n = matrix.length;
  const m = [...matrix.map(row => [...row])];

  const cloneMatrix = (mat: number[][]) => mat.map(row => [...row]);

  steps.push({
    step: ++stepCounter,
    description: 'Matriz aumentada inicial',
    operation: 'Inicio',
    matrix: cloneMatrix(m),
  });

  for (let i = 0; i < n; i++) {
    // Pivoteo parcial: buscar el máximo en la columna actual
    let maxEl = Math.abs(m[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(m[k][i]) > maxEl) {
        maxEl = Math.abs(m[k][i]);
        maxRow = k;
      }
    }

    // Intercambiar fila máxima con la fila actual
    if (maxRow !== i) {
      [m[i], m[maxRow]] = [m[maxRow], m[i]];
      steps.push({
        step: ++stepCounter,
        description: `Intercambiar Fila ${i + 1} con Fila ${maxRow + 1}`,
        operation: `F${i + 1} <-> F${maxRow + 1}`,
        matrix: cloneMatrix(m),
      });
    }

    // Comprobar si el sistema tiene solución única
    if (m[i][i] === 0) {
      return { solution: null, error: 'El sistema no tiene una solución única.', steps };
    }

    // Hacer el elemento pivote igual a 1
    const pivot = m[i][i];
    if (pivot !== 1) {
        for (let j = i; j < n + 1; j++) {
            m[i][j] /= pivot;
        }
        steps.push({
            step: ++stepCounter,
            description: `Hacer pivote (${i + 1},${i + 1}) igual a 1`,
            operation: `F${i + 1} = F${i + 1} / ${pivot.toFixed(2)}`,
            matrix: cloneMatrix(m),
        });
    }


    // Hacer cero los otros elementos de la columna
    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = m[k][i];
        if (factor !== 0) {
            for (let j = i; j < n + 1; j++) {
                m[k][j] -= factor * m[i][j];
            }
            steps.push({
                step: ++stepCounter,
                description: `Eliminar elemento (${k + 1},${i + 1})`,
                operation: `F${k + 1} = F${k + 1} - ${factor.toFixed(2)} * F${i + 1}`,
                matrix: cloneMatrix(m),
            });
        }
      }
    }
  }

  const solution = m.map(row => row[n]);
  
  steps.push({
    step: ++stepCounter,
    description: 'Matriz final en forma escalonada reducida',
    operation: 'Finalizado',
    matrix: cloneMatrix(m),
  });

  return { solution, error: null, steps };
}
