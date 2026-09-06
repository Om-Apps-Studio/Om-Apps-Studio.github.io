import React, { useState } from 'react';
import { DailyWorkout, WorkoutLog } from '../types';

interface WorkoutSummaryProps {
  workout: DailyWorkout;
  initialElapsedSeconds: number;
  onSaveLog: (log: WorkoutLog) => void;
  onCancel: () => void;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  initialElapsedSeconds,
  onSaveLog,
  onCancel
}) => {
  const defaultMin = Math.max(1, Math.round(initialElapsedSeconds / 60));

  const [actualDuration, setActualDuration] = useState<number>(defaultMin);
  const [actualDistance, setActualDistance] = useState<number>(workout.targetDistanceKm || 1.6);
  const [rpe, setRpe] = useState<number>(7);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Moderate' | 'High' | 'Peak'>('High');
  const [painFlag, setPainFlag] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const getRpeLabel = (val: number) => {
    if (val <= 3) return '1-3: Easy / Light Recovery';
    if (val <= 6) return '4-6: Moderate Aerobic Zone';
    if (val <= 8) return '7-8: Hard / Target Race Pace Effort';
    return '9-10: Maximum Exhaustion / All Out';
  };

  const handleSave = () => {
    const log: WorkoutLog = {
      id: 'log-' + Date.now(),
      workoutId: workout.id,
      date: workout.date,
      title: workout.title,
      location: workout.location,
      isConvertedToHome: !!workout.isConvertedToHome,
      plannedDurationMinutes: workout.durationMinutes,
      actualDurationMinutes: actualDuration,
      plannedDistanceKm: workout.targetDistanceKm,
      actualDistanceKm: actualDistance,
      rpe,
      energyLevel,
      painOrInjuryFlag: painFlag,
      notes,
      loggedAt: new Date().toISOString(),
      completedExercises: (workout.exercises || []).map((e) => ({
        name: e.name,
        setsCompleted: e.sets,
        repsCompleted: e.reps
      }))
    };

    onSaveLog(log);
  };

  return (
    <main className="max-w-3xl mx-auto px-gutter py-lg flex flex-col gap-lg min-h-screen pb-24 text-on-surface">
      <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            SESSION COMPLETE • POST WORKOUT LOG
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary">{workout.title}</h1>
        </div>
        <button onClick={onCancel} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-lg">
        {/* Actual Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">
              Actual Duration (Minutes)
            </label>
            <input
              type="number"
              className="form-input-stride"
              value={actualDuration}
              onChange={(e) => setActualDuration(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">
              Actual Distance (KM)
            </label>
            <input
              type="number"
              step="0.1"
              className="form-input-stride"
              value={actualDistance}
              onChange={(e) => setActualDistance(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* RPE Rating (1-10) */}
        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">
              RPE Rating (Rate of Perceived Exertion 1-10)
            </label>
            <span className="font-data-tabular text-primary font-bold text-lg">{rpe}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full accent-primary-container cursor-pointer"
            value={rpe}
            onChange={(e) => setRpe(parseInt(e.target.value, 10))}
          />
          <span className="font-label-caps text-[11px] text-primary-container italic">
            {getRpeLabel(rpe)}
          </span>
        </div>

        {/* Energy Level */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-caps text-xs text-on-surface-variant uppercase">
            Energy Level
          </label>
          <div className="grid grid-cols-4 gap-xs">
            {(['Low', 'Moderate', 'High', 'Peak'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setEnergyLevel(lvl)}
                className={`py-xs rounded text-xs font-label-caps transition-all ${
                  energyLevel === lvl
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(0,245,255,0.4)]'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Pain or Injury Flag */}
        <div className="flex justify-between items-center p-sm bg-surface-container-lowest rounded border border-outline-variant/30">
          <div>
            <span className="font-medium text-xs text-on-surface block">
              Pain or Joint Discomfort Flag
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Triggers smart coach recovery adaptation for future sessions.
            </span>
          </div>
          <button
            onClick={() => setPainFlag(!painFlag)}
            className={`px-md py-xs rounded text-xs font-label-caps transition-all ${
              painFlag
                ? 'bg-error-container text-error font-bold border border-error'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {painFlag ? '⚠️ PAIN REPORTED' : 'NO PAIN'}
          </button>
        </div>

        {/* Workout Notes */}
        <div className="flex flex-col gap-xs">
          <label className="font-label-caps text-xs text-on-surface-variant uppercase">
            Notes & Observations
          </label>
          <textarea
            rows={3}
            className="form-input-stride font-body-md text-xs resize-none"
            placeholder="Felt strong on the 400m split repeats. Kept breath controlled..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Save Action Button */}
        <button
          onClick={handleSave}
          className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-md text-headline-md py-md rounded-lg flex items-center justify-center gap-sm neo-glow"
        >
          <span>SAVE WORKOUT RESULT</span>
          <span className="material-symbols-outlined">save</span>
        </button>
      </div>
    </main>
  );
};
