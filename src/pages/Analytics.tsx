import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { DataModeIndicator } from '@/components/DataModeIndicator';
import { MetricComparison } from '@/components/MetricComparison';
import { ROICalculator } from '@/components/ROICalculator';
import { 
  mockData, 
  generatePredictions, 
  formatCurrency, 
  formatPercentage,
  MetricData
} from '@/utils/mockData';
import { generateEnhancedPredictions } from '@/utils/realDataAnalysis';

interface AnalyticsProps {
  mode: 'demo' | 'real';
  realData?: { [key: string]: MetricData[] } | null;
}

const Analytics = ({ mode, realData }: AnalyticsProps) => {
  const [showComparison, setShowComparison] = useState(false);

// Determine if we should use real data (requires non-empty arrays)
const useReal = mode === 'real' && !!realData && Array.isArray(realData.salesRevenue) && realData.salesRevenue.length > 0;

console.log('[Analytics] mode:', mode, 'useReal:', useReal, { sales: realData?.salesRevenue?.length });

// Use real data if available, otherwise use demo data
const currentData = useReal ? (realData as { [key: string]: MetricData[] }) : mockData;

// Generate predictions using appropriate algorithm
const salesRevenuePredictions = useReal ? 
  generateEnhancedPredictions((realData as any).salesRevenue).predictions :
  generatePredictions(currentData.salesRevenue);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights and performance metrics for your business
          </p>
        </div>
      </div>

      {/* Data Mode Indicator */}
      <DataModeIndicator mode={mode} hasUploadedData={useReal} />

      {/* Advanced Metrics - Temporarily removed for debugging */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Key Performance Indicators
        </h2>
        <div className="text-muted-foreground">Advanced metrics loading...</div>
      </div>

      {/* ROI Calculator */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          ROI Calculator
        </h2>
        <ROICalculator />
      </div>

      {/* Period Comparison Toggle */}
      <div className="flex items-center justify-between bg-card/50 p-4 rounded-lg border border-border">
        <div>
          <h3 className="text-lg font-medium text-foreground">Period Comparison Analysis</h3>
          <p className="text-sm text-muted-foreground">Compare current period with previous period metrics</p>
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {showComparison ? 'Hide' : 'Show'} Comparison
        </button>
      </div>

      {/* Period Comparison */}
      {showComparison && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Period Comparison Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricComparison
              currentPeriod={currentData.salesRevenue.slice(-6)}
              previousPeriod={currentData.salesRevenue.slice(-12, -6)}
              metricName="Sales Revenue"
              formatter={formatCurrency}
            />
            <MetricComparison
              currentPeriod={currentData.customerAcquisitionCost.slice(-6)}
              previousPeriod={currentData.customerAcquisitionCost.slice(-12, -6)}
              metricName="Customer Acquisition Cost"
              formatter={formatCurrency}
            />
            <MetricComparison
              currentPeriod={currentData.conversionRate.slice(-6)}
              previousPeriod={currentData.conversionRate.slice(-12, -6)}
              metricName="Conversion Rate"
              formatter={formatPercentage}
            />
          </div>
        </div>
      )}

      {/* Prediction Confidence & Data Quality - Temporarily removed for debugging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="text-muted-foreground">Prediction confidence loading...</div>
        <div className="text-muted-foreground">Data quality assessment loading...</div>
      </div>
    </div>
  );
};

export default Analytics;