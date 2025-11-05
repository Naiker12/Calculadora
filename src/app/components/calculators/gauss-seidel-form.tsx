'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Terminal } from 'lucide-react';

import { gaussSeidel } from '@/lib/methods/gauss-seidel';
import type { LinearSystemResult, LinearSystemIteration } from '@/lib/types';

const formSchema = z.object({
  size: z.coerce.number().min(2).max(5),
  matrix: z.array(z.array(z.coerce.number())),
  vector: z.array(z.coerce.number()),
  initialGuess: z.array(z.coerce.number()),
  tolerance: z.coerce.number().positive(),
  maxIterations: z.coerce.number().int().positive(),
});

type FormData = z.infer<typeof formSchema>;

export function GaussSeidelForm() {
  const [result, setResult] = useState<LinearSystemResult | null>(null);
  const [matrixSize, setMatrixSize] = useState(3);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: matrixSize,
      matrix: Array(matrixSize).fill(Array(matrixSize).fill(undefined)),
      vector: Array(matrixSize).fill(undefined),
      initialGuess: Array(matrixSize).fill(0),
      tolerance: undefined,
      maxIterations: undefined,
    },
  });
  
  const { fields: matrixRows, replace: replaceMatrix } = useFieldArray({ control: form.control, name: "matrix" });
  const { fields: vectorRows, replace: replaceVector } = useFieldArray({ control: form.control, name: "vector" });
  const { fields: guessRows, replace: replaceGuess } = useFieldArray({ control: form.control, name: "initialGuess" });

  useEffect(() => {
    const newMatrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(undefined));
    const newVector = Array(matrixSize).fill(undefined);
    const newGuess = Array(matrixSize).fill(0);
    replaceMatrix(newMatrix as any);
    replaceVector(newVector as any);
    replaceGuess(newGuess as any);
    form.setValue('size', matrixSize);
    form.setValue('initialGuess', newGuess);

  }, [matrixSize, form, replaceMatrix, replaceVector, replaceGuess]);

  function onSubmit(values: FormData) {
    const calcResult = gaussSeidel(values.matrix, values.vector, values.initialGuess, values.tolerance, values.maxIterations);
    setResult(calcResult);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="size"
              render={() => (
                <FormItem>
                  <FormLabel>Tamaño del Sistema (n x n)</FormLabel>
                  <Select onValueChange={(val) => setMatrixSize(Number(val))} value={String(matrixSize)}>
                    <FormControl>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Tamaño" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[2, 3, 4, 5].map(size => <SelectItem key={size} value={String(size)}>{size} x {size}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel>Matriz (A)</FormLabel>
              <div className="space-y-2 mt-2">
                {matrixRows.map((row, rowIndex) => (
                  <div key={row.id} className="flex gap-2">
                    {Array.from({ length: matrixSize }).map((_, colIndex) => (
                      <FormField key={`${row.id}-${colIndex}`} control={form.control} name={`matrix.${rowIndex}.${colIndex}`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" step="any" className="w-20 text-center" placeholder={`a${rowIndex+1}${colIndex+1}`} {...field} /></FormControl></FormItem>
                      )}/>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FormLabel>Vector (b)</FormLabel>
              <div className="space-y-2 mt-2">
                {vectorRows.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`vector.${index}`} render={({ field }) => (
                    <FormItem><FormControl><Input type="number" step="any" className="w-20 text-center" placeholder={`b${index+1}`} {...field} /></FormControl></FormItem>
                  )}/>
                ))}
              </div>
            </div>
            <div>
              <FormLabel>Valor Inicial (x₀)</FormLabel>
              <div className="space-y-2 mt-2">
                {guessRows.map((field, index) => (
                  <FormField key={field.id} control={form.control} name={`initialGuess.${index}`} render={({ field }) => (
                    <FormItem><FormControl><Input type="number" step="any" className="w-20 text-center" {...field} /></FormControl></FormItem>
                  )}/>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="tolerance" render={({ field }) => (
                <FormItem><FormLabel>Tolerancia</FormLabel><FormControl><Input type="number" step="any" placeholder="Ej: 0.0001" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="maxIterations" render={({ field }) => (
                <FormItem><FormLabel>Máx. Iteraciones</FormLabel><FormControl><Input type="number" placeholder="Ej: 100" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
          </div>
          <Button type="submit">Resolver Sistema</Button>
        </form>
      </Form>
      
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Resultado del Cálculo</h3>
            {result.error ? (
              <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error de Cálculo</AlertTitle><AlertDescription>{result.error}</AlertDescription></Alert>
            ) : (
              <>
                <Alert><Terminal className="h-4 w-4" /><AlertTitle>¡Solución Encontrada!</AlertTitle>
                  <AlertDescription>Convergencia en {result.iterations?.length} iteraciones.
                    <div className="font-mono text-sm mt-2">{result.solution?.map((val, i) => <div key={i}>x{i + 1} = <span className="font-bold">{val.toFixed(6)}</span></div>)}</div>
                  </AlertDescription>
                </Alert>
                <div className="mt-4 rounded-md border max-h-96 overflow-auto">
                  <Table><TableHeader className="sticky top-0 bg-card"><TableRow><TableHead className="w-16">Iter</TableHead>{Array.from({length: matrixSize}).map((_, i) => <TableHead key={i}>x{i+1}</TableHead>)}<TableHead>Error</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {result.iterations?.map((iter: LinearSystemIteration) => (
                        <TableRow key={iter.iteration}><TableCell>{iter.iteration}</TableCell>
                          {iter.values.map((v, i) => <TableCell key={i}>{v.toFixed(6)}</TableCell>)}
                          <TableCell>{iter.error.toExponential(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
