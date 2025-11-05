import { FalsePositionForm } from '@/app/components/calculators/false-position-form';
import { PageTransition } from '@/app/components/page-transition';

export function FalsePositionPage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Método de Falsa Posición</h1>
        <p className="text-muted-foreground max-w-2xl">
          Similar a la bisección, pero usa una línea recta (secante) que conecta los puntos del intervalo para estimar la raíz, lo que a menudo acelera la convergencia.
        </p>
      </div>
      <FalsePositionForm />
    </PageTransition>
  );
}
