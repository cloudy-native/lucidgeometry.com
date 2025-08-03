import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Hardcoded segments from x.html for stable debugging
const segments = [
    { length: 1, axis: 'x', speed: 0.1 },
    { length: 10, axis: 'y', speed: 1.21 },
    { length: 7, axis: 'z', speed: 1.17 },
    { length: 2, axis: 'x', speed: -0.21 },
];

const Canvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // Scene setup from x.html
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Trail setup
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const trailGeometry = new THREE.BufferGeometry();
    const maxTrailPoints = 100000;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    let trailPointCount = 0;
    scene.add(trail);

    // Segment lines setup
    const segmentMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const segmentLines: THREE.Line[] = [];
    segments.forEach(() => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(2 * 3), 3));
        const line = new THREE.Line(geometry, segmentMaterial);
        segmentLines.push(line);
        scene.add(line);
    });

    // Endpoint sphere
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const endpointSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(endpointSphere);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    camera.position.set(10, 10, 20);
    camera.lookAt(0, 0, 0);

    // Resize handler
    const handleResize = () => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop - corrected logic from x.html
    let time = 0;
    let animationFrameId: number;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        time += 0.05;
        controls.update();

        let currentStartPoint = new THREE.Vector3(0, 0, 0);
        let matrix = new THREE.Matrix4();

        segments.forEach((segment, index) => {
            const angle = segment.speed * time;
            const rotationMatrix = new THREE.Matrix4();
            if (segment.axis === 'x') {
                rotationMatrix.makeRotationX(angle);
            } else if (segment.axis === 'y') {
                rotationMatrix.makeRotationY(angle);
            } else if (segment.axis === 'z') {
                rotationMatrix.makeRotationZ(angle);
            }

            matrix.multiply(rotationMatrix);

            const translation = new THREE.Matrix4().makeTranslation(0, 0, segment.length);
            matrix.multiply(translation);

            const currentEndPoint = new THREE.Vector3(0, 0, 0).applyMatrix4(matrix);

            const positions = (segmentLines[index].geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
            currentStartPoint.toArray(positions, 0);
            currentEndPoint.toArray(positions, 3);
            segmentLines[index].geometry.attributes.position.needsUpdate = true;

            currentStartPoint.copy(currentEndPoint);
        });

        endpointSphere.position.copy(currentStartPoint);

        // Update trail
        const trailPositionAttribute = trail.geometry.attributes.position;
        const trailIndex = trailPointCount % maxTrailPoints;
        trailPositionAttribute.setXYZ(trailIndex, currentStartPoint.x, currentStartPoint.y, currentStartPoint.z);
        trailPointCount++;

        if (trailPointCount < maxTrailPoints) {
            trail.geometry.setDrawRange(0, trailPointCount);
        }
        trailPositionAttribute.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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

  return (
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
  );
};

export default Canvas;
