import { Button } from "@/components/ui/button";

interface DateRangeSelectorProps {
  selectedRange: 'historical' | 'predictions';
  onRangeChange: (range: 'historical' | 'predictions') => void;
}

export const DateRangeSelector = ({ selectedRange, onRangeChange }: DateRangeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-secondary rounded-lg">
      <Button
        variant={selectedRange === 'historical' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRangeChange('historical')}
        className="text-sm"
      >
        Last 12 Months
      </Button>
      <Button
        variant={selectedRange === 'predictions' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRangeChange('predictions')}
        className="text-sm"
      >
        Next 3 Months
      </Button>
    </div>
  );
};