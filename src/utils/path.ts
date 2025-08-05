import * as THREE from 'three';
import { Segment } from '@/components/Canvas';

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

export const generatePathPoints = (segments: Segment[]): THREE.Vector3[] => {
  if (segments.length === 0) return [];

  const denominators = segments.map(s => {
    if (s.speed.num === 0) return 1;
    const commonDivisor = gcd(Math.abs(s.speed.num), s.speed.den);
    return s.speed.den / commonDivisor;
  });
  const lcmOfDenominators = denominators.reduce((acc, d) => lcm(acc, d), 1);
  const totalTime = 2 * Math.PI * lcmOfDenominators;
  const timeStep = totalTime / 10000; // 10000 iterations for a detailed path

  const points: THREE.Vector3[] = [];
  let currentMatrix = new THREE.Matrix4();
  const rotation = new THREE.Matrix4();
  const translation = new THREE.Matrix4();

  for (let t = 0; t <= totalTime; t += timeStep) {
    currentMatrix.identity();
    for (const segment of segments) {
      const speed = segment.speed.num / segment.speed.den;
      const angle = t * speed;

      if (segment.axis === 'x') {
        rotation.makeRotationX(angle);
      } else if (segment.axis === 'y') {
        rotation.makeRotationY(angle);
      } else {
        rotation.makeRotationZ(angle);
      }
      currentMatrix.multiply(rotation);

      translation.makeTranslation(segment.length, 0, 0);
      currentMatrix.multiply(translation);
    }
    points.push(new THREE.Vector3().setFromMatrixPosition(currentMatrix));
  }

  return points;
};
