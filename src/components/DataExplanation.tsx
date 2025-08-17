import { Info, HelpCircle } from 'lucide-react';
import { dataFieldExplanations } from '@/utils/kaggleData';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataExplanationProps {
  fieldKey: keyof typeof dataFieldExplanations;
  label: string;
}

export const DataExplanation = ({ fieldKey, label }: DataExplanationProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{dataFieldExplanations[fieldKey]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const DataFieldsLegend = () => {
  return (
    <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Data Field Explanations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(dataFieldExplanations).map(([key, explanation]) => (
          <div key={key} className="p-3 bg-secondary/50 rounded-lg">
            <div className="font-medium text-sm text-foreground capitalize mb-1">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="text-xs text-muted-foreground">
              {explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};