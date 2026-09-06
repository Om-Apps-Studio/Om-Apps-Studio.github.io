import { TCXRunningSession, TCXLapData } from '../types';
import { formatSecondsToMMSS, calculatePace } from '../data/goalConfig';

export function parseTCXFile(xmlText: string, fileName: string = 'imported_run.tcx'): TCXRunningSession {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Check for XML parse errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid TCX XML format: ' + parseError.textContent);
  }

  // Extract Laps
  const lapNodes = Array.from(xmlDoc.querySelectorAll('Lap'));
  const laps: TCXLapData[] = [];

  let totalDistanceMeters = 0;
  let totalTimeSeconds = 0;
  let totalHeartRateSum = 0;
  let totalHeartRateCount = 0;
  let maxHeartRateRecorded = 0;

  lapNodes.forEach((lap, index) => {
    const totalTimeSec = parseFloat(lap.querySelector('TotalTimeSeconds')?.textContent || '0');
    const distMeters = parseFloat(lap.querySelector('DistanceMeters')?.textContent || '0');
    const maxSpeed = parseFloat(lap.querySelector('MaximumSpeed')?.textContent || '0');
    
    // Heart rate extraction
    const avgHrNode = lap.querySelector('AverageHeartRateBpm Value');
    const maxHrNode = lap.querySelector('MaximumHeartRateBpm Value');
    const avgHr = avgHrNode ? parseInt(avgHrNode.textContent || '0', 10) : undefined;
    const maxHr = maxHrNode ? parseInt(maxHrNode.textContent || '0', 10) : undefined;

    if (avgHr) {
      totalHeartRateSum += avgHr;
      totalHeartRateCount++;
    }
    if (maxHr && maxHr > maxHeartRateRecorded) {
      maxHeartRateRecorded = maxHr;
    }

    totalTimeSeconds += totalTimeSec;
    totalDistanceMeters += distMeters;

    const lapDistKm = distMeters / 1000;
    const lapPace = calculatePace(lapDistKm, totalTimeSec).paceFormatted;

    laps.push({
      lapIndex: index + 1,
      totalTimeSeconds: Math.round(totalTimeSec),
      distanceMeters: Math.round(distMeters),
      maxSpeedMps: Number(maxSpeed.toFixed(1)),
      avgPaceFormatted: lapPace,
      avgHeartRate: avgHr,
      maxHeartRate: maxHr
    });
  });

  // If no Laps were found, try fallback extraction
  if (laps.length === 0) {
    const distMetersNode = xmlDoc.querySelector('DistanceMeters');
    const timeNode = xmlDoc.querySelector('TotalTimeSeconds');
    totalDistanceMeters = distMetersNode ? parseFloat(distMetersNode.textContent || '0') : 1600;
    totalTimeSeconds = timeNode ? parseFloat(timeNode.textContent || '0') : 480;
  }

  const totalDistanceKm = Number((totalDistanceMeters / 1000).toFixed(2));
  const { paceFormatted, speedKmh } = calculatePace(totalDistanceKm, totalTimeSeconds);
  const avgHeartRate = totalHeartRateCount > 0 ? Math.round(totalHeartRateSum / totalHeartRateCount) : undefined;

  // Extract timestamp
  const startTimeNode = xmlDoc.querySelector('Id') || xmlDoc.querySelector('Lap');
  const startTimeAttr = startTimeNode?.getAttribute('StartTime') || startTimeNode?.textContent || new Date().toISOString();

  return {
    id: 'tcx-' + Date.now(),
    fileName,
    importedAt: new Date().toISOString(),
    startTime: startTimeAttr,
    totalTimeSeconds: Math.round(totalTimeSeconds),
    totalDistanceMeters: Math.round(totalDistanceMeters),
    totalDistanceKm,
    averagePaceFormatted: paceFormatted,
    averageSpeedKmh: speedKmh,
    averageHeartRate: avgHeartRate,
    maxHeartRate: maxHeartRateRecorded > 0 ? maxHeartRateRecorded : undefined,
    laps
  };
}
