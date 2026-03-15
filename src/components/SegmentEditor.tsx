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
  key: string;
  name: string;
  file: string;
}

export const availableHdris: Hdri[] = [
  {
    key: "kloppenheim_02",
    name: "Kloppenheim (4k)",
    file: "hdri/kloppenheim_02_4k.hdr",
  },
  {
    key: "artist_workshop",
    name: "Artist Workshop",
    file: "hdri/artist_workshop_1k.hdr",
  },
  {
    key: "moonless_golf",
    name: "Moonless Golf",
    file: "hdri/moonless_golf_1k.hdr",
  },
  {
    key: "citrus_orchard_road_puresky",
    name: "Huge Sky",
    file: "hdri/citrus_orchard_road_puresky_1k.hdr",
  },
  {
    key: "chinese_garden",
    name: "Chinese Garden",
    file: "hdri/chinese_garden_1k.hdr",
  },
  {
    key: "modern_buildings",
    name: "Modern Buildings",
    file: "hdri/modern_buildings_1k.hdr",
  },
  {
    key: "brown_photostudio_02",
    name: "Photo Studio",
    file: "hdri/brown_photostudio_02_1k.hdr",
  },
  {
    key: "cayley_interior",
    name: "Cayley Interior",
    file: "hdri/cayley_interior_1k.hdr",
  },
  {
    key: "burnt_warehouse",
    name: "Burnt Warehouse (4k)",
    file: "hdri/burnt_warehouse_4k.hdr",
  },
  {
    key: "cobblestone_street_night",
    name: "Cobblestone Street Night (2k)",
    file: "hdri/cobblestone_street_night_2k.hdr",
  },
  {
    key: "rainforest_trail",
    name: "Rainforest Trail (2k)",
    file: "hdri/rainforest_trail_2k.hdr",
  },
  {
    key: "rogland_moonlit_night",
    name: "Rogland Moonlit Night (2k)",
    file: "hdri/rogland_moonlit_night_2k.hdr",
  },
  {
    key: "rosendal_plains_2",
    name: "Rosenal Plains 2 (2k)",
    file: "hdri/rosendal_plains_2_2k.hdr",
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
                  min="1"
                  value={String(segment.length)}
                  onValueChange={(val) => {
                    const newLength = Math.max(1, Number(val));
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
                  min="1"
                  max={RATIO_CAP}
                  value={String(segment.speed.num)}
                  onValueChange={(val) =>
                    onUpdate(segment.id, {
                      speed: {
                        ...segment.speed,
                        num: Math.min(RATIO_CAP, Math.max(1, Number(val))),
                      },
                    })
                  }
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
            {availableHdris.map((hdri) => (
              <SelectItem key={hdri.file}>{hdri.name}</SelectItem>
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
              min="1"
              aria-label="Numerator min"
              max={randomizeConfig.numMax}
              value={String(randomizeConfig.numMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  numMin: Math.min(Math.max(1, Number(val)), c.numMax),
                }))
              }
            />
            <Input
              type="number"
              size="sm"
              aria-label="Numerator max"
              value={String(randomizeConfig.numMax)}
              min={Math.max(1, randomizeConfig.numMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({
                  ...c,
                  numMax: Math.max(Math.max(1, Number(val)), c.numMin),
                }))
              }
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
