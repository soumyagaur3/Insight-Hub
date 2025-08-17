import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  previousValue: number;
  currentValue: number;
  icon: React.ReactNode;
  format?: (value: number) => string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  previousValue, 
  currentValue, 
  icon,
  format = (v) => v.toString()
}: MetricsCardProps) => {
  const trend = currentValue > previousValue;
  const trendPercentage = previousValue ? ((currentValue - previousValue) / previousValue * 100) : 0;

  return (
    <div className="group bg-gradient-glass backdrop-blur-md p-6 rounded-2xl shadow-glass hover:shadow-glow transition-all duration-500 hover:scale-105 border border-border/30 hover:border-primary/30 relative overflow-hidden">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-primary shadow-glow group-hover:scale-110 transition-transform duration-300">
              <div className="text-primary-foreground">
                {icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{value}</p>
          
          <div className="flex items-center gap-2">
            {trend ? (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 border border-success/30">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs font-semibold text-success">
                  +{Math.abs(trendPercentage).toFixed(1)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/20 border border-destructive/30">
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="text-xs font-semibold text-destructive">
                  -{Math.abs(trendPercentage).toFixed(1)}%
                </span>
              </div>
            )}
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};