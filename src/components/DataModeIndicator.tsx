import { Database, Upload, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataModeIndicatorProps {
  mode: 'demo' | 'real';
  hasUploadedData?: boolean;
}

export const DataModeIndicator = ({ mode, hasUploadedData }: DataModeIndicatorProps) => {
  if (mode === 'demo') {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm text-blue-700 dark:text-blue-300">
          Using demo data with Kaggle marketing dataset
        </span>
        <Badge variant="secondary" className="text-xs">Demo Mode</Badge>
      </div>
    );
  }

  if (mode === 'real' && hasUploadedData) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm text-green-700 dark:text-green-300">
          Using your uploaded data with enhanced ML analysis
        </span>
        <Badge variant="default" className="text-xs">Real Data Mode</Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
      <Upload className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <span className="text-sm text-orange-700 dark:text-orange-300">
        Real data mode - please upload your business data
      </span>
      <Badge variant="outline" className="text-xs">Awaiting Upload</Badge>
    </div>
  );
};