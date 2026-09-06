import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'plan', label: 'Plan', icon: 'calendar_month' },
    { id: 'train', label: 'Train', icon: 'fitness_center' },
    { id: 'exercises', label: 'Library', icon: 'menu_book' },
    { id: 'progress', label: 'Progress', icon: 'insights' },
    { id: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl border-t border-outline-variant bg-surface-container/95 backdrop-blur-lg shadow-[0_-4px_12px_rgba(0,220,229,0.1)] flex justify-around items-center h-20 px-1 pb-safe md:hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 px-2 py-1 rounded-full ${
              isActive
                ? 'text-primary-container bg-secondary-container'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="font-label-caps text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
