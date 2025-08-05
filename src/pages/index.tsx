import { useState } from "react";
import { Dice5, Move, MousePointer2, Share2, ZoomIn } from "lucide-react";
import Canvas, { Segment } from "@/components/Canvas";
import SegmentEditor from "@/components/SegmentEditor";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";


const getInitialState = () => {
  const defaultState = {
    segments: [
      { id: '1', length: 10, speed: { num: 1, den: 1 }, axis: 'x' },
      { id: '2', length: 5, speed: { num: 2, den: 1 }, axis: 'y' },
      { id: '3', length: 2, speed: { num: 4, den: 1 }, axis: 'z' },
    ],
    hdri: 'kloppenheim_02_1k.hdr',
    material: 'silver',
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  const params = new URLSearchParams(window.location.search);
  const config = params.get('config');

  if (config) {
    try {
      const decoded = JSON.parse(atob(config));
      // Basic validation to ensure the decoded object has the expected shape
      if (decoded.segments && Array.isArray(decoded.segments) && decoded.hdri && decoded.material) {
        return {
          segments: decoded.segments,
          hdri: decoded.hdri,
          material: decoded.material,
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
    };
    const jsonString = JSON.stringify(stateToShare);
    const base64String = btoa(jsonString);
    const url = new URL(window.location.href);
    url.searchParams.set('config', base64String);
    navigator.clipboard.writeText(url.toString()).then(() => {
      addToast({
        title: "Link copied",
        description: "Link copied to clipboard successfully",
        color: "success",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      addToast({
        title: "Error",
        description: "Failed to copy link.",
        color: "danger",
      });
    });
  };

  const updateSegment = (id: string, newValues: Partial<Omit<Segment, 'id'>>) => {
    setSegments(prevSegments => 
      prevSegments.map(s => s.id === id ? { ...s, ...newValues } : s)
    );
  };

  const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log('random int', value);
    
    return value === 0 ? getRandomInt(min, max) : value;
  };

  const randomizeSegments = () => {
    const { countMin, countMax, lengthMin, lengthMax, numMin, numMax, denMin, denMax } = randomizeConfig;
    const count = Math.floor(Math.random() * (countMax - countMin + 1)) + countMin;
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
        axis: (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)],
      };
    });

    // Ensure not all axes are the same
    if (newSegments.length > 1) {
      const firstAxis = newSegments[0].axis;
      const allSame = newSegments.every(s => s.axis === firstAxis);
      if (allSame) {
        const otherAxes = ['x', 'y', 'z'].filter(ax => ax !== firstAxis);
        newSegments[1].axis = otherAxes[Math.floor(Math.random() * otherAxes.length)] as 'x' | 'y' | 'z';
      }
    }

    setSegments(newSegments);
  };

  const addSegment = () => {
    const { lengthMin, lengthMax, numMin, numMax, denMin, denMax } = randomizeConfig;
    const newSegment: Segment = {
      id: Date.now().toString(),
      length: getRandomInt(lengthMin, lengthMax),
      speed: {
        num: getRandomInt(numMin, numMax),
        den: getRandomInt(denMin, denMax),
      },
      axis: (['x', 'y', 'z'] as const)[Math.floor(Math.random() * 3)],
    };
    setSegments(prevSegments => [...prevSegments, newSegment]);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Lucid Geometry</h1>
          <p className="text-gray-400 flex items-center justify-center space-x-1.5">
            <span>Click</span>
            <Dice5 className="inline-block h-5 w-5" />
            <span>for a random config, set the background and material. Click</span>
            <Share2 className="inline-block h-5 w-5" />
            <span>to share.</span>
          </p>
        </div>
        <div className="bg-gray-800 text-gray-300 p-2 rounded-lg mb-4 text-xs flex items-center justify-center space-x-4 md:space-x-6">
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
        <div className="flex-grow w-full flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 rounded-lg overflow-y-auto">
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
              onShare={handleShare}
            />
          </div>
          <div className="flex-grow relative rounded-lg overflow-hidden">
            <Canvas
              segments={segments}
              gentleRotation={gentleRotation}
              hdri={hdri}
              material={material}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
