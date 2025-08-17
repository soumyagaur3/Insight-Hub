import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricData } from '@/utils/mockData';

interface MetricComparisonProps {
  currentPeriod: MetricData[];
  previousPeriod: MetricData[];
  metricName: string;
  formatter: (value: number) => string;
}

export const MetricComparison = ({ 
  currentPeriod, 
  previousPeriod, 
  metricName, 
  formatter 
}: MetricComparisonProps) => {
  const calculateComparison = () => {
    if (!currentPeriod.length || !previousPeriod.length) return null;

    const currentAvg = currentPeriod.reduce((sum, item) => sum + item.value, 0) / currentPeriod.length;
    const previousAvg = previousPeriod.reduce((sum, item) => sum + item.value, 0) / previousPeriod.length;
    
    const change = currentAvg - previousAvg;
    const percentChange = previousAvg !== 0 ? (change / previousAvg) * 100 : 0;

    return {
      current: currentAvg,
      previous: previousAvg,
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
    };
  };

  const comparison = calculateComparison();

  if (!comparison) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{metricName} Comparison</CardTitle>
          <CardDescription>Insufficient data for comparison</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (comparison.trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (comparison.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = () => {
    switch (comparison.trend) {
      case 'up': return 'default';
      case 'down': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {metricName} Comparison
          {getTrendIcon()}
        </CardTitle>
        <CardDescription>Period-over-period analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Current Period</div>
            <div className="text-2xl font-bold">{formatter(comparison.current)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Previous Period</div>
            <div className="text-2xl font-bold">{formatter(comparison.previous)}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Change</div>
            <div className={`text-lg font-semibold ${getTrendColor()}`}>
              {formatter(Math.abs(comparison.change))}
            </div>
          </div>
          
          <Badge variant={getBadgeVariant()}>
            {comparison.percentChange > 0 ? '+' : ''}
            {comparison.percentChange.toFixed(1)}%
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          {comparison.trend === 'up' && 'Showing positive growth trend'}
          {comparison.trend === 'down' && 'Showing declining trend - consider investigation'}
          {comparison.trend === 'flat' && 'Stable performance with minimal change'}
        </div>
      </CardContent>
    </Card>
  );
};