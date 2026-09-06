import { DailyWorkout, UserProfile, WorkoutLog, WorkoutLocation, WorkoutType } from '../types';
import { formatSecondsToMMSS } from '../data/goalConfig';
import { RAINY_DAY_HOME_WORKOUT_TEMPLATE } from '../data/rainyDayWorkout';

/**
 * Generates a full monthly training plan based on user baseline and availability.
 */
export function generateMonthlyPlan(
  profile: UserProfile,
  year: number = 2026,
  month: number = 8 // August (1-indexed)
): DailyWorkout[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const workouts: DailyWorkout[] = [];

  // Current pace baseline calculation
  const currentBest16kSec = profile.currentBest16kSeconds || 532; // Default 8:52
  const currentAvgPacePerKm = currentBest16kSec / 1.6; // e.g. 332.5s -> 5:32/km
  const current400mSplitSec = currentBest16kSec / 4;
  const target400mSplitSec = Math.max(120, current400mSplitSec - 8);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dateStr = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    const dayOfWeek = dayNames[dateObj.getDay()];
    const preferredLoc = profile.weeklyAvailableDays[dayOfWeek] || 'REST';

    let workout: DailyWorkout;

    // Special month-end test on day 28 or last day
    if (day === daysInMonth || day === 28) {
      workout = {
        id: dateStr,
        date: dateStr,
        dayNumber: day,
        title: '🏁 Monthly 1.6 KM Test',
        type: '1.6 KM Time Trial',
        location: preferredLoc === 'REST' ? 'FIELD' : preferredLoc,
        durationMinutes: 30,
        intensity: 'Very High',
        status: dateStr < '2026-08-11' ? 'completed' : 'planned',
        description: 'Test your maximum performance for 1.6 km (4 laps). Aim for even split pacing!',
        targetPace: formatSecondsToMMSS(currentAvgPacePerKm - 10) + '/km',
        targetDistanceKm: 1.6,
        splitsTarget: [
          { distance: '400m', targetTime: formatSecondsToMMSS(target400mSplitSec) },
          { distance: '800m', targetTime: formatSecondsToMMSS(target400mSplitSec * 2) },
          { distance: '1200m', targetTime: formatSecondsToMMSS(target400mSplitSec * 3) },
          { distance: '1600m', targetTime: formatSecondsToMMSS(target400mSplitSec * 4) }
        ],
        exercises: [
          { exerciseId: '1-6k-time-trial', name: '1.6 KM Time Trial', sets: 1, durationSeconds: 480, restSeconds: 180 }
        ]
      };
    } else if (preferredLoc === 'REST') {
      workout = {
        id: dateStr,
        date: dateStr,
        dayNumber: day,
        title: 'Rest & Mobility Reset',
        type: 'Rest Day',
        location: 'REST',
        durationMinutes: 15,
        intensity: 'Low',
        status: dateStr < '2026-08-11' ? 'rest' : 'planned',
        description: 'Active recovery day. Focus on hydration, quality sleep, and light static stretching.',
        exercises: [
          { exerciseId: 'worlds-greatest-stretch', name: "World's Greatest Stretch", sets: 2, reps: 5, restSeconds: 15 },
          { exerciseId: 'standing-quad-stretch', name: 'Standing Quad Stretch', sets: 2, durationSeconds: 30, restSeconds: 15 }
        ]
      };
    } else if (preferredLoc === 'FIELD') {
      const cycleIndex = day % 3;
      if (cycleIndex === 1) {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: '400m Speed Intervals',
          type: 'Interval Running',
          location: 'FIELD',
          durationMinutes: 35,
          intensity: 'High',
          status: dateStr < '2026-08-11' ? 'completed' : 'planned',
          description: `Run 400m × 4 at target pace ${formatSecondsToMMSS(target400mSplitSec)} per 400m split. Rest 90s between reps.`,
          targetPace: formatSecondsToMMSS(target400mSplitSec * 2.5) + '/km',
          targetDistanceKm: 2.5,
          splitsTarget: [
            { distance: 'Rep 1 (400m)', targetTime: formatSecondsToMMSS(target400mSplitSec) },
            { distance: 'Rep 2 (400m)', targetTime: formatSecondsToMMSS(target400mSplitSec) },
            { distance: 'Rep 3 (400m)', targetTime: formatSecondsToMMSS(target400mSplitSec + 2) },
            { distance: 'Rep 4 (400m)', targetTime: formatSecondsToMMSS(target400mSplitSec + 3) }
          ],
          exercises: [{ exerciseId: '400m-repeats', name: '400m Interval Repeats', sets: 4, restSeconds: 90 }]
        };
      } else if (cycleIndex === 2) {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: 'Aerobic Base Easy Run',
          type: 'Easy Run',
          location: 'FIELD',
          durationMinutes: 30,
          intensity: 'Moderate',
          status: dateStr < '2026-08-11' ? (day === 5 ? 'missed' : 'completed') : 'planned',
          description: 'Sustained easy effort run to build aerobic engine and leg endurance.',
          targetPace: formatSecondsToMMSS(currentAvgPacePerKm + 20) + '/km',
          targetDistanceKm: 3.2,
          exercises: []
        };
      } else {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: 'Threshold Tempo Run',
          type: 'Tempo Run',
          location: 'FIELD',
          durationMinutes: 25,
          intensity: 'High',
          status: dateStr < '2026-08-11' ? (day === 4 ? 'modified' : 'completed') : 'planned',
          description: 'Maintain comfortably hard threshold pace for 2 km continuous running.',
          targetPace: formatSecondsToMMSS(currentAvgPacePerKm - 5) + '/km',
          targetDistanceKm: 2.0,
          exercises: []
        };
      }
    } else {
      // HOME MODE
      const homeCycle = day % 3;
      if (homeCycle === 1) {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: RAINY_DAY_HOME_WORKOUT_TEMPLATE.title,
          type: 'Full Body Conditioning',
          location: 'HOME',
          durationMinutes: 35,
          intensity: 'High',
          status: dateStr < '2026-08-11' ? 'completed' : 'planned',
          description: RAINY_DAY_HOME_WORKOUT_TEMPLATE.subtitle,
          exercises: [
            { exerciseId: 'bodyweight-squat', name: 'Bodyweight Squat', sets: 3, reps: 15, restSeconds: 45 },
            { exerciseId: 'standard-push-up', name: 'Push-Up (Progression Offered)', sets: 3, reps: 12, restSeconds: 45 },
            { exerciseId: 'walking-lunge', name: 'Reverse Lunge', sets: 3, reps: 10, restSeconds: 45 },
            { exerciseId: 'glute-bridge', name: 'Glute Bridge', sets: 3, reps: 18, restSeconds: 30 },
            { exerciseId: 'mountain-climber', name: 'Mountain Climber', sets: 3, durationSeconds: 30, restSeconds: 30 },
            { exerciseId: 'forearm-plank', name: 'Plank', sets: 3, durationSeconds: 45, restSeconds: 30 },
            { exerciseId: 'calf-raise', name: 'Calf Raise', sets: 3, reps: 20, restSeconds: 30 }
          ]
        };
      } else if (homeCycle === 2) {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: '🏠 Indoor Running Drills & Cadence',
          type: 'Indoor Cardio Conditioning',
          location: 'HOME',
          durationMinutes: 30,
          intensity: 'Moderate',
          status: dateStr < '2026-08-11' ? 'completed' : 'planned',
          description: 'High knees, fast feet, and shadow running drills to maintain stride turnover.',
          exercises: [
            { exerciseId: 'high-knees', name: 'High Knees', sets: 4, durationSeconds: 40, restSeconds: 20 },
            { exerciseId: 'fast-feet', name: 'Fast Feet Shuffles', sets: 4, durationSeconds: 40, restSeconds: 20 },
            { exerciseId: 'jumping-jacks', name: 'Jumping Jacks / Fast Marching', sets: 4, durationSeconds: 40, restSeconds: 20 }
          ]
        };
      } else {
        workout = {
          id: dateStr,
          date: dateStr,
          dayNumber: day,
          title: '🏠 Strength + Core Focus',
          type: 'Core & Anti-Extension',
          location: 'HOME',
          durationMinutes: 30,
          intensity: 'Moderate',
          status: dateStr < '2026-08-11' ? 'completed' : 'planned',
          description: 'Build anti-extension core strength and shoulder stability for running mechanics.',
          exercises: [
            { exerciseId: 'forearm-plank', name: 'Forearm Plank', sets: 3, durationSeconds: 45, restSeconds: 30 },
            { exerciseId: 'side-plank', name: 'Side Plank', sets: 3, durationSeconds: 30, restSeconds: 30 },
            { exerciseId: 'dead-bug', name: 'Dead Bug', sets: 3, reps: 12, restSeconds: 30 },
            { exerciseId: 'russian-twist', name: 'Russian Twist', sets: 3, reps: 20, restSeconds: 30 }
          ]
        };
      }
    }

    workouts.push(workout);
  }

  return workouts;
}

/**
 * Converts a FIELD outdoor running session into an official Rain Mode HOME workout.
 */
export function convertFieldToHome(workout: DailyWorkout): DailyWorkout {
  return {
    ...workout,
    location: 'HOME',
    isConvertedToHome: true,
    originalLocation: 'FIELD',
    title: `🌧️ Rain Mode: Indoor Alternative (${workout.title})`,
    description: `Indoor Alternative: ${RAINY_DAY_HOME_WORKOUT_TEMPLATE.disclaimer}`,
    intensity: 'High',
    exercises: [
      { exerciseId: 'high-knees', name: 'High Knees (40s Work / 20s Rest)', sets: 2, durationSeconds: 40, restSeconds: 20 },
      { exerciseId: 'mountain-climber', name: 'Mountain Climbers (40s Work / 20s Rest)', sets: 2, durationSeconds: 40, restSeconds: 20 },
      { exerciseId: 'fast-feet', name: 'Fast Feet (40s Work / 20s Rest)', sets: 2, durationSeconds: 40, restSeconds: 20 },
      { exerciseId: 'jumping-jacks', name: 'Jumping Jacks / Fast Marching (40s Work / 20s Rest)', sets: 2, durationSeconds: 40, restSeconds: 20 }
    ]
  };
}

/**
 * Evaluates logged workout performance & enforces training safety logic.
 */
export function adaptSchedule(log: WorkoutLog, remainingWorkouts: DailyWorkout[]): DailyWorkout[] {
  const updatedWorkouts = [...remainingWorkouts];

  // Safety Check: If yesterday was a hard effort (RPE 9-10) or pain reported -> switch next session to Recovery & Mobility
  if (log.rpe >= 9 || log.painOrInjuryFlag) {
    if (updatedWorkouts.length > 0 && updatedWorkouts[0].status === 'planned') {
      updatedWorkouts[0].title = '🧘 Recovery & Mobility Reset [Safety Adapted]';
      updatedWorkouts[0].type = 'Mobility & Recovery';
      updatedWorkouts[0].intensity = 'Low';
      updatedWorkouts[0].description =
        'Safety Logic Active: Previous session was high intensity (RPE 9-10). Switched to light mobility to prevent fatigue & injury.';
      updatedWorkouts[0].exercises = [
        { exerciseId: 'worlds-greatest-stretch', name: "World's Greatest Stretch", sets: 2, reps: 5, restSeconds: 15 },
        { exerciseId: 'standing-quad-stretch', name: 'Standing Quad Stretch', sets: 2, durationSeconds: 30, restSeconds: 15 }
      ];
    }
  } else if (log.rpe <= 5 && log.rpe > 0) {
    // Progressive increase if easy
    for (const w of updatedWorkouts) {
      if (w.status === 'planned' && w.type === 'Interval Running') {
        w.description += ' [Adapted: Target 400m split sharpened by 2 seconds]';
        break;
      }
    }
  }

  return updatedWorkouts;
}
