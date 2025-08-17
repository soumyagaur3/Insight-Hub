import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, 
  TrendingUp, ArrowLeft, ZoomIn 
} from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  profit?: number;
  conversion?: number;
  drillDown?: ChartData[];
}

interface InteractiveChartProps {
  data: ChartData[];
  title: string;
  description?: string;
  defaultType?: 'line' | 'bar' | 'area' | 'pie';
  enableDrillDown?: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  title,
  description,
  defaultType = 'line',
  enableDrillDown = true
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>(defaultType);
  const [currentData, setCurrentData] = useState(data);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([title]);
  const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null);

  const handleDrillDown = (point: ChartData) => {
    if (!enableDrillDown || !point.drillDown) return;
    
    setCurrentData(point.drillDown);
    setBreadcrumb([...breadcrumb, point.name]);
    setSelectedPoint(point);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentData(data);
      setBreadcrumb([title]);
      setSelectedPoint(null);
    }
    // Could implement multi-level drill down here
  };

  const renderChart = () => {
    const chartProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              activeDot={{ 
                r: 8, 
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2
              }}
              className="animate-fade-in"
            />
            {currentData[0]?.revenue && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))', r: 4 }}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorGradient)"
              className="animate-fade-in cursor-pointer"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="cursor-pointer hover:opacity-80 transition-opacity animate-scale-in"
            />
            {currentData[0]?.revenue && (
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              className="cursor-pointer animate-scale-in"
            >
              {currentData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="backdrop-blur-md bg-gradient-glass border-border/50 shadow-glass animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              {breadcrumb.join(' > ')}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {enableDrillDown && breadcrumb.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBreadcrumbClick(0)}
              className="ml-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            className="flex items-center gap-2"
          >
            <LineChartIcon className="h-4 w-4" />
            Line
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Bar
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Area
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="flex items-center gap-2"
          >
            <PieChartIcon className="h-4 w-4" />
            Pie
          </Button>
        </div>

        {/* Drill-down indicators */}
        {enableDrillDown && (
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <ZoomIn className="h-3 w-3 mr-1" />
              Click points to drill down
            </Badge>
            {selectedPoint && (
              <Badge variant="outline" className="text-xs">
                Viewing: {selectedPoint.name}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};