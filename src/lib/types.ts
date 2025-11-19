
export type RootFindingIteration = {
  iteration: number;
  a?: number;
  b?: number;
  p: number;
  fp: number;
  error: number;
};

export type RootFindingResult = {
  iterations: RootFindingIteration[];
  root: number | null;
  error: string | null;
};

export type InterpolationResult = {
  x: number;
  y: number | null;
  polynomial?: string | null;
  interpolatedFunction?: ((x: number) => number) | null;
  error: string | null;
}

export type MatrixStep = {
  step: number;
  description: string;
  operation: string;
  matrix: number[][];
};

export type LinearSystemIteration = {
  iteration: number;
  values: number[];
  error: number;
};

export type LinearSystemResult = {
  iterations?: LinearSystemIteration[];
  solution: number[] | null;
  error: string | null;
  steps?: MatrixStep[];
};

export type FunctionData = {
  x: number;
  y: number;
};
