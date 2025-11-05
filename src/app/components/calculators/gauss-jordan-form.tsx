'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gaussJordan } from '@/lib/methods/gauss-jordan';
import type { LinearSystemResult, MatrixStep } from '@/lib/types';

const formSchema = z.object({
  size: z.coerce.number().min(2).max(5),
  matrix: z.array(z.array(z.coerce.number())),
  vector: z.array(z.coerce.number()),
});

type FormData = z.infer<typeof formSchema>;

const MatrixDisplay = ({ matrix }: { matrix: number[][] }) => (
  <div className="flex flex-col gap-2 items-center p-4 bg-muted/30 rounded-lg">
    {matrix.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-2">
        {row.map((val, colIndex) => (
          <div
            key={colIndex}
            className="w-24 h-10 flex items-center justify-center bg-background border rounded-md font-mono text-sm"
          >
            {val.toFixed(2)}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export function GaussJordanForm() {
  const [result, setResult] = useState<LinearSystemResult | null>(null);
  const [matrixSize, setMatrixSize] = useState(3);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: matrixSize,
      matrix: Array(matrixSize).fill(Array(matrixSize).fill('')),
      vector: Array(matrixSize).fill(''),
    },
  });

  const { fields: matrixRows, replace: replaceMatrix } = useFieldArray({ control: form.control, name: "matrix" });
  const { fields: vectorRows, replace: replaceVector } = useFieldArray({ control: form.control, name: "vector" });

  useEffect(() => {
    const newMatrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(''));
    const newVector = Array(matrixSize).fill('');
    replaceMatrix(newMatrix as any);
    replaceVector(newVector as any);
    form.setValue('size', matrixSize);
  }, [matrixSize, replaceMatrix, replaceVector, form]);


  function onSubmit(values: FormData) {
    const augmentedMatrix = values.matrix.map((row, i) => [...row, values.vector[i]]);
    const calcResult = gaussJordan(augmentedMatrix);
    setResult(calcResult);
  }

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Datos de Entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamaño del Sistema (n x n)</FormLabel>
                    <Select onValueChange={(val) => setMatrixSize(Number(val))} value={String(matrixSize)}>
                      <FormControl>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Tamaño" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[2, 3, 4, 5].map(size => (
                          <SelectItem key={size} value={String(size)}>{size} x {size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <FormLabel>Matriz de Coeficientes (A)</FormLabel>
                  {matrixRows.map((row, rowIndex) => (
                    <div key={row.id} className="flex gap-2">
                      {Array.from({ length: matrixSize }).map((_, colIndex) => (
                        <FormField
                          key={`${row.id}-${colIndex}`}
                          control={form.control}
                          name={`matrix.${rowIndex}.${colIndex}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" step="any" className="w-20 text-center" placeholder={`a${rowIndex+1}${colIndex+1}`} {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <FormLabel>Vector de Términos (b)</FormLabel>
                  {vectorRows.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`vector.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" step="any" className="w-20 text-center h-[40px]" placeholder={`b${index+1}`} {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
               <motion.div whileTap={{ scale: 0.95 }}>
                <Button type="submit" size="lg" className="w-full">Resolver Sistema</Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
             {result.error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error de Cálculo</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert variant="default" className="border-green-500/50 text-green-400 [&>svg]:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>¡Solución Encontrada!</AlertTitle>
                    <AlertDescription>
                      <div className="font-mono text-sm text-white">
                        {result.solution?.map((val, i) => (
                          <div key={i}>x{i + 1} = <span className="font-bold">{val.toFixed(4)}</span></div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Pasos de la Eliminación Gaussiana:</h3>
                    {result.steps?.map((step: MatrixStep) => (
                      <Card key={step.step}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Paso {step.step}</CardTitle>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                            <Badge variant="secondary" className="font-mono">{step.operation}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <MatrixDisplay matrix={step.matrix} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                 </>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
