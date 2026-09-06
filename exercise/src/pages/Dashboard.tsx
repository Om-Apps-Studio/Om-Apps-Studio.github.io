import React from 'react';
import { UserProfile, DailyWorkout, SmartCoachInsight } from '../types';
import { ProgressRing } from '../components/dashboard/ProgressRing';
import { SmartCoachCard } from '../components/dashboard/SmartCoachCard';
import { formatSecondsToMMSS } from '../data/goalConfig';

interface DashboardProps {
  profile: UserProfile | null;
  todayWorkout: DailyWorkout | null;
  insight: SmartCoachInsight | null;
  onStartWorkout: (workout: DailyWorkout) => void;
  onConvertToHome: (workout: DailyWorkout) => void;
  onOpenMonthlyInput: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  todayWorkout,
  insight,
  onStartWorkout,
  onConvertToHome,
  onOpenMonthlyInput
}) => {
  const currentBest16kSec = profile?.currentBest16kSeconds || 532; // 8:52
  const currentPaceFormatted = formatSecondsToMMSS(currentBest16kSec / 1.6); // 5:32

  return (
    <main className="flex-1 px-container-margin py-md flex flex-col gap-lg max-w-7xl mx-auto w-full pb-24 md:pb-8">
      {/* Welcome Section */}
      <section className="flex justify-between items-end border-b border-outline-variant/30 pb-sm">
        <div className="flex flex-col gap-xs">
          <h1 className="font-headline-lg text-headline-lg text-primary">
            Good Day, {profile?.name || 'Athlete'} 👋
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Target: 1.6 KM in 8:00 (5:00/km Pace)
          </p>
        </div>
        <button
          onClick={onOpenMonthlyInput}
          className="px-md py-xs rounded-lg border border-primary-container text-primary-container font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
          <span>Monthly Telemetry</span>
        </button>
      </section>

      {/* Goal Dashboard (Bento Grid Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-base">
        {/* Main Goal Card */}
        <div className="glass-panel rounded-xl p-md md:col-span-8 flex flex-col md:flex-row items-center gap-lg relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/5 rounded-full blur-2xl pointer-events-none" />

          {/* Progress Ring */}
          <ProgressRing currentBestSeconds={currentBest16kSec} targetSeconds={480} />

          {/* Goal Stats */}
          <div className="flex-1 w-full flex flex-col gap-sm">
            <div className="flex justify-between items-end border-b border-outline-variant pb-xs">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Current Best
                </span>
                <span className="font-display-lg text-display-lg text-on-surface">
                  {formatSecondsToMMSS(currentBest16kSec)}
                </span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="font-label-caps text-label-caps text-primary-container uppercase">
                  Target
                </span>
                <span className="font-headline-md text-headline-md text-primary-container">
                  8:00
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                1.6 KM GOAL • 400M SPLIT 2:00
              </span>
              <span className="material-symbols-outlined text-primary-container text-sm">
                trending_up
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Mini Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:col-span-12 gap-base">
          {/* Current Pace */}
          <div className="glass-panel rounded-lg p-sm flex flex-col justify-between h-24 border-t-2 border-t-surface-container-highest">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Current Pace
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-tabular text-data-tabular text-primary text-xl">
                {currentPaceFormatted}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">/km</span>
            </div>
          </div>

          {/* Target Pace */}
          <div className="glass-panel rounded-lg p-sm flex flex-col justify-between h-24 border-t-2 border-t-primary-container">
            <span className="font-label-caps text-label-caps text-primary-container uppercase">
              Target Pace
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-tabular text-data-tabular text-primary text-xl">5:00</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">/km</span>
            </div>
          </div>

          {/* Target Speed */}
          <div className="glass-panel rounded-lg p-sm flex flex-col justify-between h-24 border-t-2 border-t-surface-container-highest">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Target Speed
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-tabular text-data-tabular text-primary text-xl">12</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">km/h</span>
            </div>
          </div>

          {/* 400m Target Split */}
          <div className="glass-panel rounded-lg p-sm flex flex-col justify-between h-24 border-t-2 border-t-primary-container">
            <span className="font-label-caps text-label-caps text-primary-container uppercase">
              400m Target Split
            </span>
            <div className="flex items-baseline gap-xs">
              <span className="font-data-tabular text-data-tabular text-primary text-xl">2:00</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rainy Day Quick Template Banner - Mobile Optimized */}
      <div className="glass-panel rounded-xl p-md flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-md border-l-4 border-l-primary-container bg-surface-container-low/80">
        <div className="flex items-start sm:items-center gap-md">
          <div className="text-3xl flex-shrink-0">🌧️💪</div>
          <div>
            <span className="font-label-caps text-xs text-primary-container uppercase font-bold tracking-wider">
              OFFICIAL TRAINING TEMPLATE
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Rainy-Day Home Training Plan
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
              30–35 min • 3 Strength Rounds • 8-min Running Cardio • Low-Impact Mode
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            onStartWorkout({
              id: 'rainy-template',
              date: new Date().toISOString().split('T')[0],
              dayNumber: 1,
              title: '🌧️ RAINY-DAY HOME WORKOUT',
              type: 'Full Body Conditioning',
              location: 'HOME',
              durationMinutes: 35,
              intensity: 'High',
              status: 'planned',
              description: '1.6 km in 8 minutes + Belly Fat Loss + Muscle & Strength Builder',
              exercises: []
            })
          }
          className="w-full sm:w-auto px-lg py-md sm:py-sm bg-primary-container text-on-primary-container font-headline-md rounded-lg neo-glow flex items-center justify-center gap-xs font-bold text-center active:scale-[0.98] transition-transform h-[48px] flex-shrink-0"
        >
          <span>START RAINY WORKOUT</span>
          <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        </button>
      </div>

      {/* Today's Workout Section */}
      <section className="flex flex-col gap-sm">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md text-on-surface">Today's Session</h2>
          {todayWorkout?.location === 'FIELD' && (
            <button
              onClick={() => todayWorkout && onConvertToHome(todayWorkout)}
              className="text-primary-container hover:underline text-xs font-label-caps flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[14px]">cloud_off</span>
              <span>Can't train outside? Convert to HOME</span>
            </button>
          )}
        </div>

        {todayWorkout ? (
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
            {/* Graphic Header */}
            <div className="h-24 bg-surface-container-highest relative flex items-center px-md overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #00f5ff 0, #00f5ff 1px, transparent 1px, transparent 8px)'
                }}
              />
              <div className="relative z-10 flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container neo-glow">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {todayWorkout.location === 'FIELD' ? 'sprint' : 'fitness_center'}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {todayWorkout.title}
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    {todayWorkout.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-md flex flex-col gap-md">
              <div className="flex flex-wrap gap-sm">
                <span className="bg-surface-container px-3 py-1 rounded-sm font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>{' '}
                  {todayWorkout.durationMinutes} min
                </span>
                <span className="bg-error-container/20 border border-error/30 px-3 py-1 rounded-sm font-label-caps text-label-caps text-error uppercase flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>{' '}
                  {todayWorkout.intensity} Intensity
                </span>
                <span className="bg-surface-container px-3 py-1 rounded-sm font-label-caps text-label-caps text-primary-container uppercase flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">
                    {todayWorkout.location === 'FIELD' ? 'stadium' : 'home'}
                  </span>{' '}
                  {todayWorkout.location} MODE
                </span>
              </div>

              {/* START WORKOUT Button (Hero Component) */}
              <button
                onClick={() => onStartWorkout(todayWorkout)}
                className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-md text-headline-md py-sm rounded-lg flex items-center justify-center gap-sm transition-colors active:scale-[0.98] neo-glow"
              >
                <span>START WORKOUT</span>
                <span className="material-symbols-outlined">play_arrow</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-lg text-center flex flex-col items-center gap-sm">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              event_available
            </span>
            <p className="font-body-md text-on-surface-variant">
              No workout scheduled for today. Take rest or generate a new monthly plan.
            </p>
            <button
              onClick={onOpenMonthlyInput}
              className="px-md py-xs bg-primary-container text-on-primary-container rounded-lg font-label-caps"
            >
              Generate Monthly Plan
            </button>
          </div>
        )}
      </section>

      {/* Smart Coach Insight */}
      <SmartCoachCard insight={insight} />
    </main>
  );
};
