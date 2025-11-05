'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ReactNode } from 'react';

type MethodTab = {
  value: string;
  label: string;
  component: ReactNode;
};

type TabsLayoutProps = {
  methods: MethodTab[];
};

export function TabsLayout({ methods }: TabsLayoutProps) {
  return (
    <Tabs defaultValue={methods[0].value} className="w-full">
      <div className="flex justify-center">
        <TabsList>
          {methods.map((method) => (
            <TabsTrigger key={method.value} value={method.value}>
              {method.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {methods.map((method) => (
        <TabsContent key={method.value} value={method.value}>
          {method.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
