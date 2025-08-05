import { Dice5, Plus, Share2 } from "lucide-react";
import React from "react";
import { Segment, availableMaterials } from "./Canvas";

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
  onUpdate: (id: string, newValues: Partial<Omit<Segment, "id">>) => void;
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
  onShare: () => void;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({
  segments,
  onUpdate,
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
  onShare,
}) => {
  return (
    <div className="p-4 bg-gray-800 text-white space-y-6 overflow-y-auto h-full">
      {/* Action Bar */}
      <div className="p-3 bg-gray-900 rounded-lg space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onRandomize}
            title="Randomize"
            className="col-span-1 flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold text-sm"
          >
            <Dice5 className="h-5 w-5" />
          </button>
          <button
            onClick={onAdd}
            title="Add Segment"
            className="col-span-1 flex items-center justify-center p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-bold text-sm"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={onShare}
            title="Share"
            className="col-span-1 flex items-center justify-center p-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold text-sm"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Segments List */}
      <div>
        <h4 className="text-lg font-bold mb-2 flex items-center">Wheels</h4>
        <div className="space-y-2">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 px-2 text-sm font-mono text-gray-400">
            <div className="col-span-3">Length</div>
            <div className="col-span-6">Ratio</div>
            <div className="col-span-3">Axis</div>
          </div>

          {segments.map((segment) => (
            <div
              key={segment.id}
              className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-900 rounded-lg"
            >
              {/* Length Input */}
              <div className="col-span-3">
                <input
                  type="number"
                  value={segment.length}
                  onChange={(e) =>
                    onUpdate(segment.id, { length: Number(e.target.value) })
                  }
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                />
              </div>
              {/* Numerator Input */}
              <div className="col-span-3">
                <input
                  type="number"
                  min="1"
                  value={segment.speed.num}
                  onChange={(e) =>
                    onUpdate(segment.id, {
                      speed: { ...segment.speed, num: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                />
              </div>
              {/* Denominator Input */}
              <div className="col-span-3">
                <input
                  type="number"
                  min="1"
                  value={segment.speed.den}
                  onChange={(e) =>
                    onUpdate(segment.id, {
                      speed: { ...segment.speed, den: Number(e.target.value) },
                    })
                  }
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                />
              </div>
              {/* Axis Select */}
              <div className="col-span-3">
                <select
                  value={segment.axis}
                  onChange={(e) =>
                    onUpdate(segment.id, {
                      axis: e.target.value as "x" | "y" | "z",
                    })
                  }
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="x">X</option>
                  <option value="y">Y</option>
                  <option value="z">Z</option>
                </select>
              </div>
              {/* Delete Button */}
              {/* <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => onDelete(segment.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold p-1 rounded-full h-6 w-6 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Display & Randomizer Options */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-bold mb-3">Display Options</h4>
          <div className="p-4 bg-gray-900 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="gentle-rotation" className="text-white text-sm">
                Gentle Rotation
              </label>
              <input
                id="gentle-rotation"
                type="checkbox"
                checked={gentleRotation}
                onChange={(e) => onGentleRotationChange(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="hdri-select" className="text-white text-sm">
                Environment
              </label>
              <select
                id="hdri-select"
                value={hdri}
                onChange={(e) => onHdriChange(e.target.value)}
                className="form-select bg-gray-700 border-gray-600 text-white rounded focus:ring-blue-500 text-sm"
              >
                <option value="kloppenheim_02_1k.hdr">Kloppenheim</option>
                <option value="artist_workshop_1k.hdr">Artist Workshop</option>
                <option value="moonless_golf_1k.hdr">Moonless Golf</option>
                <option value="citrus_orchard_road_puresky_1k.hdr">
                  Huge Sky
                </option>
                <option value="chinese_garden_1k.hdr">Chinese Garden</option>
                <option value="modern_buildings_1k.hdr">
                  Modern Buildings
                </option>
                <option value="brown_photostudio_02_1k.hdr">
                  Photo Studio
                </option>
                <option value="cayley_interior_1k.hdr">Cayley Interior</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="material-select" className="text-white text-sm">
                Material
              </label>
              <select
                id="material-select"
                value={material}
                onChange={(e) => onMaterialChange(e.target.value)}
                className="form-select bg-gray-700 border-gray-600 text-white rounded focus:ring-blue-500 text-sm"
              >
                {availableMaterials.map((mat) => (
                  <option key={mat.key} value={mat.key}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-2">Randomize Config</h4>
          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="grid grid-cols-3 gap-x-2 gap-y-3 text-sm">
              <span className="font-mono text-gray-400 col-start-2 text-center">
                Min
              </span>
              <span className="font-mono text-gray-400 text-center">Max</span>

              <label className="text-sm">Segments</label>
              <input
                type="number"
                min="1"
                value={randomizeConfig.countMin}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    countMin: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />
              <input
                type="number"
                min="1"
                value={randomizeConfig.countMax}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    countMax: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />

              <label className="text-sm">Length</label>
              <input
                type="number"
                value={randomizeConfig.lengthMin}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    lengthMin: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />
              <input
                type="number"
                value={randomizeConfig.lengthMax}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    lengthMax: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />

              <label className="text-sm">Numerator</label>
              <input
                type="number"
                min="1"
                value={randomizeConfig.numMin}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    numMin: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />
              <input
                type="number"
                min="1"
                value={randomizeConfig.numMax}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    numMax: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />

              <label className="text-sm">Denominator</label>
              <input
                type="number"
                min="1"
                value={randomizeConfig.denMin}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    denMin: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />
              <input
                type="number"
                min="1"
                value={randomizeConfig.denMax}
                onChange={(e) =>
                  setRandomizeConfig((c) => ({
                    ...c,
                    denMax: Number(e.target.value),
                  }))
                }
                className="w-full bg-gray-700 text-white rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentEditor;
