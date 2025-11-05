import { GaussSeidelForm } from '@/app/components/calculators/gauss-seidel-form';
import { PageTransition } from '@/app/components/page-transition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function GaussSeidelPage() {
  return (
    <PageTransition>
      <Card className="bg-gray-900/30 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Método de Gauss-Seidel</CardTitle>
          <CardDescription>
            Un método iterativo para resolver sistemas de ecuaciones lineales que utiliza los valores actualizados tan pronto como están disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GaussSeidelForm />
        </CardContent>
      </Card>
    </PageTransition>
  );
}
