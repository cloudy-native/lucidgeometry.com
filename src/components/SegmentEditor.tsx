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
  Switch,
} from "@heroui/react";
import { Dice5, Plus, Share2 } from "lucide-react";
import React from "react";
import { Segment, materialSections } from "./Canvas";

export interface Hdri {
  key: string;
  name: string;
  file: string;
}

const availableHdris: Hdri[] = [
  {
    key: "kloppenheim_02",
    name: "Kloppenheim",
    file: "hdri/kloppenheim_02_1k.hdr",
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
    name: "Burnt Warehouse",
    file: "hdri/burnt_warehouse_2k.hdr",
  },
  {
    key: "cobblestone_street_night",
    name: "Cobblestone Street Night",
    file: "hdri/cobblestone_street_night_2k.hdr",
  },
  {
    key: "rainforest_trail",
    name: "Rainforest Trail",
    file: "hdri/rainforest_trail_2k.hdr",
  },
  {
    key: "rogland_moonlit_night",
    name: "Rogland Moonlit Night",
    file: "hdri/rogland_moonlit_night_2k.hdr",
  },
  {
    key: "rosendal_plains_2",
    name: "Rosenal Plains 2",
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
  thickness: number;
  onThicknessChange: (thickness: number) => void;
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
  thickness,
  onThicknessChange,
  onShare,
}) => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Controls</h4>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="text-lg font-bold">Wheels</h4>
        </CardHeader>
        <CardBody className="space-y-2">
          <div className="grid grid-cols-12 gap-2 px-1 text-sm font-mono text-gray-400">
            <div className="col-span-3">Length</div>
            <div className="col-span-6 text-center">Ratio</div>
            <div className="col-span-3">Axis</div>
          </div>
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <div className="col-span-3">
                <Input
                  type="number"
                  aria-label="Length"
                  size="sm"
                  value={String(segment.length)}
                  onValueChange={(val) =>
                    onUpdate(segment.id, { length: Number(val) })
                  }
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  aria-label="Numerator"
                  size="sm"
                  min="1"
                  value={String(segment.speed.num)}
                  onValueChange={(val) =>
                    onUpdate(segment.id, {
                      speed: { ...segment.speed, num: Number(val) },
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
                  value={String(segment.speed.den)}
                  onValueChange={(val) =>
                    onUpdate(segment.id, {
                      speed: { ...segment.speed, den: Number(val) },
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
          <Switch
            isSelected={gentleRotation}
            onValueChange={onGentleRotationChange}
          >
            Gentle Rotation
          </Switch>
          <Slider
            label="Thickness"
            minValue={0.01}
            maxValue={1.0}
            step={0.01}
            value={thickness}
            onChange={(val) => onThicknessChange(val as number)}
          />
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

            <label className="text-sm">Segments</label>
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.countMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, countMin: Number(val) }))
              }
            />
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.countMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, countMax: Number(val) }))
              }
            />

            <label className="text-sm">Length</label>
            <Input
              type="number"
              size="sm"
              value={String(randomizeConfig.lengthMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, lengthMin: Number(val) }))
              }
            />
            <Input
              type="number"
              size="sm"
              value={String(randomizeConfig.lengthMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, lengthMax: Number(val) }))
              }
            />

            <label className="text-sm">Numerator</label>
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.numMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, numMin: Number(val) }))
              }
            />
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.numMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, numMax: Number(val) }))
              }
            />

            <label className="text-sm">Denominator</label>
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.denMin)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, denMin: Number(val) }))
              }
            />
            <Input
              type="number"
              size="sm"
              min="1"
              value={String(randomizeConfig.denMax)}
              onValueChange={(val) =>
                setRandomizeConfig((c) => ({ ...c, denMax: Number(val) }))
              }
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SegmentEditor;
