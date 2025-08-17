import { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { MetricsCard } from '@/components/MetricsCard';
import { TrendChart } from '@/components/TrendChart';
import { ChartGallery } from '@/components/ChartGallery';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { KaggleDataSource } from '@/components/KaggleDataSource';
import { MarketingSpendChart } from '@/components/MarketingSpendChart';
import { LoadingSpinner } from '@/components/LoadingSpinner';

import { ExportData } from '@/components/ExportData';
import { AlertSystem } from '@/components/AlertSystem';
import { DataModeIndicator } from '@/components/DataModeIndicator';
import { 
  mockData, 
  generatePredictions, 
  formatCurrency, 
  formatPercentage,
  MetricData
} from '@/utils/mockData';
import { 
  simulateKaggleAPI, 
  MarketingSpendData,
  formatCurrency as formatKaggleCurrency,
  formatNumber as formatKaggleNumber
} from '@/utils/kaggleData';
import { generateEnhancedPredictions } from '@/utils/realDataAnalysis';

interface DashboardProps {
  mode: 'demo' | 'real';
  realData?: { [key: string]: MetricData[] } | null;
}

const Dashboard = ({ mode, realData }: DashboardProps) => {
  const [selectedRange, setSelectedRange] = useState<'historical' | 'predictions'>('historical');
  const [kaggleData, setKaggleData] = useState<MarketingSpendData[]>([]);
  const [isLoadingKaggle, setIsLoadingKaggle] = useState(true);

  // Load Kaggle data on component mount
  useEffect(() => {
    const loadKaggleData = async () => {
      try {
        setIsLoadingKaggle(true);
        const data = await simulateKaggleAPI();
        setKaggleData(data);
      } catch (error) {
        console.error('Error loading Kaggle data:', error);
      } finally {
        setIsLoadingKaggle(false);
      }
    };

    loadKaggleData();
  }, []);

// Determine if we should use real data (requires non-empty arrays)
const useReal = mode === 'real' && !!realData &&
  Array.isArray(realData.salesRevenue) && realData.salesRevenue.length > 0 &&
  Array.isArray(realData.customerAcquisitionCost) && realData.customerAcquisitionCost.length > 0 &&
  Array.isArray(realData.conversionRate) && realData.conversionRate.length > 0;

// Debug
console.log('[Dashboard] mode:', mode, 'useReal:', useReal, {
  sales: realData?.salesRevenue?.length,
  cac: realData?.customerAcquisitionCost?.length,
  conv: realData?.conversionRate?.length,
});

// Use real data if available, otherwise use demo data
const currentData = useReal ? (realData as { [key: string]: MetricData[] }) : mockData;

// Generate predictions using appropriate algorithm
const salesRevenuePredictions = useReal 
  ? generateEnhancedPredictions((realData as any).salesRevenue).predictions 
  : generatePredictions(currentData.salesRevenue);
  
const cacPredictions = useReal
  ? generateEnhancedPredictions((realData as any).customerAcquisitionCost).predictions 
  : generatePredictions(currentData.customerAcquisitionCost);
  
const conversionPredictions = useReal
  ? generateEnhancedPredictions((realData as any).conversionRate).predictions 
  : generatePredictions(currentData.conversionRate);

  // Combine historical and prediction data
  const salesData = [...currentData.salesRevenue, ...salesRevenuePredictions];
  const cacData = [...currentData.customerAcquisitionCost, ...cacPredictions];
  const conversionData = [...currentData.conversionRate, ...conversionPredictions];

  // Get current and previous values for metrics cards
  const currentSalesRevenue = currentData.salesRevenue[currentData.salesRevenue.length - 1].value;
  const previousSalesRevenue = currentData.salesRevenue[currentData.salesRevenue.length - 2].value;
  
  const currentCAC = currentData.customerAcquisitionCost[currentData.customerAcquisitionCost.length - 1].value;
  const previousCAC = currentData.customerAcquisitionCost[currentData.customerAcquisitionCost.length - 2].value;
  
  const currentConversion = currentData.conversionRate[currentData.conversionRate.length - 1].value;
  const previousConversion = currentData.conversionRate[currentData.conversionRate.length - 2].value;
  
  // Calculate marketing metrics from Kaggle data
  const totalMarketingSpend = kaggleData.reduce((sum, month) => sum + month.total_spend, 0);
  const totalLeadsGenerated = kaggleData.reduce((sum, month) => sum + month.leads_generated, 0);
  const averageROI = kaggleData.length > 0 ? 
    kaggleData.reduce((sum, month) => sum + month.roi, 0) / kaggleData.length : 0;

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-gradient-mesh"></div>
      
      <div className="relative space-y-8 p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center animate-slide-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-primary shadow-glow animate-pulse-glow">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {mode === 'real' ? 'Your Business Dashboard' : 'Demo Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ExportData 
              data={currentData} 
              predictions={{
                salesRevenue: salesRevenuePredictions,
                customerAcquisitionCost: cacPredictions,
                conversionRate: conversionPredictions
              }} 
            />
          </div>
        </div>
        {/* Data Mode Indicator */}
        <DataModeIndicator mode={mode} hasUploadedData={useReal} />
        
        {/* Kaggle Data Source Indicator - only show in demo mode */}
        {!useReal && <KaggleDataSource />}

        {/* Smart Alerts */}
        <AlertSystem data={currentData} />

        {/* Date Range Selector */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <DateRangeSelector 
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>

        {/* Marketing Metrics from Kaggle Data - only in demo mode */}
        {!useReal && (
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Marketing Performance (Kaggle Dataset)
            </h2>
            {isLoadingKaggle ? (
              <div className="bg-gradient-glass backdrop-blur-md rounded-2xl shadow-glass border border-border/30">
                <LoadingSpinner message="Loading Kaggle marketing data..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <MetricsCard
                    title="Total Marketing Spend"
                    value={formatKaggleCurrency(totalMarketingSpend)}
                    currentValue={totalMarketingSpend}
                    previousValue={totalMarketingSpend * 0.9}
                    format={formatKaggleCurrency}
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <MetricsCard
                    title="Total Leads Generated"
                    value={formatKaggleNumber(totalLeadsGenerated)}
                    currentValue={totalLeadsGenerated}
                    previousValue={totalLeadsGenerated * 0.85}
                    format={formatKaggleNumber}
                    icon={<Users className="h-5 w-5" />}
                  />
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
                  <MetricsCard
                    title="Average ROI"
                    value={`${averageROI.toFixed(1)}%`}
                    currentValue={averageROI}
                    previousValue={averageROI * 0.95}
                    format={(v) => `${v.toFixed(1)}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Business Metrics Summary */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent mb-6">
            {mode === 'real' ? 'Your Business Metrics' : 'Business Metrics Summary'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <MetricsCard
                title="Sales Revenue"
                value={formatCurrency(currentSalesRevenue)}
                currentValue={currentSalesRevenue}
                previousValue={previousSalesRevenue}
                format={formatCurrency}
                icon={<DollarSign className="h-5 w-5" />}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <MetricsCard
                title="Customer Acquisition Cost"
                value={formatCurrency(currentCAC)}
                currentValue={currentCAC}
                previousValue={previousCAC}
                format={formatCurrency}
                icon={<Users className="h-5 w-5" />}
              />
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <MetricsCard
                title="Conversion Rate"
                value={formatPercentage(currentConversion)}
                currentValue={currentConversion}
                previousValue={previousConversion}
                format={formatPercentage}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>

        {/* Marketing Spend Analysis from Kaggle - only in demo mode */}
        {!useReal && !isLoadingKaggle && kaggleData.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent mb-6">
              Marketing Channel Analysis (Kaggle Data)
            </h2>
            <div className="bg-gradient-glass backdrop-blur-md rounded-2xl border border-border/30 p-6 shadow-glass">
              <MarketingSpendChart 
                data={kaggleData} 
                title="Monthly Marketing Spend by Channel"
              />
            </div>
          </div>
        )}

        {/* Enhanced Data Visualization Gallery */}
        <div className="animate-fade-in" style={{ animationDelay: '0.65s' }}>
          <h2 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Interactive Data Visualization Gallery
          </h2>
          <ChartGallery />
        </div>

        {/* Charts Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-2xl font-semibold bg-gradient-primary bg-clip-text text-transparent mb-6">
            {selectedRange === 'historical' ? 'Historical Business Trends' : 'Future Business Predictions'}
            {mode === 'real' && ' (Enhanced ML Analysis)'}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-gradient-glass backdrop-blur-md rounded-2xl border border-border/30 p-6 shadow-glass animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <TrendChart
                data={salesData}
                title="Sales Revenue"
                color="hsl(var(--chart-revenue))"
                format={formatCurrency}
                showPredictions={selectedRange === 'predictions'}
              />
            </div>
            <div className="bg-gradient-glass backdrop-blur-md rounded-2xl border border-border/30 p-6 shadow-glass animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <TrendChart
                data={cacData}
                title="Customer Acquisition Cost"
                color="hsl(var(--chart-cac))"
                format={formatCurrency}
                showPredictions={selectedRange === 'predictions'}
              />
            </div>
            <div className="bg-gradient-glass backdrop-blur-md rounded-2xl border border-border/30 p-6 shadow-glass animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <TrendChart
                data={conversionData}
                title="Conversion Rate"
                color="hsl(var(--chart-conversion))"
                format={formatPercentage}
                showPredictions={selectedRange === 'predictions'}
              />
            </div>
          </div>
        </div>

        {/* Predictions Summary */}
        {selectedRange === 'predictions' && (
          <div className="bg-gradient-glass backdrop-blur-md p-8 rounded-2xl shadow-glass border border-border/30 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-2xl font-semibold bg-gradient-secondary bg-clip-text text-transparent mb-6">
              3-Month Forecast Summary
              {mode === 'real' && ' (Enhanced ML Predictions)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-4 rounded-xl bg-card/30">
                <div className="text-3xl font-bold text-chart-revenue mb-2">
                  {formatCurrency(salesRevenuePredictions[2].value)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Predicted Sales Revenue (3 months)
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/30">
                <div className="text-3xl font-bold text-chart-cac mb-2">
                  {formatCurrency(cacPredictions[2].value)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Predicted CAC (3 months)
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/30">
                <div className="text-3xl font-bold text-chart-conversion mb-2">
                  {formatPercentage(conversionPredictions[2].value)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Predicted Conversion Rate (3 months)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;