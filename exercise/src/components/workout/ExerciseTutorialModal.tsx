import React, { useState } from 'react';
import { ExercisePostureDiagram } from '../common/ExercisePostureDiagram';

export interface TutorialExerciseData {
  name: string;
  youtubeVideoId?: string;
  image?: string;
  instructions?: string;
  formCues?: string[];
  commonMistakes?: string[];
  targetMuscles?: string[];
  target?: string;
  durationSeconds?: number;
  phaseLabel?: string;
}

interface ExerciseTutorialModalProps {
  exercise: TutorialExerciseData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseTutorialModal: React.FC<ExerciseTutorialModalProps> = ({
  exercise,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'form'>('video');

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/85 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-surface-container border border-outline-variant/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-on-surface">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-outline-variant/30 bg-surface-container-high/50">
          <div className="flex flex-col gap-0.5">
            {exercise.phaseLabel && (
              <span className="font-label-caps text-[11px] text-primary-container uppercase tracking-wider font-bold">
                {exercise.phaseLabel}
              </span>
            )}
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold flex items-center gap-2">
              <span>{exercise.name}</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-variant/60 hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant flex items-center justify-center transition-all cursor-pointer"
            title="Close Tutorial"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Switcher: Video Tutorial vs Form Guide */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-lowest/50 px-4 pt-2">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2.5 font-label-caps text-xs border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">play_circle</span>
            <span>YouTube Video Tutorial</span>
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-4 py-2.5 font-label-caps text-xs border-b-2 font-bold transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">image</span>
            <span>Proper Form & Diagram</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active Tab Content */}
          {activeTab === 'video' ? (
            <div className="space-y-3">
              {exercise.youtubeVideoId ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary-container/30 shadow-[0_0_20px_rgba(0,245,255,0.15)] bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${exercise.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={`${exercise.name} YouTube Exercise Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center text-center p-6 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                    videocam_off
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    Video tutorial streaming preview unavailable for this variant.
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary-container">info</span>
                  High-definition exercise biomechanics demonstration
                </span>
                {exercise.youtubeVideoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${exercise.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Open in YouTube</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Form Visuals: Photo + Biomechanical Diagram */
            <div className="space-y-3">
              <div className="h-56 sm:h-64 w-full bg-surface-variant rounded-xl overflow-hidden flex border border-outline-variant/30 shadow-md">
                {exercise.image ? (
                  <div className="w-1/2 h-full relative overflow-hidden bg-black/40">
                    <img
                      src={exercise.image}
                      alt={`${exercise.name} proper form demonstration`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary">
                      Demonstration Photo
                    </div>
                  </div>
                ) : (
                  <div className="w-1/2 h-full flex items-center justify-center bg-surface-container-lowest text-on-surface-variant text-xs">
                    No photo preview
                  </div>
                )}
                <div className="w-1/2 h-full bg-surface-container-lowest border-l border-outline-variant/30 relative">
                  <ExercisePostureDiagram exerciseName={exercise.name} />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-[10px] font-bold text-primary-container">
                    Biomechanics Diagram
                  </div>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant italic text-center">
                Compare side profile and skeletal alignment cues to execute each rep with zero joint strain.
              </p>
            </div>
          )}

          {/* Biomechanical Instructions */}
          {exercise.instructions && (
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 space-y-1.5">
              <h3 className="font-label-caps text-xs text-primary-container uppercase font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">checklist</span>
                <span>How to Do Properly (Step-by-Step)</span>
              </h3>
              <p className="font-body-md text-sm text-on-surface leading-relaxed">
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* Form Cues (DO) vs Common Mistakes (DON'T) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Key Form Cues */}
            {exercise.formCues && exercise.formCues.length > 0 && (
              <div className="p-3.5 bg-primary-container/10 border border-primary-container/30 rounded-xl space-y-2">
                <h4 className="font-label-caps text-xs text-primary-container uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  <span>Key Form Cues (Do This)</span>
                </h4>
                <ul className="space-y-1.5">
                  {exercise.formCues.map((cue, idx) => (
                    <li key={idx} className="text-xs text-on-surface flex items-start gap-1.5 leading-snug">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                <h4 className="font-label-caps text-xs text-rose-400 uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-rose-400">cancel</span>
                  <span>Common Mistakes to Avoid</span>
                </h4>
                <ul className="space-y-1.5">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="text-xs text-rose-200 flex items-start gap-1.5 leading-snug">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Target Muscles Badges */}
          {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-bold">
                Target Muscle Groups & Prime Movers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exercise.targetMuscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container-high border border-outline-variant/40 text-primary"
                  >
                    💪 {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/30 bg-surface-container-high/40 flex justify-between items-center gap-3">
          <div className="text-xs text-on-surface-variant">
            {exercise.target && (
              <span>
                Target: <strong className="text-primary">{exercise.target}</strong>
              </span>
            )}
            {exercise.durationSeconds && (
              <span>
                Interval: <strong className="text-primary">{exercise.durationSeconds} seconds</strong>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer shadow-lg"
          >
            Close & Continue Workout
          </button>
        </div>
      </div>
    </div>
  );
};
