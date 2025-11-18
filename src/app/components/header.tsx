'use client';

import Link from 'next/link';
import { Sigma } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sigma className="h-6 w-6 text-primary" />
            <span className="font-bold">Zero Finder X</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
