
import { QuadraticInterpolationForm } from '@/app/components/calculators/quadratic-interpolation-form';
import { PageTransition } from '@/app/components/page-transition';

export function QuadraticInterpolationPage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Interpolación Cuadrática</h1>
        <p className="text-muted-foreground max-w-2xl">
          Estima un valor desconocido usando una parábola que pasa por tres puntos conocidos. Este método es más preciso que la interpolación lineal cuando los datos siguen una curva.
        </p>
      </div>
      <QuadraticInterpolationForm />
    </PageTransition>
  );
}
