'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle } from 'lucide-react';

import { parseFunction } from '@/lib/math-parser';
import { fixedPoint } from '@/lib/methods/fixed-point';
import type { RootFindingResult, RootFindingIteration, FunctionData } from '@/lib/types';
import { FunctionGraph } from './function-graph';

const formSchema = z.object({
  g_func: z.string().min(1, 'La función g(x) es requerida'),
  initial_p: z.coerce.number(),
  tolerance: z.coerce.number().positive('La tolerancia debe ser positiva'),
  maxIterations: z.coerce.number().int().positive('El máximo de iteraciones debe ser un entero positivo'),
});

export function FixedPointForm() {
  const [result, setResult] = useState<RootFindingResult | null>(null);
  const [functionData, setFunctionData] = useState<FunctionData[] | null>(null);
  const [parsedFuncString, setParsedFuncString] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      g_func: '',
      initial_p: '',
      tolerance: 0.0001,
      maxIterations: 50,
    },
  });

  const handleFunctionChange = (fnString: string) => {
    const { func: parsedFunc, error } = parseFunction(fnString);
    if (parsedFunc && !error) {
      setParsedFuncString(fnString);
      const dataPoints: FunctionData[] = [];
      const range = 10;
      for (let i = -range / 2; i <= range / 2; i += 0.25) {
        try {
          const y = parsedFunc(i);
          if (isFinite(y)) {
            dataPoints.push({ x: i, y });
          }
        } catch (e) {
          // Ignorar puntos
        }
      }
      setFunctionData(dataPoints);
    } else {
      setFunctionData(null);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { func: parsedFunc, error: parseError } = parseFunction(values.g_func);
    if (parseError || !parsedFunc) {
      setResult({ iterations: [], root: null, error: parseError });
      return;
    }
    const calcResult = fixedPoint(parsedFunc, values.initial_p, values.tolerance, values.maxIterations);
    setResult(calcResult);
  }

  // Data for y=x line
  const identityLineData = [{x: -10, y: -10}, {x: 10, y: 10}];

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
                name="g_func"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Función g(x) tal que x = g(x)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: (x + 2)**(1/2)"
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          handleFunctionChange(e.target.value);
                        }}
                        className="font-mono bg-slate-900/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="initial_p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Inicial (p₀)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tolerancia</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxIterations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Máx. Iteraciones</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button type="submit" size="lg" className="w-full">Calcular Punto Fijo</Button>
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
                <AlertTitle>Error de Cálculo</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="default" className="border-green-500/50 text-green-400 [&>svg]:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>¡Punto Fijo Encontrado!</AlertTitle>
                  <AlertDescription>
                    El punto fijo aproximado es <span className="font-bold text-white">{result.root?.toFixed(6)}</span>, obtenido después de {result.iterations.length} iteraciones.
                    <br/>
                    El error final es de {result.iterations[result.iterations.length - 1]?.error.toFixed(6)}.
                  </AlertDescription>
                </Alert>

                <AnimatePresence>
                  {functionData && functionData.length > 0 && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <FunctionGraph
                          data={functionData}
                          root={result?.root ?? undefined}
                          functionLabel={parsedFuncString}
                          additionalData={identityLineData}
                          additionalDataLabel="y = x"
                        />
                      </motion.div>
                  )}
                </AnimatePresence>

                <Card>
                  <CardHeader>
                    <CardTitle>Tabla de Iteraciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-72 w-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-card">
                          <TableRow>
                            <TableHead className="w-24">Iteración (i)</TableHead>
                            <TableHead>Valor (pᵢ)</TableHead>
                            <TableHead>Error |pᵢ - pᵢ₋₁|</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.iterations.map((iter: RootFindingIteration) => (
                            <TableRow key={iter.iteration} className="hover:bg-muted/50">
                              <TableCell>{iter.iteration}</TableCell>
                              <TableCell className="font-medium">{iter.p.toFixed(6)}</TableCell>
                              <TableCell>{iter.error.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Alert>
                    <AlertTitle>Resumen del Resultado</AlertTitle>
                    <AlertDescription>
                     El punto fijo es donde la función g(x) se cruza con la línea y=x. La convergencia depende de la elección de g(x) y el punto inicial.
                    </AlertDescription>
                  </Alert>

              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
