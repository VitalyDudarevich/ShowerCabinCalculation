import { CabinetConfig, CabinetType, GlassType, HardwareItem } from '../types/cabinet';
import { defaultHardwareConfig } from './defaultHardware';

export const createDefaultCabinetConfig = (
  type: CabinetType,
  name: string,
  glass: GlassType
): CabinetConfig => {
  return {
    status: 'active',
    name,
    type,
    configuration: {
      glass,
      hardware: [...defaultHardwareConfig[type]]
    }
  };
};

export const addHardware = (
  config: CabinetConfig,
  hardware: HardwareItem
): CabinetConfig => {
  return {
    ...config,
    configuration: {
      ...config.configuration,
      hardware: [...config.configuration.hardware, hardware]
    }
  };
};

export const updateHardwareColor = (
  config: CabinetConfig,
  hardwareIndex: number,
  color: string
): CabinetConfig => {
  const updatedHardware = [...config.configuration.hardware];
  updatedHardware[hardwareIndex] = {
    ...updatedHardware[hardwareIndex],
    color
  };

  return {
    ...config,
    configuration: {
      ...config.configuration,
      hardware: updatedHardware
    }
  };
}; 