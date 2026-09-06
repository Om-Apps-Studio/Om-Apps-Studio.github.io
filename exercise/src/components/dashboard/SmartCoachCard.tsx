import React from 'react';
import { SmartCoachInsight } from '../../types';

interface SmartCoachCardProps {
  insight: SmartCoachInsight | null;
}

export const SmartCoachCard: React.FC<SmartCoachCardProps> = ({ insight }) => {
  if (!insight) return null;

  return (
    <section className="glass-panel rounded-xl p-md flex gap-md items-start relative overflow-hidden border-l-4 border-l-primary-container">
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/5 rounded-full blur-xl pointer-events-none" />
      <div className="text-primary-container mt-1 flex-shrink-0">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          tips_and_updates
        </span>
      </div>
      <div className="flex flex-col gap-xs relative z-10">
        <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
          {insight.title || 'Smart Coach Insight'}
        </h4>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          {insight.message}
        </p>
        {insight.actionableRecommendation && (
          <p className="font-label-caps text-[12px] text-primary-container mt-1">
            💡 Recommendation: {insight.actionableRecommendation}
          </p>
        )}
      </div>
    </section>
  );
};
