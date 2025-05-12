export type GlassType = {
  name: string;
  color: string;
  thickness: number;
  width: number;
  height: number;
};

export type HardwareItem = {
  name: string;
  color: string;
  price: number;
  quantity: number;
};

export type CabinetConfiguration = {
  glass: GlassType;
  hardware: HardwareItem[];
};

export type CabinetType = 'glass' | 'straight' | 'corner';

export type CabinetConfig = {
  status: string;
  name: string;
  type: CabinetType;
  configuration: CabinetConfiguration;
};

export type DefaultHardwareConfig = {
  [key in CabinetType]: HardwareItem[];
}; 