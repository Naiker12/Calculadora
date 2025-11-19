
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { quadraticInterpolation } from "@/lib/methods/quadratic-interpolation";
import type { InterpolationResult, FunctionData } from "@/lib/types";
import { FunctionGraph } from "./function-graph";

const pointSchema = z.object({
  x: z.coerce.number(),
  y: z.coerce.number(),
});

const formSchema = z.object({
  points: z.array(pointSchema).length(3, "Se requieren 3 puntos"),
  x: z.coerce.number(),
});

export function QuadraticInterpolationForm() {
  const [result, setResult] = useState<InterpolationResult | null>(null);
  const [graphData, setGraphData] = useState<FunctionData[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: [
        { x: "", y: "" },
        { x: "", y: "" },
        { x: "", y: "" },
      ],
      x: "",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "points",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { points, x } = values;
    const calcResult = quadraticInterpolation(points, x);
    setResult(calcResult);

    if (calcResult.interpolatedFunction) {
        const dataPoints: FunctionData[] = [];
        const xValues = points.map(p => p.x).sort((a,b) => a-b);
        const minX = xValues[0];
        const maxX = xValues[xValues.length-1];
        const range = maxX - minX;
        
        for (let i = minX - range * 0.2; i <= maxX + range * 0.2; i += range / 40) {
            dataPoints.push({ x: i, y: calcResult.interpolatedFunction(i) });
        }
        setGraphData(dataPoints);
    } else {
        setGraphData([]);
    }
  }

  function clearForm() {
    form.reset();
    setResult(null);
    setGraphData([]);
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <FormLabel>Punto {index} (x{index}, y{index})</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`points.${index}.x`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                placeholder={`x${index}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`points.${index}.y`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                placeholder={`y${index}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="x"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de x a interpolar</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          {...field}
                          className="w-full md:w-1/2"
                        />
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
                  Interpolar
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
                  <AlertTitle>¡Interpolación Exitosa!</AlertTitle>
                  <AlertDescription>
                    Para x ={" "}
                    <span className="font-bold text-white">{result.x}</span>, el
                    valor interpolado de y es{" "}
                    <span className="font-bold text-white">
                      {result.y?.toFixed(6)}
                    </span>
                    .
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Polinomio Interpolador</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm space-y-2 bg-muted p-4 rounded-md">
                    <p>{result.polynomial}</p>
                  </CardContent>
                </Card>

                <FunctionGraph
                  data={graphData}
                  root={result.x}
                  scatterPoints={form.getValues('points')}
                  functionLabel="Polinomio P(x)"
                  isInterpolation
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
