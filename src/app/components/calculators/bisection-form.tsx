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
import { bisection } from '@/lib/methods/bisection';
import type { RootFindingResult, RootFindingIteration, FunctionData } from '@/lib/types';
import { FunctionGraph } from './function-graph';

const formSchema = z.object({
  func: z.string().min(1, 'La función es requerida'),
  a: z.coerce.number(),
  b: z.coerce.number(),
  tolerance: z.coerce.number().positive('La tolerancia debe ser positiva'),
  maxIterations: z.coerce.number().int().positive('El máximo de iteraciones debe ser un entero positivo'),
}).refine(data => {
    if (typeof data.a === 'number' && typeof data.b === 'number') {
        return data.a < data.b;
    }
    return true;
}, {
  message: 'a debe ser menor que b',
  path: ['a'],
});

export function BisectionForm() {
  const [result, setResult] = useState<RootFindingResult | null>(null);
  const [functionData, setFunctionData] = useState<FunctionData[] | null>(null);
  const [parsedFuncString, setParsedFuncString] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      func: '',
      a: '',
      b: '',
      tolerance: 0.0001,
      maxIterations: 50,
    },
  });

  const handleFunctionChange = (fnString: string) => {
    const { func: parsedFunc, error } = parseFunction(fnString);
    if (parsedFunc && !error) {
      setParsedFuncString(fnString);
      const dataPoints: FunctionData[] = [];
      const range = 40;
      for (let i = -range / 2; i <= range / 2; i += 0.5) {
        try {
          const y = parsedFunc(i);
          if (isFinite(y) && Math.abs(y) < 1e6) {
            dataPoints.push({ x: i, y });
          }
        } catch (e) {
          // Ignorar puntos donde la función no esté definida
        }
      }
      setFunctionData(dataPoints);
    } else {
      setFunctionData(null);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { func: parsedFunc, error: parseError } = parseFunction(values.func);
    if (parseError || !parsedFunc) {
      setResult({ iterations: [], root: null, error: parseError });
      return;
    }
    const calcResult = bisection(parsedFunc, values.a, values.b, values.tolerance, values.maxIterations);
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
                name="func"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Función f(x)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: x**3 - x - 2" 
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="a"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inicio del Intervalo (a)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fin del Intervalo (b)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Button type="submit" size="lg" className="w-full">Calcular Raíz</Button>
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
                    <AlertTitle>¡Raíz Encontrada!</AlertTitle>
                    <AlertDescription>
                      La raíz aproximada es <span className="font-bold text-white">{result.root?.toFixed(6)}</span>, obtenida después de {result.iterations.length} iteraciones.
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
                        <FunctionGraph data={functionData} root={result?.root ?? undefined} functionLabel={parsedFuncString}/>
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
                              <TableHead className="w-24">Iteración</TableHead>
                              <TableHead>a</TableHead>
                              <TableHead>b</TableHead>
                              <TableHead>Punto Medio (p)</TableHead>
                              <TableHead>f(p)</TableHead>
                              <TableHead>Error</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.iterations.map((iter: RootFindingIteration) => (
                              <TableRow key={iter.iteration} className="hover:bg-muted/50">
                                <TableCell>{iter.iteration}</TableCell>
                                <TableCell>{iter.a?.toFixed(6)}</TableCell>
                                <TableCell>{iter.b?.toFixed(6)}</TableCell>
                                <TableCell className="font-medium">{iter.p.toFixed(6)}</TableCell>
                                <TableCell>{iter.fp.toFixed(6)}</TableCell>
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
                      La raíz hallada representa el punto donde la función cambia de signo. Puedes ajustar la tolerancia para obtener una mayor precisión.
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
