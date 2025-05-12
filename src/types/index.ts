export interface CustomHardwareItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface AdditionalHardware {
  customItems: CustomHardwareItem[];
}

export type Configuration = 'glass' | 'straight' | 'corner' | 'unique';

export interface Glass {
  id: string;
  color: string;
  thickness: string;
  height: string;
  width: string;
  name: string;
}

export type ProjectStatus = 'Рассчет' | 'Согласован' | 'Заказан' | 'Стекло доставлено' | 'Установка' | 'Установлено' | 'Оплачено';

export interface SavedConfiguration {
  id: string;
  customerName: string;
  configuration: Configuration;
  glassColor: string;
  glassThickness: string;
  glassHeight: string;
  glassWidth: string;
  hardwareColor: string;
  profileCount: number;
  totalPrice: number;
  status: ProjectStatus;
  comment: string;
  calculationDetails: string[];
  delivery: boolean;
  installation: boolean;
  createdAt: string;
  additionalHardware: AdditionalHardware;
  isOpeningSize: boolean;
  openingLength: string;
  openingHeight: string;
  additionalRail: boolean;
  doorWidth: string;
  glassType: 'stationary' | 'door';
  profileType: string;
  cornerLength: string;
  cornerWidth: string;
  glasses: Glass[];
}

export interface ShowerConfig {
  glassColor: string;
  glassThickness: string;
  glassHeight: string;
  glassWidth: string;
  hardwareColor: string;
  profileCount: number;
  comment: string;
  configuration: Configuration;
}

export const defaultAdditionalHardware: AdditionalHardware = {
  customItems: []
};

export interface PriceConfig {
  glassClear8mm: number;
  glassClear10mm: number;
  glassUltraClear8mm: number;
  glassUltraClear10mm: number;
  glassMatteSandblasted8mm: number;
  glassMatteSandblasted10mm: number;
  glassMatteFactory10mm: number;
  glassTinted8mm: number;
  glassTinted10mm: number;
  profile8mm: number;
  profile10mm: number;
  mountingGlass: number;
  mountingWall: number;
  mountingPipe: number;
  mountingPipePipe: number;
  slidingSystem: number;
  handleKnob: number;
  handleBracketSmall: number;
  handleBracketLarge: number;
  delivery: number;
  installationGlass: number;
  installationStraight: number;
  installationCorner: number;
  glassPrice: number;
  straightPrice: number;
  cornerPrice: number;
  additionalRail: number;
  profileTube: number;
  currency: 'BYN' | 'GEL';
  usdRate: number;
  showUsdPrice: boolean;
  hinge90: number;
  hinge180: number;
  hinge135: number;
  uniquePrice: number;
  installationUnique: number;
} 