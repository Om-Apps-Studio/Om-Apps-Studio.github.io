import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  DailyWorkout,
  WorkoutLog,
  PersonalRecord,
  SmartCoachInsight,
  TCXRunningSession
} from './types';
import {
  getUserProfile,
  updateUserProfile,
  getAllDailyWorkouts,
  saveDailyWorkouts,
  updateDailyWorkout,
  getAllWorkoutLogs,
  saveWorkoutLog,
  getAllPersonalRecords,
  savePersonalRecord,
  getSmartCoachInsight,
  saveRunningSession
} from './services/storageService';
import { generateMonthlyPlan, convertFieldToHome, adaptSchedule } from './services/trainingEngine';

import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { MonthlyPlan } from './pages/MonthlyPlan';
import { MonthlyDataEntry } from './pages/MonthlyDataEntry';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { WorkoutSummary } from './pages/WorkoutSummary';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { ProgressAnalytics } from './pages/ProgressAnalytics';
import { FieldTrainingView } from './pages/FieldTrainingView';
import { Profile } from './pages/Profile';
import { RainyDayWorkoutView } from './components/workout/RainyDayWorkoutView';

const STORAGE_KEY_TAB = 'runfit_coach_active_tab';
const STORAGE_KEY_WORKOUT = 'runfit_coach_active_workout';
const STORAGE_KEY_ELAPSED = 'runfit_coach_elapsed_sec';

export const App: React.FC = () => {
  // Remember last active tab across browser refreshes
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_TAB) || 'home';
  });

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<DailyWorkout[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [insight, setInsight] = useState<SmartCoachInsight | null>(null);

  // Active workout execution state persisted across refresh
  const [currentActiveWorkout, setCurrentActiveWorkout] = useState<DailyWorkout | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WORKOUT);
    return saved ? JSON.parse(saved) : null;
  });

  const [workoutElapsedSec, setWorkoutElapsedSec] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ELAPSED);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Sync activeTab to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TAB, activeTab);
  }, [activeTab]);

  // Sync currentActiveWorkout to localStorage
  useEffect(() => {
    if (currentActiveWorkout) {
      localStorage.setItem(STORAGE_KEY_WORKOUT, JSON.stringify(currentActiveWorkout));
    } else {
      localStorage.removeItem(STORAGE_KEY_WORKOUT);
    }
  }, [currentActiveWorkout]);

  // Sync workoutElapsedSec to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ELAPSED, workoutElapsedSec.toString());
  }, [workoutElapsedSec]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fallback to 'home' if active workout or summary tab is set without active workout
  useEffect(() => {
    if ((activeTab === 'active_workout' || activeTab === 'workout_summary') && !currentActiveWorkout) {
      setActiveTab('home');
    }
  }, [activeTab, currentActiveWorkout]);

  // Load initial IndexedDB data
  const loadData = async () => {
    try {
      const userProf = await getUserProfile();
      setProfile(userProf);

      let dailyWs = await getAllDailyWorkouts();
      if (dailyWs.length === 0) {
        dailyWs = generateMonthlyPlan(userProf, 2026, 8);
        await saveDailyWorkouts(dailyWs);
      }
      setWorkouts(dailyWs);

      const logsData = await getAllWorkoutLogs();
      setLogs(logsData);

      const prsData = await getAllPersonalRecords();
      setPrs(prsData);

      const coachInsight = await getSmartCoachInsight();
      setInsight(coachInsight);
    } catch (err) {
      console.error('Error loading data from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Today's scheduled workout finder
  const todayStr = '2026-08-11';
  const todayWorkout =
    workouts.find((w) => w.date === todayStr) ||
    workouts.find((w) => w.status === 'planned') ||
    workouts[0] ||
    null;

  // Handlers
  const handleSaveMonthlyInput = async (updatedProf: UserProfile) => {
    await updateUserProfile(updatedProf);
    setProfile(updatedProf);

    // Regenerate monthly plan
    const newWorkouts = generateMonthlyPlan(updatedProf, 2026, 8);
    await saveDailyWorkouts(newWorkouts);
    setWorkouts(newWorkouts);

    setActiveTab('home');
  };

  const handleStartWorkout = (workout: DailyWorkout) => {
    const isRainOrHome =
      workout.location === 'HOME' ||
      workout.isConvertedToHome ||
      workout.id === 'rainy-template' ||
      workout.title.toLowerCase().includes('rain') ||
      workout.title.toLowerCase().includes('home');

    if (isRainOrHome) {
      setActiveTab('rainy_day_workout');
    } else {
      setCurrentActiveWorkout(workout);
      setWorkoutElapsedSec(0);
      setActiveTab('active_workout');
    }
  };

  const handleConvertToHome = async (workout: DailyWorkout) => {
    const converted = convertFieldToHome(workout);
    await updateDailyWorkout(converted);
    setWorkouts((prev) => prev.map((w) => (w.id === converted.id ? converted : w)));
    setActiveTab('rainy_day_workout');
  };

  const handleFinishActiveWorkout = (completedWorkout: DailyWorkout, elapsedSec: number) => {
    setCurrentActiveWorkout(completedWorkout);
    setWorkoutElapsedSec(elapsedSec);
    setActiveTab('workout_summary');
  };

  const handleSaveWorkoutLog = async (log: WorkoutLog) => {
    await saveWorkoutLog(log);
    setLogs((prev) => [...prev, log]);

    // Adapt future schedule with safety logic
    const remaining = workouts.filter((w) => w.date > log.date && w.status === 'planned');
    const adapted = adaptSchedule(log, remaining);

    for (const w of adapted) {
      await updateDailyWorkout(w);
    }

    // Reset saved workout states
    setCurrentActiveWorkout(null);
    setWorkoutElapsedSec(0);
    localStorage.removeItem(STORAGE_KEY_WORKOUT);
    localStorage.removeItem(STORAGE_KEY_ELAPSED);

    await loadData();
    setActiveTab('home');
  };

  const handleSaveRunSession = async (session: TCXRunningSession) => {
    await saveRunningSession(session);
    await loadData();
  };

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-on-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant animate-pulse">Starting RunFit Coach...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      {/* Top Header Bar */}
      {activeTab !== 'active_workout' && activeTab !== 'monthly_input' && activeTab !== 'rainy_day_workout' && (
        <Header
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNotifications={() => alert('Notifications: Daily reminders and position memory active!')}
        />
      )}

      {/* Main Container */}
      <div className={`${activeTab !== 'active_workout' && activeTab !== 'monthly_input' && activeTab !== 'rainy_day_workout' ? 'pt-16' : ''} flex-1 flex flex-col`}>
        {activeTab === 'home' && (
          <Dashboard
            profile={profile}
            todayWorkout={todayWorkout}
            insight={insight}
            onStartWorkout={handleStartWorkout}
            onConvertToHome={handleConvertToHome}
            onOpenMonthlyInput={() => setActiveTab('monthly_input')}
          />
        )}

        {activeTab === 'plan' && (
          <MonthlyPlan
            workouts={workouts}
            onSelectWorkout={handleStartWorkout}
            onConvertToHome={handleConvertToHome}
          />
        )}

        {activeTab === 'monthly_input' && (
          <MonthlyDataEntry
            initialProfile={profile}
            onSave={handleSaveMonthlyInput}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'train' && (
          <FieldTrainingView
            onSaveRunSession={handleSaveRunSession}
            onConvertToHomeToggle={() => {
              if (todayWorkout) handleConvertToHome(todayWorkout);
              setActiveTab('rainy_day_workout');
            }}
          />
        )}

        {activeTab === 'exercises' && <ExerciseLibrary />}

        {activeTab === 'progress' && (
          <ProgressAnalytics
            profile={profile}
            personalRecords={prs}
            bodyMetrics={[]}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            profile={profile}
            onOpenMonthlyInput={() => setActiveTab('monthly_input')}
            onStart16kTest={() => {
              const testWorkout = workouts.find((w) => w.type === '1.6 KM Time Trial') || todayWorkout;
              if (testWorkout) handleStartWorkout(testWorkout);
            }}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'rainy_day_workout' && (
          <RainyDayWorkoutView
            onSaveWorkoutLog={handleSaveWorkoutLog}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'active_workout' && (
          currentActiveWorkout ? (
            <ActiveWorkout
              workout={currentActiveWorkout}
              onFinishWorkout={handleFinishActiveWorkout}
              onCancel={() => setActiveTab('home')}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
              <p className="text-on-surface-variant">No active workout currently in progress.</p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm"
              >
                Go to Dashboard
              </button>
            </div>
          )
        )}

        {activeTab === 'workout_summary' && (
          currentActiveWorkout ? (
            <WorkoutSummary
              workout={currentActiveWorkout}
              initialElapsedSeconds={workoutElapsedSec}
              onSaveLog={handleSaveWorkoutLog}
              onCancel={() => setActiveTab('home')}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
              <p className="text-on-surface-variant">No completed workout to summarize.</p>
              <button
                onClick={() => setActiveTab('home')}
                className="px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm"
              >
                Go to Dashboard
              </button>
            </div>
          )
        )}
      </div>

      {/* Mobile Sticky Navigation */}
      {activeTab !== 'active_workout' && activeTab !== 'monthly_input' && activeTab !== 'rainy_day_workout' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
};
