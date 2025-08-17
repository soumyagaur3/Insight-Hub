import { Calculator, DollarSign, Percent, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { formatCurrency, formatPercentage } from '@/utils/mockData';

export const ROICalculator = () => {
  const [inputs, setInputs] = useState({
    investment: 10000,
    timeframe: 12,
    expectedRevenue: 25000,
    currentCAC: 150,
    targetCAC: 100
  });

  const [results, setResults] = useState<{
    roi: number;
    paybackPeriod: number;
    breakEvenPoint: number;
    projectedProfit: number;
  } | null>(null);

  const calculateROI = () => {
    const { investment, timeframe, expectedRevenue, currentCAC, targetCAC } = inputs;
    
    // Basic ROI calculation
    const roi = ((expectedRevenue - investment) / investment) * 100;
    
    // Payback period (months)
    const monthlyProfit = (expectedRevenue - investment) / timeframe;
    const paybackPeriod = monthlyProfit > 0 ? investment / monthlyProfit : 0;
    
    // Break-even point
    const breakEvenPoint = investment / (expectedRevenue / timeframe);
    
    // CAC improvement impact
    const cacImprovement = currentCAC - targetCAC;
    const customersPerMonth = expectedRevenue / timeframe / currentCAC;
    const projectedProfit = (customersPerMonth * cacImprovement) * timeframe;
    
    setResults({
      roi,
      paybackPeriod,
      breakEvenPoint,
      projectedProfit: projectedProfit + (expectedRevenue - investment)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
        <CardDescription>
          Calculate potential return on marketing investments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Investment Amount</Label>
            <Input
              type="number"
              value={inputs.investment}
              onChange={(e) => setInputs(prev => ({ ...prev, investment: Number(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Timeframe (months)</Label>
            <Input
              type="number"
              value={inputs.timeframe}
              onChange={(e) => setInputs(prev => ({ ...prev, timeframe: Number(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Expected Revenue</Label>
            <Input
              type="number"
              value={inputs.expectedRevenue}
              onChange={(e) => setInputs(prev => ({ ...prev, expectedRevenue: Number(e.target.value) }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Current CAC</Label>
            <Input
              type="number"
              value={inputs.currentCAC}
              onChange={(e) => setInputs(prev => ({ ...prev, currentCAC: Number(e.target.value) }))}
            />
          </div>
        </div>

        <Button onClick={calculateROI} className="w-full">
          Calculate ROI
        </Button>

        {results && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">ROI</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {results.roi.toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Payback Period</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {results.paybackPeriod.toFixed(1)} mo
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Break-even</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {results.breakEvenPoint.toFixed(1)} mo
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Projected Profit</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(results.projectedProfit)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};