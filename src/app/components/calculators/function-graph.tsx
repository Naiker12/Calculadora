
'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Dot, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FunctionData } from '@/lib/types';

type FunctionGraphProps = {
  data: FunctionData[];
  root?: number;
  functionLabel?: string;
  additionalData?: { x: number; y: number }[];
  additionalDataLabel?: string;
  isInterpolation?: boolean;
  scatterPoints?: FunctionData[];
};

const CustomDot = (props: any) => {
  const { cx, cy, payload, root } = props;
  
  if (root !== undefined && Math.abs(payload.x - root) < 1e-9) {
    return <Dot cx={cx} cy={cy} r={5} fill="#ef4444" stroke="white" strokeWidth={2} />;
  }
  
  return null;
};

export function FunctionGraph({ 
  data, 
  root, 
  functionLabel = "f(x)", 
  additionalData, 
  additionalDataLabel,
  isInterpolation = false,
  scatterPoints = []
}: FunctionGraphProps) {
  let chartData = [...data];

  if (isInterpolation && root !== undefined && chartData.length > 0) {
    const interpolatedPoint = chartData.find(p => Math.abs(p.x - root) < 1e-9);
    if (!interpolatedPoint) {
        const lastY = chartData.length > 0 ? chartData[chartData.length - 1].y : 0;
        chartData.push({ x: root, y: lastY }); // Placeholder, should be calculated in the method
    }
  } else if (root !== undefined) {
    if (!chartData.some(p => Math.abs(p.x - root!) < 1e-9)) {
       chartData.push({ x: root, y: 0 });
    }
  }

  chartData.sort((a,b) => a.x - b.x);

  return (
    <Card className="w-full h-96">
      <CardHeader>
        <CardTitle>Gráfica</CardTitle>
      </CardHeader>
      <CardContent className="h-full pt-4">
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis 
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              allowDuplicatedCategory={false}
            />
            <YAxis
              tickFormatter={(value) => new Intl.NumberFormat('es-ES').format(value)}
              domain={['auto', 'auto']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            {!isInterpolation && <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />}
            {root !== undefined && <ReferenceLine x={root} stroke="#ef4444" strokeDasharray="3 3" />}
            
            <Line
              data={chartData}
              type="monotone"
              dataKey="y"
              name={functionLabel}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={isInterpolation ? false : <CustomDot root={root} />}
              activeDot={{ r: 6 }}
            />
            
            {scatterPoints.length > 0 && <Scatter data={scatterPoints} fill="hsl(var(--primary))" shape="circle" />}

            {additionalData && (
              <Line
                data={additionalData}
                type="monotone"
                dataKey="y"
                name={additionalDataLabel}
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
              />
            )}
            
            {isInterpolation && root !== undefined && (
                <Scatter data={[{x: root, y: chartData.find(d => Math.abs(d.x - root!) < 1e-9)?.y}]} fill="#ef4444" shape="cross" name="Punto Interpolado" />
            )}

          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
