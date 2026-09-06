import React, { useState, useEffect } from 'react';
import {
  RAINY_DAY_HOME_WORKOUT_TEMPLATE,
  WarmupExercise,
  StrengthCircuitExercise,
  CardioRound,
  CooldownExercise
} from '../../data/rainyDayWorkout';
import { WorkoutLog, DailyWorkout } from '../../types';
import { ExercisePostureDiagram } from '../common/ExercisePostureDiagram';
import { ExerciseTutorialModal, TutorialExerciseData } from './ExerciseTutorialModal';
import {
  playWhistleSound,
  playAlertBeep,
  playChimeSound,
  speakVoice,
  isSoundEnabled,
  isVoiceEnabled,
  setSoundEnabled,
  setVoiceEnabled
} from '../../services/soundService';

interface RainyDayWorkoutViewProps {
  onSaveWorkoutLog: (log: WorkoutLog) => void;
  onCancel: () => void;
}

export const RainyDayWorkoutView: React.FC<RainyDayWorkoutViewProps> = ({
  onSaveWorkoutLog,
  onCancel
}) => {
  const template = RAINY_DAY_HOME_WORKOUT_TEMPLATE;

  // Active Phase State: 'overview' | 'warmup' | 'strength' | 'cardio' | 'cooldown' | 'summary'
  const [phase, setPhase] = useState<'overview' | 'warmup' | 'strength' | 'cardio' | 'cooldown' | 'summary'>('overview');

  // Audio Toggles
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled);
  const [voiceOn, setVoiceOn] = useState<boolean>(isVoiceEnabled);

  // Low Impact Mode Toggle
  const [isLowImpact, setIsLowImpact] = useState<boolean>(false);

  // Push-up Progression used
  const [pushupProgression, setPushupProgression] = useState<string>('Standard Push-Up');

  // Tutorial Modal State
  const [tutorialExercise, setTutorialExercise] = useState<TutorialExerciseData | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [inlineVideoMode, setInlineVideoMode] = useState<boolean>(false);
  const [overviewPreviewTab, setOverviewPreviewTab] = useState<'warmup' | 'strength' | 'cardio' | 'cooldown'>('strength');

  // 6-Second Get Ready Countdown Overlay State
  const [prepCountdown, setPrepCountdown] = useState<number | null>(null);

  // Phase 1 Warmup State
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupTimeLeft, setWarmupTimeLeft] = useState<number>(
    template.warmup.exercises[0]?.durationSeconds || 40
  );
  const [isWarmupPaused, setIsWarmupPaused] = useState<boolean>(false);

  // Phase 2 Strength State (Individual Exercise Step-by-Step Player)
  const [currentStrengthRound, setCurrentStrengthRound] = useState<number>(1);
  const [strengthExIndex, setStrengthExIndex] = useState<number>(0);
  const [strengthExTimeLeft, setStrengthExTimeLeft] = useState<number>(0);
  const [isStrengthExPaused, setIsStrengthExPaused] = useState<boolean>(false);
  const [strengthRestLeft, setStrengthRestLeft] = useState<number>(0);
  const [isStrengthResting, setIsStrengthResting] = useState<boolean>(false);

  // Phase 3 Cardio State (8 Rounds of 40s work + 20s rest)
  const [cardioRoundIndex, setCardioRoundIndex] = useState<number>(0);
  const [isCardioWorking, setIsCardioWorking] = useState<boolean>(true);
  const [cardioTimeLeft, setCardioTimeLeft] = useState<number>(40);
  const [isCardioPaused, setIsCardioPaused] = useState<boolean>(false);

  // Phase 4 Cooldown State
  const [cooldownIndex, setCooldownIndex] = useState<number>(0);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(
    template.cooldown.exercises[0]?.durationSeconds || 40
  );
  const [isCooldownPaused, setIsCooldownPaused] = useState<boolean>(false);

  // Summary State
  const [rpe, setRpe] = useState<number>(7);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Normal' | 'Good' | 'Excellent'>('Good');
  const [notes, setNotes] = useState<string>('');

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

  // Safe exercise helpers
  const currentWarmupEx = template.warmup.exercises[warmupIndex] || template.warmup.exercises[0];
  const currentStrengthEx = template.strengthCircuit.exercises[strengthExIndex] || template.strengthCircuit.exercises[0];
  const currentCardioRound = template.runningCardio.roundsSequence[cardioRoundIndex] || template.runningCardio.roundsSequence[0];
  const currentCooldownEx = template.cooldown.exercises[cooldownIndex] || template.cooldown.exercises[0];

  // Open Tutorial with Auto-Pause on Running Timer
  const openTutorial = (data: TutorialExerciseData) => {
    if (phase === 'warmup') setIsWarmupPaused(true);
    if (phase === 'strength') setIsStrengthExPaused(true);
    if (phase === 'cardio') setIsCardioPaused(true);
    if (phase === 'cooldown') setIsCooldownPaused(true);

    setTutorialExercise(data);
    setIsTutorialOpen(true);
  };

  // Mapper helpers for Tutorial Exercise Data
  const getWarmupTutorialData = (ex: WarmupExercise, idx: number): TutorialExerciseData => ({
    name: ex.name,
    youtubeVideoId: ex.youtubeVideoId,
    image: ex.image,
    instructions: ex.instructions,
    formCues: ex.formCues,
    commonMistakes: ex.commonMistakes,
    targetMuscles: ex.targetMuscles,
    durationSeconds: ex.durationSeconds,
    phaseLabel: `Phase 1: Dynamic Warm-Up • Exercise ${idx + 1} of ${template.warmup.exercises.length}`
  });

  const getStrengthTutorialData = (ex: StrengthCircuitExercise): TutorialExerciseData => {
    let videoId = ex.youtubeVideoId;
    let name = ex.name;
    if (ex.id === 's-pushup' && ex.progressionVideos && ex.progressionVideos[pushupProgression]) {
      videoId = ex.progressionVideos[pushupProgression];
      name = pushupProgression;
    }
    return {
      name,
      youtubeVideoId: videoId,
      image: ex.image,
      instructions: ex.instructions,
      formCues: ex.formCues,
      commonMistakes: ex.commonMistakes,
      targetMuscles: ex.targetMuscles,
      target: ex.target,
      durationSeconds: ex.defaultDurationSeconds,
      phaseLabel: `Phase 2: Strength Circuit • Round ${currentStrengthRound} of ${template.strengthCircuit.rounds}`
    };
  };

  const getCardioTutorialData = (round: CardioRound): TutorialExerciseData => {
    const isLow = isLowImpact;
    return {
      name: isLow ? round.lowImpactAlternativeName : round.exerciseName,
      youtubeVideoId: isLow ? round.lowImpactYoutubeVideoId : round.youtubeVideoId,
      image: isLow ? round.lowImpactImage : round.image,
      instructions: isLow ? round.lowImpactInstructions : round.instructions,
      formCues: round.formCues,
      commonMistakes: round.commonMistakes,
      targetMuscles: round.targetMuscles,
      target: `${round.workSeconds}s Work / ${round.restSeconds}s Rest`,
      durationSeconds: round.workSeconds,
      phaseLabel: `Phase 3: Running Cardio • Round ${round.roundNumber} of 8 (${isLow ? 'Low Impact' : 'Standard'})`
    };
  };

  const getCooldownTutorialData = (ex: CooldownExercise, idx: number): TutorialExerciseData => ({
    name: ex.name,
    youtubeVideoId: ex.youtubeVideoId,
    image: ex.image,
    instructions: ex.instructions,
    formCues: ex.formCues,
    commonMistakes: ex.commonMistakes,
    targetMuscles: ex.targetMuscles,
    durationSeconds: ex.durationSeconds,
    phaseLabel: `Phase 4: Cool-Down Stretches • Stretch ${idx + 1} of ${template.cooldown.exercises.length}`
  });

  // VOICE ANNOUNCEMENT FOR EXERCISE NAME & TARGET
  useEffect(() => {
    if (phase === 'overview' || phase === 'summary') return;

    let exName = '';
    let exTarget = '';

    if (phase === 'warmup') {
      exName = currentWarmupEx?.name || '';
      exTarget = `${currentWarmupEx?.durationSeconds || 40} seconds`;
    } else if (phase === 'strength') {
      if (isStrengthResting) {
        exName = 'Round Rest Period';
        exTarget = `${strengthRestLeft} seconds rest`;
      } else {
        exName = currentStrengthEx?.name || '';
        exTarget = currentStrengthEx?.target || '';
      }
    } else if (phase === 'cardio') {
      if (isCardioWorking) {
        exName = isLowImpact
          ? currentCardioRound?.lowImpactAlternativeName
          : currentCardioRound?.exerciseName;
        exTarget = '40 seconds high effort';
      } else {
        exName = 'Active Recovery';
        exTarget = '20 seconds recovery walk';
      }
    } else if (phase === 'cooldown') {
      exName = currentCooldownEx?.name || '';
      exTarget = `${currentCooldownEx?.durationSeconds || 40} seconds stretch`;
    }

    if (exName) {
      const textToSpeak = `Next exercise: ${exName}. ${exTarget ? `Target: ${exTarget}.` : ''} Get ready!`;
      speakVoice(textToSpeak);
    }
  }, [phase, warmupIndex, strengthExIndex, isStrengthResting, currentStrengthRound, cardioRoundIndex, isCardioWorking, cooldownIndex, isLowImpact]);

  // 6-SECOND PREP COUNTDOWN EFFECT
  useEffect(() => {
    let timer: any = null;
    if (prepCountdown !== null && prepCountdown > 0) {
      playAlertBeep(700 + (6 - prepCountdown) * 100, 100);
      timer = setInterval(() => {
        setPrepCountdown((c) => (c !== null && c > 1 ? c - 1 : 0));
      }, 1000);
    } else if (prepCountdown === 0) {
      setPrepCountdown(null);
      playWhistleSound();
      speakVoice('GO!');
    }
    return () => clearInterval(timer);
  }, [prepCountdown]);

  // WARMUP TIMER EFFECT WITH AUDIO & VOICE
  useEffect(() => {
    let timer: any = null;
    if (phase === 'warmup' && prepCountdown === null && !isWarmupPaused && warmupTimeLeft > 0) {
      if (warmupTimeLeft <= 3) {
        playAlertBeep(800, 120);
        speakVoice(warmupTimeLeft.toString());
      }
      timer = setInterval(() => setWarmupTimeLeft((t) => t - 1), 1000);
    } else if (phase === 'warmup' && prepCountdown === null && warmupTimeLeft === 0) {
      if (warmupIndex < template.warmup.exercises.length - 1) {
        const nextIdx = warmupIndex + 1;
        setWarmupIndex(nextIdx);
        const nextEx = template.warmup.exercises[nextIdx];
        setWarmupTimeLeft(nextEx ? nextEx.durationSeconds : 40);
        setPrepCountdown(6);
      } else {
        // Move to Strength phase
        setPhase('strength');
        setStrengthExIndex(0);
        const firstEx = template.strengthCircuit.exercises[0];
        setStrengthExTimeLeft(firstEx?.defaultDurationSeconds || 0);
        setPrepCountdown(6);
      }
    }
    return () => clearInterval(timer);
  }, [phase, prepCountdown, isWarmupPaused, warmupTimeLeft, warmupIndex]);

  // STRENGTH TIMED EXERCISE TIMER EFFECT
  useEffect(() => {
    let timer: any = null;
    if (
      phase === 'strength' &&
      prepCountdown === null &&
      !isStrengthResting &&
      !isStrengthExPaused &&
      currentStrengthEx?.defaultDurationSeconds &&
      strengthExTimeLeft > 0
    ) {
      if (strengthExTimeLeft <= 3) {
        playAlertBeep(900, 120);
        speakVoice(strengthExTimeLeft.toString());
      }
      timer = setInterval(() => setStrengthExTimeLeft((t) => t - 1), 1000);
    } else if (
      phase === 'strength' &&
      prepCountdown === null &&
      !isStrengthResting &&
      currentStrengthEx?.defaultDurationSeconds &&
      strengthExTimeLeft === 0
    ) {
      handleCompleteStrengthEx();
    }
    return () => clearInterval(timer);
  }, [phase, prepCountdown, isStrengthResting, isStrengthExPaused, strengthExTimeLeft, currentStrengthEx]);

  // STRENGTH ROUND REST TIMER EFFECT WITH AUDIO & VOICE
  useEffect(() => {
    let timer: any = null;
    if (phase === 'strength' && isStrengthResting && strengthRestLeft > 0) {
      if (strengthRestLeft <= 3) {
        playAlertBeep(800, 120);
        speakVoice(strengthRestLeft.toString());
      }
      timer = setInterval(() => setStrengthRestLeft((t) => t - 1), 1000);
    } else if (phase === 'strength' && isStrengthResting && strengthRestLeft === 0) {
      setIsStrengthResting(false);
      setStrengthExIndex(0);
      const firstEx = template.strengthCircuit.exercises[0];
      setStrengthExTimeLeft(firstEx?.defaultDurationSeconds || 0);
      setPrepCountdown(6);
    }
    return () => clearInterval(timer);
  }, [phase, isStrengthResting, strengthRestLeft, currentStrengthRound]);

  // CARDIO TIMER EFFECT WITH AUDIO & VOICE
  useEffect(() => {
    let timer: any = null;
    if (phase === 'cardio' && prepCountdown === null && !isCardioPaused && cardioTimeLeft > 0) {
      if (cardioTimeLeft <= 3) {
        playAlertBeep(1000, 120);
        speakVoice(cardioTimeLeft.toString());
      }
      timer = setInterval(() => setCardioTimeLeft((t) => t - 1), 1000);
    } else if (phase === 'cardio' && prepCountdown === null && cardioTimeLeft === 0) {
      if (isCardioWorking) {
        // Work interval finished -> enter 20s recovery
        setIsCardioWorking(false);
        setCardioTimeLeft(20);
        playChimeSound();
      } else {
        // Recovery finished -> move to next round
        if (cardioRoundIndex < template.runningCardio.totalRounds - 1) {
          const nextR = cardioRoundIndex + 1;
          setCardioRoundIndex(nextR);
          setIsCardioWorking(true);
          setCardioTimeLeft(40);
          setPrepCountdown(6);
        } else {
          // Cardio finished -> Move to Cooldown
          setPhase('cooldown');
          setCooldownIndex(0);
          setCooldownTimeLeft(template.cooldown.exercises[0]?.durationSeconds || 40);
          setPrepCountdown(6);
        }
      }
    }
    return () => clearInterval(timer);
  }, [phase, prepCountdown, isCardioPaused, cardioTimeLeft, isCardioWorking, cardioRoundIndex, isLowImpact]);

  // COOLDOWN TIMER EFFECT WITH AUDIO & VOICE
  useEffect(() => {
    let timer: any = null;
    if (phase === 'cooldown' && prepCountdown === null && !isCooldownPaused && cooldownTimeLeft > 0) {
      if (cooldownTimeLeft <= 3) {
        playAlertBeep(600, 120);
      }
      timer = setInterval(() => setCooldownTimeLeft((t) => t - 1), 1000);
    } else if (phase === 'cooldown' && prepCountdown === null && cooldownTimeLeft === 0) {
      if (cooldownIndex < template.cooldown.exercises.length - 1) {
        const nextIdx = cooldownIndex + 1;
        setCooldownIndex(nextIdx);
        const nextEx = template.cooldown.exercises[nextIdx];
        setCooldownTimeLeft(nextEx ? nextEx.durationSeconds : 40);
        setPrepCountdown(6);
      } else {
        // Cooldown finished -> Go to Summary
        setPhase('summary');
        playChimeSound();
        speakVoice('Rainy day workout complete! Outstanding job!');
      }
    }
    return () => clearInterval(timer);
  }, [phase, prepCountdown, isCooldownPaused, cooldownTimeLeft, cooldownIndex]);

  const handleStartWarmup = () => {
    setWarmupIndex(0);
    const firstEx = template.warmup.exercises[0];
    setWarmupTimeLeft(firstEx ? firstEx.durationSeconds : 40);
    setPhase('warmup');
    setPrepCountdown(6);
  };

  const handleCompleteStrengthEx = () => {
    if (strengthExIndex < template.strengthCircuit.exercises.length - 1) {
      const nextIdx = strengthExIndex + 1;
      setStrengthExIndex(nextIdx);
      const nextEx = template.strengthCircuit.exercises[nextIdx];
      setStrengthExTimeLeft(nextEx?.defaultDurationSeconds || 0);
      setPrepCountdown(6);
    } else {
      // All 7 exercises in this round completed
      if (currentStrengthRound < template.strengthCircuit.rounds) {
        const nextRound = currentStrengthRound + 1;
        setCurrentStrengthRound(nextRound);
        setStrengthRestLeft(template.strengthCircuit.restBetweenRoundsSeconds);
        setIsStrengthResting(true);
        playChimeSound();
      } else {
        // All 3 strength rounds completed -> move to Phase 3 Cardio
        setPhase('cardio');
        setCardioRoundIndex(0);
        setIsCardioWorking(true);
        setCardioTimeLeft(40);
        setPrepCountdown(6);
      }
    }
  };

  const handleSaveFinalLog = () => {
    const energyMap: Record<string, 'Low' | 'Moderate' | 'High' | 'Peak'> = {
      Low: 'Low',
      Normal: 'Moderate',
      Good: 'High',
      Excellent: 'Peak'
    };

    const log: WorkoutLog = {
      id: 'rainy-log-' + Date.now(),
      workoutId: template.id,
      date: new Date().toISOString().split('T')[0],
      title: template.title + (isLowImpact ? ' [Low Impact Mode]' : ''),
      location: 'HOME',
      isConvertedToHome: true,
      plannedDurationMinutes: 35,
      actualDurationMinutes: 35,
      rpe,
      energyLevel: energyMap[energyLevel] || 'High',
      painOrInjuryFlag: false,
      notes: `[Rainy-Day Workout Log] Push-Up Variation Used: ${pushupProgression}. Low Impact Mode: ${isLowImpact ? 'ON' : 'OFF'}. ${notes}`,
      loggedAt: new Date().toISOString(),
      completedExercises: template.strengthCircuit.exercises.map((e) => ({
        name: e.id === 's-pushup' ? pushupProgression : e.name,
        setsCompleted: 3
      }))
    };

    onSaveWorkoutLog(log);
  };

  return (
    <main className="max-w-3xl mx-auto px-gutter py-md flex flex-col gap-md text-on-surface min-h-screen pb-24 relative">
      {/* Header Bar */}
      <header className="flex justify-between items-center bg-surface-container p-md rounded-xl border border-outline-variant">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            OFFICIAL TRAINING TEMPLATE • HOME MODE
          </span>
          <h1 className="font-headline-md text-headline-md text-primary">{template.title}</h1>
        </div>
        <div className="flex items-center gap-xs">
          {/* Whistle / Sound & Voice Toggles */}
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

          <button onClick={onCancel} className="text-on-surface-variant hover:text-primary ml-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </header>

      {/* Low Impact Mode Toggle Banner */}
      <div className="glass-panel p-sm rounded-xl flex justify-between items-center border border-outline-variant">
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary-container">volume_off</span>
          <div>
            <span className="font-label-caps text-xs text-on-surface font-bold">
              🔇 Low Impact Mode
            </span>
            <span className="text-[11px] text-on-surface-variant block">
              Replaces jumping exercises for apartment dwelling & low-joint impact.
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsLowImpact(!isLowImpact)}
          className={`px-md py-xs rounded-full font-label-caps text-xs transition-all ${
            isLowImpact
              ? 'bg-primary-container text-on-primary-container font-bold neo-glow'
              : 'bg-surface-container text-on-surface-variant border border-outline-variant'
          }`}
        >
          {isLowImpact ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* OVERVIEW PHASE */}
      {phase === 'overview' && (
        <div className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-md">
          {/* Coach Motto & Quote */}
          <div className="bg-surface-container-lowest p-sm rounded-lg border-l-4 border-l-primary-container space-y-xs">
            <p className="font-headline-md text-xs text-primary">{template.coachReminders.motto}</p>
            <p className="font-body-md text-xs text-on-surface-variant italic">
              "{template.coachReminders.rainQuote}"
            </p>
          </div>

          <p className="font-body-md text-xs text-on-surface-variant">{template.disclaimer}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-xs text-center text-xs font-data-tabular">
            <div className="bg-surface-container-lowest p-xs rounded">
              <span className="text-[10px] text-on-surface-variant block uppercase">DURATION</span>
              <span className="text-primary font-bold">30–35 min</span>
            </div>
            <div className="bg-surface-container-lowest p-xs rounded">
              <span className="text-[10px] text-on-surface-variant block uppercase">STRENGTH</span>
              <span className="text-primary font-bold">3 Rounds</span>
            </div>
            <div className="bg-surface-container-lowest p-xs rounded">
              <span className="text-[10px] text-on-surface-variant block uppercase">CARDIO</span>
              <span className="text-primary font-bold">8 min (8 Rds)</span>
            </div>
            <div className="bg-surface-container-lowest p-xs rounded">
              <span className="text-[10px] text-on-surface-variant block uppercase">AUDIO & VOICE</span>
              <span className="text-primary-container font-bold">🔊 Whistle + 🗣️ Voice</span>
            </div>
          </div>

          {/* Workout Structure Outline & Interactive Tutorial Explorer */}
          <div className="space-y-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-label-caps text-xs text-primary-container uppercase font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">play_circle</span>
                <span>Exercise Video Tutorials & Form Guides</span>
              </h4>
              <span className="text-[11px] text-on-surface-variant">Tap any exercise to preview tutorial</span>
            </div>

            {/* Preview Phase Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant/30 text-center font-label-caps text-[11px]">
              <button
                type="button"
                onClick={() => setOverviewPreviewTab('warmup')}
                className={`py-1.5 rounded transition-all cursor-pointer font-bold ${
                  overviewPreviewTab === 'warmup'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Warmup (7)
              </button>
              <button
                type="button"
                onClick={() => setOverviewPreviewTab('strength')}
                className={`py-1.5 rounded transition-all cursor-pointer font-bold ${
                  overviewPreviewTab === 'strength'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Strength (7)
              </button>
              <button
                type="button"
                onClick={() => setOverviewPreviewTab('cardio')}
                className={`py-1.5 rounded transition-all cursor-pointer font-bold ${
                  overviewPreviewTab === 'cardio'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Cardio (8)
              </button>
              <button
                type="button"
                onClick={() => setOverviewPreviewTab('cooldown')}
                className={`py-1.5 rounded transition-all cursor-pointer font-bold ${
                  overviewPreviewTab === 'cooldown'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Cooldown (5)
              </button>
            </div>

            {/* Exercise Preview List with Tutorial Play Buttons */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {overviewPreviewTab === 'warmup' &&
                template.warmup.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    onClick={() => openTutorial(getWarmupTutorialData(ex, idx))}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-10 h-10 rounded-md object-cover border border-outline-variant/30"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {ex.durationSeconds}s • Dynamic Warm-Up
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container text-[11px] font-label-caps font-bold flex items-center gap-1 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      <span>Tutorial</span>
                    </button>
                  </div>
                ))}

              {overviewPreviewTab === 'strength' &&
                template.strengthCircuit.exercises.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => openTutorial(getStrengthTutorialData(ex))}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-10 h-10 rounded-md object-cover border border-outline-variant/30"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          Target: {ex.target}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container text-[11px] font-label-caps font-bold flex items-center gap-1 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      <span>Tutorial</span>
                    </button>
                  </div>
                ))}

              {overviewPreviewTab === 'cardio' &&
                template.runningCardio.roundsSequence.map((round) => {
                  const name = isLowImpact ? round.lowImpactAlternativeName : round.exerciseName;
                  const img = isLowImpact ? round.lowImpactImage : round.image;
                  return (
                    <div
                      key={round.roundNumber}
                      onClick={() => openTutorial(getCardioTutorialData(round))}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={img}
                          alt={name}
                          className="w-10 h-10 rounded-md object-cover border border-outline-variant/30"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                            Round {round.roundNumber}: {name}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {round.workSeconds}s Work / {round.restSeconds}s Rest
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container text-[11px] font-label-caps font-bold flex items-center gap-1 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">play_circle</span>
                        <span>Tutorial</span>
                      </button>
                    </div>
                  );
                })}

              {overviewPreviewTab === 'cooldown' &&
                template.cooldown.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    onClick={() => openTutorial(getCooldownTutorialData(ex, idx))}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container/60 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-10 h-10 rounded-md object-cover border border-outline-variant/30"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {ex.durationSeconds}s • Mobility & Recovery
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-primary-container/20 text-primary-container text-[11px] font-label-caps font-bold flex items-center gap-1 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      <span>Tutorial</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={handleStartWarmup}
            className="w-full bg-primary-container text-on-primary-container font-headline-md text-sm sm:text-headline-md py-md rounded-lg neo-glow flex items-center justify-center gap-xs mt-sm cursor-pointer hover:bg-primary-fixed transition-transform active:scale-[0.98] min-h-[52px] font-bold text-center"
          >
            <span>START WARM-UP (WHISTLE & VOICE ON)</span>
            <span className="material-symbols-outlined text-[22px]">play_arrow</span>
          </button>
        </div>
      )}

      {/* 6-SECOND GET READY COUNTDOWN OVERLAY */}
      {prepCountdown !== null && phase !== 'overview' && phase !== 'summary' && (
        <div className="glass-card p-lg rounded-xl flex flex-col items-center justify-center text-center gap-sm border-2 border-primary-container neo-glow shadow-[0_0_24px_rgba(0,245,255,0.4)] my-auto min-h-[300px]">
          <span className="font-label-caps text-xs text-primary-container font-bold uppercase tracking-widest">
            ⏱️ GET READY • PREPARATION COUNTDOWN
          </span>
          <div className="font-data-tabular text-7xl font-bold text-primary my-xs animate-bounce">
            {prepCountdown > 0 ? prepCountdown : 'GO! 🚀'}
          </div>
          <h3 className="font-headline-md text-xl text-on-surface font-bold">
            {phase === 'warmup'
              ? currentWarmupEx?.name
              : phase === 'strength'
              ? currentStrengthEx?.name
              : phase === 'cardio'
              ? isLowImpact
                ? currentCardioRound?.lowImpactAlternativeName
                : currentCardioRound?.exerciseName
              : phase === 'cooldown'
              ? currentCooldownEx?.name
              : 'Exercise'}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Get into starting position! Whistle will blow in {prepCountdown} seconds.
          </p>
          <button
            onClick={() => {
              setPrepCountdown(null);
              playWhistleSound();
            }}
            className="px-md py-xs bg-surface-container border border-primary-container/40 rounded text-xs font-label-caps text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors mt-xs"
          >
            SKIP COUNTDOWN (START NOW)
          </button>
        </div>
      )}

      {/* PHASE 1: WARM-UP */}
      {phase === 'warmup' && prepCountdown === null && currentWarmupEx && (
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <div>
              <span className="font-label-caps text-xs text-primary-container uppercase">
                PHASE 1: DYNAMIC WARM-UP • EXERCISE {warmupIndex + 1} OF {template.warmup.exercises.length}
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">{currentWarmupEx.name}</h2>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => openTutorial(getWarmupTutorialData(currentWarmupEx, warmupIndex))}
                className="px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container font-label-caps text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Watch YouTube Video Tutorial & Form Guide"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Tutorial</span>
              </button>
              <div className="font-data-tabular text-3xl font-bold text-primary-container">
                {warmupTimeLeft}s
              </div>
            </div>
          </div>

          {/* Media View: Photo + Diagram OR Inline YouTube Video */}
          <div>
            {inlineVideoMode ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary-container/40 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentWarmupEx.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${currentWarmupEx.name} Video Tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="h-48 sm:h-56 w-full bg-surface-variant rounded-xl overflow-hidden relative flex border border-outline-variant/30">
                <div className="w-1/2 h-full relative overflow-hidden">
                  <img src={currentWarmupEx.image} alt={currentWarmupEx.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary">
                    Proper Form Photo
                  </div>
                </div>
                <div className="w-1/2 h-full bg-surface-container-lowest border-l border-outline-variant/30 relative">
                  <ExercisePostureDiagram exerciseName={currentWarmupEx.name} />
                  <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary-container">
                    Skeletal Alignment
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={() => {
                  if (!inlineVideoMode) setIsWarmupPaused(true);
                  setInlineVideoMode(!inlineVideoMode);
                }}
                className="px-3 py-1 rounded bg-surface-container text-[11px] font-label-caps text-primary border border-outline-variant/50 hover:border-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {inlineVideoMode ? 'image' : 'smart_display'}
                </span>
                <span>{inlineVideoMode ? 'Switch to Photo & Diagram' : '▶️ Play Inline Video'}</span>
              </button>
              <button
                type="button"
                onClick={() => openTutorial(getWarmupTutorialData(currentWarmupEx, warmupIndex))}
                className="text-xs text-primary-container hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Biomechanics Guide</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{currentWarmupEx.instructions}</p>

          {/* Quick Form Cues Banner */}
          {currentWarmupEx.formCues && currentWarmupEx.formCues.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span className="text-on-surface font-medium">
                <strong>Key Cue:</strong> {currentWarmupEx.formCues[0]}
              </span>
            </div>
          )}

          {warmupIndex < template.warmup.exercises.length - 1 && (
            <p className="font-label-caps text-xs text-primary-container">
              Next: {template.warmup.exercises[warmupIndex + 1]?.name}
            </p>
          )}

          <div className="flex gap-sm pt-sm">
            <button
              onClick={() => setIsWarmupPaused(!isWarmupPaused)}
              className="flex-1 py-sm rounded border border-outline-variant font-label-caps text-xs"
            >
              {isWarmupPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={() => {
                setInlineVideoMode(false);
                if (warmupIndex < template.warmup.exercises.length - 1) {
                  const nextIdx = warmupIndex + 1;
                  setWarmupIndex(nextIdx);
                  const nextEx = template.warmup.exercises[nextIdx];
                  setWarmupTimeLeft(nextEx ? nextEx.durationSeconds : 40);
                  setPrepCountdown(6);
                } else {
                  setPhase('strength');
                  setStrengthExIndex(0);
                  const firstEx = template.strengthCircuit.exercises[0];
                  setStrengthExTimeLeft(firstEx?.defaultDurationSeconds || 0);
                  setPrepCountdown(6);
                }
              }}
              className="flex-1 py-sm rounded bg-primary-container text-on-primary-container font-label-caps text-xs font-bold neo-glow"
            >
              SKIP / NEXT
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: STRENGTH CIRCUIT (INDIVIDUAL EXERCISE STEP-BY-STEP PLAYER) */}
      {phase === 'strength' && prepCountdown === null && (
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <div>
              <span className="font-label-caps text-xs text-primary-container uppercase">
                PHASE 2: STRENGTH CIRCUIT • ROUND {currentStrengthRound} OF {template.strengthCircuit.rounds}
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">
                Exercise {strengthExIndex + 1} of 7: {currentStrengthEx?.id === 's-pushup' ? pushupProgression : currentStrengthEx?.name}
              </h2>
            </div>
            <div className="flex items-center gap-2.5">
              {currentStrengthEx && !isStrengthResting && (
                <button
                  type="button"
                  onClick={() => openTutorial(getStrengthTutorialData(currentStrengthEx))}
                  className="px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container font-label-caps text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Watch YouTube Video Tutorial & Form Guide"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>Tutorial</span>
                </button>
              )}
              {isStrengthResting ? (
                <div className="font-data-tabular text-xl font-bold text-primary-container animate-pulse">
                  REST: {strengthRestLeft}s
                </div>
              ) : currentStrengthEx?.defaultDurationSeconds ? (
                <div className="font-data-tabular text-3xl font-bold text-primary-container">
                  {strengthExTimeLeft}s
                </div>
              ) : (
                <div className="bg-primary-container/20 border border-primary-container px-3 py-1 rounded font-data-tabular text-xs font-bold text-primary-container">
                  🎯 {currentStrengthEx?.target}
                </div>
              )}
            </div>
          </div>

          {isStrengthResting ? (
            <div className="p-lg bg-surface-container-lowest rounded-xl text-center flex flex-col items-center gap-sm">
              <span className="material-symbols-outlined text-4xl text-primary-container">timer</span>
              <h3 className="font-headline-md text-headline-md text-primary">ROUND REST PERIOD</h3>
              <p className="font-body-md text-xs text-on-surface-variant">
                Hydrate and rest for {strengthRestLeft} seconds before Round {currentStrengthRound}.
              </p>
              <button
                onClick={() => {
                  setIsStrengthResting(false);
                  setStrengthExIndex(0);
                  const firstEx = template.strengthCircuit.exercises[0];
                  setStrengthExTimeLeft(firstEx?.defaultDurationSeconds || 0);
                  setPrepCountdown(6);
                }}
                className="px-md py-xs bg-primary-container text-on-primary-container font-label-caps text-xs rounded font-bold mt-xs"
              >
                START ROUND {currentStrengthRound} NOW
              </button>
            </div>
          ) : currentStrengthEx ? (
            <div className="flex flex-col gap-md">
              {/* Media: Photo + Diagram OR Inline YouTube Video */}
              <div>
                {inlineVideoMode ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary-container/40 bg-black shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${
                        currentStrengthEx.id === 's-pushup' && currentStrengthEx.progressionVideos?.[pushupProgression]
                          ? currentStrengthEx.progressionVideos[pushupProgression]
                          : currentStrengthEx.youtubeVideoId
                      }?autoplay=1&rel=0&modestbranding=1`}
                      title={`${currentStrengthEx.name} Video Tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="h-48 sm:h-56 w-full bg-surface-variant rounded-xl overflow-hidden relative flex border border-outline-variant/30">
                    <div className="w-1/2 h-full relative overflow-hidden">
                      <img src={currentStrengthEx.image} alt={currentStrengthEx.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary">
                        Proper Form Photo
                      </div>
                    </div>
                    <div className="w-1/2 h-full bg-surface-container-lowest border-l border-outline-variant/30 relative">
                      <ExercisePostureDiagram exerciseName={currentStrengthEx.name} />
                      <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary-container">
                        Skeletal Alignment
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!inlineVideoMode) setIsStrengthExPaused(true);
                      setInlineVideoMode(!inlineVideoMode);
                    }}
                    className="px-3 py-1 rounded bg-surface-container text-[11px] font-label-caps text-primary border border-outline-variant/50 hover:border-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {inlineVideoMode ? 'image' : 'smart_display'}
                    </span>
                    <span>{inlineVideoMode ? 'Switch to Photo & Diagram' : '▶️ Play Inline Video'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openTutorial(getStrengthTutorialData(currentStrengthEx))}
                    className="text-xs text-primary-container hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Biomechanics Guide</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {currentStrengthEx.instructions}
              </p>

              {/* Target & Push-Up Progression Selector */}
              <div className="flex justify-between items-center p-sm bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                <div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                    TARGET REPS / EFFORT
                  </span>
                  <span className="font-data-tabular text-lg font-bold text-primary">
                    {currentStrengthEx.target}
                  </span>
                </div>

                {currentStrengthEx.progressions && (
                  <div className="flex flex-col items-end gap-xs">
                    <span className="font-label-caps text-[10px] text-primary-container uppercase">
                      PUSH-UP VARIATION
                    </span>
                    <select
                      value={pushupProgression}
                      onChange={(e) => setPushupProgression(e.target.value)}
                      className="bg-surface-container text-xs text-primary font-data-tabular p-1 rounded border border-outline-variant"
                    >
                      {currentStrengthEx.progressions.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Key Form Cue & Target Muscles */}
              {currentStrengthEx.formCues && currentStrengthEx.formCues.length > 0 && (
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                  <span className="text-on-surface font-medium">
                    <strong>Key Cue:</strong> {currentStrengthEx.formCues[0]}
                  </span>
                </div>
              )}

              {/* Target Muscles */}
              <div className="flex gap-xs flex-wrap">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase my-auto">
                  TARGET MUSCLES:
                </span>
                {currentStrengthEx.targetMuscles.map((m, idx) => (
                  <span key={idx} className="bg-surface-container px-2 py-0.5 rounded text-[10px] text-primary-container font-label-caps">
                    {m}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-sm pt-sm">
                <button
                  onClick={() => setIsStrengthExPaused(!isStrengthExPaused)}
                  className={`flex-1 py-sm rounded font-label-caps text-xs flex items-center justify-center gap-xs border ${
                    isStrengthExPaused
                      ? 'bg-primary-container text-on-primary-container font-bold neo-glow border-primary-container'
                      : 'bg-surface-container text-on-surface border-outline-variant hover:border-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isStrengthExPaused ? 'play_arrow' : 'pause'}
                  </span>
                  <span>{isStrengthExPaused ? 'RESUME EXERCISE' : 'PAUSE EXERCISE'}</span>
                </button>

                <button
                  onClick={() => {
                    setInlineVideoMode(false);
                    handleCompleteStrengthEx();
                  }}
                  className="flex-1 py-md bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-lg neo-glow flex items-center justify-center gap-xs cursor-pointer"
                >
                  <span>
                    COMPLETE EXERCISE ({strengthExIndex + 1}/7)
                  </span>
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* PHASE 3: RUNNING-SPECIFIC CARDIO (8 ROUNDS) */}
      {phase === 'cardio' && prepCountdown === null && currentCardioRound && (
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <div>
              <span className="font-label-caps text-xs text-primary-container uppercase">
                PHASE 3: RUNNING-SPECIFIC CARDIO (1.6 KM 8-MIN CONDITIONING)
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">
                ROUND {cardioRoundIndex + 1} OF 8 • {isCardioWorking ? '🔥 WORK INTERVAL' : '💧 RECOVERY'}
              </h2>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => openTutorial(getCardioTutorialData(currentCardioRound))}
                className="px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container font-label-caps text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Watch YouTube Video Tutorial & Form Guide"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Tutorial</span>
              </button>
              <div className="font-data-tabular text-4xl font-bold text-primary-container">
                {cardioTimeLeft}s
              </div>
            </div>
          </div>

          {/* Media View: Photo OR Inline YouTube Video */}
          <div>
            {inlineVideoMode ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary-container/40 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${
                    isLowImpact ? currentCardioRound.lowImpactYoutubeVideoId : currentCardioRound.youtubeVideoId
                  }?autoplay=1&rel=0&modestbranding=1`}
                  title={isLowImpact ? currentCardioRound.lowImpactAlternativeName : currentCardioRound.exerciseName}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="h-48 sm:h-56 w-full bg-surface-variant rounded-xl overflow-hidden relative border border-outline-variant/30">
                <img
                  src={isLowImpact ? currentCardioRound.lowImpactImage : currentCardioRound.image}
                  alt="Cardio Exercise"
                  className="w-full h-full object-cover"
                />
                {isLowImpact && (
                  <div className="absolute top-2 left-2 bg-primary-container/90 text-on-primary-container px-2 py-1 rounded font-label-caps text-[10px] font-bold">
                    🔇 LOW IMPACT ALTERNATIVE ACTIVE
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={() => {
                  if (!inlineVideoMode) setIsCardioPaused(true);
                  setInlineVideoMode(!inlineVideoMode);
                }}
                className="px-3 py-1 rounded bg-surface-container text-[11px] font-label-caps text-primary border border-outline-variant/50 hover:border-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {inlineVideoMode ? 'image' : 'smart_display'}
                </span>
                <span>{inlineVideoMode ? 'Switch to Photo' : '▶️ Play Inline Video'}</span>
              </button>
              <button
                type="button"
                onClick={() => openTutorial(getCardioTutorialData(currentCardioRound))}
                className="text-xs text-primary-container hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Biomechanics Guide</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="text-center space-y-xs">
            <h3 className="font-headline-md text-xl text-primary font-bold">
              {isLowImpact
                ? currentCardioRound.lowImpactAlternativeName
                : currentCardioRound.exerciseName}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant">
              {isCardioWorking
                ? '40 Seconds High Effort Work! Maintain cadence.'
                : '20 Seconds Active Recovery Walking/Breathe.'}
            </p>
          </div>

          {/* Quick Form Cue */}
          {currentCardioRound.formCues && currentCardioRound.formCues.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span className="text-on-surface font-medium">
                <strong>Key Cue:</strong> {currentCardioRound.formCues[0]}
              </span>
            </div>
          )}

          <div className="flex gap-sm pt-sm">
            <button
              onClick={() => setIsCardioPaused(!isCardioPaused)}
              className="flex-1 py-sm rounded border border-outline-variant font-label-caps text-xs"
            >
              {isCardioPaused ? 'RESUME' : 'PAUSE'}
            </button>

            <button
              onClick={() => {
                setInlineVideoMode(false);
                if (cardioRoundIndex < template.runningCardio.totalRounds - 1) {
                  const nextR = cardioRoundIndex + 1;
                  setCardioRoundIndex(nextR);
                  setIsCardioWorking(true);
                  setCardioTimeLeft(40);
                  setPrepCountdown(6);
                } else {
                  setPhase('cooldown');
                  setCooldownIndex(0);
                  setCooldownTimeLeft(template.cooldown.exercises[0]?.durationSeconds || 40);
                  setPrepCountdown(6);
                }
              }}
              className="flex-1 py-sm rounded bg-primary-container text-on-primary-container font-label-caps text-xs font-bold neo-glow"
            >
              SKIP ROUND
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: COOL-DOWN STRETCHES */}
      {phase === 'cooldown' && prepCountdown === null && currentCooldownEx && (
        <div className="glass-card rounded-xl p-md flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-outline-variant pb-xs">
            <div>
              <span className="font-label-caps text-xs text-primary-container uppercase">
                PHASE 4: COOL-DOWN • STRETCH {cooldownIndex + 1} OF {template.cooldown.exercises.length}
              </span>
              <h2 className="font-headline-md text-headline-md text-primary">{currentCooldownEx.name}</h2>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => openTutorial(getCooldownTutorialData(currentCooldownEx, cooldownIndex))}
                className="px-3 py-1.5 rounded-lg bg-primary-container/20 border border-primary-container/40 text-primary-container font-label-caps text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Watch YouTube Video Tutorial & Form Guide"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>Tutorial</span>
              </button>
              <div className="font-data-tabular text-3xl font-bold text-primary-container">
                {cooldownTimeLeft}s
              </div>
            </div>
          </div>

          {/* Media View: Photo OR Inline YouTube Video */}
          <div>
            {inlineVideoMode ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary-container/40 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentCooldownEx.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${currentCooldownEx.name} Video Tutorial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="h-48 sm:h-56 w-full bg-surface-variant rounded-xl overflow-hidden relative border border-outline-variant/30">
                <img src={currentCooldownEx.image} alt={currentCooldownEx.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary">
                  Proper Form Demonstration
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={() => {
                  if (!inlineVideoMode) setIsCooldownPaused(true);
                  setInlineVideoMode(!inlineVideoMode);
                }}
                className="px-3 py-1 rounded bg-surface-container text-[11px] font-label-caps text-primary border border-outline-variant/50 hover:border-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {inlineVideoMode ? 'image' : 'smart_display'}
                </span>
                <span>{inlineVideoMode ? 'Switch to Photo' : '▶️ Play Inline Video'}</span>
              </button>
              <button
                type="button"
                onClick={() => openTutorial(getCooldownTutorialData(currentCooldownEx, cooldownIndex))}
                className="text-xs text-primary-container hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Biomechanics Guide</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{currentCooldownEx.instructions}</p>

          {/* Quick Form Cue */}
          {currentCooldownEx.formCues && currentCooldownEx.formCues.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span className="text-on-surface font-medium">
                <strong>Key Cue:</strong> {currentCooldownEx.formCues[0]}
              </span>
            </div>
          )}

          <div className="flex gap-sm pt-sm">
            <button
              onClick={() => setIsCooldownPaused(!isCooldownPaused)}
              className="flex-1 py-sm rounded border border-outline-variant font-label-caps text-xs"
            >
              {isCooldownPaused ? 'RESUME' : 'PAUSE'}
            </button>

            <button
              onClick={() => {
                setInlineVideoMode(false);
                if (cooldownIndex < template.cooldown.exercises.length - 1) {
                  const nextIdx = cooldownIndex + 1;
                  setCooldownIndex(nextIdx);
                  const nextEx = template.cooldown.exercises[nextIdx];
                  setCooldownTimeLeft(nextEx ? nextEx.durationSeconds : 40);
                  setPrepCountdown(6);
                } else {
                  setPhase('summary');
                  playChimeSound();
                  speakVoice('Rainy day workout complete! Outstanding job!');
                }
              }}
              className="flex-1 py-sm rounded bg-primary-container text-on-primary-container font-label-caps text-xs font-bold neo-glow"
            >
              NEXT STRETCH
            </button>
          </div>
        </div>
      )}

      {/* WORKOUT SUMMARY PHASE */}
      {phase === 'summary' && (
        <div className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-md">
          <div className="text-center space-y-xs border-b border-outline-variant pb-md">
            <span className="text-4xl">🌧️💪</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Rainy-Day Workout Complete!</h2>
            <p className="font-body-md text-xs text-on-surface-variant">
              Cardiovascular & strength session logged successfully.
            </p>
          </div>

          {/* Stat Summary Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xs text-center text-xs font-data-tabular bg-surface-container-lowest p-md rounded-lg">
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">DURATION</span>
              <span className="text-primary font-bold text-base">35 min</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">STRENGTH</span>
              <span className="text-primary font-bold text-base">3 Rounds</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">CARDIO</span>
              <span className="text-primary font-bold text-base">8 min (8 Rds)</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant block uppercase">PUSH-UP VARIATION</span>
              <span className="text-primary-container font-bold text-xs">{pushupProgression}</span>
            </div>
          </div>

          {/* RPE Rating */}
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between text-xs font-label-caps">
              <span className="text-on-surface-variant uppercase">RPE (Rate of Perceived Exertion)</span>
              <span className="text-primary font-bold font-data-tabular">{rpe} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value, 10))}
              className="accent-primary-container cursor-pointer"
            />
          </div>

          {/* Energy Rating */}
          <div className="flex flex-col gap-xs">
            <span className="font-label-caps text-xs text-on-surface-variant uppercase">Energy Level</span>
            <div className="grid grid-cols-4 gap-xs">
              {(['Low', 'Normal', 'Good', 'Excellent'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`py-xs rounded text-xs font-label-caps transition-all ${
                    energyLevel === lvl
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-xs text-on-surface-variant uppercase">Notes</label>
            <textarea
              rows={2}
              className="form-input-stride text-xs resize-none"
              placeholder="Felt great during the 8-round cardio circuit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveFinalLog}
            className="w-full bg-primary-container text-on-primary-container font-headline-md text-headline-md py-md rounded-lg neo-glow cursor-pointer"
          >
            SAVE WORKOUT
          </button>
        </div>
      )}

      {/* EXERCISE TUTORIAL & BIOMECHANICS MODAL */}
      <ExerciseTutorialModal
        exercise={tutorialExercise}
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </main>
  );
};
