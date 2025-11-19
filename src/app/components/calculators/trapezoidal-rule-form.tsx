
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

import { parseFunction } from "@/lib/math-parser";
import type { IntegrationResult, FunctionData } from "@/lib/types";
import { FunctionGraph } from "./function-graph";
import { trapezoidalRule } from "@/lib/methods/trapezoidal-rule";

const formSchema = z
  .object({
    func: z.string().min(1, "La función es requerida"),
    a: z.coerce.number(),
    b: z.coerce.number(),
    n: z.coerce
      .number()
      .int()
      .positive("El número de subintervalos debe ser un entero positivo"),
  })
  .refine((data) => data.a < data.b, {
    message: "a debe ser menor que b",
    path: ["a"],
  });

export function TrapezoidalRuleForm() {
  const [result, setResult] = useState<IntegrationResult | null>(null);
  const [functionData, setFunctionData] = useState<FunctionData[] | null>(null);
  const [parsedFuncString, setParsedFuncString] = useState("");
  const [graphProps, setGraphProps] = useState<{a: number, b: number}>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      func: "",
      a: "",
      b: "",
      n: 10,
    },
  });

  const handleFunctionChange = (fnString: string) => {
    const { func: parsedFunc, error } = parseFunction(fnString);
    if (parsedFunc && !error) {
      setParsedFuncString(fnString);
      const dataPoints: FunctionData[] = [];
      const { a, b } = form.getValues();
      
      const start = isFinite(a) ? a : -10;
      const end = isFinite(b) ? b : 10;
      const range = Math.max(10, end - start);

      for (let i = start - range * 0.1; i <= end + range * 0.1; i += range / 100) {
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
    const { func, a, b, n } = values;
    const { func: parsedFunc, error: parseError } = parseFunction(func);

    if (parseError || !parsedFunc) {
      setResult({ integral: null, error: parseError });
      return;
    }

    const calcResult = trapezoidalRule(parsedFunc, a, b, n);
    setResult(calcResult);
    setGraphProps({ a, b });
    handleFunctionChange(values.func); // Re-generate graph data with new bounds
  }

  function clearForm() {
    form.reset();
    setResult(null);
    setFunctionData(null);
    setGraphProps(undefined);
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
                    <FormLabel>Función a integrar f(x)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: x**2"
                        {...field}
                        onChange={(e) => {
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
                  name="a"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite Inferior (a)</FormLabel>
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
                      <FormLabel>Límite Superior (b)</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="n"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subintervalos (n)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                className="grid grid-cols-2 gap-4 w-full"
              >
                <Button type="submit" size="lg">
                  Calcular Integral
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={clearForm}
                >
                  Limpiar
                </Button>
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
                <Alert
                  variant="default"
                  className="border-green-500/50 text-green-400 [&>svg]:text-green-400"
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>¡Cálculo Exitoso!</AlertTitle>
                  <AlertDescription>
                    El valor aproximado de la integral es{" "}
                    <span className="font-bold text-white">
                      {result.integral?.toFixed(6)}
                    </span>
                    .
                  </AlertDescription>
                </Alert>

                <AnimatePresence>
                  {functionData && functionData.length > 0 && graphProps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <FunctionGraph
                        data={functionData}
                        functionLabel={parsedFuncString}
                        integrationArea={{a: graphProps.a, b: graphProps.b}}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
