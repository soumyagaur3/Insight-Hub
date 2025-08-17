import { Download, FileSpreadsheet, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MetricData } from '@/utils/mockData';

interface ExportDataProps {
  data: { [key: string]: MetricData[] };
  predictions: { [key: string]: MetricData[] };
}

export const ExportData = ({ data, predictions }: ExportDataProps) => {
  const exportToCSV = () => {
    const allData = Object.entries(data).map(([metric, values]) => {
      return values.map(item => ({
        metric,
        date: item.month,
        value: item.value,
        type: 'historical'
      }));
    }).flat();

    const predictionData = Object.entries(predictions).map(([metric, values]) => {
      return values.map(item => ({
        metric,
        date: item.month,
        value: item.value,
        type: 'prediction'
      }));
    }).flat();

    const csvData = [...allData, ...predictionData];
    const headers = ['metric', 'date', 'value', 'type'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-metrics-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      historical: data,
      predictions
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-metrics-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};