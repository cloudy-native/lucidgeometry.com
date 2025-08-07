import * as THREE from "three";
import { Segment } from "@/components/Canvas";

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const lcm = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
};

export const generatePathPoints = (segments: Segment[]): THREE.Vector3[] => {
  if (segments.length === 0) return [];

  const denominators = segments.map((s) => {
    if (s.speed.num === 0) return 1;
    const commonDivisor = gcd(Math.abs(s.speed.num), s.speed.den);
    return s.speed.den / commonDivisor;
  });
  const lcmOfDenominators = denominators.reduce((acc, d) => lcm(acc, d), 1);
  const totalTime = 2 * Math.PI * lcmOfDenominators;
  const timeStep = totalTime / 10000;

  const points: THREE.Vector3[] = [];
  const rotation = new THREE.Quaternion();
  const axisVector = new THREE.Vector3();

  for (let t = 0; t <= totalTime; t += timeStep) {
    const finalPoint = new THREE.Vector3(0, 0, 0);

    for (const segment of segments) {
      const speed = segment.speed.num / segment.speed.den;
      const angle = t * speed;

      if (segment.axis === "x") {
        axisVector.set(1, 0, 0);
      } else if (segment.axis === "y") {
        axisVector.set(0, 1, 0);
      } else {
        // 'z'
        axisVector.set(0, 0, 1);
      }

      // Each segment is a vector of a certain length, rotating around an axis.
      // We define the base vector perpendicular to the axis of rotation.
      const armVector = new THREE.Vector3();
      if (segment.axis === "x") {
        armVector.set(0, segment.length, 0); // Use Y-axis for arm
      } else if (segment.axis === "y") {
        armVector.set(0, 0, segment.length); // Use Z-axis for arm
      } else { // 'z'
        armVector.set(segment.length, 0, 0); // Use X-axis for arm
      }

      rotation.setFromAxisAngle(axisVector, angle);
      armVector.applyQuaternion(rotation);

      // Add this segment's vector to the final point.
      finalPoint.add(armVector);
    }
    points.push(finalPoint);
  }

  return points;
};
