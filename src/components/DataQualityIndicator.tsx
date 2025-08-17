import { Database, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MetricData } from '@/utils/mockData';

interface DataQualityIndicatorProps {
  data: { [key: string]: MetricData[] };
  mode: 'demo' | 'real';
}

export const DataQualityIndicator = ({ data, mode }: DataQualityIndicatorProps) => {
  const assessDataQuality = () => {
    let totalScore = 0;
    let factors = 0;
    const issues: string[] = [];

    // Completeness check
    const completeness = Object.values(data).reduce((acc, metrics) => {
      const nonZeroValues = metrics.filter(m => m.value > 0).length;
      return acc + (nonZeroValues / metrics.length);
    }, 0) / Object.keys(data).length;
    
    totalScore += completeness * 30;
    factors += 30;
    
    if (completeness < 0.8) {
      issues.push('Some metrics have missing or zero values');
    }

    // Consistency check
    let consistencyScore = 0;
    Object.entries(data).forEach(([metric, values]) => {
      if (values.length >= 3) {
        const changes = values.slice(1).map((val, i) => 
          Math.abs((val.value - values[i].value) / values[i].value)
        );
        const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        consistencyScore += avgChange < 2 ? 1 : 0; // Reasonable variation
      }
    });
    
    const consistency = consistencyScore / Object.keys(data).length;
    totalScore += consistency * 25;
    factors += 25;

    // Recency check (for real data)
    if (mode === 'real') {
      const latestDates = Object.values(data).map(metrics => 
        new Date(metrics[metrics.length - 1]?.month || '2020-01-01')
      );
      const mostRecent = Math.max(...latestDates.map(d => d.getTime()));
      const daysSinceLatest = (Date.now() - mostRecent) / (1000 * 60 * 60 * 24);
      
      const recencyScore = daysSinceLatest < 30 ? 1 : daysSinceLatest < 90 ? 0.7 : 0.3;
      totalScore += recencyScore * 20;
      factors += 20;
      
      if (daysSinceLatest > 30) {
        issues.push('Data may be outdated (last update > 30 days ago)');
      }
    } else {
      totalScore += 20; // Demo data is always "recent"
      factors += 20;
    }

    // Volume check
    const avgDataPoints = Object.values(data).reduce((sum, metrics) => 
      sum + metrics.length, 0) / Object.keys(data).length;
    
    const volumeScore = avgDataPoints >= 12 ? 1 : avgDataPoints >= 6 ? 0.7 : 0.4;
    totalScore += volumeScore * 25;
    factors += 25;
    
    if (avgDataPoints < 6) {
      issues.push('Limited historical data may affect prediction accuracy');
    }

    const finalScore = Math.round((totalScore / factors) * 100);
    
    let quality = 'Poor';
    let color = 'text-red-600';
    let icon = <XCircle className="h-4 w-4 text-red-600" />;
    
    if (finalScore >= 80) {
      quality = 'Excellent';
      color = 'text-green-600';
      icon = <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (finalScore >= 60) {
      quality = 'Good';
      color = 'text-yellow-600';
      icon = <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }

    return { score: finalScore, quality, color, icon, issues };
  };

  const assessment = assessDataQuality();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Quality Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {assessment.icon}
            <span className={`font-medium ${assessment.color}`}>
              {assessment.quality}
            </span>
          </div>
          <Badge variant="secondary">{assessment.score}/100</Badge>
        </div>
        
        <Progress value={assessment.score} className="w-full" />
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Assessment Factors:</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• Data Completeness</div>
            <div>• Trend Consistency</div>
            <div>• Data Recency</div>
            <div>• Historical Volume</div>
          </div>
        </div>

        {assessment.issues.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-amber-600">Recommendations:</div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {assessment.issues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};