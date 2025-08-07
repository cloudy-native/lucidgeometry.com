import { generatePathPoints } from "@/utils/path";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface ExtendedMaterialProps extends THREE.MeshPhysicalMaterialParameters {
  transmission?: number;
}

export interface MaterialProperties {
  key: string;
  name: string;
  props: ExtendedMaterialProps;
}

export interface MaterialSection {
  title: string;
  materials: MaterialProperties[];
}

export const materialSections: MaterialSection[] = [
  {
    title: "Standard",
    materials: [
      {
        key: "flat",
        name: "Flat",
        props: {
          color: new THREE.Color(0xcccccc),
          metalness: 0.0,
          roughness: 0.8,
        },
      },
      {
        key: "matte_black",
        name: "Matte Black",
        props: {
          color: new THREE.Color(0x111111),
          metalness: 0.0,
          roughness: 0.9,
        },
      },
      {
        key: "ferrari",
        name: "Ferrari",
        props: {
          color: new THREE.Color(0xe70000),
          metalness: 0.8,
          roughness: 0.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        },
      },
    ],
  },
  {
    title: "Metals",
    materials: [
      {
        key: "gold",
        name: "Gold",
        props: {
          color: new THREE.Color(0xffd700),
          metalness: 1.0,
          roughness: 0.01,
        },
      },
      {
        key: "silver",
        name: "Silver",
        props: {
          color: new THREE.Color(0xc0c0c0),
          metalness: 1.0,
          roughness: 0.05,
        },
      },
      {
        key: "mirror",
        name: "Mirror",
        props: {
          color: new THREE.Color(0xffffff),
          metalness: 1.0,
          roughness: 0.0,
        },
      },
      {
        key: "copper",
        name: "Copper",
        props: {
          color: new THREE.Color(0xb87333),
          metalness: 1.0,
          roughness: 0.1,
        },
      },
      {
        key: "brass",
        name: "Brass",
        props: {
          color: new THREE.Color(0xb5a642),
          metalness: 1.0,
          roughness: 0.2,
        },
      },
      {
        key: "bronze",
        name: "Bronze",
        props: {
          color: new THREE.Color(0xcd7f32),
          metalness: 1.0,
          roughness: 0.2,
        },
      },
      {
        key: "titanium",
        name: "Titanium",
        props: {
          color: new THREE.Color(0x878681),
          metalness: 1.0,
          roughness: 0.3,
        },
      },
      {
        key: "platinum",
        name: "Platinum",
        props: {
          color: new THREE.Color(0xe5e4e2),
          metalness: 1.0,
          roughness: 0.1,
        },
      },
    ],
  },
  {
    title: "Gemstones & Translucent",
    materials: [
      {
        key: "glass",
        name: "Glass",
        props: {
          metalness: 0.0,
          roughness: 0,
          transmission: 1.0,
          // @ts-ignore
          ior: 1.5,
          thickness: 0.5,
          transparent: true,
        },
      },
      {
        key: "jade",
        name: "Jade",
        props: {
          color: new THREE.Color(0x00a86b),
          metalness: 0.1,
          roughness: 0.2,
          transmission: 0.9,
          thickness: 1.0,
          transparent: true,
        },
      },
      {
        key: "diamond",
        name: "Diamond",
        props: {
          metalness: 0.0,
          roughness: 0.01,
          transmission: 1.0,
          // @ts-ignore
          ior: 2.418,
          thickness: 0.1,
          transparent: true,
        },
      },
      {
        key: "ruby",
        name: "Ruby",
        props: {
          color: new THREE.Color(0x9b111e),
          metalness: 0.0,
          roughness: 0.1,
          transmission: 1.0,
          // @ts-ignore
          ior: 1.77,
          thickness: 1.2,
          transparent: true,
        },
      },
      {
        key: "sapphire",
        name: "Sapphire",
        props: {
          color: new THREE.Color(0x0f52ba),
          metalness: 0.0,
          roughness: 0.1,
          transmission: 1.0,
          // @ts-ignore
          ior: 1.77,
          thickness: 1.2,
          transparent: true,
        },
      },
    ],
  },
  {
    title: "Exotic",
    materials: [
      {
        key: "neon_blue",
        name: "Neon Blue",
        props: {
          color: new THREE.Color(0x0000ff),
          emissive: new THREE.Color(0x0000ff),
          emissiveIntensity: 2.0,
        },
      },
      {
        key: "lava",
        name: "Lava",
        props: {
          color: new THREE.Color(0x1c0000),
          emissive: new THREE.Color(0xff4500),
          emissiveIntensity: 1.5,
          roughness: 0.8,
        },
      },
    ],
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
  thickness: number;
}

const Canvas: React.FC<CanvasProps> = ({
  segments,
  gentleRotation,
  hdri,
  material,
  thickness,
}) => {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/textures/scratches.jpg", (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });
  }, []);

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
      30,
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

    const tubeMaterial = new THREE.MeshPhysicalMaterial({
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
        thickness,
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
  }, [segments, gentleRotation, thickness]);

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
    const allMaterials = materialSections.flatMap(
      (section) => section.materials
    );
    const selectedMaterial = allMaterials.find((m) => m.key === material);

    if (selectedMaterial) {
      const newMaterial = new THREE.MeshPhysicalMaterial(
        selectedMaterial.props
      );

      // if (selectedMaterial.key === 'gold' && scratchTexture) {
      //   newMaterial.bumpMap = scratchTexture;
      //   newMaterial.bumpScale = 0.1; // Adjust for subtle effect
      // }

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
        {isFullscreen ? <Minimize /> : <Maximize />}
      </button>
    </div>
  );
};

export default Canvas;
