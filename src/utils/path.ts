import * as THREE from "three";
import type { Segment } from "@/components/Canvas";

const warnedComplexity = new Set<string>();

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

export const generatePathPoints = (
  segments: Segment[],
  pathResolution: number
): THREE.Vector3[] => {
  if (segments.length === 0) return [];

  // Hard caps to keep computation tractable
  const MAX_LCM = 512; // max effective cycles to trace
  const MAX_POINTS = 5_000; // global cap on point count

  const denominators = segments.map((s) => {
    if (s.speed.num === 0) return 1;
    const commonDivisor = gcd(Math.abs(s.speed.num), s.speed.den);
    return s.speed.den / commonDivisor;
  });
  // Compute LCM but clamp growth to avoid explosive periods
  const lcmOfDenominators = denominators.reduce((acc, d) => lcm(acc, d), 1);
  const effectiveLCM = Math.min(lcmOfDenominators, MAX_LCM);
  const totalTime = 2 * Math.PI * effectiveLCM;
  // Cap total points as well
  const desiredPoints = Math.max(2, Math.floor(totalTime * pathResolution));
  const numPoints = Math.min(desiredPoints, MAX_POINTS);
  const timeStep = totalTime / numPoints;

  if (effectiveLCM !== lcmOfDenominators || numPoints !== desiredPoints) {
    const key = `${effectiveLCM}-${numPoints}`;
    if (!warnedComplexity.has(key)) {
      warnedComplexity.add(key);
      // eslint-disable-next-line no-console
      console.warn(
        "generatePathPoints: capped complexity",
        {
          lcmOfDenominators,
          effectiveLCM,
          desiredPoints,
          numPoints,
        }
      );
    }
  }

  // Precompute per-segment data to avoid redundant calculations
  const segmentData = segments.map((segment) => {
    const speed = segment.speed.num / segment.speed.den;
    
    // Precompute axis vector
    const axis = segment.axis === "x" 
      ? new THREE.Vector3(1, 0, 0)
      : segment.axis === "y"
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(0, 0, 1);
    
    // Precompute base arm vector (perpendicular to rotation axis)
    const baseArm = segment.axis === "x"
      ? new THREE.Vector3(0, segment.length, 0)
      : segment.axis === "y"
      ? new THREE.Vector3(0, 0, segment.length)
      : new THREE.Vector3(segment.length, 0, 0);
    
    return { speed, axis, baseArm };
  });

  const points: THREE.Vector3[] = [];
  
  // Reuse objects to avoid allocations in the hot loop
  const rotation = new THREE.Quaternion();
  const armVector = new THREE.Vector3();

  for (let t = 0; t < totalTime; t += timeStep) {
    const finalPoint = new THREE.Vector3(0, 0, 0);

    for (const data of segmentData) {
      const angle = t * data.speed;
      
      // Copy base arm and rotate it
      armVector.copy(data.baseArm);
      rotation.setFromAxisAngle(data.axis, angle);
      armVector.applyQuaternion(rotation);

      finalPoint.add(armVector);
    }
    points.push(finalPoint);
  }

  // Explicitly close the loop by duplicating the first point
  if (points.length > 0) {
    points.push(points[0].clone());
  }

  return points;
};
