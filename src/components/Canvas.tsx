import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { generatePathPoints } from "@/utils/path";

interface ExtendedMaterialProps extends THREE.MeshStandardMaterialParameters {
  transmission?: number;
}

export interface MaterialProperties {
  key: string;
  name: string;
  props: ExtendedMaterialProps;
}

export const availableMaterials: MaterialProperties[] = [
  {
    key: "silver",
    name: "Silver",
    props: {
      color: new THREE.Color(0xffffff),
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.0,
      transparent: false,
    },
  },
  {
    key: "gold",
    name: "Gold",
    props: {
      color: new THREE.Color(0xffd700),
      metalness: 1.0,
      roughness: 0.01,
      transmission: 0.0,
      transparent: false,
    },
  },
  {
    key: "copper",
    name: "Copper",
    props: {
      color: new THREE.Color(0xb87333),
      metalness: 1.0,
      roughness: 0.4,
      transmission: 0.0,
      transparent: false,
    },
  },
  {
    key: "glass",
    name: "Glass",
    props: {
      color: new THREE.Color(0xffffff),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 1.0,
      transparent: true,
      opacity: 0.5,
    },
  },
  {
    key: "flat",
    name: "Flat",
    props: {
      color: new THREE.Color(0xcccccc),
      metalness: 0.0,
      roughness: 0.8,
      transmission: 0.0,
      transparent: false,
    },
  },
  {
    key: "neon",
    name: "Neon",
    props: {
      color: new THREE.Color(0x00ff00),
      metalness: 0.0,
      roughness: 0.0,
      transmission: 1.0,
      transparent: true,
    },
  },
];

export interface Segment {
  id: string;
  length: number;
  speed: { num: number; den: number };
  axis: "x" | "y" | "z";
}

interface CanvasProps {
  segments: Segment[];
  gentleRotation: boolean;
  hdri: string;
  material: string;
}

const Canvas: React.FC<CanvasProps> = ({
  segments,
  gentleRotation,
  hdri,
  material,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const pathTubeRef = useRef<THREE.Mesh | null>(null);

  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleResize = useCallback(() => {
    if (rendererRef.current && cameraRef.current && mountRef.current) {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      const mount = mountRef.current;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (
        renderer.domElement.width !== width ||
        renderer.domElement.height !== height
      ) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    }
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // default is 512
    directionalLight.shadow.mapSize.height = 2048; // default is 512
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    const tubeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.2,
      visible: false,
    });
    const pathTube = new THREE.Mesh(new THREE.TubeGeometry(), tubeMaterial);
    pathTube.castShadow = true;
    pathTube.receiveShadow = true;
    scene.add(pathTube);
    pathTubeRef.current = pathTube;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      pathTube.geometry.dispose();
      tubeMaterial.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, [handleResize]);

  useEffect(() => {
    if (!pathTubeRef.current || !controlsRef.current) return;

    controlsRef.current.autoRotate = gentleRotation;
    controlsRef.current.autoRotateSpeed = gentleRotation ? 0.5 : 0;

    const points = generatePathPoints(segments);

    if (points.length > 0) {
      const oldTubeGeometry = pathTubeRef.current.geometry;
      const tubeCurve = new THREE.CatmullRomCurve3(points);
      pathTubeRef.current.geometry = new THREE.TubeGeometry(
        tubeCurve,
        points.length * 2,
        0.1,
        8,
        false
      );
      oldTubeGeometry.dispose();

      const boundingBox = new THREE.Box3().setFromPoints(points);
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);
      if (!controlsRef.current.target.equals(center)) {
        controlsRef.current.target.lerp(center, 0.1);
      }

      if (directionalLightRef.current) {
        const light = directionalLightRef.current;
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) * 1.2;
        light.shadow.camera.left = -maxDim;
        light.shadow.camera.right = maxDim;
        light.shadow.camera.top = maxDim;
        light.shadow.camera.bottom = -maxDim;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = Math.max(maxDim * 4, 1000);

        light.shadow.camera.updateProjectionMatrix();
      }
    }
  }, [segments, gentleRotation]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    new RGBELoader().setPath("/").load(hdri, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });
  }, [hdri]);

  useEffect(() => {
    if (!pathTubeRef.current) return;

    const tubeMesh = pathTubeRef.current as THREE.Mesh;
    const selectedMaterial = availableMaterials.find((m) => m.key === material);

    if (selectedMaterial) {
      const newMaterial = new THREE.MeshStandardMaterial(
        selectedMaterial.props
      );
      tubeMesh.material = newMaterial;
    }
  }, [material]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      // If we are exiting fullscreen, force a resize after a short delay
      // to allow the browser's layout to settle.
      if (!isNowFullscreen) {
        setTimeout(() => {
          handleResize();
        }, 150);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleResize]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded"
      >
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </div>
  );
};

export default Canvas;
