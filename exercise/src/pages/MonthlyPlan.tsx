import React, { useState } from 'react';
import { DailyWorkout } from '../types';

interface MonthlyPlanProps {
  workouts: DailyWorkout[];
  onSelectWorkout: (workout: DailyWorkout) => void;
  onConvertToHome: (workout: DailyWorkout) => void;
}

export const MonthlyPlan: React.FC<MonthlyPlanProps> = ({
  workouts,
  onSelectWorkout,
  onConvertToHome
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-11');
  const [currentMonthName, setCurrentMonthName] = useState<string>('August 2026');

  // Selected workout detail
  const selectedWorkout = workouts.find((w) => w.date === selectedDate) || workouts[0];

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'planned':
        return 'status-planned';
      case 'modified':
        return 'status-modified';
      case 'missed':
        return 'status-missed';
      default:
        return 'status-rest';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-gutter py-md space-y-lg md:grid md:grid-cols-12 md:gap-lg md:space-y-0 pb-24 md:pb-8 w-full">
      {/* Calendar Section */}
      <section className="md:col-span-7 space-y-md">
        <div className="glass-card rounded-xl p-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-md">
            <button className="p-xs text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-primary">{currentMonthName}</h2>
            <button className="p-xs text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-xs text-center font-label-caps text-label-caps text-on-surface-variant mb-xs">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>

          {/* Calendar Grid (Days 1 to 31) */}
          <div className="grid grid-cols-7 gap-xs font-data-tabular text-data-tabular">
            {workouts.map((w) => {
              const isSelected = w.date === selectedDate;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedDate(w.date)}
                  className={`aspect-square flex flex-col justify-center items-center rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-surface-container ring-2 ring-primary-container shadow-[0_0_12px_rgba(0,245,255,0.4)]'
                      : 'bg-surface-container hover:bg-surface-variant'
                  }`}
                >
                  <span
                    className={`mb-xs text-xs ${
                      isSelected ? 'text-primary font-bold' : 'text-on-surface'
                    }`}
                  >
                    {w.dayNumber}
                  </span>
                  <div className={`status-dot ${getStatusDotClass(w.status)}`} />
                </button>
              );
            })}
          </div>

          {/* Status Legend */}
          <div className="flex justify-around items-center pt-md mt-sm border-t border-outline-variant/30 text-xs font-label-caps text-on-surface-variant">
            <div className="flex items-center gap-xs">
              <div className="status-dot status-completed" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="status-dot status-planned" />
              <span>Planned</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="status-dot status-modified" />
              <span>Modified</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="status-dot status-missed" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-xs">
              <div className="status-dot status-rest" />
              <span>Rest</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Day Workout Details Sidebar / Drawer */}
      <section className="md:col-span-5 space-y-md">
        {selectedWorkout ? (
          <div className="glass-card rounded-xl p-md flex flex-col gap-md">
            <div className="flex justify-between items-start border-b border-outline-variant pb-xs">
              <div>
                <span className="font-label-caps text-label-caps text-primary-container uppercase">
                  Day {selectedWorkout.dayNumber} • {selectedWorkout.date}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                  {selectedWorkout.title}
                </h3>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-label-caps uppercase bg-surface-container text-on-surface-variant border border-outline-variant">
                {selectedWorkout.status}
              </span>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant">
              {selectedWorkout.description}
            </p>

            <div className="flex flex-wrap gap-xs">
              <span className="bg-surface-container px-2 py-1 rounded text-xs font-label-caps flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">schedule</span>{' '}
                {selectedWorkout.durationMinutes} min
              </span>
              <span className="bg-surface-container px-2 py-1 rounded text-xs font-label-caps flex items-center gap-xs text-primary-container">
                <span className="material-symbols-outlined text-[14px]">
                  {selectedWorkout.location === 'FIELD' ? 'stadium' : 'home'}
                </span>{' '}
                {selectedWorkout.location} MODE
              </span>
            </div>

            {/* Target Pacing / Splits if present */}
            {selectedWorkout.splitsTarget && selectedWorkout.splitsTarget.length > 0 && (
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 flex flex-col gap-xs">
                <span className="font-label-caps text-[11px] text-primary-container uppercase">
                  Target Lap Splits
                </span>
                <div className="grid grid-cols-2 gap-xs">
                  {selectedWorkout.splitsTarget.map((split, i) => (
                    <div key={i} className="flex justify-between text-xs font-data-tabular">
                      <span className="text-on-surface-variant">{split.distance}:</span>
                      <span className="text-primary font-bold">{split.targetTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise List */}
            {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
              <div className="flex flex-col gap-xs">
                <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                  Prescribed Exercises ({selectedWorkout.exercises.length})
                </span>
                <div className="space-y-xs">
                  {selectedWorkout.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-xs bg-surface-container-low rounded border border-outline-variant/20 text-xs"
                    >
                      <span className="font-medium text-on-surface">{ex.name}</span>
                      <span className="font-data-tabular text-primary-container">
                        {ex.sets} sets × {ex.reps ? `${ex.reps} reps` : `${ex.durationSeconds}s`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-xs pt-sm border-t border-outline-variant">
              <button
                onClick={() => onSelectWorkout(selectedWorkout)}
                className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-md py-xs rounded-lg flex items-center justify-center gap-xs neo-glow"
              >
                <span>START WORKOUT</span>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </button>

              {selectedWorkout.location === 'FIELD' && (
                <button
                  onClick={() => onConvertToHome(selectedWorkout)}
                  className="w-full border border-primary-container/50 text-primary-container hover:bg-primary-container/10 font-label-caps text-xs py-xs rounded-lg flex items-center justify-center gap-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">cloud_off</span>
                  <span>Convert to HOME Workout</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-md text-center text-on-surface-variant">
            Select a date to view scheduled workout details.
          </div>
        )}
      </section>
    </main>
  );
};
