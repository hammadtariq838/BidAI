import React, { useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

// Utility Function
const formatNumberLabel = (value: number) => {
  if (value >= 1e9) {
    return '$' + (value / 1e9).toFixed(1) + 'B';
  } else if (value >= 1e6) {
    return '$' + (value / 1e6).toFixed(1) + 'M';
  } else if (value >= 1e3) {
    return '$' + (value / 1e3).toFixed(1) + 'K';
  } else {
    return '$' + value.toLocaleString();
  }
};

const Slider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      value,
      onValueChange,
      ...props
    }: {
      className: string;
      min: number;
      max: number;
      step: number;
      value: number[];
      onValueChange: (newValues: number[]) => void;
    },
    ref
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);

    const handleValueChange = (newValues: React.SetStateAction<number[]>) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues as number[]);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLSpanElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white">
          <SliderPrimitive.Range className="absolute h-full  bg-[#548C2F]" />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute text-center"
              style={{
                left: `calc(${((value - min) / (max - min)) * 100}% -
                  ${index === 0 ? 0 : 60}px)`,
                top: `10px`,
              }}
            >
              <span className="text-xs">{formatNumberLabel(value)}</span>
            </div>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-[#023047]  shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
