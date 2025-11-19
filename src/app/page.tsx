
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TabsLayout } from '@/app/components/tabs-layout';
import { BisectionPage } from '@/app/components/pages/bisection-page';
import { FalsePositionPage } from '@/app/components/pages/false-position-page';
import { FixedPointPage } from '@/app/components/pages/fixed-point-page';
import { GaussJordanPage } from '@/app/components/pages/gauss-jordan-page';
import { GaussSeidelPage } from '@/app/components/pages/gauss-seidel-page';
import { JacobiPage } from '@/app/components/pages/jacobi-page';
import { PageLoader } from '@/app/components/page-loader';
import { LinearInterpolationPage } from '@/app/components/pages/linear-interpolation-page';
import { TrapezoidalRulePage } from './components/pages/trapezoidal-rule-form';
import { QuadraticInterpolationPage } from './components/pages/quadratic-interpolation-form';


const methods = [
  {
    value: 'biseccion',
    label: 'Bisección',
    component: <BisectionPage />,
  },
  {
    value: 'falsa-posicion',
    label: 'Falsa Posición',
    component: <FalsePositionPage />,
  },
  {
    value: 'punto-fijo',
    label: 'Punto Fijo',
    component: <FixedPointPage />,
  },
  {
    value: 'interpolacion-lineal',
    label: 'Interpolación Lineal',
    component: <LinearInterpolationPage />,
  },
  {
    value: 'interpolacion-cuadratica',
    label: 'Interpolación Cuadrática',
    component: <QuadraticInterpolationPage />,
  },
  {
    value: 'regla-trapecio',
    label: 'Regla del Trapecio',
    component: <TrapezoidalRulePage />,
  },
  {
    value: 'gauss-jordan',
    label: 'Gauss-Jordan',
    component: <GaussJordanPage />,
  },
  {
    value: 'gauss-seidel',
    label: 'Gauss-Seidel',
    component: <GaussSeidelPage />,
  },
  {
    value: 'jacobi',
    label: 'Jacobi',
    component: <JacobiPage />,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div key="loader">
          <PageLoader />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TabsLayout methods={methods} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
