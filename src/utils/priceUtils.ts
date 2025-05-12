import { PriceConfig } from '../types/priceConfig';

export const getItemPrice = (itemName: string, prices: PriceConfig): number => {
  switch (itemName) {
    case 'Петля 90 градусов':
    case 'Петля 90':
    case 'Петля 90°':
      return prices.hinge90;
    case 'Петля 180 градусов':
    case 'Петля 180':
    case 'Петля 180°':
      return prices.hinge180;
    case 'Петля 135 градусов':
    case 'Петля 135':
    case 'Петля 135°':
      return prices.hinge135;
    case 'Ручка':
    case 'Ручка-кнобка':
    case 'Ручка кноб':
      return prices.handleKnob;
    case 'Ручка-скоба малая':
    case 'Ручка скоба маленькая':
      return prices.handleBracketSmall;
    case 'Ручка-скоба большая':
    case 'Ручка скоба большая':
      return prices.handleBracketLarge;
    case 'Палка стена-стекло':
      return prices.mountingWall;
    case 'Крепление палка стена-стекло-стекло':
    case 'Крепление стекло-стекло':
      return prices.mountingWallGlassGlass;
    case 'Раздвижная система':
      return prices.slidingSystem;
    case 'Фиксатор':
      return prices.additionalRail;
    case 'Дополнительный профиль':
    case 'Профиль':
      return prices.profile8mm;
    case 'Профильная труба (рельса)':
      return prices.profileTube;
    case 'Крепление труба-стекло':
      return prices.mountingPipe;
    case 'Уголок труба-труба':
      return prices.mountingPipePipe;
    default:
      return 0;
  }
}; 