import React from 'react';

interface ExercisePostureDiagramProps {
  exerciseName: string;
  className?: string;
}

export const ExercisePostureDiagram: React.FC<ExercisePostureDiagramProps> = ({
  exerciseName,
  className = 'w-full h-full'
}) => {
  const name = exerciseName.toLowerCase();

  // SVG Posture Illustrations matching exercise types
  if (name.includes('squat')) {
    return (
      <svg className={className} viewBox="0 0 200 160" fill="none">
        <rect width="200" height="160" fill="#010f1f" />
        <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
        {/* Torso & Head */}
        <circle cx="85" cy="45" r="12" fill="#00f5ff" />
        <path d="M 85 57 L 70 95 L 45 135" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 95 L 115 100 L 125 135" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 85 65 L 125 75" stroke="#00f5ff" strokeWidth="5" strokeLinecap="round" />
        <text x="135" y="45" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">SQUAT POSTURE</text>
        <text x="135" y="60" fill="#b9caca" fontSize="8" fontFamily="sans-serif">90° Thigh Parallel</text>
      </svg>
    );
  }

  if (name.includes('push-up') || name.includes('push up')) {
    return (
      <svg className={className} viewBox="0 0 200 160" fill="none">
        <rect width="200" height="160" fill="#010f1f" />
        <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
        {/* Plank Push Up Body */}
        <circle cx="160" cy="85" r="10" fill="#00f5ff" />
        <path d="M 155 92 L 60 115 L 30 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" />
        <path d="M 130 98 L 130 138" stroke="#00f5ff" strokeWidth="5" strokeLinecap="round" />
        <text x="15" y="40" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">PUSH-UP ALIGNMENT</text>
        <text x="15" y="55" fill="#b9caca" fontSize="8" fontFamily="sans-serif">Straight Rigid Spine</text>
      </svg>
    );
  }

  if (name.includes('lunge')) {
    return (
      <svg className={className} viewBox="0 0 200 160" fill="none">
        <rect width="200" height="160" fill="#010f1f" />
        <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
        {/* Lunge posture */}
        <circle cx="100" cy="40" r="11" fill="#00f5ff" />
        <path d="M 100 51 L 100 90" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" />
        <path d="M 100 90 L 140 90 L 140 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 100 90 L 60 115 L 60 138" stroke="#00f5ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="15" y="40" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">LUNGE POSTURE</text>
        <text x="15" y="55" fill="#b9caca" fontSize="8" fontFamily="sans-serif">Dual 90° Knee Angles</text>
      </svg>
    );
  }

  if (name.includes('plank')) {
    return (
      <svg className={className} viewBox="0 0 200 160" fill="none">
        <rect width="200" height="160" fill="#010f1f" />
        <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
        {/* Forearm Plank */}
        <circle cx="160" cy="100" r="10" fill="#00f5ff" />
        <path d="M 155 105 L 50 120 L 30 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" />
        <path d="M 140 110 L 140 138 L 160 138" stroke="#00f5ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="15" y="40" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">PLANK STABILITY</text>
        <text x="15" y="55" fill="#b9caca" fontSize="8" fontFamily="sans-serif">Braced Core & Glutes</text>
      </svg>
    );
  }

  if (name.includes('bridge')) {
    return (
      <svg className={className} viewBox="0 0 200 160" fill="none">
        <rect width="200" height="160" fill="#010f1f" />
        <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
        {/* Glute Bridge */}
        <circle cx="40" cy="130" r="10" fill="#00f5ff" />
        <path d="M 45 130 Q 100 80, 140 100 L 155 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" />
        <text x="15" y="40" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">GLUTE BRIDGE</text>
        <text x="15" y="55" fill="#b9caca" fontSize="8" fontFamily="sans-serif">Full Hip Extension</text>
      </svg>
    );
  }

  // Default Athletic Movement Illustration
  return (
    <svg className={className} viewBox="0 0 200 160" fill="none">
      <rect width="200" height="160" fill="#010f1f" />
      <path d="M 0 140 L 200 140" stroke="#3a494a" strokeWidth="2" />
      <circle cx="100" cy="45" r="11" fill="#00f5ff" />
      <path d="M 100 56 L 80 95 L 45 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 80 95 L 125 110 L 140 138" stroke="#e9feff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 100 65 L 145 50" stroke="#00f5ff" strokeWidth="5" strokeLinecap="round" />
      <text x="15" y="30" fill="#00f5ff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
        {exerciseName.toUpperCase()}
      </text>
    </svg>
  );
};
