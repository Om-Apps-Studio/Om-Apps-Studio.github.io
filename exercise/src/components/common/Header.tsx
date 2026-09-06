import React from 'react';
import { UserProfile } from '../../types';

interface HeaderProps {
  profile: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenNotifications
}) => {
  return (
    <header class="fixed top-0 w-full z-50 border-b border-outline-variant bg-surface/90 backdrop-blur-md shadow-sm flex justify-between items-center px-gutter h-16 w-full">
      <div class="flex items-center gap-sm cursor-pointer" onClick={() => setActiveTab('home')}>
        <img
          className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          alt={profile?.name || 'User Profile'}
          src={profile?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDexm1sT4WUT_yxc95zuRpByeFFnGbRDFTK1FRd9kg76jJmOA4JUTOgU_m3guBWxmSIQvP-Ep6UEM0d0lq3um_cgO4i6UlcjBAKS6pTATZYQ6fGPPepvOYdOyCy-cgdV5RFocp_wdP2Hk38DzPhBnvISIuVwgOxJa_WoJNX4XAwq0rBGfM5lDwizopMk9ifA0REY2EqoB95FEeeV4--39ZV8tIFqjcbth8nyCCJzLZGUqn-Ae1-CfS'}
        />
        <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
          RunFit Coach
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex gap-lg">
        {[
          { id: 'home', label: 'Home' },
          { id: 'plan', label: 'Plan' },
          { id: 'train', label: 'Train' },
          { id: 'exercises', label: 'Library' },
          { id: 'progress', label: 'Progress' },
          { id: 'profile', label: 'Profile' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center font-label-caps text-label-caps transition-colors relative py-1 ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-2 w-full h-1 bg-primary-container rounded-t-full neo-glow" />
            )}
          </button>
        ))}
      </nav>

      {/* Notification Icon */}
      <button
        onClick={onOpenNotifications}
        className="text-primary hover:opacity-80 transition-opacity active:scale-95 p-2 rounded-full flex items-center justify-center"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          notifications
        </span>
      </button>
    </header>
  );
};
