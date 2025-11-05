import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Sigma } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Calculadora NumSolver Pro',
  description: 'Calculadora profesional de métodos numéricos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.variable)}>
        <main className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex items-center">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <Sigma className="h-6 w-6 text-primary" />
                  <span className="hidden font-bold sm:inline-block">
                    Calculator Online
                  </span>
                </a>
              </div>
            </div>
          </header>
          <div className="flex-1 container mx-auto px-4 sm:px-8 py-8">
            {children}
          </div>
          <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} Calculator Online. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
