import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MetricData } from '@/utils/mockData';

interface PredictionConfidenceProps {
  historicalData: MetricData[];
  predictions: MetricData[];
  metricName: string;
}

export const PredictionConfidence = ({ 
  historicalData, 
  predictions, 
  metricName 
}: PredictionConfidenceProps) => {
  const calculateConfidence = () => {
    if (historicalData.length < 6) return { score: 50, level: 'Low' };

    // Calculate trend consistency
    const values = historicalData.map(d => d.value);
    const diffs = values.slice(1).map((val, i) => val - values[i]);
    const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
    const variance = diffs.reduce((sum, diff) => sum + Math.pow(diff - avgDiff, 2), 0) / diffs.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower variance = higher confidence
    const consistencyScore = Math.max(0, 100 - (stdDev / Math.abs(avgDiff)) * 20);
    
    // Data recency bonus
    const recencyBonus = Math.min(20, historicalData.length * 2);
    
    const totalScore = Math.min(95, consistencyScore + recencyBonus);
    
    let level = 'Low';
    if (totalScore >= 80) level = 'High';
    else if (totalScore >= 60) level = 'Medium';
    
    return { score: Math.round(totalScore), level };
  };

  const confidence = calculateConfidence();

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'High': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Medium': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {metricName} Prediction Confidence
        </CardTitle>
        <CardDescription>
          Confidence level for next 3-month predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getConfidenceIcon(confidence.level)}
            <span className={`font-medium ${getConfidenceColor(confidence.level)}`}>
              {confidence.level} Confidence
            </span>
          </div>
          <Badge variant="secondary">{confidence.score}%</Badge>
        </div>
        
        <Progress value={confidence.score} className="w-full" />
        
        <div className="text-sm text-muted-foreground">
          Based on {historicalData.length} months of historical data and trend consistency analysis.
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Prediction Range:</span>
          </div>
          {predictions.map((pred, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{pred.month}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{pred.value.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  ±{Math.round((100 - confidence.score) * pred.value / 100).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};