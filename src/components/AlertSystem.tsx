import { AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetricData } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';

interface AlertSystemProps {
  data: { [key: string]: MetricData[] };
}

export const AlertSystem = ({ data }: AlertSystemProps) => {
  const generateAlerts = () => {
    const alerts: Array<{
      type: 'warning' | 'info' | 'danger';
      title: string;
      message: string;
      icon: React.ReactNode;
    }> = [];

    // Check for significant drops
    Object.entries(data).forEach(([metric, values]) => {
      if (values.length >= 2) {
        const current = values[values.length - 1].value;
        const previous = values[values.length - 2].value;
        const change = ((current - previous) / previous) * 100;

        if (change < -10) {
          alerts.push({
            type: 'danger',
            title: `Significant Drop in ${metric}`,
            message: `${metric} has decreased by ${Math.abs(change).toFixed(1)}% from the previous period.`,
            icon: <TrendingDown className="h-4 w-4" />
          });
        } else if (change > 15) {
          alerts.push({
            type: 'info',
            title: `Strong Growth in ${metric}`,
            message: `${metric} has increased by ${change.toFixed(1)}% from the previous period.`,
            icon: <TrendingUp className="h-4 w-4" />
          });
        }
      }
    });

    // Check CAC vs Revenue ratio
    const revenue = data.salesRevenue?.[data.salesRevenue.length - 1]?.value || 0;
    const cac = data.customerAcquisitionCost?.[data.customerAcquisitionCost.length - 1]?.value || 0;
    
    if (revenue > 0 && cac > 0) {
      const cacRatio = (cac / revenue) * 100;
      if (cacRatio > 20) {
        alerts.push({
          type: 'warning',
          title: 'High Customer Acquisition Cost',
          message: `CAC represents ${cacRatio.toFixed(1)}% of revenue, which may impact profitability.`,
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }
    }

    return alerts;
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>All Systems Normal</AlertTitle>
        <AlertDescription>
          No significant issues detected in your business metrics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Smart Alerts</h3>
        <Badge variant="secondary">{alerts.length}</Badge>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === 'danger' ? 'destructive' : 'default'}>
            {alert.icon}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};