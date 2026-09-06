import React from 'react';
import { UserProfile, PersonalRecord, BodyMetricsHistory } from '../types';
import { formatSecondsToMMSS } from '../data/goalConfig';

interface ProgressAnalyticsProps {
  profile: UserProfile | null;
  personalRecords: PersonalRecord[];
  bodyMetrics: BodyMetricsHistory[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  profile,
  personalRecords,
  bodyMetrics
}) => {
  const best16kSec = profile?.currentBest16kSeconds || 532; // 8:52

  return (
    <main className="max-w-7xl mx-auto px-gutter py-md flex flex-col gap-lg pb-24 md:pb-8 w-full">
      {/* Header */}
      <section className="flex flex-col gap-xs border-b border-outline-variant/30 pb-sm">
        <h1 className="font-headline-lg text-headline-lg text-primary">Progress & Performance Analytics</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Track 1.6 km time reductions, body composition changes, and strength PRs.
        </p>
      </section>

      {/* Goal Target Banner */}
      <div className="glass-card rounded-xl p-md flex flex-col md:flex-row justify-between items-center gap-md border-l-4 border-l-primary-container">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            PRIMARY OBJECTIVE
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            1.6 KM in 8:00 (5:00/km Pace)
          </h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Current Best: <strong className="text-primary font-data-tabular">{formatSecondsToMMSS(best16kSec)}</strong> • Target Speed: <strong className="text-primary">12 km/h</strong>
          </p>
        </div>
        <div className="flex gap-md text-center">
          <div className="bg-surface-container-lowest px-md py-sm rounded-lg border border-outline-variant/30">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
              1.6 KM BEST
            </span>
            <span className="font-data-tabular text-xl font-bold text-primary">
              {formatSecondsToMMSS(best16kSec)}
            </span>
          </div>
          <div className="bg-surface-container-lowest px-md py-sm rounded-lg border border-outline-variant/30">
            <span className="font-label-caps text-[10px] text-primary-container uppercase block">
              TARGET
            </span>
            <span className="font-data-tabular text-xl font-bold text-primary-container">
              8:00
            </span>
          </div>
        </div>
      </div>

      {/* Personal Records Grid */}
      <section className="flex flex-col gap-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary-container">emoji_events</span>
          <span>Personal Records (PRs)</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {personalRecords.map((pr) => (
            <div
              key={pr.id}
              className="glass-panel rounded-xl p-md flex flex-col justify-between h-32 border-t-2 border-t-primary-container relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-primary-container/20">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
              <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">
                {pr.metricName}
              </span>
              <div>
                <span className="font-data-tabular text-2xl font-bold text-primary block">
                  {pr.formattedValue}
                </span>
                <span className="font-label-caps text-[10px] text-primary-container">
                  Achieved: {pr.achievedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progression Graphs Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {/* 1.6 KM Time History Chart */}
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <h3 className="font-headline-md text-headline-md text-primary">1.6 KM Time Trend</h3>
            <span className="font-data-tabular text-xs text-primary-container">Target: 8:00</span>
          </div>
          <div className="h-48 w-full bg-surface-container-lowest rounded-lg p-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            {/* SVG Visual Graph */}
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <path
                d="M 10 90 Q 75 70, 150 50 T 290 30"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="3"
              />
              <path
                d="M 10 90 Q 75 70, 150 50 T 290 30 L 290 120 L 10 120 Z"
                fill="url(#chart-grad)"
                opacity="0.25"
              />
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between font-data-tabular text-[10px] text-on-surface-variant pt-xs border-t border-outline-variant/20">
              <span>Week 1 (9:20)</span>
              <span>Week 2 (9:05)</span>
              <span>Week 3 (8:52)</span>
              <span className="text-primary font-bold">Goal (8:00)</span>
            </div>
          </div>
        </div>

        {/* Body Weight & Waist Trend */}
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <h3 className="font-headline-md text-headline-md text-primary">Body & Waist Metrics</h3>
            <span className="font-data-tabular text-xs text-on-surface-variant">
              Weight & Waist Circumference
            </span>
          </div>
          <div className="h-48 w-full bg-surface-container-lowest rounded-lg p-sm flex flex-col justify-between border border-outline-variant/30">
            <div className="space-y-sm my-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant font-label-caps">Current Weight:</span>
                <span className="font-data-tabular text-primary font-bold text-base">
                  {profile?.weightKg || 75.5} kg
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full w-3/4 rounded-full" />
              </div>

              <div className="flex justify-between items-center text-xs pt-xs">
                <span className="text-on-surface-variant font-label-caps">Waist Circumference:</span>
                <span className="font-data-tabular text-primary font-bold text-base">
                  {profile?.waistCm || 82.0} cm
                </span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-primary-fixed h-full w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
