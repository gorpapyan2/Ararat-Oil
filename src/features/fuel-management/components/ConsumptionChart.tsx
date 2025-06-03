import React from 'react';

interface ConsumptionData {
  date: string;
  consumption: number;
}

interface ConsumptionChartProps {
  data: ConsumptionData[];
}

const ConsumptionChart: React.FC<ConsumptionChartProps> = ({ data }) => {
  return (
    <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
      <div className="text-center">
        <p className="text-muted-foreground">Consumption Chart</p>
        <p className="text-sm text-muted-foreground mt-2">
          Chart component will be implemented with a charting library
        </p>
        {data && data.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {data.length} data points available
          </p>
        )}
      </div>
    </div>
  );
};

export default ConsumptionChart; 