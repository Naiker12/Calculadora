import { PageTransition } from '@/app/components/page-transition';
import { LinearInterpolationForm } from '../calculators/linear-interpolation-page';

export function LinearInterpolationPage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Interpolación Lineal</h1>
        <p className="text-muted-foreground max-w-2xl">
          Estima un valor desconocido entre dos puntos conocidos usando una línea recta. Este método es ideal para aproximaciones rápidas cuando los datos son lineales.
        </p>
      </div>
      <LinearInterpolationForm />
    </PageTransition>
  );
}
