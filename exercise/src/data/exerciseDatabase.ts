import { ExerciseItem } from '../types';

export const EXERCISE_DATABASE: ExerciseItem[] = [
  // LOWER BODY
  {
    id: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'Lower Body',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/aclHkVaku9U/hqdefault.jpg',
    youtubeVideoId: 'aclHkVaku9U',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointed slightly outwards.',
      'Inhale as you hinge at hips and bend knees, lowering your thighs parallel to the floor.',
      'Keep chest elevated and core engaged throughout the movement.',
      'Drive through heels to return to starting standing position.'
    ],
    commonMistakes: ['Knees caving inwards', 'Rounding lower back', 'Lifting heels off the ground'],
    tips: ['Keep weight centered over heels and mid-foot', 'Fix eyes on a focal point straight ahead'],
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squat',
    category: 'Lower Body',
    muscleGroups: ['Adductors', 'Glutes', 'Quadriceps'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/9ZuXKqRbT9k/hqdefault.jpg',
    youtubeVideoId: '9ZuXKqRbT9k',
    instructions: [
      'Take a wide stance with feet roughly 1.5x shoulder width apart and toes flared out 45 degrees.',
      'Lower hips straight down while tracking knees outwards in line with toes.',
      'Press firmly through heels to extend hips back up.'
    ],
    commonMistakes: ['Allowing knees to collapse inside toe line', 'Leaning too far forward'],
    tips: ['Squeeze glutes tightly at top of movement'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'Lower Body',
    muscleGroups: ['Quadriceps', 'Glutes', 'Core'],
    equipment: 'Bench or Chair',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/2C-uNgKwPLE/hqdefault.jpg',
    youtubeVideoId: '2C-uNgKwPLE',
    instructions: [
      'Stand 2-3 feet in front of an elevated surface. Place top of rear foot flat on bench.',
      'Lower rear knee towards floor until front thigh is parallel to ground.',
      'Push back up through front leg heel.'
    ],
    commonMistakes: ['Front knee shooting too far past toes', 'Losing torso alignment'],
    tips: ['Focus on sinking straight down rather than leaning forward'],
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    category: 'Lower Body',
    muscleGroups: ['Quadriceps', 'Glutes', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/2ea3_b9rFdM/hqdefault.jpg',
    youtubeVideoId: '2ea3_b9rFdM',
    instructions: [
      'Step forward with one leg and lower hips until both knees are bent at 90-degree angles.',
      'Drive through front heel to step into the next lunge stride smoothly.'
    ],
    commonMistakes: ['Short strides causing knee strain', 'Slumping shoulders'],
    tips: ['Maintain steady rhythmic walking pace'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'Lower Body',
    muscleGroups: ['Glutes', 'Hamstrings', 'Core'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/wPM8icPu6H8/hqdefault.jpg',
    youtubeVideoId: 'wPM8icPu6H8',
    instructions: [
      'Lie face up on mat with knees bent and feet flat on floor hip-width apart.',
      'Squeeze glutes and lift hips toward ceiling until knees, hips, and shoulders align.',
      'Hold 1-2 seconds at apex before lowering under control.'
    ],
    commonMistakes: ['Arching lower back excess', 'Pushing through toes instead of heels'],
    tips: ['Keep core braced to prevent spinal hyperextension'],
    defaultSets: 3,
    defaultReps: 20,
    restSeconds: 30
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    category: 'Lower Body',
    muscleGroups: ['Glutes', 'Hamstrings'],
    equipment: 'Mat',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/yFNjwkUNIao/hqdefault.jpg',
    youtubeVideoId: 'yFNjwkUNIao',
    instructions: [
      'Lie on back, extend one leg straight out in line with thigh.',
      'Drive through remaining heel to elevate hips.',
      'Lower under control without resting hips on ground between reps.'
    ],
    commonMistakes: ['Hips tilting to one side'],
    tips: ['Keep pelvis level throughout thrust'],
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 45
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    category: 'Lower Body',
    muscleGroups: ['Gastrocnemius', 'Soleus', 'Achilles Tendon'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/fZYTVO9-Ggk/hqdefault.jpg',
    youtubeVideoId: 'fZYTVO9-Ggk',
    instructions: [
      'Stand tall with feet hip-width apart.',
      'Rise onto balls of feet, squeezing calf muscles at peak.',
      'Lower slowly back to heel contact.'
    ],
    commonMistakes: ['Bouncing through reps without full range of motion'],
    tips: ['Essential for lower-leg elasticity in running'],
    defaultSets: 4,
    defaultReps: 25,
    restSeconds: 30
  },

  // UPPER BODY
  {
    id: 'standard-push-up',
    name: 'Standard Push-Up',
    category: 'Upper Body',
    muscleGroups: ['Pectorals', 'Triceps', 'Anterior Deltoids', 'Core'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/IODxDxX7oi4/hqdefault.jpg',
    youtubeVideoId: 'IODxDxX7oi4',
    instructions: [
      'Place hands slightly wider than shoulder-width in high plank position.',
      'Lower body as a rigid unit until chest is 1 inch off floor.',
      'Push floor away firmly until arms are fully extended.'
    ],
    commonMistakes: ['Sagging hips', 'Flaring elbows 90 degrees outward'],
    tips: ['Keep elbows tucked at roughly 45-degree angle to torso'],
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 45
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    category: 'Upper Body',
    muscleGroups: ['Triceps', 'Inner Chest'],
    equipment: 'Mat',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/PPTj-MW2tcs/hqdefault.jpg',
    youtubeVideoId: 'PPTj-MW2tcs',
    instructions: [
      'Form high plank with index fingers and thumbs touching to make a diamond shape.',
      'Lower chest towards diamond, keeping elbows close to ribcage.',
      'Drive back up.'
    ],
    commonMistakes: ['Letting hips drop'],
    tips: ['Modify to knee position if wrist strain occurs'],
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    category: 'Upper Body',
    muscleGroups: ['Deltoids', 'Upper Chest', 'Triceps'],
    equipment: 'Mat',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/V6BtY3Lt0Ys/hqdefault.jpg',
    youtubeVideoId: 'V6BtY3Lt0Ys',
    instructions: [
      'Assume downward dog position with hips elevated high in inverted V.',
      'Lower top of head toward floor between hands.',
      'Press through shoulders back to inverted V.'
    ],
    commonMistakes: ['Bending at hips instead of elbow flexion'],
    tips: ['Great bodyweight builder for shoulder overhead stability'],
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 60
  },
  {
    id: 'triceps-dip',
    name: 'Triceps Dip',
    category: 'Upper Body',
    muscleGroups: ['Triceps', 'Anterior Deltoids'],
    equipment: 'Bench or Chair',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/4ua3MzaU0QU/hqdefault.jpg',
    youtubeVideoId: '4ua3MzaU0QU',
    instructions: [
      'Sit on bench edge, grip edge beside hips. Slide buttocks off with knees bent.',
      'Lower hips by bending elbows until upper arms are parallel to floor.',
      'Press up to full arm extension.'
    ],
    commonMistakes: ['Shrugging shoulders near ears'],
    tips: ['Keep back close to edge of bench throughout'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45
  },
  {
    id: 'superman',
    name: 'Superman Hold',
    category: 'Upper Body',
    muscleGroups: ['Erector Spinae', 'Glutes', 'Upper Back'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/z6PJMT2y8GQ/hqdefault.jpg',
    youtubeVideoId: 'z6PJMT2y8GQ',
    instructions: [
      'Lie face down on floor with arms extended overhead.',
      'Simultaneously lift arms, chest, and legs off ground.',
      'Hold at apex for 2-3 seconds, then lower smoothly.'
    ],
    commonMistakes: ['Over-extending neck upwards'],
    tips: ['Keep eyes looking straight at mat to protect cervical spine'],
    defaultSets: 3,
    defaultDurationSeconds: 30,
    restSeconds: 30
  },

  // CORE
  {
    id: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'Core',
    muscleGroups: ['Rectus Abdominis', 'Transverse Abdominis', 'Core'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/xe2MXatLTUw/hqdefault.jpg',
    youtubeVideoId: 'xe2MXatLTUw',
    instructions: [
      'Place forearms on floor shoulder-width apart, elbows directly under shoulders.',
      'Extend legs straight back, resting on toes.',
      'Create straight line from head to heels. Brace abdominal wall tightly.'
    ],
    commonMistakes: ['Hips sagging', 'Piking hips upward in air'],
    tips: ['Squeeze glutes and pull navel toward spine'],
    defaultSets: 3,
    defaultDurationSeconds: 45,
    restSeconds: 30
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'Core',
    muscleGroups: ['Obliques', 'Core', 'Gluteus Medius'],
    equipment: 'Mat',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/sKMD_pbNm7w/hqdefault.jpg',
    youtubeVideoId: 'sKMD_pbNm7w',
    instructions: [
      'Lie on side with forearm flat on mat, elbow under shoulder.',
      'Stack feet and lift hips off floor until body forms straight diagonal line.',
      'Hold position while breathing steadily.'
    ],
    commonMistakes: ['Bottom hip dipping towards floor'],
    tips: ['Crucial for anti-lateral flexion and lateral hip stability in runners'],
    defaultSets: 3,
    defaultDurationSeconds: 30,
    restSeconds: 30
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'Core',
    muscleGroups: ['Deep Core', 'Transverse Abdominis'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/4XLEnwUr1d8/hqdefault.jpg',
    youtubeVideoId: '4XLEnwUr1d8',
    instructions: [
      'Lie on back with arms reaching up and knees bent 90 degrees over hips.',
      'Slowly lower opposite arm and leg toward floor without arching lower back.',
      'Return to center and repeat on alternate side.'
    ],
    commonMistakes: ['Lower back arching off floor'],
    tips: ['Press lower back firmly into floor throughout entire rep'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 30
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'Core',
    muscleGroups: ['Core', 'Hip Flexors', 'Cardio'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/nmwgirgXLYM/hqdefault.jpg',
    youtubeVideoId: 'nmwgirgXLYM',
    instructions: [
      'Start in high plank position with hands under shoulders.',
      'Drive one knee toward chest rapid fire, then quickly switch legs in running motion.'
    ],
    commonMistakes: ['Bouncing hips high in air'],
    tips: ['Keep shoulder blades stable and hips low'],
    defaultSets: 3,
    defaultDurationSeconds: 40,
    restSeconds: 30
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'Core',
    muscleGroups: ['Obliques', 'Abs'],
    equipment: 'Mat',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/wkD8rjkodUI/hqdefault.jpg',
    youtubeVideoId: 'wkD8rjkodUI',
    instructions: [
      'Sit on floor with knees bent and feet slightly elevated.',
      'Lean back 45 degrees, interlock hands, and rotate torso smoothly side to side.'
    ],
    commonMistakes: ['Twisting arms without rotating shoulders'],
    tips: ['Rotate entire torso from ribs'],
    defaultSets: 3,
    defaultReps: 20,
    restSeconds: 30
  },

  // CARDIO / CONDITIONING
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'Cardio',
    muscleGroups: ['Hip Flexors', 'Quadriceps', 'Cardiovascular'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/OAJ_J3EZkdY/hqdefault.jpg',
    youtubeVideoId: 'OAJ_J3EZkdY',
    instructions: [
      'Run in place while driving knees aggressively up toward hip height.',
      'Pump arms synchronized with leg action in athletic sprinter posture.'
    ],
    commonMistakes: ['Leaning backward'],
    tips: ['Stay light on forefeet with high turnover'],
    defaultSets: 4,
    defaultDurationSeconds: 40,
    restSeconds: 30
  },
  {
    id: 'fast-feet',
    name: 'Fast Feet Shuffles',
    category: 'Cardio',
    muscleGroups: ['Calves', 'Quadriceps', 'Agility'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/bkaByqjBefQ/hqdefault.jpg',
    youtubeVideoId: 'bkaByqjBefQ',
    instructions: [
      'Drop into quarter squat stance.',
      'Patter feet as quickly as possible on ground maintaining rapid cadence.'
    ],
    commonMistakes: ['Standing straight up'],
    tips: ['Keep center of gravity low'],
    defaultSets: 4,
    defaultDurationSeconds: 30,
    restSeconds: 30
  },
  {
    id: 'skaters',
    name: 'Skater Jumps',
    category: 'Cardio',
    muscleGroups: ['Glutes', 'Adductors', 'Lateral Stability'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/IkGOdk2VDJw/hqdefault.jpg',
    youtubeVideoId: 'IkGOdk2VDJw',
    instructions: [
      'Leap laterally to right, landing softly on right foot with left leg sweeping behind.',
      'Explode laterally to left landing on left leg.'
    ],
    commonMistakes: ['Heavy landing sound'],
    tips: ['Absorb force smoothly in hip hinge on each landing'],
    defaultSets: 3,
    defaultReps: 16,
    restSeconds: 45
  },
  {
    id: 'burpee',
    name: 'Burpees',
    category: 'Cardio',
    muscleGroups: ['Full Body', 'Cardiovascular'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    image: 'https://i.ytimg.com/vi/xQdyIrSSFnE/hqdefault.jpg',
    youtubeVideoId: 'xQdyIrSSFnE',
    instructions: [
      'From standing position, drop hands to floor and kick feet back into plank.',
      'Perform quick push-up, jump feet forward toward hands, and explode up into jump with overhead reach.'
    ],
    commonMistakes: ['Piking back in plank step'],
    tips: ['Pace breathing steadily'],
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 60
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscleGroups: ['Calves', 'Shoulders', 'Cardio'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/2W4ZNSwoW_4/hqdefault.jpg',
    youtubeVideoId: '2W4ZNSwoW_4',
    instructions: [
      'Jump feet out sideways while raising arms overhead.',
      'Jump back to standing posture with arms at sides.'
    ],
    commonMistakes: ['Stiff knee landings'],
    tips: ['Keep slight soft bend in knees throughout'],
    defaultSets: 3,
    defaultDurationSeconds: 45,
    restSeconds: 30
  },

  // RUNNING DRILLS & OUTDOOR
  {
    id: '1-6k-time-trial',
    name: '1.6 KM Time Trial',
    category: 'Running',
    muscleGroups: ['Legs', 'Cardiovascular', 'Mental Toughness'],
    equipment: 'Track or GPS Watch',
    difficulty: 'Advanced',
    image: 'https://i.ytimg.com/vi/OAJ_J3EZkdY/hqdefault.jpg',
    youtubeVideoId: 'OAJ_J3EZkdY',
    instructions: [
      'Warm up with 10 mins easy jog and dynamic stretches.',
      'Run 1.6 km (4 laps of a 400m track) at maximum sustainable 8:00 goal pacing effort.',
      'Record lap splits at every 400m.'
    ],
    commonMistakes: ['Starting lap 1 way too fast'],
    tips: ['Aim for even or slightly negative split pacing across all 4 laps'],
    defaultSets: 1,
    defaultDurationSeconds: 480,
    restSeconds: 180
  },
  {
    id: '400m-repeats',
    name: '400m Interval Repeats',
    category: 'Running',
    muscleGroups: ['Quadriceps', 'VO2 Max System'],
    equipment: 'Track or Open Field',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/bkaByqjBefQ/hqdefault.jpg',
    youtubeVideoId: 'bkaByqjBefQ',
    instructions: [
      'Run 400 meters at target split pace (2:00 target).',
      'Rest 90-120 seconds with active walking/jogging.',
      'Repeat for prescribed set count.'
    ],
    commonMistakes: ['Fading pace heavily on final reps'],
    tips: ['Maintain upright stride mechanics even under fatigue'],
    defaultSets: 4,
    restSeconds: 90
  },

  // MOBILITY
  {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch",
    category: 'Mobility',
    muscleGroups: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings', 'Adductors'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/OvObOV0WrKw/hqdefault.jpg',
    youtubeVideoId: 'OvObOV0WrKw',
    instructions: [
      'Step forward into deep lunge. Place inside hand on floor.',
      'Rotate arm towards ceiling opening chest.',
      'Place hand back down, shift hips back to stretch front hamstring.'
    ],
    commonMistakes: ['Rushing through rotations'],
    tips: ['Breathe deeply at each position'],
    defaultSets: 2,
    defaultReps: 5,
    restSeconds: 15
  },
  {
    id: 'standing-quad-stretch',
    name: 'Standing Quad Stretch',
    category: 'Mobility',
    muscleGroups: ['Quadriceps'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/zi5__zBRzYc/hqdefault.jpg',
    youtubeVideoId: 'zi5__zBRzYc',
    instructions: [
      'Stand on one leg, pull ankle behind toward glute.',
      'Keep knees together and press hips forward.'
    ],
    commonMistakes: ['Arching back'],
    tips: ['Tuck pelvis slightly to intensify quad stretch'],
    defaultSets: 2,
    defaultDurationSeconds: 30,
    restSeconds: 15
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    category: 'Mobility',
    muscleGroups: ['Deltoids', 'Rotator Cuff', 'Upper Trapezius'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/m3VRxuRRToA/hqdefault.jpg',
    youtubeVideoId: 'm3VRxuRRToA',
    instructions: [
      'Extend arms horizontally at shoulder level with palms facing down.',
      'Rotate arms smoothly in controlled 8-10 inch circles forward for 20s, then reverse.',
      'Maintain tight core and keep shoulders relaxed away from ears.'
    ],
    commonMistakes: ['Dropping arms below shoulder height', 'Shrugging shoulders up toward ears'],
    tips: ['Keep ribcage locked down and engage core to prevent spinal swaying'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'marching-in-place',
    name: 'Marching in Place',
    category: 'Cardio',
    muscleGroups: ['Hip Flexors', 'Quadriceps', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/16oJspYFz7s/hqdefault.jpg',
    youtubeVideoId: '16oJspYFz7s',
    instructions: [
      'Stand tall with feet hip-width apart.',
      'Drive alternating knees up to waist height (90 degrees).',
      'Pump opposite arms synchronously in running cadence.'
    ],
    commonMistakes: ['Leaning backward when lifting knees', 'Stomping on flat feet'],
    tips: ['Land softly on the balls of feet with light springiness'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'high-knee-marching',
    name: 'High-Knee Marching',
    category: 'Cardio',
    muscleGroups: ['Hip Flexors', 'Rectus Abdominis', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/OAJ_J3EZkdY/hqdefault.jpg',
    youtubeVideoId: 'OAJ_J3EZkdY',
    instructions: [
      'Elevate knee actively toward chest height while maintaining tall spinal posture.',
      'Drive opposite arm forward with power.',
      'Brace core firmly on each repetition.'
    ],
    commonMistakes: ['Rounding shoulders forward', 'Letting hips drop'],
    tips: ['Focus on pulling with the lower abdominals and hip flexors'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'Running',
    muscleGroups: ['Hamstrings', 'Quadriceps', 'Calves'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/e4cnI7eVKRw/hqdefault.jpg',
    youtubeVideoId: 'e4cnI7eVKRw',
    instructions: [
      'Jog lightly in place flexing hamstrings to flick heels toward glutes.',
      'Keep thighs pointing down perpendicular to floor.',
      'Maintain slight forward athletic lean from ankles.'
    ],
    commonMistakes: ['Swinging knees forward like high knees', 'Arching lower back'],
    tips: ['Fast ground contact time on balls of feet'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'hip-rotations',
    name: 'Hip Rotations',
    category: 'Mobility',
    muscleGroups: ['Hip Capsule', 'Glute Medius', 'Lower Back'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/DeqMGwnxc1M/hqdefault.jpg',
    youtubeVideoId: 'DeqMGwnxc1M',
    instructions: [
      'Place hands on hips with feet shoulder-width.',
      'Trace wide smooth circular paths with pelvis.',
      'Perform 20s clockwise, then 20s counter-clockwise.'
    ],
    commonMistakes: ['Bending knees excessively', 'Jerky movements'],
    tips: ['Relax abdominal wall and breathe rhythmically'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'ankle-rotations',
    name: 'Ankle Rotations',
    category: 'Mobility',
    muscleGroups: ['Achilles Tendon', 'Peroneals', 'Anterior Tibialis'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/z24gW6aHJrI/hqdefault.jpg',
    youtubeVideoId: 'z24gW6aHJrI',
    instructions: [
      'Lift one foot slightly off the ground.',
      'Trace large complete circles with the big toe.',
      'Switch rotational direction and change legs at halfway mark.'
    ],
    commonMistakes: ['Rushing with tiny circles', 'Moving entire leg from hip'],
    tips: ['Crucial warm-up drill to prevent Achilles tendinopathy and shin splints'],
    defaultSets: 1,
    defaultDurationSeconds: 40,
    restSeconds: 15
  },
  {
    id: 'fast-feet-shuffles',
    name: 'Fast Feet Agility Shuffles',
    category: 'Cardio',
    muscleGroups: ['Calves', 'Quadriceps', 'Fast-Twitch Foot Fibers'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    image: 'https://i.ytimg.com/vi/bkaByqjBefQ/hqdefault.jpg',
    youtubeVideoId: 'bkaByqjBefQ',
    instructions: [
      'Drop into an athletic quarter-squat crouch.',
      'Rapidly alternate tapping balls of feet in place as fast as possible.',
      'Keep hands active in front for balance.'
    ],
    commonMistakes: ['Standing up straight losing crouch angle', 'Crossing feet'],
    tips: ['Pretend you are running on hot coals; minimize foot contact duration'],
    defaultSets: 3,
    defaultDurationSeconds: 40,
    restSeconds: 20
  },
  {
    id: 'diaphragmatic-breathing',
    name: 'Deep Diaphragmatic Breathing',
    category: 'Mobility',
    muscleGroups: ['Diaphragm', 'Parasympathetic Nervous System'],
    equipment: 'Mat',
    difficulty: 'Beginner',
    image: 'https://i.ytimg.com/vi/vMjTJf4-xz0/hqdefault.jpg',
    youtubeVideoId: 'vMjTJf4-xz0',
    instructions: [
      'Sit comfortably or lie supine with hand on lower belly.',
      'Inhale slowly for 4s through nose expanding abdomen.',
      'Hold 2s, then exhale slowly for 6s through pursed lips.'
    ],
    commonMistakes: ['Chest-only shallow breathing', 'Tensing shoulders on inhale'],
    tips: ['Activates the vagus nerve and shifts body into rapid recovery state'],
    defaultSets: 1,
    defaultDurationSeconds: 60,
    restSeconds: 0
  }
];
