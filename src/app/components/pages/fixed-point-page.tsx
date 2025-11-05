import { FixedPointForm } from '@/app/components/calculators/fixed-point-form';
import { PageTransition } from '@/app/components/page-transition';

export function FixedPointPage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Iteración de Punto Fijo</h1>
        <p className="text-muted-foreground max-w-2xl">
          Encuentra soluciones a `f(x) = 0` reorganizando la ecuación a la forma `x = g(x)` y luego iterando `p_n = g(p_n-1)` hasta converger.
        </p>
      </div>
      <FixedPointForm />
    </PageTransition>
  );
}
