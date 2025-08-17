import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  month: string;
  value: number;
  predicted?: boolean;
}

interface TrendChartProps {
  data: DataPoint[];
  title: string;
  color: string;
  format?: (value: number) => string;
  showPredictions?: boolean;
}

export const TrendChart = ({ 
  data, 
  title, 
  color, 
  format = (v) => v.toString(),
  showPredictions = false 
}: TrendChartProps) => {
  const historicalData = data.filter(d => !d.predicted);
  const predictionData = showPredictions ? data.filter(d => d.predicted) : [];
  
  // Combine last historical point with predictions for smooth line
  const combinedPredictionData = showPredictions && predictionData.length > 0 
    ? [historicalData[historicalData.length - 1], ...predictionData]
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">
            {format(payload[0].value)}
            {payload[0].payload.predicted && (
              <span className="text-warning ml-1">(Predicted)</span>
            )}
          </p>
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
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={format}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Historical data line */}
            <Line
              data={historicalData}
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
            
            {/* Prediction data line */}
            {showPredictions && combinedPredictionData.length > 0 && (
              <Line
                data={combinedPredictionData}
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-prediction))"
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={{ fill: "hsl(var(--chart-prediction))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-prediction))", strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};