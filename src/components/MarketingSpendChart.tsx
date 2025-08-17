import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MarketingSpendData, formatCurrency } from '@/utils/kaggleData';

interface MarketingSpendChartProps {
  data: MarketingSpendData[];
  title: string;
}

export const MarketingSpendChart = ({ data, title }: MarketingSpendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="digital_marketing" 
              name="Digital Marketing"
              fill="hsl(var(--chart-revenue))" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="social_media" 
              name="Social Media"
              fill="hsl(var(--chart-cac))" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="traditional_marketing" 
              name="Traditional Marketing"
              fill="hsl(var(--chart-conversion))" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="email_marketing" 
              name="Email Marketing"
              fill="hsl(var(--chart-prediction))" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};