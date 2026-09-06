import React, { useState } from 'react';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { ExerciseItem } from '../types';
import { ExercisePostureDiagram } from '../components/common/ExercisePostureDiagram';

export const ExerciseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseItem | null>(null);

  const categories = ['ALL', 'Lower Body', 'Upper Body', 'Core', 'Cardio', 'Running', 'Mobility'];

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-gutter md:px-lg flex flex-col gap-lg py-md pb-24 md:pb-8">
      {/* Search & Filter Bar */}
      <section className="flex flex-col gap-md sticky top-16 z-40 bg-background/95 backdrop-blur-md py-md -mx-gutter px-gutter md:mx-0 md:px-0 border-b border-outline-variant/30">
        <div className="relative w-full glass-card rounded-lg overflow-hidden neo-glow">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-none py-sm pl-xl pr-sm text-body-md font-body-md text-on-surface focus:ring-0 placeholder:text-on-surface-variant h-[48px]"
            placeholder="Search exercises by name or muscle group (e.g. Squat, Glutes, Push-Up)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-sm overflow-x-auto no-scrollbar pb-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-md py-xs rounded-full font-label-caps text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-container text-on-primary-container font-bold border border-primary-container shadow-[0_0_8px_rgba(0,245,255,0.4)]'
                  : 'bg-transparent text-on-surface-variant border border-outline-variant hover:border-primary-container hover:text-primary-container'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Exercise Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md md:gap-lg">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setActiveModalExercise(ex)}
            className="glass-card rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-primary-container transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-48 w-full bg-surface-variant overflow-hidden">
              <img
                src={ex.image}
                alt={ex.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <ExercisePostureDiagram exerciseName={ex.name} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="absolute bottom-sm left-sm right-sm flex justify-between items-end z-20">
                <span className="bg-surface-container/90 backdrop-blur-sm px-xs py-1 rounded font-label-caps text-[10px] text-primary-container border border-outline-variant">
                  {ex.category.toUpperCase()}
                </span>
                <span className="bg-surface-container/90 backdrop-blur-sm px-xs py-1 rounded font-label-caps text-[10px] text-on-surface border border-outline-variant">
                  {ex.difficulty}
                </span>
              </div>
            </div>

            <div className="p-md flex flex-col gap-xs">
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                {ex.name}
              </h3>
              <div className="flex flex-wrap gap-xs mt-1">
                {ex.muscleGroups.map((m, idx) => (
                  <span
                    key={idx}
                    className="bg-surface-container-highest px-2 py-0.5 rounded text-[10px] text-on-surface-variant font-label-caps"
                  >
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-sm mt-xs border-t border-outline-variant/30 text-xs font-data-tabular text-primary-container">
                <span>
                  {ex.defaultSets ? `${ex.defaultSets} sets` : ''}{' '}
                  {ex.defaultReps ? `× ${ex.defaultReps} reps` : `${ex.defaultDurationSeconds}s`}
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Exercise Detail Modal */}
      {activeModalExercise && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg flex items-center justify-center p-md overflow-y-auto">
          <div className="glass-card max-w-2xl w-full rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto border border-primary-container/40">
            <div className="relative h-56 w-full bg-surface-variant flex">
              <div className="w-1/2 h-full relative overflow-hidden">
                <img
                  src={activeModalExercise.image}
                  alt={activeModalExercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/2 h-full bg-surface-container-lowest border-l border-outline-variant/40">
                <ExercisePostureDiagram exerciseName={activeModalExercise.name} />
              </div>
              <button
                onClick={() => setActiveModalExercise(null)}
                className="absolute top-sm right-sm w-8 h-8 rounded-full bg-background/80 text-on-surface flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-colors z-30"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-md md:p-lg overflow-y-auto space-y-md text-on-surface">
              <div>
                <span className="font-label-caps text-xs text-primary-container uppercase">
                  {activeModalExercise.category} • {activeModalExercise.equipment}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  {activeModalExercise.name}
                </h2>
              </div>

              {/* YouTube Video Tutorial Embed */}
              {activeModalExercise.youtubeVideoId && (
                <div className="flex flex-col gap-xs">
                  <h4 className="font-label-caps text-xs text-primary-container uppercase flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>▶️ Watch YouTube Exercise Tutorial</span>
                  </h4>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary-container/40 shadow-[0_0_12px_rgba(0,245,255,0.2)]">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${activeModalExercise.youtubeVideoId}?rel=0&modestbranding=1`}
                      title={`${activeModalExercise.name} Video Tutorial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div>
                <h4 className="font-label-caps text-xs text-on-surface-variant uppercase mb-xs">
                  Execution Instructions & Biomechanics
                </h4>
                <ol className="list-decimal list-inside space-y-xs text-xs font-body-md text-on-surface leading-relaxed">
                  {activeModalExercise.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>

              {/* Common Mistakes */}
              {activeModalExercise.commonMistakes && (
                <div>
                  <h4 className="font-label-caps text-xs text-error uppercase mb-xs">
                    ⚠️ Common Mistakes to Avoid
                  </h4>
                  <ul className="list-disc list-inside space-y-xs text-xs text-on-surface-variant">
                    {activeModalExercise.commonMistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {activeModalExercise.tips && (
                <div>
                  <h4 className="font-label-caps text-xs text-primary-container uppercase mb-xs">
                    💡 Training & Form Tips
                  </h4>
                  <ul className="list-disc list-inside space-y-xs text-xs text-on-surface-variant">
                    {activeModalExercise.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setActiveModalExercise(null)}
                className="w-full bg-primary-container text-on-primary-container font-headline-md py-xs rounded-lg mt-md neo-glow"
              >
                CLOSE EXERCISE DETAILS
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
