import React, { useState } from 'react';
import { UserProfile } from '../types';
import { exportAllDataAsJSON, exportLogsAsCSV, importDataFromJSON } from '../services/exportService';

interface ProfileProps {
  profile: UserProfile | null;
  onOpenMonthlyInput: () => void;
  onStart16kTest: () => void;
  onRefreshData: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  onOpenMonthlyInput,
  onStart16kTest,
  onRefreshData
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = async () => {
    const jsonStr = await exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RunFit_Coach_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCSV = async () => {
    const csvStr = await exportLogsAsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RunFit_Coach_Training_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const success = await importDataFromJSON(text);
      if (success) {
        setImportStatus('Data successfully restored!');
        onRefreshData();
      } else {
        setImportStatus('Error restoring data. Check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="max-w-4xl mx-auto px-gutter py-md flex flex-col gap-lg pb-24 md:pb-8 w-full text-on-surface">
      {/* Header */}
      <section className="flex flex-col gap-xs border-b border-outline-variant/30 pb-sm">
        <h1 className="font-headline-lg text-headline-lg text-primary">Athlete Profile & Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage target configuration, offline backup, and data exports.
        </p>
      </section>

      {/* Profile Card */}
      <div className="glass-card rounded-xl p-md md:p-lg flex items-center gap-md">
        <img
          src={
            profile?.avatarUrl ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCDexm1sT4WUT_yxc95zuRpByeFFnGbRDFTK1FRd9kg76jJmOA4JUTOgU_m3guBWxmSIQvP-Ep6UEM0d0lq3um_cgO4i6UlcjBAKS6pTATZYQ6fGPPepvOYdOyCy-cgdV5RFocp_wdP2Hk38DzPhBnvISIuVwgOxJa_WoJNX4XAwq0rBGfM5lDwizopMk9ifA0REY2EqoB95FEeeV4--39ZV8tIFqjcbth8nyCCJzLZGUqn-Ae1-CfS'
          }
          alt="Athlete Avatar"
          className="w-16 h-16 rounded-full object-cover border-2 border-primary-container"
        />
        <div className="flex-1">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {profile?.name || 'Om'}
          </h2>
          <p className="font-data-tabular text-xs text-primary-container">
            Primary Target: 1.6 KM in 8:00 (5:00/km Pace)
          </p>
        </div>
        <button
          onClick={onOpenMonthlyInput}
          className="px-md py-xs rounded-lg border border-primary-container text-primary-container font-label-caps text-xs hover:bg-primary-container/10 transition-colors"
        >
          Edit Baseline
        </button>
      </div>

      {/* Month-End Test Launcher */}
      <div className="glass-panel rounded-xl p-md flex justify-between items-center border-l-4 border-l-primary-container">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            PERIODIC ASSESSMENT
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            🏁 Month-End 1.6 KM Time Trial
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Run 1.6 km (400m × 4 laps) at full target pacing to calibrate the next 30-day training cycle.
          </p>
        </div>
        <button
          onClick={onStart16kTest}
          className="px-lg py-sm bg-primary-container text-on-primary-container font-headline-md rounded-lg neo-glow flex-shrink-0"
        >
          START TEST
        </button>
      </div>

      {/* Data Export & Import */}
      <section className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-md">
        <h3 className="font-headline-md text-headline-md text-primary">
          💾 Offline Data Storage & Backups
        </h3>
        <p className="font-body-md text-xs text-on-surface-variant">
          Your training data is stored locally on this device via IndexedDB. Export JSON backups to transfer or restore data across devices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          <button
            onClick={handleExportJSON}
            className="py-sm px-md bg-surface-container text-primary border border-primary-container/40 rounded-lg font-label-caps text-xs hover:bg-surface-variant transition-colors flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>EXPORT ALL DATA (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-sm px-md bg-surface-container text-primary border border-primary-container/40 rounded-lg font-label-caps text-xs hover:bg-surface-variant transition-colors flex items-center justify-center gap-xs"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            <span>EXPORT LOGS (CSV)</span>
          </button>
        </div>

        <div className="pt-sm border-t border-outline-variant/30 flex flex-col gap-xs">
          <label className="font-label-caps text-xs text-on-surface-variant uppercase">
            RESTORE FROM JSON BACKUP
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="form-input-stride font-body-md text-xs"
          />
          {importStatus && (
            <span className="font-label-caps text-xs text-primary-container mt-xs">
              {importStatus}
            </span>
          )}
        </div>
      </section>
    </main>
  );
};
