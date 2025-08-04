import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Segment = {
  length: number;
  axis: "x" | "y" | "z";
  speed: {
    num: number;
    den: number;
  };
};

// Hardcoded segments from x.html for stable debugging
const segments: Segment[] = [
  { length: 1, axis: "x", speed: { num: 1, den: 10 } },
  { length: 2, axis: "y", speed: { num: 1, den: 7 } },
  { length: .5, axis: "z", speed: { num: 2, den: 5 } },
  { length: 1, axis: "x", speed: { num: 3, den: 4 } },
];

// --- Repetition Calculation --- //

// Greatest Common Divisor
const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
};

// Least Common Multiple
const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
};

const calculateTimeStep = (segments: Segment[], targetIterations: number): number => {
    if (segments.length === 0) return 0.05;

    // 1. Simplify each speed fraction and get the denominators
    const denominators = segments.map(s => {
        if (s.speed.num === 0) return 1; // Stationary segments don't affect repetition
        const commonDivisor = gcd(Math.abs(s.speed.num), s.speed.den);
        return s.speed.den / commonDivisor;
    });

    // 2. The repetition period is determined by the LCM of the denominators.
    const lcmOfDenominators = denominators.reduce((acc, d) => lcm(acc, d), 1);

    // 3. The total time T for a full cycle is 2 * PI * LCM.
    const totalTime = 2 * Math.PI * lcmOfDenominators;

    // 4. Derive the timeStep from the target number of iterations.
    const timeStep = totalTime / targetIterations;

    console.log(`Targeting ${targetIterations.toLocaleString()} iterations. Derived timeStep: ${timeStep}`);
    return timeStep;
};


const Canvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Basic Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    camera.position.set(10, 10, 20);
    camera.lookAt(0, 0, 0);

    // --- Path Calculation ---
    const TARGET_ITERATIONS = 100000;
    const timeStep = calculateTimeStep(segments, TARGET_ITERATIONS);
    const pathPoints: THREE.Vector3[] = [];

    for (let i = 0; i <= TARGET_ITERATIONS; i++) {
      const time = i * timeStep;
      let matrix = new THREE.Matrix4();

      segments.forEach(segment => {
        const angle = (segment.speed.num / segment.speed.den) * time;
        const rotationMatrix = new THREE.Matrix4();

        if (segment.axis === 'x') {
          rotationMatrix.makeRotationX(angle);
        } else if (segment.axis === 'y') {
          rotationMatrix.makeRotationY(angle);
        } else { // 'z'
          rotationMatrix.makeRotationZ(angle);
        }
        matrix.multiply(rotationMatrix);

        // The translation must be perpendicular to the axis of rotation.
        const translationMatrix = new THREE.Matrix4();
        if (segment.axis === 'x') {
          translationMatrix.makeTranslation(0, segment.length, 0);
        } else {
          // This works for both 'y' and 'z' rotations.
          translationMatrix.makeTranslation(segment.length, 0, 0);
        }
        matrix.multiply(translationMatrix);
      });
      pathPoints.push(new THREE.Vector3().setFromMatrixPosition(matrix));
    }

    // --- Drawing ---
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    scene.add(pathLine);

    // --- Animation & Cleanup ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          if ((object as any).material) {
            (object as any).material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Canvas;
