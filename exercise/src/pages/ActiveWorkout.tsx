import React, { useState, useEffect } from 'react';
import { DailyWorkout, WorkoutExercise } from '../types';
import { formatSecondsToMMSS } from '../data/goalConfig';
import {
  playWhistleSound,
  playAlertBeep,
  playChimeSound,
  speakVoice,
  isSoundEnabled,
  isVoiceEnabled,
  setSoundEnabled,
  setVoiceEnabled
} from '../services/soundService';

interface ActiveWorkoutProps {
  workout: DailyWorkout;
  onFinishWorkout: (completedWorkout: DailyWorkout, elapsedSeconds: number) => void;
  onCancel: () => void;
}

export const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workout,
  onFinishWorkout,
  onCancel
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Audio & Voice States
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled);
  const [voiceOn, setVoiceOn] = useState<boolean>(isVoiceEnabled);

  // Exercise Progress
  const exercises = workout.exercises || [];
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);

  const currentEx: WorkoutExercise | undefined = exercises[currentExIndex];

  // Whistle and session start voice
  useEffect(() => {
    playWhistleSound();
    speakVoice(`Starting session: ${workout.title}. Let's get closer to 1.6 KM in 8 minutes!`);
  }, []);

  // Announce exercise name & target on arrival
  useEffect(() => {
    if (!currentEx || isResting) return;
    const targetStr = currentEx.reps
      ? `${currentEx.reps} reps`
      : `${currentEx.durationSeconds} seconds`;
    speakVoice(`Exercise: ${currentEx.name}. Target: ${targetStr}. Set ${currentSet} of ${currentEx.sets}. Get ready!`);
  }, [currentExIndex, currentSet, isResting]);

  // Overall workout timer
  useEffect(() => {
    let interval: any = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  // Rest timer countdown with beeps and voice
  useEffect(() => {
    let interval: any = null;
    if (isResting && restSecondsLeft > 0) {
      if (restSecondsLeft <= 3) {
        playAlertBeep(900, 100);
        speakVoice(restSecondsLeft.toString());
      }
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restSecondsLeft === 0) {
      setIsResting(false);
      playWhistleSound();
      speakVoice('Rest period over. Get ready for your next set!');
    }
    return () => clearInterval(interval);
  }, [isResting, restSecondsLeft]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
  };

  const handleCompleteSet = () => {
    if (!currentEx) return;

    if (currentSet < currentEx.sets) {
      setCurrentSet((prev) => prev + 1);
      playChimeSound();
      startRest(currentEx.restSeconds || 30);
    } else {
      // Move to next exercise
      if (currentExIndex < exercises.length - 1) {
        const nextIdx = currentExIndex + 1;
        setCurrentExIndex(nextIdx);
        setCurrentSet(1);
        playChimeSound();
        startRest(currentEx.restSeconds || 45);
      } else {
        // All exercises completed
        playChimeSound();
        speakVoice('All exercises completed! Workout finished.');
        onFinishWorkout(workout, elapsedSeconds);
      }
    }
  };

  const startRest = (seconds: number) => {
    setRestSecondsLeft(seconds);
    setIsResting(true);
  };

  return (
    <main className="max-w-3xl mx-auto px-gutter py-md flex flex-col gap-md min-h-screen pb-24 text-on-surface">
      {/* Active Workout Header / Timer Bar */}
      <header className="flex justify-between items-center bg-surface-container p-md rounded-xl border border-outline-variant">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            ACTIVE SESSION • {workout.location} MODE
          </span>
          <h1 className="font-headline-md text-headline-md text-primary">{workout.title}</h1>
        </div>

        <div className="flex items-center gap-sm">
          {/* Audio & Voice Toggles */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-colors ${
              soundOn
                ? 'bg-primary-container/20 border-primary-container text-primary-container'
                : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}
            title={soundOn ? 'Whistle & Sound FX: ON' : 'Whistle & Sound FX: OFF'}
          >
            <span className="material-symbols-outlined text-sm">
              {soundOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full border transition-colors ${
              voiceOn
                ? 'bg-primary-container/20 border-primary-container text-primary-container'
                : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}
            title={voiceOn ? 'Voice Coaching: ON' : 'Voice Coaching: OFF'}
          >
            <span className="material-symbols-outlined text-sm">
              {voiceOn ? 'record_voice_over' : 'voice_over_off'}
            </span>
          </button>

          <div className="flex flex-col items-end ml-md">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
              ELAPSED TIME
            </span>
            <span className="font-data-tabular text-2xl font-bold text-primary">
              {formatSecondsToMMSS(elapsedSeconds)}
            </span>
          </div>
        </div>
      </header>

      {/* Rest Timer Overlay */}
      {isResting ? (
        <div className="glass-panel p-lg rounded-xl text-center flex flex-col items-center gap-md border-2 border-primary-container neo-glow">
          <span className="material-symbols-outlined text-4xl text-primary-container">timer</span>
          <h2 className="font-headline-md text-headline-md text-primary-container">
            REST & RECOVER
          </h2>
          <div className="font-data-tabular text-5xl font-bold text-primary">
            {restSecondsLeft}s
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => setRestSecondsLeft((prev) => prev + 30)}
              className="px-md py-xs rounded bg-surface-container text-xs font-label-caps border border-outline-variant"
            >
              +30 SEC
            </button>

            <button
              onClick={() => {
                setIsResting(false);
                playWhistleSound();
              }}
              className="px-md py-xs rounded bg-primary-container text-on-primary-container text-xs font-label-caps font-bold"
            >
              SKIP REST
            </button>
          </div>
        </div>
      ) : currentEx ? (
        /* Current Exercise Card */
        <div className="glass-card rounded-xl overflow-hidden flex flex-col gap-md p-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <div>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                Exercise {currentExIndex + 1} of {exercises.length}
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">{currentEx.name}</h2>
            </div>
            <div className="bg-primary-container/20 border border-primary-container px-md py-xs rounded-full">
              <span className="font-data-tabular text-primary font-bold text-sm">
                SET {currentSet} OF {currentEx.sets}
              </span>
            </div>
          </div>

          <div className="flex justify-around items-center py-md bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-center">
            {currentEx.reps ? (
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                  TARGET REPS
                </span>
                <span className="font-data-tabular text-3xl font-bold text-primary">
                  {currentEx.reps}
                </span>
              </div>
            ) : (
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                  DURATION
                </span>
                <span className="font-data-tabular text-3xl font-bold text-primary">
                  {currentEx.durationSeconds}s
                </span>
              </div>
            )}

            <div className="h-10 w-[1px] bg-outline-variant/40" />

            <div>
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                REST PERIOD
              </span>
              <span className="font-data-tabular text-xl text-on-surface">
                {currentEx.restSeconds}s
              </span>
            </div>
          </div>

          <button
            onClick={handleCompleteSet}
            className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline-md text-headline-md py-md rounded-lg flex items-center justify-center gap-sm transition-colors active:scale-[0.98] neo-glow"
          >
            <span>COMPLETE SET {currentSet}</span>
            <span className="material-symbols-outlined">check_circle</span>
          </button>
        </div>
      ) : (
        /* Running / Non-exercise Session View */
        <div className="glass-card rounded-xl p-lg text-center flex flex-col items-center gap-md">
          <span className="material-symbols-outlined text-5xl text-primary-container">sprint</span>
          <h2 className="font-headline-md text-headline-md text-primary">Outdoor Run In Progress</h2>
          <p className="font-body-md text-sm text-on-surface-variant">
            Maintain steady pace toward target {workout.targetPace || '5:00/km'}.
          </p>
          <button
            onClick={() => {
              playChimeSound();
              speakVoice('Session complete!');
              onFinishWorkout(workout, elapsedSeconds);
            }}
            className="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-lg neo-glow mt-md"
          >
            FINISH & RECORD RUN
          </button>
        </div>
      )}

      {/* Control Buttons Footer */}
      <div className="flex gap-sm pt-md border-t border-outline-variant">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1 py-sm rounded-lg font-label-caps text-xs border border-outline-variant text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span>{isPaused ? 'RESUME WORKOUT' : 'PAUSE WORKOUT'}</span>
        </button>

        <button
          onClick={() => {
            playChimeSound();
            speakVoice('Ending session.');
            onFinishWorkout(workout, elapsedSeconds);
          }}
          className="flex-1 py-sm rounded-lg font-label-caps text-xs bg-surface-container text-primary border border-primary-container/40 hover:bg-surface-variant transition-colors flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">flag</span>
          <span>END SESSION</span>
        </button>
      </div>
    </main>
  );
};
