import { Database, ExternalLink, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const KaggleDataSource = () => {
  return (
    <div className="bg-gradient-card p-4 rounded-lg shadow-card border border-border mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Data Source</h3>
            <p className="text-xs text-muted-foreground">Kaggle: Marketing Spending Analysis Dataset</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            API Connected
          </Badge>
          <a 
            href="https://www.kaggle.com/datasets/sinderpreet/analyze-the-marketing-spending" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-glow transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
      
      <Alert className="mt-3 border-warning/20 bg-warning/5">
        <AlertCircle className="h-4 w-4 text-warning" />
        <AlertDescription className="text-warning text-xs">
          <strong>Demo Mode:</strong> This dashboard uses simulated data based on the Kaggle marketing spending dataset structure. 
          In production, this would connect to real Kaggle API endpoints.
        </AlertDescription>
      </Alert>
    </div>
  );
};