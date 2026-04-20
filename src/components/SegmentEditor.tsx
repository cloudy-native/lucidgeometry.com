import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Slider,
} from "@heroui/react";
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
    group: "Nature",
    key: "evening",
    name: "Evening (4k)",
    file: "hdri/evening_4K_8e4d6c2d-2e94-4a3d-8531-50fdb1db77a0.hdr",
  },
  {
    group: "Nature",
    key: "bluesky",
    name: "Blue Sky (4k)",
    file: "hdri/bluesky_4K_9e437ace-34b0-4921-85ee-bf13feea7a21.hdr",
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
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Controls</h4>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button
                onClick={onRandomize}
                title="Randomize"
                color="primary"
                startContent={<Dice5 />}
              >
                Randomize
              </Button>
              <Button
                onClick={onAdd}
                title="Add Segment"
                color="secondary"
                startContent={<Plus />}
              >
                Add
              </Button>
              <Button
                onClick={onShare}
                title="Share"
                color="success"
                startContent={<Share2 />}
              >
                Share
              </Button>
            </div>
            {/* <div>
              <Checkbox isSelected={isAnimated} onValueChange={onIsAnimatedChange}>
                Animate
              </Checkbox>
            </div> */}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Wheels</h4>
        </CardHeader>
        <CardBody className="space-y-2">
          <div className="grid grid-cols-12 gap-2 px-1 text-sm font-mono text-gray-400">
            <div className="col-span-2">Length</div>
            <div className="col-span-2">LFO (s)</div>
            <div className="col-span-5 text-center">Ratio</div>
            <div className="col-span-3">Axis</div>
          </div>
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div className="col-span-2">
                <Input
                  type="number"
                  aria-label="Length"
                  size="sm"
                  value={String(segment.length)}
                  onValueChange={(val) => {
                    const parsed = Number(val);
                    const newLength = parsed === 0 ? 1 : parsed;
                    onUpdate(segment.id, {
                      length: newLength,
                      originalLength: segment.lfoPeriod
                        ? newLength
                        : segment.originalLength,
                    });
                  }}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  aria-label="LFO Period (seconds)"
                  size="sm"
                  min="0"
                  step="0.1"
                  value={
                    segment.lfoPeriod ? String(segment.lfoPeriod / 1000) : "0"
                  }
                  onValueChange={(val) => {
                    const periodSeconds = Number(val);
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
                <Input
                  type="number"
                  aria-label="Numerator"
                  size="sm"
                  min={-RATIO_CAP}
                  max={RATIO_CAP}
                  defaultValue={String(segment.speed.num)}
                  key={segment.id + "-num-" + segment.speed.num}
                  onBlur={(e) => {
                    const n = Number(e.target.value);
                    if (!n) { e.target.value = String(segment.speed.num); return; }
                    const clamped = Math.sign(n) * Math.min(RATIO_CAP, Math.max(1, Math.abs(n)));
                    e.target.value = String(clamped);
                    onUpdate(segment.id, { speed: { ...segment.speed, num: clamped } });
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  aria-label="Denominator"
                  size="sm"
                  min="1"
                  max={RATIO_CAP}
                  value={String(segment.speed.den)}
                  onValueChange={(val) =>
                    onUpdate(segment.id, {
                      speed: {
                        ...segment.speed,
                        den: Math.min(RATIO_CAP, Math.max(1, Number(val))),
                      },
                    })
                  }
                />
              </div>
              <div className="col-span-3">
                <Select
                  aria-label="Axis"
                  size="sm"
                  selectedKeys={[segment.axis]}
                  onChange={(e) =>
                    onUpdate(segment.id, {
                      axis: e.target.value as "x" | "y" | "z",
                    })
                  }
                >
                  <SelectItem key="x">X</SelectItem>
                  <SelectItem key="y">Y</SelectItem>
                  <SelectItem key="z">Z</SelectItem>
                </Select>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Display Options</h4>
        </CardHeader>
        <CardBody className="space-y-4">
          <Slider
            label="Rotation Speed"
            minValue={0}
            maxValue={5}
            step={0.1}
            value={gentleRotation}
            onChange={(val) => onGentleRotationChange(val as number)}
          />
          <Slider
            label="Thickness"
            minValue={0.01}
            maxValue={1.0}
            step={0.01}
            value={thickness}
            onChange={(val) => onThicknessChange(val as number)}
          />
          {/* <Slider
            label="Path Resolution"
            minValue={50}
            maxValue={2000}
            step={10}
            value={pathResolution}
            onChange={(val) => onPathResolutionChange(val as number)}
          /> */}

          <Select
            label="Environment"
            selectedKeys={[hdri]}
            onChange={(e) => onHdriChange(e.target.value)}
          >
            {Object.entries(
              availableHdris.reduce<Record<string, Hdri[]>>((acc, h) => {
                if (!acc[h.group]) acc[h.group] = [];
                acc[h.group].push(h);
                return acc;
              }, {})
            ).map(([group, items]) => (
              <SelectSection key={group} title={group} showDivider>
                {items.map((h) => (
                  <SelectItem key={h.file}>{h.name}</SelectItem>
                ))}
              </SelectSection>
            ))}
          </Select>
          <Select
            label="Material"
            selectedKeys={[material]}
            onChange={(e) => onMaterialChange(e.target.value)}
          >
            {materialSections.map((section) => (
              <SelectSection key={section.title} title={section.title}>
                {section.materials.map((mat) => (
                  <SelectItem key={mat.key}>{mat.name}</SelectItem>
                ))}
              </SelectSection>
            ))}
          </Select>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Randomizer Configuration</h4>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-x-2 gap-y-3 text-sm items-center">
            <span className="font-mono text-gray-400 col-start-2 text-center">
              Min
            </span>
            <span className="font-mono text-gray-400 text-center">Max</span>

            <span className="text-sm">Segments</span>
            <Input
              type="number"
              size="sm"
              min="1"
              aria-label="Segments min"
              max={randomizeConfig.countMax}
              value={String(randomizeConfig.countMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  countMin: Math.min(Math.max(1, Number(val)), c.countMax),
                }))
              }
            />
            <Input
              type="number"
              size="sm"
              min={Math.max(1, randomizeConfig.countMin)}
              aria-label="Segments max"
              value={String(randomizeConfig.countMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  countMax: Math.max(Math.max(1, Number(val)), c.countMin),
                }))
              }
            />

            <span className="text-sm">Length</span>
            <Input
              type="number"
              size="sm"
              min="1"
              aria-label="Length min"
              max={randomizeConfig.lengthMax}
              value={String(randomizeConfig.lengthMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lengthMin: Math.max(1, Math.min(Number(val), c.lengthMax)),
                }))
              }
            />
            <Input
              type="number"
              size="sm"
              min={Math.max(1, randomizeConfig.lengthMin)}
              aria-label="Length max"
              value={String(randomizeConfig.lengthMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lengthMax: Math.max(1, Math.max(Number(val), c.lengthMin)),
                }))
              }
            />

            <span className="text-sm">Numerator</span>
            <Input
              type="number"
              size="sm"
              aria-label="Numerator min"
              defaultValue={String(randomizeConfig.numMin)}
              key={"numMin-" + randomizeConfig.numMin}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (!n) { e.target.value = String(randomizeConfig.numMin); return; }
                setRandomizeConfig((c) => ({ ...c, numMin: Math.min(n, c.numMax) }));
              }}
              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            />
            <Input
              type="number"
              size="sm"
              aria-label="Numerator max"
              defaultValue={String(randomizeConfig.numMax)}
              key={"numMax-" + randomizeConfig.numMax}
              onBlur={(e) => {
                const n = Number(e.target.value);
                if (!n) { e.target.value = String(randomizeConfig.numMax); return; }
                setRandomizeConfig((c) => ({ ...c, numMax: Math.max(n, c.numMin) }));
              }}
              onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            />

            <span className="text-sm">Denominator</span>
            <Input
              type="number"
              size="sm"
              min="1"
              aria-label="Denominator min"
              max={randomizeConfig.denMax}
              value={String(randomizeConfig.denMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  denMin: Math.min(Math.max(1, Number(val)), c.denMax),
                }))
              }
            />
            <Input
              type="number"
              size="sm"
              aria-label="Denominator max"
              value={String(randomizeConfig.denMax)}
              min={Math.max(1, randomizeConfig.denMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  denMax: Math.max(Math.max(1, Number(val)), c.denMin),
                }))
              }
            />

            <span className="text-sm">LFO Period (s)</span>
            <Input
              type="number"
              size="sm"
              min="0"
              step="1"
              aria-label="LFO Period min"
              max={randomizeConfig.lfoPeriodMax}
              value={String(randomizeConfig.lfoPeriodMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lfoPeriodMin: Math.min(
                    Math.max(0, Number(val)),
                    c.lfoPeriodMax,
                  ),
                }))
              }
            />
            <Input
              type="number"
              size="sm"
              min={randomizeConfig.lfoPeriodMin}
              step="1"
              aria-label="LFO Period max"
              value={String(randomizeConfig.lfoPeriodMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  lfoPeriodMax: Math.max(Number(val), c.lfoPeriodMin),
                }))
              }
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SegmentEditor;
