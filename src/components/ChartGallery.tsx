import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveChart } from './InteractiveChart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/contexts/DataContext';
import { mockData, MetricData } from '@/utils/mockData';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, 
  Zap, Eye, Download 
} from 'lucide-react';


export const ChartGallery: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('overview');
  const { mode, realData, hasUploadedData } = useDataContext();
  
// Determine if we should use real data
const useReal = mode === 'real' && !!hasUploadedData && !!realData &&
  Array.isArray(realData.salesRevenue) && realData.salesRevenue.length > 0;

console.log('[ChartGallery] mode:', mode, 'hasUploadedData:', hasUploadedData, 'useReal:', useReal, {
  sales: realData?.salesRevenue?.length,
});

// Use real data if available, otherwise use demo data
const currentData = useReal ? realData! : mockData;
  
  // Transform data for charts
  const transformToChartData = (data: MetricData[]) => {
    return data.slice(-4).map((item, index) => ({
      name: `Q${index + 1}`,
      value: Math.round(item.value),
      revenue: Math.round(item.value * 0.85),
      conversion: 12.5 + (index * 2.5),
      drillDown: [
        { name: 'Month 1', value: Math.round(item.value * 0.3), revenue: Math.round(item.value * 0.25) },
        { name: 'Month 2', value: Math.round(item.value * 0.35), revenue: Math.round(item.value * 0.3) },
        { name: 'Month 3', value: Math.round(item.value * 0.35), revenue: Math.round(item.value * 0.3) },
      ]
    }));
  };
  
  const revenueChartData = transformToChartData(currentData.salesRevenue);
  
const marketingData = useReal ? [
  { name: 'Digital Channels', value: 40 },
  { name: 'Direct Sales', value: 30 },
  { name: 'Referrals', value: 20 },
  { name: 'Other', value: 10 },
] : [
  { name: 'Social Media', value: 35 },
  { name: 'Email Campaign', value: 28 },
  { name: 'Google Ads', value: 22 },
  { name: 'Content Marketing', value: 15 },
];

  const downloadChart = (chartName: string) => {
    // Mock download functionality
    console.log(`Downloading ${chartName} chart...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="h-6 w-6" />
            Advanced Data Visualization Gallery
          </CardTitle>
          <p className="text-muted-foreground">
            Interactive charts with drill-down capabilities and multiple visualization types
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Interactive
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Real-time
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Exportable
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Chart Gallery Tabs */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={revenueChartData}
              title={mode === 'real' ? 'Your Revenue Analysis' : 'Quarterly Revenue Analysis'}
              description="Click on any quarter to drill down into monthly data"
              defaultType="bar"
              enableDrillDown={true}
            />
            
            <InteractiveChart
              data={marketingData}
              title={mode === 'real' ? 'Your Channel Performance' : 'Marketing Channel Performance'}
              description="Distribution of marketing channel effectiveness"
              defaultType="pie"
              enableDrillDown={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <InteractiveChart
            data={currentData.salesRevenue.slice(-6).map((item, index) => ({
              name: item.month,
              value: Math.round(item.value / 1000), // Convert to thousands for better display
              revenue: Math.round(item.value / 1000 * 0.85),
              profit: Math.round(item.value / 1000 * 0.2)
            }))}
            title={mode === 'real' ? 'Your Performance Metrics' : 'Monthly Performance Metrics'}
            description="Comprehensive view of performance, revenue, and profit trends"
            defaultType="line"
            enableDrillDown={false}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Chart Controls</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadChart('performance')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Switch between chart types using the toolbar</p>
                  <p>• Hover over data points for detailed information</p>
                  <p>• Click and drag to zoom into specific time periods</p>
                  <p>• Use the reset button to return to full view</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Line Chart</Badge>
                  <Badge variant="outline">Bar Chart</Badge>
                  <Badge variant="outline">Area Chart</Badge>
                  <Badge variant="outline">Pie Chart</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass">
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Best Performing Month</span>
                  <Badge variant="default">April (96%)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Highest Revenue</span>
                  <Badge variant="secondary">$145,000</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Growth Trend</span>
                  <Badge variant="outline" className="text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <InteractiveChart
            data={[
              {
                name: mode === 'real' ? 'Premium Customers' : 'Enterprise',
                value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.5),
                drillDown: [
                  { name: 'Segment A', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.2) },
                  { name: 'Segment B', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.2) },
                  { name: 'Segment C', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.1) },
                ]
              },
              {
                name: mode === 'real' ? 'Standard Customers' : 'SMB',
                value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.3),
                drillDown: [
                  { name: 'Category 1', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.15) },
                  { name: 'Category 2', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.1) },
                  { name: 'Category 3', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.05) },
                ]
              },
              {
                name: mode === 'real' ? 'New Customers' : 'Startup',
                value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.2),
                drillDown: [
                  { name: 'Type A', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.1) },
                  { name: 'Type B', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.06) },
                  { name: 'Type C', value: Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.04) },
                ]
              },
            ]}
            title={mode === 'real' ? 'Your Customer Segments' : 'Customer Segment Analysis'}
            description="Revenue by customer segment with detailed breakdown"
            defaultType="bar"
            enableDrillDown={true}
          />
          
          <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass">
            <CardHeader>
              <CardTitle className="text-lg">Segment Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.5 / 1000)}K
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mode === 'real' ? 'Premium Revenue' : 'Enterprise Revenue'}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    ${Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.3 / 1000)}K
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mode === 'real' ? 'Standard Revenue' : 'SMB Revenue'}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    ${Math.round(currentData.salesRevenue[currentData.salesRevenue.length - 1].value * 0.2 / 1000)}K
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mode === 'real' ? 'New Customer Revenue' : 'Startup Revenue'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};