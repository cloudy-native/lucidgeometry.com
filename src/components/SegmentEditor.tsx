import { Dice5, Plus, Share2 } from "lucide-react";
import type React from "react";
import { materialSections, type Segment } from "./Canvas";

export interface Hdri {
  group: string;
  key: string;
  name: string;
  file: string;
}

// The files names MUST be all lower case and without spaces
// The key is used in the URL and should be unique
// The file path is relative to the public directory
// The group name can be anything you like
//
export const availableHdris: Hdri[] = [
  {
    group: "Space",
    key: "nebula_1",
    name: "Nebula 1 (4k)",
    file: "hdri/nebula-hdri_4K_742ed0df-a9d3-4878-9a4c-42f915e9c08a.hdr",
  },
  {
    group: "Space",
    key: "deep_space_nebula",
    name: "Deep Space Nebula (4k)",
    file: "hdri/deep-space-nebula_4K_7b4870ed-9185-4c3c-884c-6fe8b5159085.hdr",
  },
  {
    group: "Space",
    key: "pride_nebula",
    name: "Pride Nebula (4k)",
    file: "hdri/pride-nebula-8k_4K_7d9bb580-91d2-406e-a772-2a82367d0fcb.hdr",
  },
  {
    group: "Space",
    key: "earth",
    name: "Earth (4k)",
    file: "hdri/earth_4K_86104e26-ce9b-4bf8-930a-85fe3ebb1778.hdr",
  },
  {
    group: "Space",
    key: "rendercrate-orbital-35",
    name: "Orbital 35 (4k)",
    file: "hdri/rendercrate_orbital_35_4k.hdr",
  },
  {
    group: "Space",
    key: "blue_nebula",
    name: "Blue Nebula (4k)",
    file: "hdri/blue-nebula_4K_c388c77d-a06f-4777-b94a-5c0a3ffc56c3.hdr",
  },
  {
    group: "Space",
    key: "green_nebula",
    name: "Green Nebula (4k)",
    file: "hdri/green-nebula-in-dark-space_4K_3e75b7b1-e06e-4107-ad8d-7b5107820af7.hdr",
  },
  {
    group: "Space",
    key: "nebulas",
    name: "Nebulas (4k)",
    file: "hdri/nebulas_4K_373f4d42-869c-48f1-8733-e1e9b3aa6c8a.hdr",
  },
  {
    group: "Space",
    key: "nebulas_dark_space",
    name: "Nebulas in Dark Space (4k)",
    file: "hdri/nebulas-in-deep-dark-space_4K_b904070c-e1d2-437b-a4e4-99ff1c234645.hdr",
  },
  {
    group: "Space",
    key: "celestial_nexus",
    name: "Celestial Nexus (4k)",
    file: "hdri/celestial-nexus-hdri_4K_1c4936f5-dd2b-4345-a3b7-a4e8f1f316d7.hdr",
  },
  {
    group: "Space",
    key: "deep_dark_space",
    name: "Deep Dark Space (4k)",
    file: "hdri/deep-dark-space-with-stars_4K_56e0040f-4645-4b62-b685-637b0eb970ed.hdr",
  },
  {
    group: "Space",
    key: "space_1",
    name: "Space 1 (4k)",
    file: "hdri/space_4K_cfb6bce1-e40f-460c-8c3e-937fc6dd71b5.hdr",
  },
  {
    group: "Space",
    key: "space_2",
    name: "Space 2 (4k)",
    file: "hdri/space_4K_e7660b03-e3f3-47ce-8a05-56f64fe1738f.hdr",
  },
  {
    group: "Nature",
    key: "evening",
    name: "Evening (4k)",
    file: "hdri/evening_4K_8e4d6c2d-2e94-4a3d-8531-50fdb1db77a0.hdr",
  },
  {
    group: "Nature",
    key: "evening_2",
    name: "Evening 2 (4k)",
    file: "hdri/evening_4K_b2fe3faa-4828-4e05-8e05-6e458ccd7bac.hdr",
  },
  {
    group: "Nature",
    key: "bluesky_1",
    name: "Blue Sky 1 (4k)",
    file: "hdri/bluesky_4K_9e437ace-34b0-4921-85ee-bf13feea7a21.hdr",
  },
  {
    group: "Nature",
    key: "bluesky_2",
    name: "Blue Sky 2 (4k)",
    file: "hdri/bluesky_4K_94f45920-bacf-45ac-855c-8846d13875bd.hdr",
  },
  {
    group: "Nature",
    key: "bluesky_3",
    name: "Blue Sky 3 (4k)",
    file: "hdri/bluesky_4K_c17a719b-989d-4db3-86e7-041ef5a71959.hdr",
  },
  {
    group: "Nature",
    key: "pinksky",
    name: "Pink Sky (4k)",
    file: "hdri/pinksky_4K_60b31f4e-bb0b-4df7-990b-1a7a01af5660.hdr",
  },
  {
    group: "Nature",
    key: "redsky",
    name: "Red Sky (4k)",
    file: "hdri/redsky_4K_a6bdf644-5735-48f8-8ba3-0c007606f54e.hdr",
  },
  {
    group: "Nature",
    key: "clouds_1",
    name: "Clouds 1 (4k)",
    file: "hdri/clouds_4K_164ea8bc-d2bd-4bd6-a7fb-4491d41079f7.hdr",
  },
  {
    group: "Nature",
    key: "clouds_2",
    name: "Clouds 2 (4k)",
    file: "hdri/clouds_4K_3265e40b-b5ec-4dd2-a836-25f386a613fb.hdr",
  },
  {
    group: "Nature",
    key: "clouds_3",
    name: "Clouds 3 (4k)",
    file: "hdri/clouds_4K_c81cf373-971f-450d-ae10-2a86fca805e1.hdr",
  },
  {
    group: "Nature",
    key: "sunset_1",
    name: "Sunset 1 (4k)",
    file: "hdri/sunset_4K_3ff98cd2-949f-4b52-806b-d42ac68636fe.hdr",
  },
  {
    group: "Nature",
    key: "sunset_2",
    name: "Sunset 2 (4k)",
    file: "hdri/sunset_4K_9cd262d9-8696-41f0-b48c-dc93a1f41df7.hdr",
  },
  {
    group: "Nature",
    key: "sunset_3",
    name: "Sunset 3 (4k)",
    file: "hdri/sunset_4K_580ed36b-6781-4f12-8252-a4b1a1e3e4fe.hdr",
  },
  {
    group: "Nature",
    key: "sunset_4",
    name: "Sunset 4 (4k)",
    file: "hdri/sunset_4K_a24de9a5-77c1-43d4-acc1-9825c88315b2.hdr",
  },
  {
    group: "Nature",
    key: "sunset_5",
    name: "Sunset 5 (4k)",
    file: "hdri/sunset_4K_b5dcff58-1d18-45cf-8aeb-f69224bbed72.hdr",
  },
  {
    group: "Nature",
    key: "sunset_6",
    name: "Sunset 6 (4k)",
    file: "hdri/sunset_4K_082d1f14-e2d3-4032-af36-742d5763b4ca.hdr",
  },
  {
    group: "Nature",
    key: "sunset_7",
    name: "Sunset 7 (4k)",
    file: "hdri/sunset_4K_0a86ce01-513a-4897-b683-3c728330ff06.hdr",
  },
  {
    group: "Nature",
    key: "sunset_8",
    name: "Sunset 8 (4k)",
    file: "hdri/sunset_4K_160a138b-7018-4146-8f1f-af23184ce20e.hdr",
  },
  {
    group: "Nature",
    key: "sunset_9",
    name: "Sunset 9 (4k)",
    file: "hdri/sunset_4K_2c50abf8-2a6c-41d4-936a-36f8b0e14d8e.hdr",
  },
  {
    group: "Nature",
    key: "sunset_10",
    name: "Sunset 10 (4k)",
    file: "hdri/sunset_4K_5ff463d3-4b2e-4c86-a5ff-915edf294690.hdr",
  },
  {
    group: "Nature",
    key: "sunset_11",
    name: "Sunset 11 (4k)",
    file: "hdri/sunset_4K_a556f376-bfef-45a6-b8d8-4075f96b6cb2.hdr",
  },
  {
    group: "Nature",
    key: "sunset_12",
    name: "Sunset 12 (4k)",
    file: "hdri/sunset_4K_e41b3892-7677-4f47-b5a1-e42a255b3ddf.hdr",
  },
  {
    group: "Nature",
    key: "sunset_clouds",
    name: "Sunset Clouds (4k)",
    file: "hdri/sunset-clouds_4K_1fb99eca-9075-4e16-a520-6ffff4b29c23.hdr",
  },
  {
    group: "Nature",
    key: "kloppenheim_02",
    name: "Kloppenheim (4k)",
    file: "hdri/kloppenheim_02_4k.hdr",
  },
  {
    group: "Nature",
    key: "bambanani_sunset",
    name: "Bambanani Sunset (4k)",
    file: "hdri/bambanani_sunset_4k.hdr",
  },
  {
    group: "Nature",
    key: "cedar_bridge_sunset",
    name: "Cedar Bridge Sunset (4k)",
    file: "hdri/cedar_bridge_sunset_1_4k.hdr",
  },
  {
    group: "Nature",
    key: "chinese_garden",
    name: "Chinese Garden (4k)",
    file: "hdri/chinese_garden_4k.hdr",
  },
  {
    group: "Nature",
    key: "citrus_orchard_road_puresky",
    name: "Huge Sky (1k)",
    file: "hdri/citrus_orchard_road_puresky_1k.hdr",
  },
  {
    group: "Nature",
    key: "moonless_golf",
    name: "Moonless Golf (4k)",
    file: "hdri/moonless_golf_4k.hdr",
  },
  {
    group: "Nature",
    key: "rainforest_trail",
    name: "Rainforest Trail (4k)",
    file: "hdri/rainforest_trail_4k.hdr",
  },
  {
    group: "Nature",
    key: "plains_sunset",
    name: "Plains Sunset (4k)",
    file: "hdri/plains_sunset_4k.hdr",
  },
  {
    group: "Nature",
    key: "qwantani_moonrise_puresky",
    name: "Qwantani Moonrise (4k)",
    file: "hdri/qwantani_moonrise_puresky_4k.hdr",
  },
  {
    group: "Nature",
    key: "rogland_clear_night",
    name: "Rogland Clear Night (4k)",
    file: "hdri/rogland_clear_night_4k.hdr",
  },
  {
    group: "Nature",
    key: "rogland_moonlit_night",
    name: "Rogland Moonlit Night (2k)",
    file: "hdri/rogland_moonlit_night_2k.hdr",
  },
  {
    group: "Nature",
    key: "rosendal_plains_2",
    name: "Rosendal Plains 2 (2k)",
    file: "hdri/rosendal_plains_2_2k.hdr",
  },
  {
    group: "Nature",
    key: "sunflowers_puresky",
    name: "Sunflowers Sky (4k)",
    file: "hdri/sunflowers_puresky_4k.hdr",
  },
  {
    group: "Studio",
    key: "artist_workshop",
    name: "Artist Workshop (4k)",
    file: "hdri/artist_workshop_4k.hdr",
  },
  {
    group: "Studio",
    key: "brown_photostudio_02",
    name: "Photo Studio (4k)",
    file: "hdri/brown_photostudio_02_4k.hdr",
  },
  {
    group: "Urban",
    key: "burnt_warehouse",
    name: "Burnt Warehouse (4k)",
    file: "hdri/burnt_warehouse_4k.hdr",
  },
  {
    group: "Urban",
    key: "cobblestone_street_night",
    name: "Cobblestone Street Night (4k)",
    file: "hdri/cobblestone_street_night_4k.hdr",
  },
  {
    group: "Urban",
    key: "modern_buildings",
    name: "Modern Buildings (1k)",
    file: "hdri/modern_buildings_1k.hdr",
  },
  {
    group: "Interior",
    key: "cayley_interior",
    name: "Cayley Interior (4k)",
    file: "hdri/cayley_interior_4k.hdr",
  },
];

export interface RandomizeConfig {
  countMin: number;
  countMax: number;
  lengthMin: number;
  lengthMax: number;
  numMin: number;
  numMax: number;
  denMin: number;
  denMax: number;
  lfoPeriodMin: number;
  lfoPeriodMax: number;
}

interface SegmentEditorProps {
  segments: Segment[];
  onUpdate: (id: string, newValues: Partial<Omit<Segment, "id">>) => void;
  onAdd: () => void;
  onRandomize: () => void;
  randomizeConfig: RandomizeConfig;
  setRandomizeConfig: React.Dispatch<React.SetStateAction<RandomizeConfig>>;
  gentleRotation: number;
  onGentleRotationChange: (speed: number) => void;
  hdri: string;
  onHdriChange: (hdri: string) => void;
  material: string;
  onMaterialChange: (material: string) => void;
  thickness: number;
  onThicknessChange: (thickness: number) => void;
  pathResolution: number;
  onPathResolutionChange: (resolution: number) => void;
  onShare: () => void;
  isAnimated: boolean;
  onIsAnimatedChange: (isAnimated: boolean) => void;
}

const hdrisByGroup = availableHdris.reduce<Record<string, Hdri[]>>((acc, h) => {
  if (!acc[h.group]) acc[h.group] = [];
  acc[h.group].push(h);
  return acc;
}, {});

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
  thickness,
  onThicknessChange,
  pathResolution: _pathResolution,
  onPathResolutionChange: _onPathResolutionChange,
  onShare,
  isAnimated: _isAnimated,
  onIsAnimatedChange: _onIsAnimatedChange,
}) => {
  const RATIO_CAP = 64;
  return (
    <div className="space-y-4 p-4">
      <section className="card">
        <div className="card-header">
          <h4 className="text-lg font-bold">Controls</h4>
        </div>
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onRandomize} title="Randomize" className="btn btn-primary">
              <Dice5 size={18} />
              Randomize
            </button>
            <button type="button" onClick={onAdd} title="Add Segment" className="btn btn-secondary">
              <Plus size={18} />
              Add
            </button>
            <button type="button" onClick={onShare} title="Share" className="btn btn-success">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h4 className="text-lg font-bold">Wheels</h4>
        </div>
        <div className="card-body space-y-2">
          <div className="grid grid-cols-12 gap-2 px-1 font-mono text-sm text-zinc-400">
            <div className="col-span-2">Length</div>
            <div className="col-span-2">LFO (s)</div>
            <div className="col-span-5 text-center">Ratio</div>
            <div className="col-span-3">Axis</div>
          </div>
          {segments.map((segment) => (
            <div key={segment.id} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-2">
                <input
                  type="number"
                  aria-label="Length"
                  className="field-sm"
                  value={Number.isFinite(segment.length) ? segment.length : ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "" || raw === "-" || raw === "+" || raw === ".") {
                      return;
                    }
                    const parsed = Number(raw);
                    if (!Number.isFinite(parsed)) return;
                    const newLength = parsed === 0 ? 1 : parsed;
                    onUpdate(segment.id, {
                      length: newLength,
                      originalLength: segment.lfoPeriod
                        ? newLength
                        : segment.originalLength,
                    });
                  }}
                  onBlur={(e) => {
                    const parsed = Number(e.target.value);
                    if (!Number.isFinite(parsed) || parsed === 0) {
                      e.target.value = String(segment.length);
                      if (!Number.isFinite(segment.length) || segment.length === 0) {
                        onUpdate(segment.id, {
                          length: 1,
                          originalLength: segment.lfoPeriod ? 1 : segment.originalLength,
                        });
                      }
                    }
                  }}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  aria-label="LFO Period (seconds)"
                  className="field-sm"
                  min={0}
                  step={0.1}
                  value={
                    segment.lfoPeriod && Number.isFinite(segment.lfoPeriod)
                      ? segment.lfoPeriod / 1000
                      : 0
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return;
                    const periodSeconds = Number(raw);
                    if (!Number.isFinite(periodSeconds) || periodSeconds < 0) {
                      return;
                    }
                    onUpdate(segment.id, {
                      lfoPeriod:
                        periodSeconds > 0 ? periodSeconds * 1000 : undefined,
                      originalLength:
                        periodSeconds > 0 ? segment.length : undefined,
                      lfoPhase:
                        periodSeconds > 0 && segment.lfoPhase === undefined
                          ? 0
                          : segment.lfoPhase,
                    });
                  }}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  aria-label="Numerator"
                  className="field-sm"
                  min={-RATIO_CAP}
                  max={RATIO_CAP}
                  defaultValue={segment.speed.num}
                  key={segment.id + "-num-" + segment.speed.num}
                  onBlur={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isFinite(n) || n === 0) {
                      e.target.value = String(segment.speed.num);
                      return;
                    }
                    const clamped =
                      Math.sign(n) * Math.min(RATIO_CAP, Math.max(1, Math.abs(n)));
                    e.target.value = String(clamped);
                    onUpdate(segment.id, {
                      speed: { ...segment.speed, num: clamped },
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  aria-label="Denominator"
                  className="field-sm"
                  min={1}
                  max={RATIO_CAP}
                  value={
                    Number.isFinite(segment.speed.den) ? segment.speed.den : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return;
                    const n = Number(raw);
                    if (!Number.isFinite(n)) return;
                    onUpdate(segment.id, {
                      speed: {
                        ...segment.speed,
                        den: Math.min(RATIO_CAP, Math.max(1, n)),
                      },
                    });
                  }}
                  onBlur={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isFinite(n) || n < 1) {
                      e.target.value = String(segment.speed.den);
                      if (!Number.isFinite(segment.speed.den) || segment.speed.den < 1) {
                        onUpdate(segment.id, {
                          speed: { ...segment.speed, den: 1 },
                        });
                      }
                    }
                  }}
                />
              </div>
              <div className="col-span-3">
                <select
                  aria-label="Axis"
                  className="field-sm"
                  value={segment.axis}
                  onChange={(e) =>
                    onUpdate(segment.id, {
                      axis: e.target.value as "x" | "y" | "z",
                    })
                  }
                >
                  <option value="x">X</option>
                  <option value="y">Y</option>
                  <option value="z">Z</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h4 className="text-lg font-bold">Display Options</h4>
        </div>
        <div className="card-body space-y-4">
          <div>
            <div className="slider-label">
              <span>Rotation Speed</span>
              <span className="text-zinc-500">{gentleRotation.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className="slider"
              min={0}
              max={5}
              step={0.1}
              value={gentleRotation}
              onChange={(e) => onGentleRotationChange(Number(e.target.value))}
            />
          </div>
          <div>
            <div className="slider-label">
              <span>Thickness</span>
              <span className="text-zinc-500">{thickness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className="slider"
              min={0.01}
              max={1}
              step={0.01}
              value={thickness}
              onChange={(e) => onThicknessChange(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm" htmlFor="hdri-select">
              Environment
            </label>
            <select
              id="hdri-select"
              className="field"
              value={hdri}
              onChange={(e) => onHdriChange(e.target.value)}
            >
              {Object.entries(hdrisByGroup).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((h) => (
                    <option key={h.file} value={h.file}>
                      {h.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm" htmlFor="material-select">
              Material
            </label>
            <select
              id="material-select"
              className="field"
              value={material}
              onChange={(e) => onMaterialChange(e.target.value)}
            >
              {materialSections.map((section) => (
                <optgroup key={section.title} label={section.title}>
                  {section.materials.map((mat) => (
                    <option key={mat.key} value={mat.key}>
                      {mat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h4 className="text-lg font-bold">Randomizer Configuration</h4>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-3 items-center gap-x-2 gap-y-3 text-sm">
            <span className="col-start-2 text-center font-mono text-zinc-400">Min</span>
            <span className="text-center font-mono text-zinc-400">Max</span>

            <span>Segments</span>
            <input
              type="number"
              className="field-sm"
              min={1}
              aria-label="Segments min"
              max={randomizeConfig.countMax}
              value={randomizeConfig.countMin}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  countMin: Math.min(Math.max(1, Number(e.target.value)), c.countMax),
                }))
              }
            />
            <input
              type="number"
              className="field-sm"
              min={Math.max(1, randomizeConfig.countMin)}
              aria-label="Segments max"
              value={randomizeConfig.countMax}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  countMax: Math.max(Math.max(1, Number(e.target.value)), c.countMin),
                }))
              }
            />

            <span>Length</span>
            <input
              type="number"
              className="field-sm"
              min={1}
              aria-label="Length min"
              max={randomizeConfig.lengthMax}
              value={randomizeConfig.lengthMin}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lengthMin: Math.max(1, Math.min(Number(e.target.value), c.lengthMax)),
                }))
              }
            />
            <input
              type="number"
              className="field-sm"
              min={Math.max(1, randomizeConfig.lengthMin)}
              aria-label="Length max"
              value={randomizeConfig.lengthMax}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lengthMax: Math.max(1, Math.max(Number(e.target.value), c.lengthMin)),
                }))
              }
            />

            <span>Numerator</span>
            <input
              type="number"
              className="field-sm"
              aria-label="Numerator min"
              defaultValue={randomizeConfig.numMin}
              key={"numMin-" + randomizeConfig.numMin}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (!n) {
                  e.target.value = String(randomizeConfig.numMin);
                  return;
                }
                setRandomizeConfig((c) => ({ ...c, numMin: Math.min(n, c.numMax) }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />
            <input
              type="number"
              className="field-sm"
              aria-label="Numerator max"
              defaultValue={randomizeConfig.numMax}
              key={"numMax-" + randomizeConfig.numMax}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (!n) {
                  e.target.value = String(randomizeConfig.numMax);
                  return;
                }
                setRandomizeConfig((c) => ({ ...c, numMax: Math.max(n, c.numMin) }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
            />

            <span>Denominator</span>
            <input
              type="number"
              className="field-sm"
              min={1}
              aria-label="Denominator min"
              max={randomizeConfig.denMax}
              value={randomizeConfig.denMin}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  denMin: Math.min(Math.max(1, Number(e.target.value)), c.denMax),
                }))
              }
            />
            <input
              type="number"
              className="field-sm"
              aria-label="Denominator max"
              value={randomizeConfig.denMax}
              min={Math.max(1, randomizeConfig.denMin)}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  denMax: Math.max(Math.max(1, Number(e.target.value)), c.denMin),
                }))
              }
            />

            <span>LFO Period (s)</span>
            <input
              type="number"
              className="field-sm"
              min={0}
              step={1}
              aria-label="LFO Period min"
              max={randomizeConfig.lfoPeriodMax}
              value={randomizeConfig.lfoPeriodMin}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lfoPeriodMin: Math.min(Math.max(0, Number(e.target.value)), c.lfoPeriodMax),
                }))
              }
            />
            <input
              type="number"
              className="field-sm"
              min={randomizeConfig.lfoPeriodMin}
              step={1}
              aria-label="LFO Period max"
              value={randomizeConfig.lfoPeriodMax}
              onChange={(e) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lfoPeriodMax: Math.max(Number(e.target.value), c.lfoPeriodMin),
                }))
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SegmentEditor;
