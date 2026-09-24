// Модели данных (структура повторяет JSON с mafixture.ru)

export interface FixtureChannel {
  number: number;
  attribute: string;
}

export interface Fixture {
  name: string;
  channels: FixtureChannel[];
}

export interface ChannelOption {
  ma2: string;   // значение в данных grandMA2 (например "PAN")
  label: string; // человекочитаемое имя (например "Pan")
}

export interface ChannelSelection {
  number: number;
  option: ChannelOption;
  inverted: boolean;
}

export interface SavedFixture {
  name: string;
  channels: FixtureChannel[];
  savedAt: number; // unix ms
}

export interface SearchRecord {
  id: string;
  channelCount: number;
  selections: ChannelSelection[];
  found: number;
  date: number; // unix ms
}

export const CHANNEL_OPTIONS: ChannelOption[] = [
  { ma2: 'ANY', label: 'ANY' },
  { ma2: 'DIM', label: 'Dimmer' },
  { ma2: 'SHUTTER', label: 'Shutter/Strobe' },
  { ma2: 'COLORRGB1', label: 'Red' },
  { ma2: 'COLORRGB2', label: 'Green' },
  { ma2: 'COLORRGB3', label: 'Blue' },
  { ma2: 'COLORRGB4', label: 'Amber' },
  { ma2: 'COLORRGB5', label: 'White' },
  { ma2: 'COLORRGB15', label: 'UV' },
  { ma2: 'COLOR1', label: 'Color Wheel' },
  { ma2: 'CTO', label: 'CTO' },
  { ma2: 'CTB', label: 'CTB' },
  { ma2: 'EFFECTMACRO', label: 'Macro' },
  { ma2: 'PAN', label: 'Pan' },
  { ma2: 'PAN (fine)', label: 'Pan (fine)' },
  { ma2: 'TILT', label: 'Tilt' },
  { ma2: 'TILT (fine)', label: 'Tilt (fine)' },
  { ma2: 'GOBO1', label: 'Gobo1' },
  { ma2: 'GOBO1_POS', label: 'Gobo1 <>' },
  { ma2: 'GOBO2', label: 'Gobo2' },
  { ma2: 'GOBO2_POS', label: 'Gobo2 <>' },
  { ma2: 'EFFECTWHEEL', label: 'Effect' },
  { ma2: 'EFFECTINDEXROTATE', label: 'Effect <>' },
  { ma2: 'FROST', label: 'Frost' },
  { ma2: 'ZOOM', label: 'Zoom' },
  { ma2: 'FOCUS', label: 'Focus' },
  { ma2: 'CONTROLRANGE', label: 'Reset' },
  { ma2: 'POSITIONMSPEED', label: 'PT Speed' },
];

export const ANY_OPTION = CHANNEL_OPTIONS[0];
export const MA_VERSION = '3.9.61.5';
export const TOTAL_FIXTURES = 35410;
export const MAX_CHANNELS = 64;