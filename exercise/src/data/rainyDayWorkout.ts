export interface WarmupExercise {
  id: string;
  name: string;
  durationSeconds: number;
  instructions: string;
  image: string;
  youtubeVideoId: string;
  formCues: string[];
  commonMistakes: string[];
  targetMuscles: string[];
}

export interface StrengthCircuitExercise {
  id: string;
  name: string;
  target: string;
  defaultReps?: number;
  defaultDurationSeconds?: number;
  perSide?: boolean;
  progressions?: string[]; // e.g. ['Incline Push-Up', 'Knee Push-Up', 'Standard Push-Up']
  progressionVideos?: Record<string, string>;
  targetMuscles: string[];
  image: string;
  youtubeVideoId: string;
  instructions: string;
  formCues: string[];
  commonMistakes: string[];
}

export interface CardioRound {
  roundNumber: number;
  exerciseName: string;
  lowImpactAlternativeName: string;
  workSeconds: number;
  restSeconds: number;
  image: string;
  lowImpactImage: string;
  youtubeVideoId: string;
  lowImpactYoutubeVideoId: string;
  instructions: string;
  lowImpactInstructions: string;
  formCues: string[];
  commonMistakes: string[];
  targetMuscles: string[];
}

export interface CooldownExercise {
  id: string;
  name: string;
  durationSeconds: number;
  instructions: string;
  image: string;
  youtubeVideoId: string;
  formCues: string[];
  commonMistakes: string[];
  targetMuscles: string[];
}

export interface RainyDayWorkoutTemplate {
  id: string;
  title: string;
  subtitle: string;
  totalDurationMinutes: number;
  equipment: string;
  difficultyLevels: ('Beginner' | 'Intermediate' | 'Advanced')[];
  coachReminders: {
    motto: string;
    rainQuote: string;
  };
  disclaimer: string;
  warmup: {
    durationMinutes: number;
    exercises: WarmupExercise[];
  };
  strengthCircuit: {
    rounds: number;
    restBetweenRoundsSeconds: number;
    exercises: StrengthCircuitExercise[];
  };
  runningCardio: {
    durationMinutes: number;
    totalRounds: number;
    roundsSequence: CardioRound[];
  };
  cooldown: {
    durationMinutes: number;
    exercises: CooldownExercise[];
  };
  weeklyRainySchedule: {
    day: string;
    workoutTitle: string;
    type: string;
  }[];
}

export const RAINY_DAY_HOME_WORKOUT_TEMPLATE: RainyDayWorkoutTemplate = {
  id: 'rainy-day-home-workout',
  title: '🌧️ RAINY-DAY HOME WORKOUT',
  subtitle: '1.6 km in 8 minutes + Belly Fat Loss + Muscle & Strength Builder',
  totalDurationMinutes: 35,
  equipment: 'No equipment required',
  difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
  coachReminders: {
    motto: '🏃 Run for speed + Strength for muscle + Food for recovery + Sleep for progress.',
    rainQuote: "Rain doesn't have to stop your training. Adapt the workout, don't skip the goal. 🌧️💪"
  },
  disclaimer:
    'This workout helps maintain conditioning when running outside is not possible. It is not an exact replacement for outdoor running.',
  warmup: {
    durationMinutes: 5,
    exercises: [
      {
        id: 'w-arm-circles',
        name: 'Arm Circles',
        durationSeconds: 40,
        instructions:
          'Extend arms horizontally at shoulder level. Rotate your arms smoothly in controlled 8-10 inch circles forward for 20 seconds, then reverse directions. Keep shoulders relaxed and away from your ears.',
        image: 'https://i.ytimg.com/vi/m3VRxuRRToA/hqdefault.jpg',
        youtubeVideoId: 'm3VRxuRRToA',
        formCues: [
          'Maintain arms strictly horizontal at shoulder height',
          'Initiate circular motion from shoulder joints, not elbows or wrists',
          'Brace abdominal wall to prevent ribs from flaring'
        ],
        commonMistakes: [
          'Dropping arms below shoulder height',
          'Shrugging shoulders upward towards ears',
          'Arching lumbar spine while rotating'
        ],
        targetMuscles: ['Deltoids', 'Rotator Cuff', 'Upper Trapezius', 'Rhomboids']
      },
      {
        id: 'w-marching-place',
        name: 'Marching in Place',
        durationSeconds: 40,
        instructions:
          'Stand tall with feet hip-width. March briskly in place by driving alternating knees up toward 90-degree waist height. Synchronize opposite arm swing in a fluid running rhythm.',
        image: 'https://i.ytimg.com/vi/16oJspYFz7s/hqdefault.jpg',
        youtubeVideoId: '16oJspYFz7s',
        formCues: [
          'Drive knee up to exact 90° hip parallel',
          'Pump opposite arm forward with elbows bent at 90°',
          'Land softly on midfoot and ball of foot'
        ],
        commonMistakes: [
          'Leaning torso backward as knees rise',
          'Stomping flat-footed with loud impact',
          'Passive arms hanging at sides'
        ],
        targetMuscles: ['Hip Flexors', 'Quadriceps', 'Calves', 'Core Stabilizers']
      },
      {
        id: 'w-high-knee-march',
        name: 'High-Knee Marching',
        durationSeconds: 40,
        instructions:
          'Elevate your knee drive higher than a standard march, pulling the knee actively toward chest height while keeping posture tall and rigid.',
        image:
          'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=800&q=80',
        youtubeVideoId: 'OAJ_J3EZkdY',
        formCues: [
          'Pull knee above hip line with core tension',
          'Keep supporting leg straight and glute engaged',
          'Stay tall through spine with proud chest'
        ],
        commonMistakes: [
          'Rounding shoulders forward to meet knee',
          'Collapsing ankle or knee of stance leg',
          'Jerky erratic pacing'
        ],
        targetMuscles: ['Iliopsoas', 'Rectus Abdominis', 'Gluteus Medius']
      },
      {
        id: 'w-butt-kicks',
        name: 'Butt Kicks',
        durationSeconds: 40,
        instructions:
          'Jog gently in place, actively flexing your hamstrings to flick each heel straight up toward your glutes. Keep thighs perpendicular to the floor.',
        image: 'https://i.ytimg.com/vi/e4cnI7eVKRw/hqdefault.jpg',
        youtubeVideoId: 'e4cnI7eVKRw',
        formCues: [
          'Pull heels directly up toward glutes underneath hips',
          'Keep knees pointing downward toward floor',
          'Slight forward athletic lean from the ankles'
        ],
        commonMistakes: [
          'Swinging knees forward like high knees',
          'Arching lower back on every kick',
          'Looking down at feet instead of horizon'
        ],
        targetMuscles: ['Hamstrings', 'Quadriceps (Dynamic Stretch)', 'Calves']
      },
      {
        id: 'w-hip-rotations',
        name: 'Hip Rotations',
        durationSeconds: 40,
        instructions:
          'Place hands firmly on hips with feet slightly wider than shoulder-width. Draw wide, smooth circular paths with your pelvis clockwise for 20 seconds, then counter-clockwise.',
        image: 'https://i.ytimg.com/vi/DeqMGwnxc1M/hqdefault.jpg',
        youtubeVideoId: 'DeqMGwnxc1M',
        formCues: [
          'Keep feet firmly rooted flat into floor',
          'Maximize circumference of hip circle',
          'Maintain steady, relaxed nasal breathing'
        ],
        commonMistakes: [
          'Bending knees excessively instead of mobilizing hips',
          'Jerking movements without circular smoothness',
          'Holding breath'
        ],
        targetMuscles: ['Hip Capsule', 'Glute Medius', 'Quadratus Lumborum']
      },
      {
        id: 'w-ankle-rotations',
        name: 'Ankle Rotations',
        durationSeconds: 40,
        instructions:
          'Balance on one leg with the other foot slightly elevated. Trace smooth, large circles in the air with your big toe, mobilizing the ankle joint and Achilles tendon. Switch legs at 20s.',
        image: 'https://i.ytimg.com/vi/z24gW6aHJrI/hqdefault.jpg',
        youtubeVideoId: 'z24gW6aHJrI',
        formCues: [
          'Isolate ankle joint; keep lower leg stationary',
          'Perform full 360-degree circumduction',
          'Control both inward and outward rotations'
        ],
        commonMistakes: [
          'Rushing with tiny incomplete circles',
          'Twisting whole leg from hip instead of ankle',
          'Losing standing balance'
        ],
        targetMuscles: ['Achilles Tendon', 'Peroneals', 'Tibialis Anterior']
      },
      {
        id: 'w-light-jacks',
        name: 'Light Jumping Jacks',
        durationSeconds: 40,
        instructions:
          'Perform light, rhythmic jumping jacks. Land softly on forefeet with slight knee bend, sweeping arms in a full overhead circle to warm the cardiovascular system.',
        image:
          'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80',
        youtubeVideoId: '2W4ZNSwoW_4',
        formCues: [
          'Land softly on the balls of feet with knees springy',
          'Touch fingertips overhead at apex of jump',
          'Keep core braced and spine neutral'
        ],
        commonMistakes: [
          'Heavy flat-footed landings',
          'Knees collapsing inward on impact',
          'Short, half-hearted arm arcs'
        ],
        targetMuscles: ['Calves', 'Deltoids', 'Cardiovascular System']
      }
    ]
  },
  strengthCircuit: {
    rounds: 3,
    restBetweenRoundsSeconds: 60,
    exercises: [
      {
        id: 's-squat',
        name: 'Bodyweight Squat',
        target: '15 reps',
        defaultReps: 15,
        targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
        image:
          'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
        youtubeVideoId: 'aclHkVaku9U',
        instructions:
          'Stand with feet shoulder-width apart, toes pointing slightly outward (15-30°). Inhale, push hips back and down, bending knees until thighs are at least parallel to floor. Keep chest proud, drive through midfoot/heels to stand and squeeze glutes at the top.',
        formCues: [
          'Hips initiate movement by reaching backward before knees bend',
          'Track knees outward directly over second and third toes',
          'Keep chest tall and eyes focused straight forward'
        ],
        commonMistakes: [
          'Knees collapsing inward (valgus fault)',
          'Heels peeling up off the floor',
          'Rounding lower back into flexion'
        ]
      },
      {
        id: 's-pushup',
        name: 'Push-Up',
        target: '8–15 reps',
        defaultReps: 12,
        progressions: ['Incline Push-Up', 'Knee Push-Up', 'Standard Push-Up'],
        progressionVideos: {
          'Incline Push-Up': '4dF1DOWzf20',
          'Knee Push-Up': 'rrVwNeIpy-k',
          'Standard Push-Up': 'IODxDxX7oi4'
        },
        targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoids', 'Core'],
        image: 'https://i.ytimg.com/vi/IODxDxX7oi4/hqdefault.jpg',
        youtubeVideoId: 'IODxDxX7oi4',
        instructions:
          'Set hands slightly wider than shoulder-width. Establish a solid plank line from crown of head to heels. Lower chest until 1-2 inches above floor with elbows angled back at 45 degrees. Press floor away smoothly.',
        formCues: [
          'Keep elbows tucked at 45° angle, not flared to 90°',
          'Maintain rigid spine with glutes and abs tightly contracted',
          'Gaze slightly forward of fingertips to preserve neck alignment'
        ],
        commonMistakes: [
          'Sagging hips putting pressure on lumbar spine',
          'Piking hips into the air like a downward dog',
          'Flaring elbows out laterally stressing anterior shoulder capsule'
        ]
      },
      {
        id: 's-reverse-lunge',
        name: 'Reverse Lunge',
        target: '10 each leg',
        defaultReps: 10,
        perSide: true,
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Hip Stabilizers'],
        image: 'https://i.ytimg.com/vi/TI2U-RfbALY/hqdefault.jpg',
        youtubeVideoId: 'TI2U-RfbALY',
        instructions:
          'Stand upright with feet hip-width apart. Step backward with left foot, bending both knees to approximately 90 degrees until back knee gently hovers above floor. Drive firmly through front heel to step back to starting position.',
        formCues: [
          'Both front and back knees form 90° angles at bottom of lunge',
          'Front knee stays aligned over midfoot, never collapsing inward',
          'Torso remains upright with chest lifted and core braced'
        ],
        commonMistakes: [
          'Stepping feet onto a single straight line instead of hip-width tracks',
          'Slamming back knee onto the hard floor',
          'Leaning torso excessively forward over front thigh'
        ]
      },
      {
        id: 's-glute-bridge',
        name: 'Glute Bridge',
        target: '15–20 reps',
        defaultReps: 18,
        targetMuscles: ['Gluteus Maximus', 'Hamstrings', 'Posterior Chain'],
        image: 'https://i.ytimg.com/vi/wPM8icPu6H8/hqdefault.jpg',
        youtubeVideoId: 'wPM8icPu6H8',
        instructions:
          'Lie on your back with knees bent and feet flat on floor, hip-width apart. Drive through heels and squeeze glutes hard to elevate hips until body forms a straight line from knees to shoulders. Pause 2 seconds at apex before lowering.',
        formCues: [
          'Drive through heels and midfoot with toes relaxed',
          'Squeeze glutes maximally at the top of each rep',
          'Keep ribs pinned down to prevent lower back hyperextension'
        ],
        commonMistakes: [
          'Arching lumbar spine rather than extending hips with glutes',
          'Pushing through toes instead of heels',
          'Allowing knees to splay outward or knock inward'
        ]
      },
      {
        id: 's-mountain-climber',
        name: 'Mountain Climber',
        target: '20–30 sec',
        defaultDurationSeconds: 30,
        targetMuscles: ['Core / Transverse Abdominis', 'Hip Flexors', 'Shoulders', 'Cardio'],
        image: 'https://i.ytimg.com/vi/nmwgirgXLYM/hqdefault.jpg',
        youtubeVideoId: 'nmwgirgXLYM',
        instructions:
          'Begin in a high push-up plank position with hands directly under shoulders. Alternately drive knees toward chest in a fast, fluid running motion while keeping hips low and core completely locked.',
        formCues: [
          'Keep shoulders stacked directly over palms at all times',
          'Maintain level hips without bouncing up and down',
          'Drive knees straight forward along chest centerline'
        ],
        commonMistakes: [
          'Hips bouncing high into the air',
          'Hands drifting ahead of shoulder line',
          'Holding breath during high tempo reps'
        ]
      },
      {
        id: 's-plank',
        name: 'Plank',
        target: '30–45 sec',
        defaultDurationSeconds: 45,
        targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Erector Spinae', 'Deltoids'],
        image: 'https://i.ytimg.com/vi/xe2MXatLTUw/hqdefault.jpg',
        youtubeVideoId: 'xe2MXatLTUw',
        instructions:
          'Rest on forearms with elbows directly under shoulders. Extend legs straight back with toes on floor. Brace abdominals, squeeze quadriceps and glutes to maintain a perfectly straight line from head to heels.',
        formCues: [
          'Draw navel in toward spine and brace like taking a punch',
          'Lock out knees and squeeze glutes together',
          'Keep eyes fixed on the floor between forearms'
        ],
        commonMistakes: [
          'Sagging hips and hyperextending lumbar spine',
          'Piking hips into a triangle',
          'Tilting head up or collapsing neck'
        ]
      },
      {
        id: 's-calf-raise',
        name: 'Calf Raise',
        target: '20 reps',
        defaultReps: 20,
        targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon', 'Foot Arches'],
        image: 'https://i.ytimg.com/vi/fZYTVO9-Ggk/hqdefault.jpg',
        youtubeVideoId: 'fZYTVO9-Ggk',
        instructions:
          'Stand tall with feet hip-width. Push down through balls of both feet to lift heels as high as possible. Pause at top contraction for 1 second, then lower heels slowly under control over 2-3 seconds.',
        formCues: [
          'Distribute weight evenly across first and second metatarsal heads',
          'Reach full vertical extension at peak of each repetition',
          'Control the eccentric lowering phase for 2 full seconds'
        ],
        commonMistakes: [
          'Rolling weight outward onto pinky toe edge',
          'Bouncing rapidly without eccentric control',
          'Bending knees to generate artificial momentum'
        ]
      }
    ]
  },
  runningCardio: {
    durationMinutes: 8,
    totalRounds: 8,
    roundsSequence: [
      {
        roundNumber: 1,
        exerciseName: 'High Knees',
        lowImpactAlternativeName: 'High-Knee Marching',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/OAJ_J3EZkdY/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/16oJspYFz7s/hqdefault.jpg',
        youtubeVideoId: 'OAJ_J3EZkdY',
        lowImpactYoutubeVideoId: '16oJspYFz7s',
        instructions:
          'Sprint dynamically in place driving knees up to 90° hip level. Pump arms rhythmically in running form to maximize stride power and aerobic engine.',
        lowImpactInstructions:
          'March rapidly in place with zero flight phase. Drive knees deliberately to waist level and pump opposite arms with high muscular tension.',
        formCues: [
          'Stay light on balls of feet with quick contact time',
          'Drive knees forward and up, not backward',
          'Maintain proud chest and upright running posture'
        ],
        commonMistakes: [
          'Leaning backward to help lift legs',
          'Dropping arm swing rhythm',
          'Landing flat-footed with loud impacts'
        ],
        targetMuscles: ['Hip Flexors', 'Quadriceps', 'Calves', 'Aerobic Engine']
      },
      {
        roundNumber: 2,
        exerciseName: 'Mountain Climbers',
        lowImpactAlternativeName: 'Slow Knee-to-Elbow Planks',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/nmwgirgXLYM/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/CalgrvjwZk0/hqdefault.jpg',
        youtubeVideoId: 'nmwgirgXLYM',
        lowImpactYoutubeVideoId: 'CalgrvjwZk0',
        instructions:
          'Assume full push-up position and drive knees explosively toward chest in high cadence sprints. Keep hips parallel to floor.',
        lowImpactInstructions:
          'Hold solid high plank. Slowly bring right knee to touch right tricep/elbow, hold 1s, step back, and switch sides deliberately.',
        formCues: [
          'Keep wrists directly beneath shoulders',
          'Hips stay level with shoulders, no bouncing',
          'Breathe continuously in time with cadence'
        ],
        commonMistakes: [
          'Piking hips into the air',
          'Looking back between feet (strains cervical neck)',
          'Shifting hands out in front of chest'
        ],
        targetMuscles: ['Transverse Abdominis', 'Shoulders', 'Hip Flexors', 'Cardio Engine']
      },
      {
        roundNumber: 3,
        exerciseName: 'Fast Feet',
        lowImpactAlternativeName: 'Low Quarter Squat Heel Taps',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/bkaByqjBefQ/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/Fg4ryGff51M/hqdefault.jpg',
        youtubeVideoId: 'bkaByqjBefQ',
        lowImpactYoutubeVideoId: 'Fg4ryGff51M',
        instructions:
          'Drop into an athletic quarter-squat crouch. Alternate tapping balls of feet in place as rapidly as possible, mimicking football agility drills.',
        lowImpactInstructions:
          'Hold quarter squat stance. Alternately tap right heel then left heel forward with fast arm pumping. No impact or jumping.',
        formCues: [
          'Stay low in athletic quarter-squat stance',
          'Rapid foot turnover on balls of feet',
          'Keep chest up and hands ready at chest'
        ],
        commonMistakes: [
          'Standing up straight losing athletic squat angle',
          'Crossing feet or tripping',
          'Holding breath'
        ],
        targetMuscles: ['Calves', 'Quadriceps', 'Fast-Twitch Foot Fibers', 'Agility']
      },
      {
        roundNumber: 4,
        exerciseName: 'Jumping Jacks',
        lowImpactAlternativeName: 'Fast Marching / Side Step Jacks',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/2W4ZNSwoW_4/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/FJ-seqGfwzA/hqdefault.jpg',
        youtubeVideoId: '2W4ZNSwoW_4',
        lowImpactYoutubeVideoId: 'FJ-seqGfwzA',
        instructions:
          'Jump feet wide while simultaneously clapping hands overhead, then return smoothly. Continuous rhythmic conditioning.',
        lowImpactInstructions:
          'Step right leg out to side while sweeping arms overhead, step back to center, then step left leg out. Zero joint impact.',
        formCues: [
          'Springy landings through midfoot and knees',
          'Full arm overhead range of motion',
          'Maintain steady breathing rhythm'
        ],
        commonMistakes: [
          'Landing with stiff locked knees',
          'Short incomplete arm sweeps',
          'Losing core engagement'
        ],
        targetMuscles: ['Full Body Conditioning', 'Calves', 'Deltoids', 'Heart Rate']
      },
      {
        roundNumber: 5,
        exerciseName: 'High Knees',
        lowImpactAlternativeName: 'High-Knee Marching',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/OAJ_J3EZkdY/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/16oJspYFz7s/hqdefault.jpg',
        youtubeVideoId: 'OAJ_J3EZkdY',
        lowImpactYoutubeVideoId: '16oJspYFz7s',
        instructions:
          'Sprint dynamically in place driving knees up to 90° hip level. Second round focus: maintain high cadence even with fatigue.',
        lowImpactInstructions:
          'High-knee marching with powerful arm swings. Focus on crisp hip flexor drive.',
        formCues: [
          'Stay light on balls of feet',
          'Drive knees forward and up',
          'Keep posture upright and proud'
        ],
        commonMistakes: ['Torso leaning back', 'Dropping arm rhythm'],
        targetMuscles: ['Hip Flexors', 'Quadriceps', 'Calves', 'Aerobic Engine']
      },
      {
        roundNumber: 6,
        exerciseName: 'Mountain Climbers',
        lowImpactAlternativeName: 'Slow Knee-to-Elbow Planks',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/nmwgirgXLYM/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/CalgrvjwZk0/hqdefault.jpg',
        youtubeVideoId: 'nmwgirgXLYM',
        lowImpactYoutubeVideoId: 'CalgrvjwZk0',
        instructions:
          'Assume full push-up position and drive knees explosively toward chest. Dig deep for round 6.',
        lowImpactInstructions:
          'Slow knee-to-elbow plank hold. Emphasize side oblique crunch on each knee drive.',
        formCues: ['Wrists under shoulders', 'Hips level', 'Steady rhythmic breath'],
        commonMistakes: ['Hips piking up', 'Hands drifting forward'],
        targetMuscles: ['Core', 'Shoulders', 'Cardio Engine']
      },
      {
        roundNumber: 7,
        exerciseName: 'Fast Feet',
        lowImpactAlternativeName: 'Low Quarter Squat Heel Taps',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/bkaByqjBefQ/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/Fg4ryGff51M/hqdefault.jpg',
        youtubeVideoId: 'bkaByqjBefQ',
        lowImpactYoutubeVideoId: 'Fg4ryGff51M',
        instructions:
          'Quarter-squat stance. Rapid foot turnover like running on hot coals. Maximize foot speed.',
        lowImpactInstructions:
          'Quarter squat heel taps. Move arms and feet with high cadence and zero impact.',
        formCues: ['Stay low in crouch', 'Rapid feet on balls of toes', 'Chest proud'],
        commonMistakes: ['Standing tall', 'Crossing feet'],
        targetMuscles: ['Calves', 'Quadriceps', 'Fast-Twitch Foot Fibers']
      },
      {
        roundNumber: 8,
        exerciseName: 'Jumping Jacks',
        lowImpactAlternativeName: 'Fast Marching / Side Step Jacks',
        workSeconds: 40,
        restSeconds: 20,
        image: 'https://i.ytimg.com/vi/2W4ZNSwoW_4/hqdefault.jpg',
        lowImpactImage: 'https://i.ytimg.com/vi/FJ-seqGfwzA/hqdefault.jpg',
        youtubeVideoId: '2W4ZNSwoW_4',
        lowImpactYoutubeVideoId: 'FJ-seqGfwzA',
        instructions:
          'Final cardio sprint round! Empty the tank with high tempo jumping jacks and full range arm claps.',
        lowImpactInstructions:
          'Final cardio round: rapid side step jacks or fast marching with maximum effort.',
        formCues: ['Soft springy landings', 'Full overhead arm sweep', 'Breathe through mouth'],
        commonMistakes: ['Flat-foot landings', 'Slumping shoulders'],
        targetMuscles: ['Full Body Conditioning', 'Cardiovascular Engine']
      }
    ]
  },
  cooldown: {
    durationMinutes: 5,
    exercises: [
      {
        id: 'c-quad-stretch',
        name: 'Quadriceps Stretch',
        durationSeconds: 40,
        instructions:
          'Stand upright holding a wall or chair for balance if needed. Grasp right ankle behind you with right hand, drawing heel toward glute. Keep knees touching together and gently press hips forward.',
        image: 'https://i.ytimg.com/vi/zi5__zBRzYc/hqdefault.jpg',
        youtubeVideoId: 'zi5__zBRzYc',
        formCues: [
          'Keep knees side-by-side; do not allow stretching knee to flare outward',
          'Tuck pelvis under (posterior tilt) to deepen stretch along rectus femoris',
          'Stand upright with tall spine'
        ],
        commonMistakes: [
          'Knee flaring out to the side',
          'Arching lower back to get heel closer',
          'Pulling ankle sideways twisting knee joint'
        ],
        targetMuscles: ['Quadriceps (Rectus Femoris, Vastus Medialis)', 'Hip Flexors']
      },
      {
        id: 'c-hamstring-stretch',
        name: 'Hamstring Stretch',
        durationSeconds: 40,
        instructions:
          'Step one foot slightly forward, resting on heel with toes pointed upward. Hinge at hips pushing buttocks straight back while keeping back flat until a deep stretch is felt along back of thigh.',
        image: 'https://i.ytimg.com/vi/qQ26F282VRo/hqdefault.jpg',
        youtubeVideoId: 'qQ26F282VRo',
        formCues: [
          'Hinge from hips with straight, flat spine',
          'Flex front toes toward ceiling to engage calf and sciatic line',
          'Inhale deeply and sink slightly deeper on exhalation'
        ],
        commonMistakes: [
          'Rounding upper back trying to touch toes with hands',
          'Locking knee joint in hyperextension',
          'Bouncing aggressively'
        ],
        targetMuscles: ['Biceps Femoris', 'Semitendinosus', 'Gastrocnemius']
      },
      {
        id: 'c-calf-stretch',
        name: 'Calf Stretch',
        durationSeconds: 40,
        instructions:
          'Step into a shallow lunge facing a wall or with hands on front thigh. Press rear heel firmly flat into floor with rear leg completely straight. Lean forward into front knee until deep calf stretch.',
        image: 'https://i.ytimg.com/vi/tUA4MO1kXV8/hqdefault.jpg',
        youtubeVideoId: 'tUA4MO1kXV8',
        formCues: [
          'Rear heel must remain cemented into floor throughout stretch',
          'Rear toes must point straight forward, not rotated outward',
          'Keep core gently engaged and pelvis squared'
        ],
        commonMistakes: [
          'Turning back foot outward (relieves stretch on calf belly)',
          'Letting rear heel lift off floor',
          'Arching lumbar spine'
        ],
        targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon']
      },
      {
        id: 'c-hip-flexor-stretch',
        name: 'Hip-Flexor Stretch',
        durationSeconds: 40,
        instructions:
          'Assume a half-kneeling position on a mat with both knees bent at 90 degrees. Squeeze rear glute tightly, tuck tailbone under, and shift hips forward 1-2 inches until stretch is felt in front of rear hip.',
        image: 'https://i.ytimg.com/vi/mzPvzMivukw/hqdefault.jpg',
        youtubeVideoId: 'mzPvzMivukw',
        formCues: [
          'Firmly squeeze the glute of the rear leg to reciprocally inhibit hip flexor',
          'Tuck pelvis under before shifting forward',
          'Maintain tall, vertical torso alignment'
        ],
        commonMistakes: [
          'Hyperextending lower back to force hip forward',
          'Leaning torso forward over front knee',
          'Collapsing inward through front knee'
        ],
        targetMuscles: ['Psoas Major', 'Iliacus', 'Rectus Femoris']
      },
      {
        id: 'c-deep-breathing',
        name: 'Deep Diaphragmatic Breathing',
        durationSeconds: 60,
        instructions:
          'Sit comfortably tall or lie supine with one hand on chest and one on belly. Inhale slowly through nose for 4 seconds expanding lower abdomen. Hold for 2 seconds. Exhale slowly for 6 seconds through pursed lips to downregulate heart rate and activate recovery.',
        image: 'https://i.ytimg.com/vi/vMjTJf4-xz0/hqdefault.jpg',
        youtubeVideoId: 'vMjTJf4-xz0',
        formCues: [
          'Belly hand rises on inhale; chest hand remains still',
          'Slow, controlled 6-second exhalation triggers parasympathetic shift',
          'Consciously release tension in neck, jaw, and shoulders'
        ],
        commonMistakes: [
          'Shallow chest breathing with rising shoulders',
          'Rushing through the exhalation',
          'Tensing abdominal wall during inhalation'
        ],
        targetMuscles: ['Diaphragm', 'Intercostal Muscles', 'Parasympathetic Nervous System']
      }
    ]
  },
  weeklyRainySchedule: [
    { day: 'Monday', workoutTitle: '🏠 Strength + Cardio (Rainy-Day Workout)', type: 'Full Body Conditioning' },
    { day: 'Tuesday', workoutTitle: '🏠 Indoor Running Drills & Cadence', type: 'Indoor Cardio Conditioning' },
    { day: 'Wednesday', workoutTitle: '🏠 Strength + Core Focus', type: 'Core & Anti-Extension' },
    { day: 'Thursday', workoutTitle: '🧘 Recovery + Mobility Reset', type: 'Mobility & Recovery' },
    { day: 'Friday', workoutTitle: '🏠 Strength + Cardio Circuit', type: 'Full Body Conditioning' },
    { day: 'Saturday', workoutTitle: '🏠 Indoor Interval Workout (8-Round Cardio)', type: 'Indoor Cardio Conditioning' },
    { day: 'Sunday', workoutTitle: '😴 Rest & Recovery', type: 'Rest Day' }
  ]
};
