import React, { useState } from 'react';
import { UserProfile, WorkoutLocation } from '../types';
import { formatSecondsToMMSS, parseMMSSToSeconds } from '../data/goalConfig';

interface MonthlyDataEntryProps {
  initialProfile: UserProfile | null;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

export const MonthlyDataEntry: React.FC<MonthlyDataEntryProps> = ({
  initialProfile,
  onSave,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [weightKg, setWeightKg] = useState<number>(initialProfile?.weightKg || 75.5);
  const [heightCm, setHeightCm] = useState<number>(initialProfile?.heightCm || 178);
  const [waistCm, setWaistCm] = useState<number>(initialProfile?.waistCm || 82.0);
  const [bodyFat, setBodyFat] = useState<number>(initialProfile?.bodyFatPercentage || 16.5);

  const [best16kMMSS, setBest16kMMSS] = useState<string>(
    formatSecondsToMMSS(initialProfile?.currentBest16kSeconds || 532)
  );
  const [best1kMMSS, setBest1kMMSS] = useState<string>(
    formatSecondsToMMSS(initialProfile?.currentBest1kSeconds || 315)
  );

  const [maxPushUps, setMaxPushUps] = useState<number>(initialProfile?.maxPushUps || 25);
  const [maxSquats, setMaxSquats] = useState<number>(initialProfile?.maxSquats || 40);
  const [maxPlank, setMaxPlank] = useState<number>(initialProfile?.maxPlankSeconds || 60);

  const [availableDays, setAvailableDays] = useState<Record<string, WorkoutLocation>>(
    initialProfile?.weeklyAvailableDays || {
      Monday: 'FIELD',
      Tuesday: 'HOME',
      Wednesday: 'FIELD',
      Thursday: 'HOME',
      Friday: 'FIELD',
      Saturday: 'FIELD',
      Sunday: 'REST'
    }
  );

  const [availableDuration, setAvailableDuration] = useState<number>(
    initialProfile?.availableDurationMinutes || 45
  );

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayLocationChange = (day: string, loc: WorkoutLocation) => {
    setAvailableDays((prev) => ({ ...prev, [day]: loc }));
  };

  const handleComplete = () => {
    const updatedProfile: UserProfile = {
      ...(initialProfile || {
        id: 'default_user',
        name: 'Om',
        avatarUrl: '',
        targetDistanceKm: 1.6,
        targetTimeFormatted: '8:00',
        targetPaceFormatted: '5:00/km',
        targetSpeedKmh: 12.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
      weightKg,
      heightCm,
      waistCm,
      bodyFatPercentage: bodyFat,
      currentBest16kSeconds: parseMMSSToSeconds(best16kMMSS),
      currentBest1kSeconds: parseMMSSToSeconds(best1kMMSS),
      maxPushUps,
      maxSquats,
      maxPlankSeconds: maxPlank,
      weeklyAvailableDays: availableDays,
      availableDurationMinutes: availableDuration,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedProfile);
  };

  return (
    <main className="flex-grow flex flex-col items-center py-lg px-container-margin relative overflow-hidden max-w-3xl mx-auto w-full pb-24">
      {/* Background Atmospheric effect */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full flex flex-col gap-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-xs border-b border-outline-variant/30 pb-xs">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Monthly Telemetry Initialization
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Calibrate your baseline performance for the upcoming cycle.
            </p>
          </div>
          <button onClick={onCancel} className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative mb-md px-md">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-surface-variant z-0" />
          <div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-primary-container z-0 transition-all duration-300 shadow-[0_0_8px_rgba(0,245,255,0.6)]"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />

          {[
            { num: 1, label: 'Body' },
            { num: 2, label: 'Running' },
            { num: 3, label: 'Strength' },
            { num: 4, label: 'Calendar' },
            { num: 5, label: 'Review' }
          ].map((s) => {
            const isActive = step >= s.num;
            return (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className="relative z-10 flex flex-col items-center gap-xs"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-caps text-xs transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(0,245,255,0.4)]'
                      : 'bg-surface-container-high border-2 border-surface-variant text-on-surface-variant'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`font-label-caps text-[11px] hidden md:block ${
                    isActive ? 'text-primary-container' : 'text-on-surface-variant'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Steps */}
        <div className="glass-panel p-md md:p-lg rounded-xl flex flex-col gap-lg">
          {step === 1 && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm pb-sm border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-primary-container">
                  monitor_weight
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Step 1: Body Metrics
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-stride"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    className="form-input-stride"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Waist Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-stride"
                    value={waistCm}
                    onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Body Fat % (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-stride"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm pb-sm border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-primary-container">directions_run</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Step 2: Running Baseline
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Current Best 1.6 KM Time (MM:SS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8:52"
                    className="form-input-stride"
                    value={best16kMMSS}
                    onChange={(e) => setBest16kMMSS(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Current Best 1 KM Time (MM:SS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5:15"
                    className="form-input-stride"
                    value={best1kMMSS}
                    onChange={(e) => setBest1kMMSS(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm pb-sm border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-primary-container">fitness_center</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Step 3: Strength Baseline
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Max Push-Ups
                  </label>
                  <input
                    type="number"
                    className="form-input-stride"
                    value={maxPushUps}
                    onChange={(e) => setMaxPushUps(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Max Squats
                  </label>
                  <input
                    type="number"
                    className="form-input-stride"
                    value={maxSquats}
                    onChange={(e) => setMaxSquats(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Max Plank (Seconds)
                  </label>
                  <input
                    type="number"
                    className="form-input-stride"
                    value={maxPlank}
                    onChange={(e) => setMaxPlank(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm pb-sm border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-primary-container">
                  calendar_month
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Step 4: Weekly Availability (HOME vs FIELD)
                </h2>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant">
                Select your preferred training location for each day of the week:
              </p>
              <div className="space-y-xs">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex justify-between items-center p-sm bg-surface-container-lowest rounded border border-outline-variant/30"
                  >
                    <span className="font-medium text-sm text-on-surface">{day}</span>
                    <div className="flex gap-xs">
                      {(['HOME', 'FIELD', 'REST'] as WorkoutLocation[]).map((loc) => {
                        const isSelected = availableDays[day] === loc;
                        return (
                          <button
                            key={loc}
                            onClick={() => handleDayLocationChange(day, loc)}
                            className={`px-sm py-1 rounded text-xs font-label-caps transition-all ${
                              isSelected
                                ? loc === 'FIELD'
                                  ? 'bg-primary-container text-on-primary-container font-bold'
                                  : loc === 'HOME'
                                  ? 'bg-secondary-container text-primary font-bold'
                                  : 'bg-outline-variant text-on-surface'
                                : 'bg-surface-container text-on-surface-variant hover:text-primary'
                            }`}
                          >
                            {loc === 'HOME' ? '🏠 HOME' : loc === 'FIELD' ? '🏃 FIELD' : '😴 REST'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-xs mt-sm">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Available Session Duration (Minutes)
                </label>
                <input
                  type="number"
                  className="form-input-stride"
                  value={availableDuration}
                  onChange={(e) => setAvailableDuration(parseInt(e.target.value, 10) || 30)}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm pb-sm border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-primary-container">rocket_launch</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Step 5: Review & Generate Adaptive Plan
                </h2>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant/40 space-y-sm text-xs">
                <div className="flex justify-between border-b border-outline-variant/20 pb-xs">
                  <span className="text-on-surface-variant">Primary Target:</span>
                  <span className="text-primary font-bold">1.6 KM in 8:00 (5:00/km Pace)</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/20 pb-xs">
                  <span className="text-on-surface-variant">Baseline Best 1.6k:</span>
                  <span className="text-on-surface font-data-tabular">{best16kMMSS}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/20 pb-xs">
                  <span className="text-on-surface-variant">Body Metrics:</span>
                  <span className="text-on-surface font-data-tabular">
                    {weightKg} kg • {waistCm} cm waist
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Strength Baseline:</span>
                  <span className="text-on-surface font-data-tabular">
                    {maxPushUps} Push-ups • {maxSquats} Squats • {maxPlank}s Plank
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between gap-sm pt-md border-t border-surface-variant/50">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-lg py-sm rounded-lg font-label-caps text-label-caps border border-outline-variant text-on-surface-variant hover:text-primary transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-lg py-sm rounded-lg font-label-caps text-label-caps bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-colors flex items-center gap-xs shadow-[0_0_12px_rgba(0,245,255,0.3)]"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-lg py-sm rounded-lg font-headline-md text-headline-md bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-colors flex items-center gap-xs neo-glow"
              >
                <span>GENERATE MONTHLY PLAN</span>
                <span className="material-symbols-outlined">auto_mode</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
