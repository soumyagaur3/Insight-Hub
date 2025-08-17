// Simulated Kaggle API integration for "analyze-the-marketing-spending" dataset
// In a real implementation, this would connect to Kaggle's API

export interface MarketingSpendData {
  month: string;
  digital_marketing: number;
  traditional_marketing: number;
  social_media: number;
  email_marketing: number;
  content_marketing: number;
  total_spend: number;
  leads_generated: number;
  conversion_rate: number;
  revenue_generated: number;
  roi: number;
}

// Simulated Kaggle API response
export const simulateKaggleAPI = async (): Promise<MarketingSpendData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map((month, index) => {
    const baseSpend = 50000 + Math.random() * 20000;
    const seasonalFactor = 1 + 0.3 * Math.sin((index / 12) * 2 * Math.PI);
    
    const digital_marketing = Math.round(baseSpend * 0.4 * seasonalFactor);
    const traditional_marketing = Math.round(baseSpend * 0.25 * seasonalFactor);
    const social_media = Math.round(baseSpend * 0.2 * seasonalFactor);
    const email_marketing = Math.round(baseSpend * 0.1 * seasonalFactor);
    const content_marketing = Math.round(baseSpend * 0.05 * seasonalFactor);
    
    const total_spend = digital_marketing + traditional_marketing + social_media + email_marketing + content_marketing;
    const leads_generated = Math.round(total_spend * (0.02 + Math.random() * 0.01));
    const conversion_rate = 2.5 + Math.random() * 2;
    const revenue_generated = Math.round(leads_generated * conversion_rate * 150 * (1 + Math.random() * 0.3));
    const roi = ((revenue_generated - total_spend) / total_spend) * 100;
    
    return {
      month,
      digital_marketing,
      traditional_marketing,
      social_media,
      email_marketing,
      content_marketing,
      total_spend,
      leads_generated,
      conversion_rate,
      revenue_generated,
      roi
    };
  });
};

// Data field explanations for users
export const dataFieldExplanations = {
  digital_marketing: "Spend on digital advertising including Google Ads, display ads, and programmatic advertising",
  traditional_marketing: "Investment in traditional channels like TV, radio, print, and outdoor advertising",
  social_media: "Budget allocated to social media advertising across platforms like Facebook, Instagram, LinkedIn, and Twitter",
  email_marketing: "Costs for email marketing campaigns, automation tools, and list management",
  content_marketing: "Investment in content creation, SEO, blog posts, videos, and thought leadership materials",
  total_spend: "Sum of all marketing channel investments for the month",
  leads_generated: "Total number of qualified leads acquired through all marketing channels",
  conversion_rate: "Percentage of leads that convert to paying customers",
  revenue_generated: "Total revenue attributed to marketing efforts for the month",
  roi: "Return on Investment - percentage return generated from marketing spend"
};

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