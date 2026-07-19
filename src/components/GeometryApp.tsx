import { Dice5, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import Canvas, { type Segment } from "@/components/Canvas";
import SegmentEditor, { availableHdris } from "@/components/SegmentEditor";

const ensureNonZero = (v: number) => (v === 0 ? 1 : v);
const ensureNonZeroSpeed = (s: { num: number; den: number }) => ({
  num: ensureNonZero(s.num),
  den: ensureNonZero(s.den),
});

const defaultRandomizeConfig = {
  countMin: 3,
  countMax: 3,
  lengthMin: 1,
  lengthMax: 10,
  numMin: -7,
  numMax: 7,
  denMin: 1,
  denMax: 7,
  lfoPeriodMin: 30,
  lfoPeriodMax: 50,
};

const generateRandomSegments = (
  config: typeof defaultRandomizeConfig,
): Segment[] => {
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
    let lo = Math.ceil(min);
    let hi = Math.floor(max);
    if (lo > hi) [lo, hi] = [hi, lo];

    // Avoid infinite retry when the only integer in range is 0
    if (lo === 0 && hi === 0) return 1;

    for (let attempt = 0; attempt < 64; attempt++) {
      const value = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      if (value !== 0) return value;
    }
    // Bounded fallback: prefer a non-zero endpoint
    if (hi !== 0) return hi;
    if (lo !== 0) return lo;
    return 1;
  };

  const shuffle = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  /** Prefer den ≠ num; if the den range cannot differ, nudge or accept equal. */
  const pickDenominator = (num: number, dMin: number, dMax: number): number => {
    let lo = Math.ceil(dMin);
    let hi = Math.floor(dMax);
    if (lo > hi) [lo, hi] = [hi, lo];
    if (lo < 1) lo = 1;
    if (hi < 1) hi = 1;

    for (let attempt = 0; attempt < 32; attempt++) {
      const den = getRandomInt(lo, hi);
      if (den !== num) return den;
    }
    // Ranges collapsed to a single value equal to num — force a neighbor
    if (num !== 1) return 1;
    return 2;
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

  const generateUniqueRatio = (
    maxAttempts = 50,
  ): { num: number; den: number } => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const num = getRandomInt(numMin, numMax);
      const den = pickDenominator(num, denMin, denMax);

      const gcd = (a: number, b: number): number =>
        b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(Math.abs(num), Math.abs(den));
      const normalizedNum = num / divisor;
      const normalizedDen = den / divisor;
      const ratioKey = `${normalizedNum}/${normalizedDen}`;

      if (!usedRatios.has(ratioKey)) {
        usedRatios.add(ratioKey);
        return { num, den };
      }
    }

    const num = getRandomInt(numMin, numMax);
    const den = pickDenominator(num, denMin, denMax);
    return { num, den };
  };

  return Array.from({ length: count }, (_, i) => {
    const speed = generateUniqueRatio();
    const length = getRandomInt(lengthMin, lengthMax);
    const lfoPeriod =
      (Math.floor(Math.random() * (lfoPeriodMax - lfoPeriodMin + 1)) +
        lfoPeriodMin) *
      1000;
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
      if (
        decoded.segments &&
        Array.isArray(decoded.segments) &&
        decoded.hdri &&
        decoded.material
      ) {
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
          thickness: decoded.thickness ?? 0.1,
        };
      }
    } catch (e) {
      console.error("Failed to parse config from URL", e);
    }
  }

  return defaultState;
};

export default function GeometryApp() {
  const [initialState] = useState(getInitialState);
  const [segments, setSegments] = useState<Segment[]>(initialState.segments);
  const [gentleRotation, setGentleRotation] = useState(0.5);
  const [hdri, setHdri] = useState(initialState.hdri);
  const [material, setMaterial] = useState(initialState.material);
  const [thickness, setThickness] = useState(initialState.thickness);
  const [isAnimated, setIsAnimated] = useState(false);
  const [pathResolution, setPathResolution] = useState(500);
  const [randomizeConfig, setRandomizeConfig] = useState(defaultRandomizeConfig);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
    tone: "success" | "danger";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(id);
  }, [toast]);

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
        setToast({
          title: "Link copied",
          description: "Link copied to clipboard successfully",
          tone: "success",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        setToast({
          title: "Error",
          description: "Failed to copy link.",
          tone: "danger",
        });
      },
    );
  };

  const updateSegment = (
    id: string,
    newValues: Partial<Omit<Segment, "id">>,
  ) => {
    setSegments((prevSegments) =>
      prevSegments.map((s) => {
        if (s.id !== id) return s;
        const merged = { ...s, ...newValues } as Segment;
        if (newValues.speed) {
          merged.speed = ensureNonZeroSpeed(merged.speed);
        }
        return merged;
      }),
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
    <div className="flex h-full min-h-0 flex-col">
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-50 max-w-sm rounded-lg border px-4 py-3 shadow-lg ${
            toast.tone === "success"
              ? "border-emerald-500/40 bg-emerald-950 text-emerald-100"
              : "border-red-500/40 bg-red-950 text-red-100"
          }`}
        >
          <p className="font-semibold">{toast.title}</p>
          <p className="text-sm opacity-90">{toast.description}</p>
        </div>
      )}

      <div className="pb-4 pt-8 text-center">
        <h1 className="mb-2 text-4xl font-bold md:text-5xl">Lucid Geometry</h1>
        <p className="flex items-center justify-center space-x-1.5 text-zinc-400">
          <span>Click</span>
          <Dice5 className="inline-block h-5 w-5" />
          <span>for a random config, set the background and material. Click</span>
          <Share2 className="inline-block h-5 w-5" />
          <span>to share.</span>
        </p>
      </div>

      <div className="flex w-full min-h-0 flex-grow flex-col gap-4 md:flex-row">
        <div className="w-full overflow-y-auto rounded-lg md:w-2/5 lg:w-1/3">
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
        <div className="relative min-h-[50vh] flex-grow overflow-hidden rounded-lg md:min-h-0">
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
  );
}
