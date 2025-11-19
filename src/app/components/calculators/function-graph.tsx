'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Dot, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FunctionGraphProps = {
  data: { x: number; y: number }[];
  root?: number;
  functionLabel?: string;
  additionalData?: { x: number; y: number }[];
  additionalDataLabel?: string;
  isInterpolation?: boolean;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload, root } = props;
  
  // Only render dot if the current point's x is the root
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
  isInterpolation = false
}: FunctionGraphProps) {
  let chartData = [...data];

  // For interpolation, the root is the x value we are finding a y for.
  // We need to calculate its y based on the line and add it to the data.
  if (isInterpolation && root !== undefined && chartData.length === 2) {
    const [p1, p2] = chartData;
    const y = p1.y + (root - p1.x) * (p2.y - p1.y) / (p2.x - p1.x);
    if (!chartData.some(p => Math.abs(p.x - root!) < 1e-9)) {
      chartData.push({ x: root, y });
    }
  } else if (root !== undefined) {
    // For root finding, ensure the root point (y=0) is in the data for the dot
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
              dot={isInterpolation ? <CustomDot root={root} /> : false}
              activeDot={{ r: 6 }}
            />
             {isInterpolation && <Scatter data={chartData} fill="hsl(var(--primary))" />}

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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
