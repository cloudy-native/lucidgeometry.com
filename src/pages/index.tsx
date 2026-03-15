import { addToast } from "@heroui/toast";
import { Dice5, Share2 } from "lucide-react";
import { useState } from "react";
import Canvas, { type Segment } from "@/components/Canvas";
import SegmentEditor, { availableHdris } from "@/components/SegmentEditor";
import DefaultLayout from "@/layouts/default";

const ensureNonZero = (v: number) => (v === 0 ? 1 : v);
const ensureNonZeroSpeed = (s: { num: number; den: number }) => ({
  num: ensureNonZero(s.num),
  den: ensureNonZero(s.den),
});

const defaultRandomizeConfig = {
  countMin: 3,
  countMax: 4,
  lengthMin: 1,
  lengthMax: 10,
  numMin: 1,
  numMax: 5,
  denMin: 1,
  denMax: 5,
  lfoPeriodMin: 300,
  lfoPeriodMax: 500,
};

const generateRandomSegments = (config: typeof defaultRandomizeConfig): Segment[] => {
  const {
    countMin,
    countMax,
    lengthMin,
    lengthMax,
    numMin,
    numMax,
    denMin,
    denMax,
    lfoPeriodMin,
    lfoPeriodMax,
  } = config;

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return value === 0 ? getRandomInt(min, max) : value;
  };

  const shuffle = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const count = Math.floor(Math.random() * (countMax - countMin + 1)) + countMin;
  let assignedAxes: ("x" | "y" | "z")[] = [];
  const allAxes: ("x" | "y" | "z")[] = ["x", "y", "z"];

  if (count <= 0) {
    return [];
  } else if (count === 1) {
    assignedAxes = [allAxes[Math.floor(Math.random() * 3)]];
  } else if (count === 2) {
    assignedAxes = shuffle([...allAxes]).slice(0, 2);
  } else {
    assignedAxes = [...allAxes];
    for (let i = 3; i < count; i++) {
      assignedAxes.push(allAxes[Math.floor(Math.random() * 3)]);
    }
    assignedAxes = shuffle(assignedAxes);
  }

  const usedRatios = new Set<string>();
  
  const generateUniqueRatio = (maxAttempts = 50): { num: number; den: number } => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const num = getRandomInt(numMin, numMax);
      let den = getRandomInt(denMin, denMax);

      // Avoid num === den
      while (num === den) {
        den = getRandomInt(denMin, denMax);
      }

      // Normalize the ratio to check for duplicates
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(Math.abs(num), Math.abs(den));
      const normalizedNum = num / divisor;
      const normalizedDen = den / divisor;
      const ratioKey = `${normalizedNum}/${normalizedDen}`;

      if (!usedRatios.has(ratioKey)) {
        usedRatios.add(ratioKey);
        return { num, den };
      }
    }
    
    // If we can't find a unique ratio after max attempts, just return a random one
    const num = getRandomInt(numMin, numMax);
    let den = getRandomInt(denMin, denMax);
    while (num === den) {
      den = getRandomInt(denMin, denMax);
    }
    return { num, den };
  };

  return Array.from({ length: count }, (_, i) => {
    const speed = generateUniqueRatio();
    const length = getRandomInt(lengthMin, lengthMax);
    const lfoPeriod = (Math.floor(Math.random() * (lfoPeriodMax - lfoPeriodMin + 1)) + lfoPeriodMin) * 1000;
    const lfoPhase = Math.random() * 2 * Math.PI;

    return {
      id: i.toString(),
      length,
      speed,
      axis: assignedAxes[i],
      lfoPeriod,
      lfoPhase,
      originalLength: length,
    };
  });
};

const getInitialState = () => {
  const defaultState = {
    segments: generateRandomSegments(defaultRandomizeConfig),
    hdri: availableHdris[0].file,
    material: "gold",
    thickness: 0.1,
  };

  if (typeof window === "undefined") {
    return defaultState;
  }

  const params = new URLSearchParams(window.location.search);
  const config = params.get("config");

  if (config) {
    try {
      const decoded = JSON.parse(atob(config));
      // Basic validation to ensure the decoded object has the expected shape
      if (
        decoded.segments &&
        Array.isArray(decoded.segments) &&
        decoded.hdri &&
        decoded.material
      ) {
        // Migration for old links that don't have the full path
        if (!decoded.hdri.startsWith("hdri/")) {
          decoded.hdri = `hdri/${decoded.hdri}`;
        }

        return {
          segments: decoded.segments.map((s: Segment) => ({
            ...s,
            speed: ensureNonZeroSpeed(s.speed),
          })),
          hdri: decoded.hdri,
          material: decoded.material,
          thickness: decoded.thickness ?? 0.1, // Fallback for old links
        };
      }
    } catch (e) {
      console.error("Failed to parse config from URL", e);
    }
  }

  return defaultState;
};

export default function IndexPage() {
  const [initialState] = useState(getInitialState);
  const [segments, setSegments] = useState<Segment[]>(initialState.segments);
  const [gentleRotation, setGentleRotation] = useState(0.5);
  const [hdri, setHdri] = useState(initialState.hdri);
  const [material, setMaterial] = useState(initialState.material);
  const [thickness, setThickness] = useState(initialState.thickness);
  const [isAnimated, setIsAnimated] = useState(false);
  const [pathResolution, setPathResolution] = useState(500);
  const [randomizeConfig, setRandomizeConfig] = useState(defaultRandomizeConfig);

  const handleShare = () => {
    const stateToShare = {
      segments,
      hdri,
      material,
      thickness,
    };
    const jsonString = JSON.stringify(stateToShare);
    const base64String = btoa(jsonString);
    const url = new URL(window.location.href);
    url.searchParams.set("config", base64String);
    navigator.clipboard.writeText(url.toString()).then(
      () => {
        addToast({
          title: "Link copied",
          description: "Link copied to clipboard successfully",
          color: "success",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        addToast({
          title: "Error",
          description: "Failed to copy link.",
          color: "danger",
        });
      }
    );
  };

  const updateSegment = (
    id: string,
    newValues: Partial<Omit<Segment, "id">>
  ) => {
    setSegments((prevSegments) =>
      prevSegments.map((s) => {
        if (s.id !== id) return s;
        const merged = { ...s, ...newValues } as Segment;
        if (newValues.speed) {
          merged.speed = ensureNonZeroSpeed(merged.speed);
        }
        return merged;
      })
    );
  };

  const randomizeSegments = () => {
    setSegments(generateRandomSegments(randomizeConfig));
  };

  const addSegment = () => {
    const tempConfig = { ...randomizeConfig, countMin: 1, countMax: 1 };
    const [newSegment] = generateRandomSegments(tempConfig);
    const segmentWithId = { ...newSegment, id: Date.now().toString() };
    setSegments((prevSegments) => [...prevSegments, segmentWithId]);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Lucid Geometry
          </h1>
          <p className="text-gray-400 flex items-center justify-center space-x-1.5">
            <span>Click</span>
            <Dice5 className="inline-block h-5 w-5" />
            <span>
              for a random config, set the background and material. Click
            </span>
            <Share2 className="inline-block h-5 w-5" />
            <span>to share.</span>
          </p>
        </div>
        {/* <Alert>
          <div className="text-xs flex items-center justify-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <MousePointer2 size={14} />
              <span>Left-click: Rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <ZoomIn size={14} />
              <span>Scroll: Zoom</span>
            </div>
            <div className="flex items-center space-x-2">
              <Move size={14} />
              <span>Right-click: Pan</span>
            </div>
          </div>
        </Alert> */}
        <div className="flex-grow w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/5 lg:w-1/3 rounded-lg overflow-y-auto">
            <SegmentEditor
              segments={segments}
              onUpdate={updateSegment}
              onAdd={addSegment}
              onRandomize={randomizeSegments}
              randomizeConfig={randomizeConfig}
              setRandomizeConfig={setRandomizeConfig}
              gentleRotation={gentleRotation}
              onGentleRotationChange={setGentleRotation}
              hdri={hdri}
              onHdriChange={setHdri}
              material={material}
              onMaterialChange={setMaterial}
              thickness={thickness}
              onThicknessChange={setThickness}
              pathResolution={pathResolution}
              onPathResolutionChange={setPathResolution}
              onShare={handleShare}
              isAnimated={isAnimated}
              onIsAnimatedChange={setIsAnimated}
            />
          </div>
          <div className="flex-grow relative rounded-lg overflow-hidden">
            <Canvas
              segments={segments}
              gentleRotation={gentleRotation}
              hdri={hdri}
              material={material}
              thickness={thickness}
              isAnimated={isAnimated}
              pathResolution={pathResolution}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
