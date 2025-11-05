import { JacobiForm } from '@/app/components/calculators/jacobi-form';
import { PageTransition } from '@/app/components/page-transition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function JacobiPage() {
  return (
    <PageTransition>
      <Card className="bg-gray-900/30 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Método de Jacobi</CardTitle>
          <CardDescription>
            Un algoritmo iterativo para resolver sistemas de ecuaciones lineales estrictamente dominantes en su diagonal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JacobiForm />
        </CardContent>
      </Card>
    </PageTransition>
  );
}
