import Canvas, { Segment } from "@/components/Canvas";
import SegmentEditor from "@/components/SegmentEditor";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import { Dice5, Share2 } from "lucide-react";
import { useState } from "react";

const getInitialState = () => {
  const defaultState = {
    segments: [
      { id: "1", length: -1, speed: { num: 4, den: 3 }, axis: "x" },
      { id: "2", length: -3, speed: { num: 2, den: 1 }, axis: "y" },
      { id: "3", length: 3, speed: { num: 1, den: 4 }, axis: "z" },
    ],
    hdri: "hdri/kloppenheim_02_1k.hdr",
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
          segments: decoded.segments,
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
  const [gentleRotation, setGentleRotation] = useState(true);
  const [hdri, setHdri] = useState(initialState.hdri);
  const [material, setMaterial] = useState(initialState.material);
  const [thickness, setThickness] = useState(initialState.thickness);
  const [randomizeConfig, setRandomizeConfig] = useState({
    countMin: 3,
    countMax: 4,
    lengthMin: -5,
    lengthMax: 5,
    numMin: 1,
    numMax: 5,
    denMin: 1,
    denMax: 5,
  });

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
      prevSegments.map((s) => (s.id === id ? { ...s, ...newValues } : s))
    );
  };

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("random int", value);

    return value === 0 ? getRandomInt(min, max) : value;
  };

  const randomizeSegments = () => {
    const {
      countMin,
      countMax,
      lengthMin,
      lengthMax,
      numMin,
      numMax,
      denMin,
      denMax,
    } = randomizeConfig;
    const count =
      Math.floor(Math.random() * (countMax - countMin + 1)) + countMin;

    // Helper to shuffle an array, with TSX-compatible generic syntax
    const shuffle = <T,>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    let assignedAxes: ("x" | "y" | "z")[] = [];
    const allAxes: ("x" | "y" | "z")[] = ["x", "y", "z"];

    if (count <= 0) {
      // No segments to generate
    } else if (count === 1) {
      assignedAxes = [allAxes[Math.floor(Math.random() * 3)]];
    } else if (count === 2) {
      assignedAxes = shuffle([...allAxes]).slice(0, 2);
    } else {
      // count >= 3
      assignedAxes = [...allAxes]; // Start with one of each
      for (let i = 3; i < count; i++) {
        assignedAxes.push(allAxes[Math.floor(Math.random() * 3)]);
      }
      assignedAxes = shuffle(assignedAxes); // Shuffle the final list
    }

    const newSegments = Array.from({ length: count }, (_, i) => {
      let num = getRandomInt(numMin, numMax);
      let den = getRandomInt(denMin, denMax);

      while (num === den) {
        den = getRandomInt(denMin, denMax);
      }

      return {
        id: i.toString(),
        length: getRandomInt(lengthMin, lengthMax),
        speed: { num, den },
        axis: assignedAxes[i],
      };
    });

    setSegments(newSegments);
  };

  const addSegment = () => {
    const { lengthMin, lengthMax, numMin, numMax, denMin, denMax } =
      randomizeConfig;
    const newSegment: Segment = {
      id: Date.now().toString(),
      length: getRandomInt(lengthMin, lengthMax),
      speed: {
        num: getRandomInt(numMin, numMax),
        den: getRandomInt(denMin, denMax),
      },
      axis: (["x", "y", "z"] as const)[Math.floor(Math.random() * 3)],
    };
    setSegments((prevSegments) => [...prevSegments, newSegment]);
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
              onShare={handleShare}
            />
          </div>
          <div className="flex-grow relative rounded-lg overflow-hidden">
            <Canvas
              segments={segments}
              gentleRotation={gentleRotation}
              hdri={hdri}
              material={material}
              thickness={thickness}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
