// Generate realistic mock data for business metrics

export interface MetricData {
  month: string;
  value: number;
  predicted?: boolean;
}

// Improved linear regression for better predictions
export const linearRegression = (data: number[]): { slope: number; intercept: number; r2: number } => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0, r2: 0 };
  
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumYY = data.reduce((acc, yi) => acc + yi * yi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared for prediction confidence
  const meanY = sumY / n;
  const ssRes = data.reduce((acc, yi, i) => {
    const predicted = slope * i + intercept;
    return acc + Math.pow(yi - predicted, 2);
  }, 0);
  const ssTot = data.reduce((acc, yi) => acc + Math.pow(yi - meanY, 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
};

// Enhanced predictions with trend analysis and confidence intervals
export const generatePredictions = (historicalData: MetricData[], months: number = 3): MetricData[] => {
  const values = historicalData.map(d => d.value);
  const { slope, intercept, r2 } = linearRegression(values);
  
  const predictions: MetricData[] = [];
  const lastIndex = historicalData.length - 1;
  const lastValue = values[lastIndex];
  
  // Add some trend momentum and noise reduction based on R-squared
  const trendStrength = Math.min(Math.max(r2, 0.1), 0.9); // Clamp between 0.1 and 0.9
  const noiseReduction = 1 - (r2 * 0.3); // Less noise for better fits
  
  for (let i = 1; i <= months; i++) {
    // Use weighted prediction combining linear trend and momentum
    const linearPrediction = slope * (lastIndex + i) + intercept;
    const momentumPrediction = lastValue + (slope * i);
    
    // Blend predictions based on trend strength
    let predictedValue = (linearPrediction * trendStrength) + (momentumPrediction * (1 - trendStrength));
    
    // Add small random variation but reduce it for more confident predictions
    const variation = predictedValue * 0.02 * noiseReduction * (Math.random() - 0.5);
    predictedValue = Math.max(0, predictedValue + variation);
    
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Calculate future month
    const currentMonth = new Date().getMonth();
    const futureMonthIndex = (currentMonth + i) % 12;
    
    predictions.push({
      month: monthNames[futureMonthIndex],
      value: predictedValue,
      predicted: true
    });
  }
  
  return predictions;
};

// Generate historical data with realistic trends
export const generateHistoricalData = (
  baseValue: number,
  trend: 'up' | 'down' | 'stable',
  volatility: number = 0.1
): MetricData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data: MetricData[] = [];
  
  let currentValue = baseValue;
  const trendFactor = trend === 'up' ? 1.05 : trend === 'down' ? 0.95 : 1.01;
  
  for (let i = 0; i < 12; i++) {
    // Add some seasonal variation and random noise
    const seasonalFactor = 1 + 0.1 * Math.sin((i / 12) * 2 * Math.PI);
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    
    currentValue = currentValue * trendFactor * seasonalFactor * randomFactor;
    
    data.push({
      month: months[i],
      value: Math.round(currentValue)
    });
  }
  
  return data;
};

// Mock data for different metrics
export const mockData = {
  salesRevenue: generateHistoricalData(850000, 'up', 0.15),
  customerAcquisitionCost: generateHistoricalData(125, 'down', 0.12),
  conversionRate: generateHistoricalData(3.2, 'up', 0.08).map(d => ({
    ...d,
    value: Math.max(0.5, Math.min(8, d.value)) // Keep conversion rate realistic (0.5% - 8%)
  }))
};

// Formatting functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
};