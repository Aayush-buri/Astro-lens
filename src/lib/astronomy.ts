import type {
  CurrentObservationState,
  TelescopeCoordinates,
  TelescopeGuidance,
  Visibility,
} from '@/types';
import { tonightVisibility, celestialObjects } from '@/data/mockData';

const STORAGE_KEY = 'astrolens_current_observation';

/**
 * Standard default coordinates for all mock celestial objects.
 */
export const defaultCoordinates: Record<string, TelescopeCoordinates> = {
  jupiter: { azimuth: 120, altitude: 40 },
  saturn: { azimuth: 138, altitude: 44 },
  moon: { azimuth: 95, altitude: 62 },
  mars: { azimuth: 210, altitude: 35 },
  sirius: { azimuth: 162, altitude: 28 },
  andromeda: { azimuth: 45, altitude: 55 },
};

/**
 * Save the detected observation to session storage.
 */
export function saveCurrentObservation(observation: CurrentObservationState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(observation));
  } catch (e) {
    console.error('Failed to save observation to sessionStorage:', e);
  }
}

/**
 * Retrieve the saved observation from session storage.
 */
export function getSavedCurrentObservation(): CurrentObservationState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentObservationState;
  } catch (e) {
    console.error('Failed to read observation from sessionStorage:', e);
    return null;
  }
}

/**
 * Clear the current observation from session storage.
 */
export function clearCurrentObservation() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear observation from sessionStorage:', e);
  }
}

/**
 * Get coordinates for an object ID or Name.
 */
export function getCoordinates(idOrName: string): TelescopeCoordinates {
  const key = idOrName.toLowerCase().replace(/\s+galaxy$/i, '');
  if (defaultCoordinates[key]) return defaultCoordinates[key];
  // Fallback to tonightVisibility if available
  const match = tonightVisibility.find(
    (v) => v.objectId === key || v.objectName.toLowerCase() === idOrName.toLowerCase()
  );
  if (match) return { azimuth: match.azimuth, altitude: match.altitude };
  return { azimuth: 120, altitude: 40 };
}

/**
 * Get visibility information for any target object.
 */
export function getTargetVisibilityInfo(targetIdOrName: string): Visibility {
  const key = targetIdOrName.toLowerCase().replace(/\s+galaxy$/i, '');
  const found = tonightVisibility.find(
    (v) => v.objectId === key || v.objectName.toLowerCase() === targetIdOrName.toLowerCase()
  );
  if (found) return found;

  // If Mars (or other object in celestialObjects list)
  const obj = celestialObjects.find(
    (o) => o.id === key || o.name.toLowerCase() === targetIdOrName.toLowerCase()
  );

  const coords = getCoordinates(key);
  return {
    objectId: key,
    objectName: obj ? obj.name : targetIdOrName,
    objectType: obj ? obj.type : 'Planet',
    isVisible: true,
    bestViewingStart: '9:30 PM',
    bestViewingEnd: '2:00 AM',
    quality: 'Good',
    azimuth: coords.azimuth,
    altitude: coords.altitude,
  };
}

/**
 * Calculate the telescope movement delta from current object to target object.
 */
export function calculateGuidance(
  currentName: string,
  targetName: string
): TelescopeGuidance {
  const current = getCoordinates(currentName);
  const target = getCoordinates(targetName);

  let deltaAz = target.azimuth - current.azimuth;
  // Normalize azimuth delta to [-180, 180]
  if (deltaAz > 180) deltaAz -= 360;
  if (deltaAz < -180) deltaAz += 360;

  const deltaAlt = target.altitude - current.altitude;

  return {
    currentObject: currentName,
    targetObject: targetName,
    current,
    target,
    deltaAzimuth: Math.abs(deltaAz),
    deltaAltitude: Math.abs(deltaAlt),
    horizontalDirection: deltaAz >= 0 ? 'RIGHT' : 'LEFT',
    verticalDirection: deltaAlt >= 0 ? 'UP' : 'DOWN',
  };
}
