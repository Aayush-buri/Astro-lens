export type VisualKey =
  | 'jupiter'
  | 'saturn'
  | 'moon'
  | 'mars'
  | 'venus'
  | 'sirius'
  | 'andromeda'
  | 'nebula'
  | 'constellation'
  | 'star'
  | 'planet'
  | 'galaxy';

export interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'galaxy' | 'nebula' | 'moon' | 'constellation';
  visualKey?: VisualKey;
  description: string;
  quickFacts: { label: string; value: string }[];
  bestTime: string;
  funFact: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  color: string;
}

export interface Observation {
  id: string;
  objectId: string;
  objectName: string;
  objectType: string;
  visualKey?: VisualKey;
  confidence: number;
  timestamp: string;
  date: string;
  time: string;
}

export interface Visibility {
  objectId: string;
  objectName: string;
  objectType: string;
  visualKey?: VisualKey;
  isVisible: boolean;
  bestViewingStart: string;
  bestViewingEnd: string;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  azimuth: number;
  altitude: number;
}

export interface TelescopeCoordinates {
  azimuth: number;
  altitude: number;
}

export interface TelescopeGuidance {
  currentObject: string;
  targetObject: string;
  current: TelescopeCoordinates;
  target: TelescopeCoordinates;
  deltaAzimuth: number;
  deltaAltitude: number;
  horizontalDirection: 'LEFT' | 'RIGHT';
  verticalDirection: 'UP' | 'DOWN';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CurrentObservationState {
  objectId: string;
  objectName: string;
  visualKey?: VisualKey;
  confidence: number;
  imagePreview?: string | null;
}
