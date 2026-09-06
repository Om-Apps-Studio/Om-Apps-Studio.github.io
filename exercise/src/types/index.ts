export type WorkoutLocation = 'HOME' | 'FIELD' | 'REST';

export type WorkoutStatus = 'completed' | 'planned' | 'modified' | 'missed' | 'rest';

export type WorkoutType = 
  | 'Easy Run'
  | 'Interval Running'
  | 'Tempo Run'
  | 'Long Endurance Run'
  | '1.6 KM Time Trial'
  | 'Recovery Run'
  | 'Lower Body Strength'
  | 'Upper Body Strength'
  | 'Core & Anti-Extension'
  | 'Indoor Cardio Conditioning'
  | 'Full Body Conditioning'
  | 'Mobility & Recovery'
  | 'Rest Day';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  targetDistanceKm: number; // 1.6
  targetTimeFormatted: string; // "8:00"
  targetPaceFormatted: string; // "5:00/km"
  targetSpeedKmh: number; // 12.0
  currentBest16kSeconds: number; // e.g. 532 (8:52)
  currentBest1kSeconds: number; // e.g. 315 (5:15)
  weightKg: number;
  heightCm: number;
  waistCm: number;
  bodyFatPercentage?: number;
  maxPushUps: number;
  maxSquats: number;
  maxPlankSeconds: number;
  weeklyAvailableDays: Record<string, WorkoutLocation>; // { Monday: 'FIELD', Tuesday: 'HOME', ... }
  availableDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'Lower Body' | 'Upper Body' | 'Core' | 'Cardio' | 'Mobility' | 'Running';
  muscleGroups: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  instructions: string[];
  commonMistakes: string[];
  tips: string[];
  defaultSets?: number;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  restSeconds?: number;
  youtubeVideoId?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  completed?: boolean;
}

export interface DailyWorkout {
  id: string; // e.g. "2026-08-11"
  date: string; // ISO "YYYY-MM-DD"
  dayNumber: number; // 1-31
  title: string;
  type: WorkoutType;
  location: WorkoutLocation;
  isConvertedToHome?: boolean;
  originalLocation?: WorkoutLocation;
  durationMinutes: number;
  intensity: 'Low' | 'Moderate' | 'High' | 'Very High';
  status: WorkoutStatus;
  description: string;
  targetPace?: string; // e.g. "5:15/km"
  targetDistanceKm?: number; // e.g. 1.6 or 3.0
  exercises: WorkoutExercise[];
  splitsTarget?: { distance: string; targetTime: string }[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: string;
  title: string;
  location: WorkoutLocation;
  isConvertedToHome: boolean;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  plannedDistanceKm?: number;
  actualDistanceKm?: number;
  averagePaceFormatted?: string; // "5:12"
  averageSpeedKmh?: number;
  splitsActual?: { split: string; timeFormatted: string }[];
  completedExercises: { name: string; setsCompleted: number; repsCompleted?: number }[];
  rpe: number; // 1-10
  energyLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  painOrInjuryFlag: boolean;
  painNotes?: string;
  notes?: string;
  loggedAt: string;
}

export interface TCXLapData {
  lapIndex: number;
  totalTimeSeconds: number;
  distanceMeters: number;
  maxSpeedMps: number;
  avgPaceFormatted: string;
  avgHeartRate?: number;
  maxHeartRate?: number;
  calories?: number;
}

export interface TCXRunningSession {
  id: string;
  fileName: string;
  importedAt: string;
  startTime: string;
  totalTimeSeconds: number;
  totalDistanceMeters: number;
  totalDistanceKm: number;
  averagePaceFormatted: string;
  averageSpeedKmh: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  totalElevationGainMeters?: number;
  cadenceAvg?: number;
  laps: TCXLapData[];
}

export interface BodyMetricsHistory {
  id: string;
  date: string;
  weightKg: number;
  waistCm: number;
  bodyFatPercentage?: number;
}

export interface PersonalRecord {
  id: string;
  metricName: string;
  formattedValue: string;
  rawNumericValue: number;
  unit: string;
  achievedAt: string;
  previousValueFormatted?: string;
}

export interface SmartCoachInsight {
  id: string;
  type: 'recovery' | 'progress' | 'consistency' | 'warning';
  title: string;
  message: string;
  actionableRecommendation?: string;
  createdAt: string;
}
