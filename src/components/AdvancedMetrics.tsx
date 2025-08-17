import { Calculator, Target, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricData } from '@/utils/mockData';
import { formatCurrency, formatPercentage } from '@/utils/mockData';

interface AdvancedMetricsProps {
  data: { [key: string]: MetricData[] };
}

export const AdvancedMetrics = ({ data }: AdvancedMetricsProps) => {
  const calculateMetrics = () => {
    const revenue = data.salesRevenue || [];
    const cac = data.customerAcquisitionCost || [];
    const conversionRate = data.conversionRate || [];

    // Customer Lifetime Value (simplified calculation)
    const avgRevenue = revenue.length > 0 ? 
      revenue.reduce((sum, item) => sum + item.value, 0) / revenue.length : 0;
    const avgCAC = cac.length > 0 ? 
      cac.reduce((sum, item) => sum + item.value, 0) / cac.length : 0;
    const ltv = avgCAC > 0 ? avgRevenue / avgCAC * 12 : 0; // Simplified LTV calculation

    // Return on Ad Spend (ROAS)
    const roas = avgCAC > 0 ? avgRevenue / avgCAC : 0;

    // Growth Rate
    const recentRevenue = revenue.slice(-3);
    const growthRate = recentRevenue.length >= 2 ? 
      ((recentRevenue[recentRevenue.length - 1].value - recentRevenue[0].value) / recentRevenue[0].value) * 100 : 0;

    // Payback Period
    const paybackPeriod = avgCAC > 0 && avgRevenue > 0 ? avgCAC / (avgRevenue / 12) : 0;

    return {
      ltv,
      roas,
      growthRate,
      paybackPeriod
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.ltv)}</div>
          <CardDescription>
            Estimated customer lifetime value
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROAS</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.roas.toFixed(2)}x</div>
          <CardDescription>
            Return on advertising spend
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(metrics.growthRate / 100)}</div>
          <CardDescription>
            Quarterly revenue growth
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.paybackPeriod.toFixed(1)} mo</div>
          <CardDescription>
            Customer acquisition payback
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};