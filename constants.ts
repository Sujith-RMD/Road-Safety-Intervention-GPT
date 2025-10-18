
import { Scenario } from './types';

export const ACCIDENT_TYPES: string[] = [
  'Pedestrian Collision',
  'Vehicle Collision (T-bone)',
  'Vehicle Collision (Rear-end)',
  'Traffic Signal Violation',
  'Lane Departure',
  'Speeding-related',
  'Cycling Accident',
];

export const LOCATION_TYPES: string[] = [
  'School Zone',
  'Highway Interchange',
  'Busy Urban Intersection',
  'City Street (Residential)',
  'Rural Road',
  'Shopping District',
];

export const EXAMPLE_SCENARIOS: Scenario[] = [
  {
    accidentType: 'Pedestrian Collision',
    locationType: 'School Zone',
    description: 'Frequent near-misses involving children crossing the street during morning drop-off hours. Drivers seem distracted and speed is a concern.',
  },
  {
    accidentType: 'Vehicle Collision (T-bone)',
    locationType: 'Busy Urban Intersection',
    description: 'A high number of T-bone collisions at a four-way intersection with stop signs. Sightlines are partially obscured by parked cars.',
  },
  {
    accidentType: 'Speeding-related',
    locationType: 'City Street (Residential)',
    description: 'Residents have complained about cars using their street as a "cut-through" to avoid a major road, often driving well above the speed limit.',
  },
  {
    accidentType: 'Traffic Signal Violation',
    locationType: 'Highway Interchange',
    description: 'Drivers frequently run red lights at the off-ramp intersection, leading to dangerous conflicts with cross-traffic.',
  },
];
