import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MetricData } from '@/utils/mockData';

interface DataUploadProps {
  onDataUploaded: (data: { [key: string]: MetricData[] }) => void;
}

export const DataUpload = ({ onDataUploaded }: DataUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('processing');
    setUploadedFile(file.name);

    try {
      const text = await file.text();
      const parsedData = parseCSVData(text);
      
      // Simulate processing time for ML training
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onDataUploaded(parsedData);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error parsing file:', error);
      setUploadStatus('error');
    }
  };

  const parseCSVData = (csvText: string): { [key: string]: MetricData[] } => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Expected format: month, sales_revenue, customer_acquisition_cost, conversion_rate
    const data: { [key: string]: MetricData[] } = {
      salesRevenue: [],
      customerAcquisitionCost: [],
      conversionRate: []
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 4) {
        const month = values[0];
        const salesRevenue = parseFloat(values[1]) || 0;
        const cac = parseFloat(values[2]) || 0;
        const conversionRate = parseFloat(values[3]) || 0;

        data.salesRevenue.push({ month, value: salesRevenue });
        data.customerAcquisitionCost.push({ month, value: cac });
        data.conversionRate.push({ month, value: conversionRate });
      }
    }

    return data;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upload Your Business Data</h3>
        </div>
        
        <p className="text-muted-foreground mb-6 text-sm">
          Upload a CSV file with your business metrics for advanced ML analysis and predictions
        </p>

        {/* Expected format info */}
        <div className="bg-secondary/50 p-4 rounded-lg mb-6 text-left">
          <h4 className="font-medium text-sm mb-2">Expected CSV Format:</h4>
          <code className="text-xs text-muted-foreground block">
            month,sales_revenue,customer_acquisition_cost,conversion_rate<br/>
            Jan,850000,125,3.2<br/>
            Feb,920000,118,3.4<br/>
            ...
          </code>
        </div>

        {/* Upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button 
          onClick={handleUploadClick}
          disabled={uploadStatus === 'processing'}
          className="mb-4"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploadStatus === 'processing' ? 'Processing...' : 'Choose CSV File'}
        </Button>

        {/* Status messages */}
        {uploadStatus === 'processing' && (
          <Alert className="border-primary/20 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Processing {uploadedFile} and training ML model...
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'success' && (
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Successfully uploaded {uploadedFile} and trained enhanced ML model!
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              Error processing {uploadedFile}. Please check the file format and try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};