import { BisectionForm } from '@/app/components/calculators/bisection-form';
import { PageTransition } from '@/app/components/page-transition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function BisectionPage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Método de Bisección</h1>
        <p className="text-muted-foreground max-w-2xl">
          Encuentra el punto donde tu función cruza el eje X, dividiendo el intervalo paso a paso. Este método reduce el intervalo hasta encontrar una raíz con el nivel de precisión deseado.
        </p>
      </div>
      <BisectionForm />
    </PageTransition>
  );
}
