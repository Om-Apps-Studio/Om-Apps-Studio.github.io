import React from 'react';

interface ProgressRingProps {
  currentBestSeconds: number; // e.g. 532 (8:52)
  targetSeconds: number; // 480 (8:00)
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  currentBestSeconds,
  targetSeconds
}) => {
  const diffSeconds = Math.max(0, currentBestSeconds - targetSeconds);
  const percentage = Math.min(100, Math.max(10, Math.round((targetSeconds / currentBestSeconds) * 100)));

  // SVG parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.2
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background track */}
        <circle
          className="text-surface-container-high"
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
        />
        {/* Progress line */}
        <circle
          className="text-primary-container progress-ring-circle glow-stroke"
          cx="50"
          cy="50"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data-tabular text-data-tabular text-primary font-bold">
          {diffSeconds}s
        </span>
        <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-wider uppercase">
          TO GO
        </span>
      </div>
    </div>
  );
};
