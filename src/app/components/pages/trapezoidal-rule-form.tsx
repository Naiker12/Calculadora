
import { TrapezoidalRuleForm } from '@/app/components/calculators/trapezoidal-rule-form';
import { PageTransition } from '@/app/components/page-transition';

export function TrapezoidalRulePage() {
  return (
    <PageTransition>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Regla del Trapecio</h1>
        <p className="text-muted-foreground max-w-2xl">
          Calcula una aproximación de una integral definida dividiendo el área bajo la curva en una serie de trapezoides.
        </p>
      </div>
      <TrapezoidalRuleForm />
    </PageTransition>
  );
}
