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
import {
  linearInterpolation,
} from "@/lib/methods/linear-interpolation";
import type {
  InterpolationResult,
  FunctionData,
} from "@/lib/types";
import { FunctionGraph } from "./function-graph";

const formSchema = z.object({
  x0: z.coerce.number(),
  y0: z.coerce.number(),
  x1: z.coerce.number(),
  y1: z.coerce.number(),
  x: z.coerce.number(),
});

export function LinearInterpolationForm() {
  const [result, setResult] = useState<InterpolationResult | null>(null);
  const [points, setPoints] = useState<FunctionData[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      x0: "",
      y0: "",
      x1: "",
      y1: "",
      x: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { x0, y0, x1, y1, x } = values;
    const calcResult = linearInterpolation(x0, y0, x1, y1, x);
    setResult(calcResult);
    setPoints([
      { x: x0, y: y0 },
      { x: x1, y: y1 },
    ]);
  }

  function clearForm() {
    form.reset();
    setResult(null);
    setPoints([]);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormLabel className="md:col-span-2">Punto 1 (x₀, y₀)</FormLabel>
                <FormField
                  control={form.control}
                  name="x0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>x₀</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="y0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>y₀</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormLabel className="md:col-span-2">Punto 2 (x₁, y₁)</FormLabel>
                <FormField
                  control={form.control}
                  name="x1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>x₁</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="y1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>y₁</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    <CardTitle>Proceso de Cálculo</CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm space-y-4">
                    <p>Fórmula de Interpolación Lineal:</p>
                    <p className="bg-muted p-2 rounded-md">
                      y = y₀ + (x - x₀) * (y₁ - y₀) / (x₁ - x₀)
                    </p>
                    <p>Sustituyendo los valores:</p>
                    <p className="bg-muted p-2 rounded-md">
                      y = {form.getValues("y0")} + ({result.x} - {form.getValues("x0")}) * (
                      {form.getValues("y1")} - {form.getValues("y0")}) / (
                      {form.getValues("x1")} - {form.getValues("x0")})
                    </p>
                    <p>Resultado:</p>
                    <p className="bg-muted p-2 rounded-md">
                      y = {result.y?.toFixed(6)}
                    </p>
                  </CardContent>
                </Card>

                <FunctionGraph
                  data={points}
                  root={result.x}
                  functionLabel="Interpolación"
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
