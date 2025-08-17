import { Upload } from 'lucide-react';
import { DataUpload } from '@/components/DataUpload';
import { DataFieldsLegend } from '@/components/DataExplanation';
import { MetricData } from '@/utils/mockData';

interface DataUploadPageProps {
  onDataUploaded: (data: { [key: string]: MetricData[] }) => void;
  hasUploadedData: boolean;
}

const DataUploadPage = ({ onDataUploaded, hasUploadedData }: DataUploadPageProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Upload Your Data
          </h1>
          <p className="text-muted-foreground">
            Upload your business data for enhanced ML analysis and personalized insights
          </p>
        </div>
      </div>

      {/* Upload Status */}
      {hasUploadedData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium">
              Data successfully uploaded and ready for analysis
            </span>
          </div>
        </div>
      )}

      {/* Data Upload Component */}
      <DataUpload onDataUploaded={onDataUploaded} />

      {/* Data Format Explanation */}
      <DataFieldsLegend />

      {/* Benefits of Real Data */}
      <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Benefits of Using Your Real Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Enhanced Predictions</h4>
            <p className="text-sm text-muted-foreground">
              Our advanced ML algorithms provide more accurate forecasts based on your actual business patterns
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Personalized Insights</h4>
            <p className="text-sm text-muted-foreground">
              Get tailored recommendations and alerts specific to your business performance
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Seasonal Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Detect and account for seasonal patterns in your business metrics
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Anomaly Detection</h4>
            <p className="text-sm text-muted-foreground">
              Automatically identify unusual patterns and potential issues in your data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadPage;