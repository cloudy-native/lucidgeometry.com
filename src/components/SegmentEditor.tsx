import React from 'react';
import { Dice5 } from 'lucide-react';
import { Segment, availableMaterials } from './Canvas';

export interface RandomizeConfig {
  countMin: number;
  countMax: number;
  lengthMin: number;
  lengthMax: number;
  numMin: number;
  numMax: number;
  denMin: number;
  denMax: number;
}

interface SegmentEditorProps {
  segments: Segment[];
  onUpdate: (id: string, newValues: Partial<Omit<Segment, 'id'>>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onRandomize: () => void;
  randomizeConfig: RandomizeConfig;
  setRandomizeConfig: React.Dispatch<React.SetStateAction<RandomizeConfig>>;
  gentleRotation: boolean;
  onGentleRotationChange: (rotate: boolean) => void;
  hdri: string;
  onHdriChange: (hdri: string) => void;
  material: string;
  onMaterialChange: (material: string) => void;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({
  segments,
  onUpdate,
  onDelete,
  onAdd,
  onRandomize,
  randomizeConfig,
  setRandomizeConfig,
  gentleRotation,
  onGentleRotationChange,
  hdri,
  onHdriChange,
  material,
  onMaterialChange,
}) => {

  return (
    <div className="w-full">
      <div className="mt-6 pt-4">
        <h4 className="text-lg font-bold mb-2">Display Options</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="gentle-rotation" className="text-white">Gentle Rotation</label>
            <input id="gentle-rotation" type="checkbox" checked={gentleRotation} onChange={e => onGentleRotationChange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="hdri-select" className="text-white">Environment</label>
            <select id="hdri-select" value={hdri} onChange={e => onHdriChange(e.target.value)} className="form-select bg-gray-700 border-gray-600 text-white rounded focus:ring-blue-500">
              <option value="kloppenheim_02_1k.hdr">Kloppenheim</option>
              <option value="artist_workshop_1k.hdr">Artist Workshop</option>
              <option value="moonless_golf_1k.hdr">Moonless Golf</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="material-select" className="text-white">Material</label>
            <select id="material-select" value={material} onChange={e => onMaterialChange(e.target.value)} className="form-select bg-gray-700 border-gray-600 text-white rounded focus:ring-blue-500">
              {availableMaterials.map(mat => (
                <option key={mat.key} value={mat.key}>{mat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center space-x-2 p-2 border border-gray-700 rounded-md bg-gray-900">
            <div className="flex items-center space-x-1">
              <label className="text-sm font-mono">L:</label>
              <input
                type="number"
                value={segment.length}
                onChange={(e) => onUpdate(segment.id, { length: Number(e.target.value) })}
                className="w-14 bg-gray-700 text-white rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-mono">N:</label>
              <input
                type="number"
                min="1"
                value={segment.speed.num}
                onChange={(e) => onUpdate(segment.id, { speed: { ...segment.speed, num: Number(e.target.value) } })}
                className="w-12 bg-gray-700 text-white rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-sm font-mono">D:</label>
              <input
                type="number"
                min="1"
                value={segment.speed.den}
                onChange={(e) => onUpdate(segment.id, { speed: { ...segment.speed, den: Number(e.target.value) } })}
                className="w-12 bg-gray-700 text-white rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center space-x-1">
              <select
                value={segment.axis}
                onChange={(e) => onUpdate(segment.id, { axis: e.target.value as 'x' | 'y' | 'z' })}
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm appearance-none"
              >
                <option value="x">X</option>
                <option value="y">Y</option>
                <option value="z">Z</option>
              </select>
            </div>
            <button onClick={() => onDelete(segment.id)} className="ml-auto bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">X</button>
          </div>
        ))}
      </div>
      <button onClick={onAdd} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add Segment</button>
      
      <div className="mt-4 pt-4">
        <h4 className="text-md font-bold mb-2">Randomizer Config</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <span className="font-mono text-gray-400"></span>
          <span className="font-mono text-gray-400">Min</span>
          <span className="font-mono text-gray-400">Max</span>
          
          <label className="text-sm">Length Range</label>
          <input type="number" value={randomizeConfig.lengthMin} onChange={e => setRandomizeConfig(c => ({ ...c, lengthMin: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />
          <input type="number" value={randomizeConfig.lengthMax} onChange={e => setRandomizeConfig(c => ({ ...c, lengthMax: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />
          <label className="font-mono">Numerator</label>
          <input type="number" min="1" value={randomizeConfig.numMin} onChange={e => setRandomizeConfig(c => ({ ...c, numMin: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />
          <input type="number" value={randomizeConfig.numMax} onChange={e => setRandomizeConfig(c => ({ ...c, numMax: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />

          <label className="font-mono">Denominator</label>
          <input type="number" min="1" value={randomizeConfig.denMin} onChange={e => setRandomizeConfig(c => ({ ...c, denMin: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />
          <input type="number" value={randomizeConfig.denMax} onChange={e => setRandomizeConfig(c => ({ ...c, denMax: Number(e.target.value) }))} className="w-full bg-gray-700 text-white rounded px-2 py-1" />
        </div>
        <button onClick={onRandomize} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
          <Dice5 size={20} />
          <span>Randomize</span>
        </button>
      </div>
    </div>
  );
};

export default SegmentEditor;
