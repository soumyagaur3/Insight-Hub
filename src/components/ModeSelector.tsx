import { Database, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeSelectorProps {
  mode: 'demo' | 'real';
  onModeChange: (mode: 'demo' | 'real') => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="flex gap-3 p-1 bg-secondary rounded-lg max-w-fit mx-auto">
      <Button
        variant={mode === 'demo' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('demo')}
        className="flex items-center gap-2"
      >
        <Database className="h-4 w-4" />
        Demo Data
      </Button>
      <Button
        variant={mode === 'real' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('real')}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Real Data
      </Button>
    </div>
  );
};