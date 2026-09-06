import React, { useState } from 'react';
import { parseTCXFile } from '../services/tcxParser';
import { TCXRunningSession } from '../types';

interface FieldTrainingViewProps {
  onSaveRunSession: (session: TCXRunningSession) => void;
  onConvertToHomeToggle: () => void;
}

export const FieldTrainingView: React.FC<FieldTrainingViewProps> = ({
  onSaveRunSession,
  onConvertToHomeToggle
}) => {
  const [activeTab, setActiveTab] = useState<'tcx' | 'manual'>('tcx');
  const [tcxError, setTcxError] = useState<string | null>(null);
  const [parsedSession, setParsedSession] = useState<TCXRunningSession | null>(null);

  // Manual run input state
  const [distanceKm, setDistanceKm] = useState<number>(1.6);
  const [durationMin, setDurationMin] = useState<number>(8.5);
  const [avgHeartRate, setAvgHeartRate] = useState<number>(165);
  const [notes, setNotes] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTcxError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const session = parseTCXFile(text, file.name);
        setParsedSession(session);
      } catch (err: any) {
        setTcxError(err.message || 'Failed to parse TCX file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveParsed = () => {
    if (parsedSession) {
      onSaveRunSession(parsedSession);
      alert('TCX Running Session successfully saved to training log!');
      setParsedSession(null);
    }
  };

  const handleSaveManual = () => {
    const totalSec = Math.round(durationMin * 60);
    const paceSec = totalSec / distanceKm;
    const mins = Math.floor(paceSec / 60);
    const secs = Math.floor(paceSec % 60);
    const paceStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const session: TCXRunningSession = {
      id: 'manual-run-' + Date.now(),
      fileName: 'manual_log.tcx',
      importedAt: new Date().toISOString(),
      startTime: new Date().toISOString(),
      totalTimeSeconds: totalSec,
      totalDistanceMeters: Math.round(distanceKm * 1000),
      totalDistanceKm: distanceKm,
      averagePaceFormatted: paceStr,
      averageSpeedKmh: Number(((distanceKm / (durationMin / 60))).toFixed(1)),
      averageHeartRate: avgHeartRate,
      laps: [
        {
          lapIndex: 1,
          totalTimeSeconds: totalSec,
          distanceMeters: Math.round(distanceKm * 1000),
          maxSpeedMps: 3.5,
          avgPaceFormatted: paceStr,
          avgHeartRate: avgHeartRate
        }
      ]
    };

    onSaveRunSession(session);
    alert('Outdoor running session saved!');
  };

  return (
    <main className="max-w-4xl mx-auto px-gutter py-md flex flex-col gap-lg pb-24 md:pb-8 w-full text-on-surface">
      {/* Header */}
      <section className="flex justify-between items-center border-b border-outline-variant/30 pb-xs">
        <div>
          <span className="font-label-caps text-xs text-primary-container uppercase">
            FIELD MODE • OUTDOOR RUNNING TELEMETRY
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary">Field Training & TCX Import</h1>
        </div>

        <button
          onClick={onConvertToHomeToggle}
          className="px-md py-xs rounded-lg border border-primary-container text-primary-container font-label-caps text-xs hover:bg-primary-container/10 transition-colors flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">cloud_off</span>
          <span>Convert to HOME Workout</span>
        </button>
      </section>

      {/* Tabs */}
      <div className="flex gap-sm border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('tcx')}
          className={`py-xs px-md font-headline-md text-sm transition-colors border-b-2 ${
            activeTab === 'tcx'
              ? 'border-primary-container text-primary'
              : 'border-transparent text-on-surface-variant'
          }`}
        >
          📥 Import TCX File (Garmin / Strava)
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`py-xs px-md font-headline-md text-sm transition-colors border-b-2 ${
            activeTab === 'manual'
              ? 'border-primary-container text-primary'
              : 'border-transparent text-on-surface-variant'
          }`}
        >
          ✏️ Manual Run Logger
        </button>
      </div>

      {activeTab === 'tcx' ? (
        <div className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-md">
          <div className="border-2 border-dashed border-primary-container/40 rounded-xl p-lg text-center flex flex-col items-center gap-sm bg-surface-container-lowest/50 hover:border-primary-container transition-colors">
            <span className="material-symbols-outlined text-4xl text-primary-container">
              upload_file
            </span>
            <h3 className="font-headline-md text-headline-md text-primary">
              Upload Garmin / Strava .TCX File
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant">
              Parses distance, duration, pace, heart rate, elevation, and lap splits automatically.
            </p>

            <input
              type="file"
              accept=".tcx,.xml"
              onChange={handleFileUpload}
              className="hidden"
              id="tcx-file-input"
            />
            <label
              htmlFor="tcx-file-input"
              className="px-lg py-sm bg-primary-container text-on-primary-container font-headline-md rounded-lg cursor-pointer hover:bg-primary-fixed transition-colors neo-glow mt-xs"
            >
              SELECT TCX FILE
            </label>
          </div>

          {tcxError && (
            <div className="p-sm bg-error-container/20 border border-error text-error text-xs rounded">
              {tcxError}
            </div>
          )}

          {parsedSession && (
            <div className="bg-surface-container p-md rounded-xl border border-primary-container space-y-md">
              <h4 className="font-headline-md text-headline-md text-primary">
                Imported Run: {parsedSession.fileName}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm text-center">
                <div className="bg-surface-container-lowest p-sm rounded border border-outline-variant/30">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase">
                    DISTANCE
                  </span>
                  <span className="font-data-tabular text-xl font-bold text-primary">
                    {parsedSession.totalDistanceKm} km
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-sm rounded border border-outline-variant/30">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase">
                    AVG PACE
                  </span>
                  <span className="font-data-tabular text-xl font-bold text-primary">
                    {parsedSession.averagePaceFormatted} /km
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-sm rounded border border-outline-variant/30">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase">
                    AVG SPEED
                  </span>
                  <span className="font-data-tabular text-xl font-bold text-primary">
                    {parsedSession.averageSpeedKmh} km/h
                  </span>
                </div>

                <div className="bg-surface-container-lowest p-sm rounded border border-outline-variant/30">
                  <span className="font-label-caps text-[10px] text-on-surface-variant block uppercase">
                    HEART RATE
                  </span>
                  <span className="font-data-tabular text-xl font-bold text-primary">
                    {parsedSession.averageHeartRate || 'N/A'} bpm
                  </span>
                </div>
              </div>

              {/* Lap Splits */}
              {parsedSession.laps && parsedSession.laps.length > 0 && (
                <div>
                  <h5 className="font-label-caps text-xs text-on-surface-variant uppercase mb-xs">
                    Lap Split Breakdown ({parsedSession.laps.length} Laps)
                  </h5>
                  <div className="space-y-xs">
                    {parsedSession.laps.map((lap) => (
                      <div
                        key={lap.lapIndex}
                        className="flex justify-between items-center p-xs bg-surface-container-lowest rounded text-xs font-data-tabular"
                      >
                        <span className="text-on-surface">Lap {lap.lapIndex}</span>
                        <span className="text-on-surface-variant">{lap.distanceMeters}m</span>
                        <span className="text-primary font-bold">{lap.avgPaceFormatted}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveParsed}
                className="w-full bg-primary-container text-on-primary-container font-headline-md py-sm rounded-lg neo-glow"
              >
                SAVE IMPORTED RUN TO TRAINING ENGINE
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-md md:p-lg flex flex-col gap-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase">
                Distance (KM)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input-stride"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase">
                Duration (Minutes)
              </label>
              <input
                type="number"
                step="0.1"
                className="form-input-stride"
                value={durationMin}
                onChange={(e) => setDurationMin(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-label-caps text-xs text-on-surface-variant uppercase">
                Avg Heart Rate (BPM)
              </label>
              <input
                type="number"
                className="form-input-stride"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          <button
            onClick={handleSaveManual}
            className="w-full bg-primary-container text-on-primary-container font-headline-md py-sm rounded-lg neo-glow mt-md"
          >
            LOG MANUAL OUTDOOR RUN
          </button>
        </div>
      )}
    </main>
  );
};
