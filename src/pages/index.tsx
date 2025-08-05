import { useState } from "react";
import Canvas, { Segment } from "@/components/Canvas";
import SegmentEditor from "@/components/SegmentEditor";
import DefaultLayout from "@/layouts/default";

const initialSegments: Segment[] = [
  { id: '1', length: 10, speed: { num: 1, den: 1 }, axis: 'x' },
  { id: '2', length: 5, speed: { num: 2, den: 1 }, axis: 'y' },
  { id: '3', length: 2, speed: { num: 4, den: 1 }, axis: 'z' },
];

export default function IndexPage() {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [gentleRotation, setGentleRotation] = useState(true);
  const [hdri, setHdri] = useState('kloppenheim_02_1k.hdr');
  const [material, setMaterial] = useState('silver');
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

  const deleteSegment = (id: string) => {
    setSegments(prevSegments => prevSegments.filter(s => s.id !== id));
  };

  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-var(--navbar-height))] bg-gray-900 text-white">
        <div className="w-96 p-4 bg-gray-800 overflow-y-auto">
          <SegmentEditor 
            segments={segments} 
            onUpdate={updateSegment}
            onAdd={addSegment}
            onDelete={deleteSegment}
            onRandomize={randomizeSegments}
            randomizeConfig={randomizeConfig}
            setRandomizeConfig={setRandomizeConfig}
            gentleRotation={gentleRotation}
            onGentleRotationChange={setGentleRotation}
            hdri={hdri}
            onHdriChange={setHdri}
            material={material}
            onMaterialChange={setMaterial}
          />
        </div>
        <div className="flex-grow relative">
          <Canvas 
            segments={segments} 
            gentleRotation={gentleRotation} 
            hdri={hdri}
            material={material} 
          />
        </div>
      </div>
    </DefaultLayout>
  );
}
