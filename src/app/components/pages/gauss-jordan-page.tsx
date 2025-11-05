import { GaussJordanForm } from '@/app/components/calculators/gauss-jordan-form';
import { PageTransition } from '@/app/components/page-transition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function GaussJordanPage() {
  return (
    <PageTransition>
      <Card className="bg-gray-900/30 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Eliminación de Gauss-Jordan</CardTitle>
          <CardDescription>
            Resuelve sistemas de ecuaciones lineales transformando la matriz a su forma escalonada reducida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GaussJordanForm />
        </CardContent>
      </Card>
    </PageTransition>
  );
}
