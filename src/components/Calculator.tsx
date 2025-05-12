import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  SelectChangeEvent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Snackbar,
  Alert,
  Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { calculatorStyles } from '../styles/calculatorStyles';

interface PriceConfig {
  glassClear8mm: number;
  glassClear10mm: number;
  glassTinted8mm: number;
  glassTinted10mm: number;
  profileChrome8mm: number;
  profileMatte10mm: number;
  profileBlack: number;
  profileGold: number;
  mountingWallGlass: number;
  mountingWallGlassGlass: number;
  slidingChrome: number;
  slidingMatte: number;
  slidingBlack: number;
  slidingGold: number;
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
  uniquePrice: number;
  additionalRail: number;
  profileTube: number;
  glassUltraClear8mm: number;
  glassUltraClear10mm: number;
  glassMatteSandblasted8mm: number;
  glassMatteSandblasted10mm: number;
  glassMatteFactory10mm: number;
  hinge90: number;
  hinge180: number;
  hinge135: number;
  currency: string;
  usdRate: number;
  showUsdPrice: boolean;
  installationUnique: number;
  profile8mm: number;
  profile10mm: number;
}

type ProjectStatus = 'Рассчет' | 'Согласован' | 'Заказан' | 'Стекло доставлено' | 'Установка' | 'Установлено' | 'Оплачено';

interface SavedConfiguration {
  id: string;
  customerName: string;
  configuration: string;
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

interface ShowerConfig {
  glassColor: string;
  glassThickness: string;
  glassHeight: string;
  glassWidth: string;
  hardwareColor: string;
  profileCount: number;
  comment: string;
  configuration: string;
}

interface CustomHardwareItem {
  id: string;
  name: string;
  count: number;
}

interface AdditionalHardware {
  customItems: CustomHardwareItem[];
}

const defaultConfig: ShowerConfig = {
  glassColor: 'Прозрачное',
  glassThickness: '8',
  glassHeight: '',
  glassWidth: '',
  hardwareColor: 'Хром',
  profileCount: 0,
  comment: '',
  configuration: ''
};

type GlassType = 'clear' | 'ultra-clear' | 'matte-sandblasted' | 'matte-factory' | 'bronze' | 'graphite-rus' | 'graphite-iran';
type GlassThickness = '8' | '10';

const GLASS_TYPES = {
  CLEAR: 'clear',
  ULTRA_CLEAR: 'ultra_clear',
  MATTE_SANDBLASTED: 'matte_sandblasted',
  MATTE_FACTORY: 'matte_factory',
  BRONZE: 'bronze',
  GRAPHITE_RUS: 'graphite_rus',
  GRAPHITE_IRAN: 'graphite_iran'
} as const;

const GLASS_THICKNESS = {
  EIGHT: 8,
  TEN: 10
} as const;

const GLASS_TYPE_TEXT = {
  [GLASS_TYPES.CLEAR]: 'прозрачное',
  [GLASS_TYPES.ULTRA_CLEAR]: 'ультра прозрачное',
  [GLASS_TYPES.MATTE_SANDBLASTED]: 'матовое пескоструй',
  [GLASS_TYPES.MATTE_FACTORY]: 'матовое заводское',
  [GLASS_TYPES.BRONZE]: 'бронза',
  [GLASS_TYPES.GRAPHITE_RUS]: 'графит рус',
  [GLASS_TYPES.GRAPHITE_IRAN]: 'графит иран'
} as const;

interface Glass {
  id: string;
  color: string;
  thickness: string;
  height: string;
  width: string;
  name: string;
}

const HARDWARE_ITEMS: string[] = [];

const Calculator: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [configuration, setConfiguration] = useState<string>('');
  const [glasses, setGlasses] = useState<Glass[]>([{
    id: '1',
    color: GLASS_TYPES.CLEAR,
    thickness: GLASS_THICKNESS.EIGHT.toString(),
    height: '',
    width: '',
    name: 'Стекло 1'
  }]);
  const [hardwareColor, setHardwareColor] = useState<string>('');
  const [profileCount, setProfileCount] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [delivery, setDelivery] = useState<boolean>(true);
  const [installation, setInstallation] = useState<boolean>(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [status, setStatus] = useState<ProjectStatus>('Рассчет');
  const [calculationDetails, setCalculationDetails] = useState<string[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hardwareChanged, setHardwareChanged] = useState<boolean>(false);
  const [prices, setPrices] = useState<PriceConfig>({
    glassClear8mm: 0,
    glassClear10mm: 0,
    glassTinted8mm: 0,
    glassTinted10mm: 0,
    profileChrome8mm: 0,
    profileMatte10mm: 0,
    profileBlack: 0,
    profileGold: 0,
    mountingWallGlass: 0,
    mountingWallGlassGlass: 0,
    slidingChrome: 0,
    slidingMatte: 0,
    slidingBlack: 0,
    slidingGold: 0,
    handleKnob: 0,
    handleBracketSmall: 0,
    handleBracketLarge: 0,
    delivery: 0,
    installationGlass: 0,
    installationStraight: 0,
    installationCorner: 0,
    glassPrice: 0,
    straightPrice: 0,
    cornerPrice: 0,
    uniquePrice: 0,
    additionalRail: 0,
    profileTube: 0,
    glassUltraClear8mm: 0,
    glassUltraClear10mm: 0,
    glassMatteSandblasted8mm: 0,
    glassMatteSandblasted10mm: 0,
    glassMatteFactory10mm: 0,
    hinge90: 0,
    hinge180: 0,
    hinge135: 0,
    currency: 'BYN',
    usdRate: 1,
    showUsdPrice: false,
    installationUnique: 0,
    profile8mm: 0,
    profile10mm: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [priceChanged, setPriceChanged] = useState<boolean>(false);
  const [changedDetails, setChangedDetails] = useState<{ [key: string]: boolean }>({});
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<ProjectStatus>('Рассчет');
  const [config, setConfig] = useState<ShowerConfig>(defaultConfig);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [glassType, setGlassType] = useState<'stationary' | 'door'>('stationary');
  const [doorWidth, setDoorWidth] = useState<string>('');
  const [isOpeningSize, setIsOpeningSize] = useState<boolean>(true);
  const [openingLength, setOpeningLength] = useState<string>('');
  const [openingHeight, setOpeningHeight] = useState<string>('');
  const [additionalRail, setAdditionalRail] = useState<boolean>(false);
  const [profileType, setProfileType] = useState<string>('');
  const [previousValues, setPreviousValues] = useState({
    glassColor: '',
    glassThickness: '',
    hardwareColor: '',
    profileCount: 0,
    glassHeight: '',
    glassWidth: '',
  });
  const [cornerLength, setCornerLength] = useState<string>('');
  const [cornerWidth, setCornerWidth] = useState<string>('');
  const [currency, setCurrency] = useState<'BYN' | 'GEL'>(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    return (savedCurrency as 'BYN' | 'GEL') || 'BYN';
  });
  const [usdRate, setUsdRate] = useState<number>(1);
  const [additionalHardware, setAdditionalHardware] = useState<AdditionalHardware>({
    customItems: []
  });
  const [openHardwareDialog, setOpenHardwareDialog] = useState(false);
  const [newHardwareName, setNewHardwareName] = useState<string>('');
  const [newHardwareCount, setNewHardwareCount] = useState<number>(1);
  const [hardwareDialogChanged, setHardwareDialogChanged] = useState(false);
  const [initialHardwareState, setInitialHardwareState] = useState<AdditionalHardware>({ customItems: [] });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Сохраняем состояние калькулятора при изменении
  useEffect(() => {
    const saveState = () => {
      const calculatorState = {
        customerName,
        configuration,
        glasses,
        hardwareColor,
        profileCount,
        comment,
        delivery,
        installation,
        isOpeningSize,
        openingLength,
        openingHeight,
        additionalRail,
        doorWidth,
        status,
        totalPrice,
        calculationDetails,
        editingId,
        priceChanged,
        changedDetails,
        originalPrice,
        originalStatus,
        glassType,
        profileType
      };
      localStorage.setItem('calculatorState', JSON.stringify(calculatorState));
    };

    // Сохраняем при изменении любого из полей
    saveState();

    // Сохраняем при размонтировании компонента
    return () => {
      saveState();
    };
  }, [
    customerName,
    configuration,
    glasses,
    hardwareColor,
    profileCount,
    comment,
    delivery,
    installation,
    isOpeningSize,
    openingLength,
    openingHeight,
    additionalRail,
    doorWidth,
    status,
    totalPrice,
    calculationDetails,
    editingId,
    priceChanged,
    changedDetails,
    originalPrice,
    originalStatus,
    glassType,
    profileType
  ]);

  // Восстанавливаем состояние калькулятора при загрузке
  useEffect(() => {
    const loadState = () => {
      const savedPrices = localStorage.getItem('showerPrices');
      if (savedPrices) {
        const parsedPrices = JSON.parse(savedPrices);
        console.log('Loaded prices:', parsedPrices);
        setPrices(parsedPrices);
        setCurrency(parsedPrices.currency || 'BYN');
        setUsdRate(parsedPrices.usdRate || 1);
      } else {
        console.error('No prices found in localStorage');
      }

      // Загружаем сохраненные конфигурации
      const savedConfigurations = localStorage.getItem('savedConfigs');
      if (savedConfigurations) {
        const parsedConfigs = JSON.parse(savedConfigurations);
        console.log('Loaded saved configurations:', parsedConfigs);
        setSavedConfigs(parsedConfigs);
      }

      // Восстанавливаем состояние калькулятора
      const savedCalculatorState = localStorage.getItem('calculatorState');
      if (savedCalculatorState) {
        const state = JSON.parse(savedCalculatorState);
        setCustomerName(state.customerName || '');
        setConfiguration(state.configuration || '');
        setGlasses(state.glasses || [{
          id: '1',
          color: GLASS_TYPES.CLEAR,
          thickness: GLASS_THICKNESS.EIGHT.toString(),
          height: '',
          width: '',
          name: 'Стекло 1'
        }]);
        setHardwareColor(state.hardwareColor || '');
        setProfileCount(state.profileCount || 0);
        setComment(state.comment || '');
        setDelivery(state.delivery !== undefined ? state.delivery : true);
        setInstallation(state.installation !== undefined ? state.installation : true);
        setIsOpeningSize(state.isOpeningSize !== undefined ? state.isOpeningSize : true);
        setOpeningLength(state.openingLength || '');
        setOpeningHeight(state.openingHeight || '');
        setAdditionalRail(state.additionalRail || false);
        setDoorWidth(state.doorWidth || '');
        setStatus(state.status || 'Рассчет');
        setTotalPrice(state.totalPrice || 0);
        setCalculationDetails(state.calculationDetails || []);
        setEditingId(state.editingId || null);
        setPriceChanged(state.priceChanged || false);
        setChangedDetails(state.changedDetails || {});
        setOriginalPrice(state.originalPrice || 0);
        setOriginalStatus(state.originalStatus || 'Рассчет');
        setGlassType(state.glassType || 'stationary');
        setProfileType(state.profileType || '');
      }
    };

    // Загружаем состояние при монтировании
    loadState();

    // Добавляем обработчик видимости страницы
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Добавляем обработчик перед уходом со страницы
  useEffect(() => {
    const handleBeforeUnload = () => {
      const calculatorState = {
        customerName,
        configuration,
        glasses,
        hardwareColor,
        profileCount,
        comment,
        delivery,
        installation,
        isOpeningSize,
        openingLength,
        openingHeight,
        additionalRail,
        doorWidth,
        status,
        totalPrice,
        calculationDetails,
        editingId,
        priceChanged,
        changedDetails,
        originalPrice,
        originalStatus,
        glassType,
        profileType
      };
      localStorage.setItem('calculatorState', JSON.stringify(calculatorState));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    customerName,
    configuration,
    glasses,
    hardwareColor,
    profileCount,
    comment,
    delivery,
    installation,
    isOpeningSize,
    openingLength,
    openingHeight,
    additionalRail,
    doorWidth,
    status,
    totalPrice,
    calculationDetails,
    editingId,
    priceChanged,
    changedDetails,
    originalPrice,
    originalStatus,
    glassType,
    profileType
  ]);

  // Добавляем эффект для сохранения выбранной валюты
  useEffect(() => {
    localStorage.setItem('selectedCurrency', currency);
  }, [currency]);

  const calculatePrice = () => {
    let total = 0;
    const details: string[] = [];

    // Если конфигурация не выбрана, не производим расчет
    if (!configuration) {
      setCalculationDetails(details);
      setTotalPrice(total);
      return;
    }

    if (configuration === 'unique') {
      // Расчет стоимости для каждого стекла
      glasses.forEach((glass) => {
        if (glass.height && glass.width && parseFloat(glass.height) > 0 && parseFloat(glass.width) > 0) {
          const glassArea = (parseFloat(glass.height) * parseFloat(glass.width)) / 1000000; // конвертация в м²
          let glassPrice = 0;

          if (glass.color === GLASS_TYPES.CLEAR) {
            glassPrice = parseFloat(glass.thickness) === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm;
          } else if (glass.color === GLASS_TYPES.ULTRA_CLEAR) {
            glassPrice = parseFloat(glass.thickness) === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm;
          } else if (glass.color === GLASS_TYPES.MATTE_SANDBLASTED) {
            glassPrice = parseFloat(glass.thickness) === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm;
          } else if (glass.color === GLASS_TYPES.MATTE_FACTORY) {
            glassPrice = prices.glassMatteFactory10mm;
          } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glass.color as any)) {
            glassPrice = parseFloat(glass.thickness) === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm;
          }

          const glassCost = glassPrice * glassArea;
          total += glassCost;
          const glassTypeText = GLASS_TYPE_TEXT[glass.color as keyof typeof GLASS_TYPE_TEXT] || 'тонированное';
          details.push(`${glass.name}: ${glassTypeText} ${glass.thickness} мм (${glassArea.toFixed(2)} м²): ${glassCost.toFixed(2)} ₾`);
        }
      });
    } else if (configuration === 'glass') {
      // Расчет для стекляшки
      if (glasses[0].height && glasses[0].width) {
        const glassArea = (parseFloat(glasses[0].height) * parseFloat(glasses[0].width)) / 1000000;
        let glassPrice = 0;

        if (glasses[0].color === GLASS_TYPES.CLEAR) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm;
        } else if (glasses[0].color === GLASS_TYPES.ULTRA_CLEAR) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm;
        } else if (glasses[0].color === GLASS_TYPES.MATTE_SANDBLASTED) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm;
        } else if (glasses[0].color === GLASS_TYPES.MATTE_FACTORY) {
          glassPrice = prices.glassMatteFactory10mm;
        } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glasses[0].color as any)) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm;
        }

        const glassCost = glassPrice * glassArea;
        total += glassCost;
        details.push(`Стекло ${GLASS_TYPE_TEXT[glasses[0].color as keyof typeof GLASS_TYPE_TEXT] || 'тонированное'} ${glasses[0].thickness} мм (${glassArea.toFixed(2)} м²): ${glassCost.toFixed(2)} ₾`);
      }
    } else if (configuration === 'straight') {
      // Расчет для прямой раздвижной
      if (isOpeningSize) {
        if (openingLength && openingHeight) {
          const adjustedLength = parseFloat(openingLength) + 30; // Добавляем 30 мм к ширине проема
          const glassArea = (adjustedLength * parseFloat(openingHeight)) / 1000000; // конвертация в м²
          const glassTypeText = GLASS_TYPE_TEXT[glasses[0].color as keyof typeof GLASS_TYPE_TEXT] || 'тонированное';
          let glassPrice = 0;

          if (glasses[0].color === GLASS_TYPES.CLEAR) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm;
          } else if (glasses[0].color === GLASS_TYPES.ULTRA_CLEAR) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm;
          } else if (glasses[0].color === GLASS_TYPES.MATTE_SANDBLASTED) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm;
          } else if (glasses[0].color === GLASS_TYPES.MATTE_FACTORY) {
            glassPrice = prices.glassMatteFactory10mm;
          } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glasses[0].color as any)) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm;
          }

          const glassCost = glassPrice * glassArea;
          total += glassCost;
          details.push(`Стекло ${glassTypeText} ${glasses[0].thickness} мм (${glassArea.toFixed(2)} м²): ${glassCost.toFixed(2)} ₾`);
        }
      } else {
        if (glasses[0].height && glasses[0].width && doorWidth) {
          const stationaryArea = (parseFloat(glasses[0].height) * parseFloat(glasses[0].width)) / 1000000;
          const doorArea = (parseFloat(glasses[0].height) * parseFloat(doorWidth)) / 1000000;
          const totalArea = stationaryArea + doorArea;
          const glassTypeText = GLASS_TYPE_TEXT[glasses[0].color as keyof typeof GLASS_TYPE_TEXT] || 'тонированное';
          let glassPrice = 0;

          if (glasses[0].color === GLASS_TYPES.CLEAR) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm;
          } else if (glasses[0].color === GLASS_TYPES.ULTRA_CLEAR) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm;
          } else if (glasses[0].color === GLASS_TYPES.MATTE_SANDBLASTED) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm;
          } else if (glasses[0].color === GLASS_TYPES.MATTE_FACTORY) {
            glassPrice = prices.glassMatteFactory10mm;
          } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glasses[0].color as any)) {
            glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm;
          }

          const glassCost = glassPrice * totalArea;
          total += glassCost;
          details.push(`Стекло ${glassTypeText} ${glasses[0].thickness} мм (${totalArea.toFixed(2)} м²): ${glassCost.toFixed(2)} ₾`);
        }
      }
    } else if (configuration === 'corner') {
      // Расчет для угловой раздвижной
      if (cornerLength && cornerWidth && glasses[0].height) {
        // Площадь первой стены (длина * высота)
        const firstWallArea = (parseFloat(cornerLength) * parseFloat(glasses[0].height)) / 1000000;
        // Площадь второй стены (ширина * высота)
        const secondWallArea = (parseFloat(cornerWidth) * parseFloat(glasses[0].height)) / 1000000;
        // Общая площадь стекла
        const totalGlassArea = firstWallArea + secondWallArea;
        const glassTypeText = GLASS_TYPE_TEXT[glasses[0].color as keyof typeof GLASS_TYPE_TEXT] || 'тонированное';
        let glassPrice = 0;

        if (glasses[0].color === GLASS_TYPES.CLEAR) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm;
        } else if (glasses[0].color === GLASS_TYPES.ULTRA_CLEAR) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm;
        } else if (glasses[0].color === GLASS_TYPES.MATTE_SANDBLASTED) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm;
        } else if (glasses[0].color === GLASS_TYPES.MATTE_FACTORY) {
          glassPrice = prices.glassMatteFactory10mm;
        } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glasses[0].color as any)) {
          glassPrice = parseFloat(glasses[0].thickness) === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm;
        }

        const glassCost = glassPrice * totalGlassArea;
        total += glassCost;
        details.push(`Стекло ${glassTypeText} ${glasses[0].thickness} мм (${totalGlassArea.toFixed(2)} м²): ${glassCost.toFixed(2)} ₾`);
      }
    }

    // Расчет стоимости профиля только если выбран цвет фурнитуры
    if (hardwareColor && profileCount > 0) {
      const glassThickness = parseFloat(glasses[0].thickness);
      const profilePrice = glassThickness === 8 ? prices.profile8mm : prices.profile10mm;
      const profileCost = profilePrice * profileCount;
      total += profileCost;
      
      // Определяем название цвета профиля
      let profileColorName = '';
      switch (hardwareColor) {
        case 'chrome':
          profileColorName = 'Хром';
          break;
        case 'matte':
          profileColorName = 'Матовый';
          break;
        case 'black':
          profileColorName = 'Черный';
          break;
        case 'gold':
          profileColorName = 'Золотой';
          break;
      }
      
      details.push(`Профиль ${profileColorName} ${glassThickness} мм (${profileCount} шт.): ${profileCost.toFixed(2)} ${prices.currency}`);
    }

    // Расчет стоимости дополнительной фурнитуры
    for (const item of additionalHardware.customItems) {
      let itemPrice = 0;
      
      if (item.name === 'Профиль') {
        const glassThickness = parseFloat(glasses[0].thickness);
        const profilePrice = glassThickness === 8 ? prices.profile8mm : prices.profile10mm;
        itemPrice = profilePrice * item.count;
        total += itemPrice;
        
        // Определяем название цвета профиля
        let profileColorName = '';
        switch (hardwareColor) {
          case 'chrome':
            profileColorName = 'Хром';
            break;
          case 'matte':
            profileColorName = 'Матовый';
            break;
          case 'black':
            profileColorName = 'Черный';
            break;
          case 'gold':
            profileColorName = 'Золотой';
            break;
        }
        
        details.push(`Профиль ${profileColorName} ${glassThickness} мм (${item.count} шт.): ${itemPrice.toFixed(2)} ${prices.currency}`);
        continue;
      }

      if (item.name.includes('Петля 90 градусов')) {
        itemPrice = prices.hinge90 * item.count;
      } else if (item.name.includes('Петля 180 градусов')) {
        itemPrice = prices.hinge180 * item.count;
      } else if (item.name.includes('Петля 135 градусов')) {
        itemPrice = prices.hinge135 * item.count;
      } else if (item.name.includes('Ручка')) {
        itemPrice = prices.handleKnob * item.count;
      } else if (item.name.includes('Крепление палка стена-стекло')) {
        itemPrice = prices.mountingWallGlass * item.count;
      } else if (item.name.includes('Крепление палка стена-стекло-стекло')) {
        itemPrice = prices.mountingWallGlassGlass * item.count;
      } else if (item.name.includes('Раздвижная система')) {
        if (hardwareColor === 'chrome') {
          itemPrice = prices.slidingChrome * item.count;
        } else if (hardwareColor === 'matte') {
          itemPrice = prices.slidingMatte * item.count;
        } else if (hardwareColor === 'black') {
          itemPrice = prices.slidingBlack * item.count;
        } else if (hardwareColor === 'gold') {
          itemPrice = prices.slidingGold * item.count;
        }
      } else if (item.name.includes('Дополнительная направляющая')) {
        itemPrice = prices.additionalRail * item.count;
      } else if (item.name.includes('Дополнительный профиль')) {
        itemPrice = prices.profileTube * item.count;
      }
      
      total += itemPrice;
      details.push(`${item.name} (${item.count} шт.): ${itemPrice.toFixed(2)} ${prices.currency}`);
    }

    // Стоимость доставки
    if (delivery) {
      total += prices.delivery;
      details.push(`Доставка: ${prices.delivery} ${prices.currency}`);
    }

    // Стоимость монтажа
    if (installation) {
      if (configuration === 'glass') {
        total += prices.installationGlass;
        details.push(`Монтаж стекла: ${prices.installationGlass} ${prices.currency}`);
      } else if (configuration === 'straight') {
        total += prices.installationStraight;
        details.push(`Монтаж прямой раздвижной: ${prices.installationStraight} ${prices.currency}`);
      } else if (configuration === 'corner') {
        total += prices.installationCorner;
        details.push(`Монтаж угловой раздвижной: ${prices.installationCorner} ${prices.currency}`);
      } else if (configuration === 'unique') {
        total += prices.installationUnique;
        details.push(`Установка: ${prices.installationUnique} ${prices.currency}`);
      }
    }

    // Добавляем базовую стоимость в конец
    if (configuration === 'glass') {
      total += prices.glassPrice;
      details.push(`Базовая стоимость: ${prices.glassPrice} ${prices.currency}`);
    } else if (configuration === 'straight') {
      total += prices.straightPrice;
      details.push(`Базовая стоимость: ${prices.straightPrice} ${prices.currency}`);
    } else if (configuration === 'corner') {
      total += prices.cornerPrice;
      details.push(`Базовая стоимость: ${prices.cornerPrice} ${prices.currency}`);
    } else if (configuration === 'unique') {
      total += prices.uniquePrice;
      details.push(`Базовая стоимость: ${prices.uniquePrice} ${prices.currency}`);
    }

    setCalculationDetails(details);
    setTotalPrice(total);
  };

  // Обработчики событий для стекла
  const handleGlassColorChange = (id: string) => (event: SelectChangeEvent<string>) => {
    updateGlass(id, 'color', event.target.value);
    setErrors(prev => ({ ...prev, glassColor: '' }));
  };

  const handleGlassThicknessChange = (id: string) => (event: SelectChangeEvent<string>) => {
    updateGlass(id, 'thickness', event.target.value);
    setErrors(prev => ({ ...prev, glassThickness: '' }));
  };

  const handleGlassHeightChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || (/^\d{0,4}$/.test(value) && parseInt(value) <= 5000)) {
      updateGlass(id, 'height', value);
      setErrors(prev => ({ ...prev, glassHeight: '' }));
      if (configuration === 'unique') {
        setTimeout(() => calculatePrice(), 0);
      }
    }
  };

  const handleGlassWidthChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || (/^\d{0,4}$/.test(value) && parseInt(value) <= 5000)) {
      updateGlass(id, 'width', value);
      setErrors(prev => ({ ...prev, glassWidth: '' }));
      if (configuration === 'unique') {
        setTimeout(() => calculatePrice(), 0);
      }
    }
  };

  const handleGlassNameChange = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateGlass(id, 'name', event.target.value);
    if (configuration === 'unique') {
      setTimeout(() => calculatePrice(), 0);
    }
  };

  const handleProfileCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 9) {
      setProfileCount(value);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [glasses[0].height, glasses[0].width, glasses[0].thickness, glasses[0].color, hardwareColor, profileCount, configuration, prices, delivery, installation, isOpeningSize, openingLength, openingHeight, additionalRail, glassType, profileType]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Общие проверки для всех конфигураций
    if (!customerName.trim()) {
      newErrors.customerName = 'Введите название проекта';
    }
    
    if (!configuration) {
      newErrors.configuration = 'Выберите конфигурацию';
    }

    // Проверки для всех конфигураций
    if (configuration) {
      if (!glasses[0].color) newErrors.glassColor = 'Выберите цвет стекла';
      if (!glasses[0].thickness) newErrors.glassThickness = 'Выберите толщину стекла';
      if (!hardwareColor) newErrors.hardwareColor = 'Выберите цвет фурнитуры';
      if (profileCount < 0 || profileCount > 9) newErrors.profileCount = 'Количество профиля должно быть от 0 до 9';
    }

    // Проверки для прямой раздвижной
    if (configuration === 'straight') {
      if (isOpeningSize) {
        if (!openingLength || parseFloat(openingLength) < 10) {
          newErrors.openingLength = 'Ширина проема должна быть не менее 10 мм';
        }
        if (!openingHeight || parseFloat(openingHeight) < 10) {
          newErrors.openingHeight = 'Высота кабины должна быть не менее 10 мм';
        }
      } else {
        if (!glasses[0].height || parseFloat(glasses[0].height) < 10) {
          newErrors.glassHeight = 'Высота должна быть не менее 10 мм';
        }
        if (!glasses[0].width || parseFloat(glasses[0].width) < 10) {
          newErrors.glassWidth = 'Ширина должна быть не менее 10 мм';
        }
        if (!doorWidth || parseFloat(doorWidth) < 10) {
          newErrors.doorWidth = 'Ширина двери должна быть не менее 10 мм';
        }
      }
    }

    // Проверки для угловой раздвижной
    if (configuration === 'corner') {
      if (!cornerLength || parseFloat(cornerLength) < 10) {
        newErrors.cornerLength = 'Длина должна быть не менее 10 мм';
      }
      if (!cornerWidth || parseFloat(cornerWidth) < 10) {
        newErrors.cornerWidth = 'Ширина должна быть не менее 10 мм';
      }
      if (!glasses[0].height || parseFloat(glasses[0].height) < 10) {
        newErrors.glassHeight = 'Высота должна быть не менее 10 мм';
      }
    }
    
    // Проверки для уникальной конфигурации
    if (configuration === 'unique') {
      glasses.forEach((glass, index) => {
        if (!glass.color) {
          newErrors[`glassColor_${glass.id}`] = 'Выберите цвет стекла';
        }
        if (!glass.thickness) {
          newErrors[`glassThickness_${glass.id}`] = 'Выберите толщину стекла';
        }
        if (!glass.height || parseFloat(glass.height) < 10) {
          newErrors[`glassHeight_${glass.id}`] = 'Высота должна быть не менее 10 мм';
        }
        if (!glass.width || parseFloat(glass.width) < 10) {
          newErrors[`glassWidth_${glass.id}`] = 'Ширина должна быть не менее 10 мм';
        }
        if (!glass.name.trim()) {
          newErrors[`glassName_${glass.id}`] = 'Введите название стекла';
        }
      });
    }
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      setShowSuccessMessage(false);
      return;
    }

    const savedConfigs = JSON.parse(localStorage.getItem('savedConfigs') || '[]');
    const isDuplicate = savedConfigs.some((config: SavedConfiguration) => 
      config.customerName.toLowerCase() === customerName.toLowerCase() && 
      config.id !== editingId
    );

    if (isDuplicate) {
      setErrors(prev => ({
        ...prev,
        customerName: 'Проект с таким названием уже существует'
      }));
      return;
    }

    const newConfig: SavedConfiguration = {
      id: editingId || Date.now().toString(),
      customerName,
      configuration,
      glassColor: glasses[0].color,
      glassThickness: glasses[0].thickness,
      glassHeight: glasses[0].height,
      glassWidth: glasses[0].width,
      hardwareColor,
      profileCount: Number(profileCount),
      totalPrice,
      status: status as ProjectStatus,
      comment,
      calculationDetails,
      delivery,
      installation,
      createdAt: new Date().toISOString(),
      additionalHardware,
      isOpeningSize,
      openingLength,
      openingHeight,
      additionalRail,
      doorWidth,
      glassType,
      profileType,
      cornerLength: configuration === 'corner' ? cornerLength : '',
      cornerWidth: configuration === 'corner' ? cornerWidth : '',
      glasses: configuration === 'unique' ? glasses : [glasses[0]]
    };

    console.log('Saving configuration:', newConfig);

    const existingIndex = savedConfigs.findIndex((config: SavedConfiguration) => config.id === newConfig.id);

    if (existingIndex !== -1) {
      savedConfigs[existingIndex] = newConfig;
    } else {
      savedConfigs.push(newConfig);
    }

    try {
      localStorage.setItem('savedConfigs', JSON.stringify(savedConfigs));
      console.log('Successfully saved to localStorage');
      setSavedConfigs(savedConfigs);
      setEditingId(null);
      setPriceChanged(false);
      setChangedDetails({});
      setHardwareChanged(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    // Очищаем все поля после успешного сохранения
    setCustomerName('');
    setConfiguration('');
    setGlasses([{
      id: '1',
      color: GLASS_TYPES.CLEAR,
      thickness: GLASS_THICKNESS.EIGHT.toString(),
      height: '',
      width: '',
      name: 'Стекло 1'
    }]);
    setHardwareColor('');
    setProfileCount(0);
    setComment('');
    setErrors({});
    setCalculationDetails([]);
    setTotalPrice(0);
    setOriginalPrice(0);
    setStatus('Рассчет');
    setOriginalStatus('Рассчет');
    setGlassType('stationary');
    setProfileType('');
    setIsOpeningSize(true);
    setOpeningLength('');
    setOpeningHeight('');
    setAdditionalRail(false);
    setDoorWidth('');
    setCornerLength('');
    setCornerWidth('');
    setAdditionalHardware({ customItems: [] });
    setDelivery(true);
    setInstallation(true);
    localStorage.removeItem('calculatorState');
  };

  const handleEdit = (config: SavedConfiguration) => {
    setCustomerName(config.customerName);
    setConfiguration(config.configuration);
    setGlasses([{
      id: '1',
      color: config.glassColor,
      thickness: config.glassThickness,
      height: config.glassHeight,
      width: config.glassWidth,
      name: config.glassColor
    }]);
    setHardwareColor(config.hardwareColor);
    setTotalPrice(config.totalPrice);
    setOriginalPrice(config.totalPrice);
    setStatus(config.status as ProjectStatus);
    setProfileCount(config.profileCount);
    setComment(config.comment);
    setCalculationDetails(config.calculationDetails);
    setEditingId(config.id);
    setPriceChanged(false);
    setChangedDetails({});
    setDelivery(config.delivery);
    setInstallation(config.installation);
    setIsOpeningSize(config.isOpeningSize ?? true);
    setOpeningLength(config.openingLength || '');
    setOpeningHeight(config.openingHeight || '');
    setAdditionalRail(config.additionalRail || false);
    setDoorWidth(config.doorWidth || '');
    setGlassType(config.glassType || 'stationary');
    setProfileType(config.profileType || '');
    setAdditionalHardware(config.additionalHardware || { customItems: [] });
    
    if (config.configuration === 'corner') {
      setCornerLength(config.cornerLength || '');
      setCornerWidth(config.cornerWidth || '');
    }
  };

  const handleDelete = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('savedConfigs', JSON.stringify(updatedConfigs));
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as ProjectStatus;
    setStatus(newStatus);
    if (editingId) {
      const updatedConfigs = savedConfigs.map(config => 
        config.id === editingId ? { ...config, status: newStatus } : config
      );
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('savedConfigs', JSON.stringify(updatedConfigs));
    }
  };

  const handleSaveDialogClose = () => {
    setOpenSaveDialog(false);
  };

  const handleConfigurationChange = (event: SelectChangeEvent) => {
    const newConfig = event.target.value;
    setConfiguration(newConfig);
    
    if (newConfig === 'unique') {
      setGlasses([{
        id: '1',
        color: GLASS_TYPES.CLEAR,
        thickness: GLASS_THICKNESS.EIGHT.toString(),
        height: '',
        width: '',
        name: 'Стекло 1'
      }]);
      setProfileCount(0);
      setComment('');
    } else if (newConfig === 'glass') {
      // Добавляем профиль и крепление по умолчанию для стекляшки
      const newItems: CustomHardwareItem[] = [
        {
          id: Date.now().toString(),
          name: 'Профиль',
          count: 1
        },
        {
          id: (Date.now() + 1).toString(),
          name: 'Крепление палка стена-стекло',
          count: 1
        }
      ];
      setAdditionalHardware({
        customItems: newItems
      });
    }
    
    setErrors({});
  };

  // Добавляем useEffect для автоматического расчета при изменении значений
  useEffect(() => {
    if (configuration === 'corner' && cornerLength && cornerWidth && glasses[0].height) {
      calculatePrice();
    }
  }, [cornerLength, cornerWidth, glasses[0].height, glasses[0].color, glasses[0].thickness, hardwareColor, profileCount, delivery, installation, additionalRail]);

  // Обработчик изменения чекбокса "Указать размеры стекла"
  const handleOpeningSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsOpeningSize = !e.target.checked;
    setIsOpeningSize(newIsOpeningSize);
    
    // Сохраняем текущие значения
    const currentState = {
      customerName,
      configuration,
      status,
      delivery,
      installation,
      totalPrice,
      calculationDetails,
      editingId,
      priceChanged,
      changedDetails,
      originalPrice,
      originalStatus,
      glassType,
      profileType
    };
    
    // Сбрасываем все поля к значениям по умолчанию
    setGlasses([{
      id: '1',
      color: GLASS_TYPES.CLEAR,
      thickness: GLASS_THICKNESS.EIGHT.toString(),
      height: '',
      width: '',
      name: 'Стекло 1'
    }]);
    setProfileCount(0);
    setComment('');
    setOpeningLength('');
    setOpeningHeight('');
    setAdditionalRail(false);
    
    // Восстанавливаем сохраненные значения
    setCustomerName(currentState.customerName);
    setConfiguration(currentState.configuration);
    setStatus(currentState.status);
    setDelivery(currentState.delivery);
    setInstallation(currentState.installation);
    setTotalPrice(currentState.totalPrice);
    setCalculationDetails(currentState.calculationDetails);
    setEditingId(currentState.editingId);
    setPriceChanged(currentState.priceChanged);
    setChangedDetails(currentState.changedDetails);
    setOriginalPrice(currentState.originalPrice);
    setOriginalStatus(currentState.originalStatus);
    setGlassType(currentState.glassType);
    setProfileType(currentState.profileType);
  };

  const handleCornerLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCornerLength(value);
      calculatePrice();
    }
  };

  const handleCornerWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCornerWidth(value);
      calculatePrice();
    }
  };

  const filteredConfigs = savedConfigs.filter(config => 
    config.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const handleNewProject = () => {
    setCustomerName('');
    setConfiguration('');
    setGlasses([{
      id: '1',
      color: GLASS_TYPES.CLEAR,
      thickness: GLASS_THICKNESS.EIGHT.toString(),
      height: '',
      width: '',
      name: 'Стекло 1'
    }]);
    setHardwareColor('');
    setProfileCount(0);
    setComment('');
    setErrors({});
    setEditingId(null);
    setPriceChanged(false);
    setChangedDetails({});
    setCalculationDetails([]);
    setTotalPrice(0);
    setOriginalPrice(0);
    setStatus('Рассчет');
    setOriginalStatus('Рассчет');
    setGlassType('stationary');
    setProfileType('');
    setIsOpeningSize(true);
    setOpeningLength('');
    setOpeningHeight('');
    localStorage.removeItem('calculatorState');
  };

  const formatPrice = (price: number) => {
    const usdPrice = price / usdRate;
    const currencySymbol = currency === 'BYN' ? 'BYN' : '₾';
    return (
      <Box>
        <Typography variant="h6" component="div">
          Цена: {price.toFixed(2)} {currencySymbol}
        </Typography>
        {prices.showUsdPrice && (
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              color: 'text.secondary',
              mt: 0.5
            }}
          >
            ~ {usdPrice.toFixed(2)} $
          </Typography>
        )}
      </Box>
    );
  };

  const addGlass = () => {
    const lastGlass = glasses[glasses.length - 1];
    setGlasses(prev => [...prev, {
      id: (prev.length + 1).toString(),
      color: lastGlass.color,
      thickness: lastGlass.thickness,
      height: '',
      width: '',
      name: `Стекло ${prev.length + 1}`
    }]);
    // Добавляем вызов calculatePrice после обновления состояния
    setTimeout(() => calculatePrice(), 0);
  };

  const removeGlass = (id: string) => {
    if (glasses.length > 1) {
      setGlasses(prev => prev.filter(glass => glass.id !== id));
    }
  };

  const updateGlass = (id: string, field: keyof Glass, value: string) => {
    setGlasses(prev => prev.map(glass => 
      glass.id === id ? { ...glass, [field]: value } : glass
    ));
  };

  const handleOpenHardwareDialog = () => {
    setInitialHardwareState(JSON.parse(JSON.stringify(additionalHardware)));
    setHardwareDialogChanged(false);
    setOpenHardwareDialog(true);
  };

  const updateCustomHardwareCount = (id: string, count: number) => {
    setAdditionalHardware(prev => ({
      ...prev,
      customItems: prev.customItems.map(item =>
        item.id === id ? { ...item, count } : item
      )
    }));
    setHardwareDialogChanged(true);
  };

  const removeCustomHardware = (id: string) => {
    setAdditionalHardware(prev => ({
      ...prev,
      customItems: prev.customItems.filter(item => item.id !== id)
    }));
    setHardwareDialogChanged(true);
  };

  const addCustomHardware = () => {
    if (!newHardwareName.trim()) return;
    
    const availableItems = getAvailableHardwareItems();
    const isValidItem = availableItems.includes(newHardwareName.trim());
    
    if (!isValidItem) return;
    
    const newItem: CustomHardwareItem = {
      id: Date.now().toString(),
      name: newHardwareName.trim(),
      count: newHardwareCount
    };
    
    setAdditionalHardware(prev => ({
      ...prev,
      customItems: [...prev.customItems, newItem]
    }));
    
    setNewHardwareName('');
    setNewHardwareCount(1);
    setHardwareDialogChanged(true);
  };

  const handleSaveHardware = () => {
    if (newHardwareName.trim()) {
      if (getAvailableHardwareItems().includes(newHardwareName.trim())) {
        addCustomHardware();
      }
    }
    setOpenHardwareDialog(false);
    calculatePrice();
    setHardwareDialogChanged(false);
  };

  const handleCloseHardware = () => {
    setAdditionalHardware(initialHardwareState);
    setOpenHardwareDialog(false);
    setHardwareDialogChanged(false);
  };

  const getAvailableHardwareItems = () => {
    const items = [];
    
    if (prices.hinge90 > 0) {
      items.push('Петля 90 градусов');
    }
    if (prices.hinge180 > 0) {
      items.push('Петля 180 градусов');
    }
    if (prices.hinge135 > 0) {
      items.push('Петля 135 градусов');
    }
    if (prices.handleKnob > 0) {
      items.push('Ручка');
    }
    if (prices.mountingWallGlass > 0) {
      items.push('Крепление палка стена-стекло');
    }
    if (prices.mountingWallGlassGlass > 0) {
      items.push('Крепление палка стена-стекло-стекло');
    }
    if (prices.slidingChrome > 0 || prices.slidingMatte > 0 || prices.slidingBlack > 0 || prices.slidingGold > 0) {
      items.push('Раздвижная система');
    }
    if (prices.additionalRail > 0) {
      items.push('Дополнительная направляющая');
    }
    if (prices.profileTube > 0) {
      items.push('Дополнительный профиль');
    }
    
    return items;
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      const updatedConfigs = savedConfigs.filter(config => config.id !== projectToDelete);
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('savedConfigs', JSON.stringify(updatedConfigs));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleCopyDetails = async () => {
    const detailsText = [
      customerName && `Название проекта: ${customerName}`,
      configuration && `Конфигурация: ${
        configuration === 'glass' ? 'Стекляшка' :
        configuration === 'straight' ? 'Прямая раздвижная' :
        configuration === 'corner' ? 'Угловая раздвижная' :
        configuration === 'unique' ? 'Уникальная конфигурация' : configuration
      }`,
      comment && `Комментарий: ${comment}`,
      ...calculationDetails.map((detail, index) => {
        const formattedDetail = detail.replace(/(\d+\.?\d*)\s*₾/, (match: any, price: any) => {
          const numPrice = parseFloat(price);
          const currencySymbol = currency === 'BYN' ? 'BYN' : '₾';
          return `${numPrice.toFixed(2)} ${currencySymbol}`;
        });
        return (
          <ListItem key={index} sx={calculatorStyles.listItem}>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 'normal', fontSize: '0.9rem' }}>
                  {formattedDetail}
                </Typography>
              }
              sx={calculatorStyles.listItemText}
            />
          </ListItem>
        );
      }),
      `Итоговая стоимость: ${totalPrice.toFixed(2)} ${currency === 'BYN' ? 'BYN' : '₾'}${prices.showUsdPrice ? ` (~${(totalPrice / prices.usdRate).toFixed(2)} $)` : ''}`
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(detailsText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Box sx={calculatorStyles.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={calculatorStyles.topBar}>
            <Box sx={calculatorStyles.topBarContent}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewProject}
                fullWidth
                size="small"
              >
                Новый проект
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                fullWidth
                size="small"
              >
                Сохранить
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Левая колонка - Детали расчета */}
        <Grid item xs={12} md={3}>
          <Paper sx={calculatorStyles.leftColumn}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Детали расчета:
              </Typography>
            </Box>
            <List sx={calculatorStyles.list}>
              {customerName && (
                <ListItem sx={calculatorStyles.listItem}>
                  <ListItemText 
                    primary="Название проекта:"
                    secondary={
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {customerName}
                        {configuration && (
                          <span style={{ fontWeight: 'bold', color: 'text.secondary' }}>
                            {' '}({configuration === 'glass' ? 'Стекляшка' :
                              configuration === 'straight' ? 'Прямая раздвижная' :
                              configuration === 'corner' ? 'Угловая раздвижная' :
                              configuration === 'unique' ? 'Уникальная конфигурация' : configuration})
                          </span>
                        )}
                      </Typography>
                    }
                    sx={calculatorStyles.listItemText}
                  />
                </ListItem>
              )}
              {comment && (
                <ListItem sx={calculatorStyles.listItem}>
                  <ListItemText 
                    primary={
                      <Typography sx={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                        Комментарий: {comment}
                      </Typography>
                    }
                    sx={calculatorStyles.listItemText}
                  />
                </ListItem>
              )}
              {calculationDetails.map((detail, index) => {
                const formattedDetail = detail.replace(/(\d+\.?\d*)\s*₾/, (match: any, price: any) => {
                  const numPrice = parseFloat(price);
                  const currencySymbol = currency === 'BYN' ? 'BYN' : '₾';
                  return `${numPrice.toFixed(2)} ${currencySymbol}`;
                });
                return (
                  <ListItem key={index} sx={calculatorStyles.listItem}>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 'normal', fontSize: '0.9rem' }}>
                          {formattedDetail}
                        </Typography>
                      }
                      sx={calculatorStyles.listItemText}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box sx={calculatorStyles.priceContainer}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Итоговая стоимость:
              </Typography>
              {priceChanged && (
                <Typography variant="body2" color="text.secondary" sx={calculatorStyles.priceChange}>
                  Старая стоимость: {originalPrice.toFixed(2)} {currency === 'BYN' ? 'BYN' : '₾'}
                  {prices.showUsdPrice && ` (~${(originalPrice / usdRate).toFixed(2)} $)`}
                </Typography>
              )}
              <Box sx={calculatorStyles.price}>
                {formatPrice(totalPrice)}
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCopyDetails}
                fullWidth
                sx={{ 
                  mt: 2,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'white',
                    borderColor: 'primary.dark',
                    color: 'primary.dark'
                  }
                }}
              >
                Скопировать
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Центральная колонка - Основное окно */}
        <Grid item xs={12} md={6}>
          <Paper sx={calculatorStyles.mainContent}>
            <Box sx={calculatorStyles.content}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={status}
                  label="Статус"
                  onChange={handleStatusChange}
                >
                  <MenuItem value="Рассчет">Рассчет</MenuItem>
                  <MenuItem value="Согласован">Согласован</MenuItem>
                  <MenuItem value="Заказан">Заказан</MenuItem>
                  <MenuItem value="Стекло доставлено">Стекло доставлено</MenuItem>
                  <MenuItem value="Установка">Установка</MenuItem>
                  <MenuItem value="Установлено">Установлено</MenuItem>
                  <MenuItem value="Оплачено">Оплачено</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Название проекта"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value.slice(0, 500))}
                fullWidth
                error={!!errors.customerName}
                helperText={errors.customerName}
                required
              />

              <FormControl fullWidth error={!!errors.configuration} required>
                <InputLabel>Конфигурация</InputLabel>
                <Select
                  value={configuration}
                  label="Конфигурация"
                  onChange={handleConfigurationChange}
                >
                  <MenuItem value="glass">Стекляшка</MenuItem>
                  <MenuItem value="straight">Прямая раздвижная</MenuItem>
                  <MenuItem value="corner">Угловая раздвижная</MenuItem>
                  <MenuItem value="straight-swing" disabled>Прямая распашная</MenuItem>
                  <MenuItem value="corner-swing" disabled>Угловая распашная</MenuItem>
                  <MenuItem value="unique">Уникальная Конфигурация</MenuItem>
                </Select>
                {errors.configuration && <FormHelperText>{errors.configuration}</FormHelperText>}
              </FormControl>

              {configuration === 'glass' && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassColor}>
                        <InputLabel>Цвет стекла</InputLabel>
                        <Select
                          value={glasses[0].color}
                          onChange={handleGlassColorChange('1')}
                          label="Цвет стекла"
                        >
                          <MenuItem value={GLASS_TYPES.CLEAR}>Прозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультрапрозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструйное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_FACTORY}>Матовое заводское</MenuItem>
                          <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит (Россия)</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит (Иран)</MenuItem>
                        </Select>
                        {errors.glassColor && <FormHelperText>{errors.glassColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassThickness}>
                        <InputLabel>Толщина стекла</InputLabel>
                        <Select
                          value={glasses[0].thickness}
                          onChange={handleGlassThicknessChange('1')}
                          label="Толщина стекла"
                        >
                          <MenuItem value={GLASS_THICKNESS.EIGHT.toString()}>8 мм</MenuItem>
                          <MenuItem value={GLASS_THICKNESS.TEN.toString()}>10 мм</MenuItem>
                        </Select>
                        {errors.glassThickness && <FormHelperText>{errors.glassThickness}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={6}>
                      <TextField
                        label="Ширина (мм)"
                        type="number"
                        value={glasses[0].width}
                        onChange={handleGlassWidthChange('1')}
                        inputProps={{ min: 10, max: 5000 }}
                        fullWidth
                        error={!!errors.glassWidth}
                        helperText={errors.glassWidth}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Высота (мм)"
                        type="number"
                        value={glasses[0].height}
                        onChange={handleGlassHeightChange('1')}
                        inputProps={{ min: 10, max: 5000 }}
                        fullWidth
                        error={!!errors.glassHeight}
                        helperText={errors.glassHeight}
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.hardwareColor} required>
                        <InputLabel>Цвет фурнитуры</InputLabel>
                        <Select
                          value={hardwareColor}
                          label="Цвет фурнитуры"
                          onChange={(e: SelectChangeEvent) => setHardwareColor(e.target.value)}
                        >
                          <MenuItem value="chrome">Хром</MenuItem>
                          <MenuItem value="matte">Матовый</MenuItem>
                          <MenuItem value="black">Черный</MenuItem>
                          <MenuItem value="gold">Золотой</MenuItem>
                        </Select>
                        {errors.hardwareColor && <FormHelperText>{errors.hardwareColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenHardwareDialog}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Добавить фурнитуру
                      </Button>
                    </Grid>
                    {additionalHardware.customItems.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          {additionalHardware.customItems.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            >
                              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                              <Typography sx={{ minWidth: '80px' }}>
                                {item.count} шт.
                              </Typography>
                              <IconButton
                                onClick={() => removeCustomHardware(item.id)}
                                size="small"
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={calculatorStyles.checkboxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={delivery}
                          onChange={(e) => setDelivery(e.target.checked)}
                        />
                      }
                      label="Доставка"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={installation}
                          onChange={(e) => setInstallation(e.target.checked)}
                        />
                      }
                      label="Установка"
                    />
                  </Box>

                  <TextField
                    label="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                    fullWidth
                    multiline
                    rows={2}
                    helperText={`${comment.length}/2000`}
                  />
                </>
              )}

              {configuration === 'straight' && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassColor}>
                        <InputLabel>Цвет стекла</InputLabel>
                        <Select
                          value={glasses[0].color}
                          onChange={handleGlassColorChange('1')}
                          label="Цвет стекла"
                        >
                          <MenuItem value={GLASS_TYPES.CLEAR}>Прозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультрапрозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструйное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_FACTORY}>Матовое заводское</MenuItem>
                          <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит (Россия)</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит (Иран)</MenuItem>
                        </Select>
                        {errors.glassColor && <FormHelperText>{errors.glassColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassThickness}>
                        <InputLabel>Толщина стекла</InputLabel>
                        <Select
                          value={glasses[0].thickness}
                          onChange={handleGlassThicknessChange('1')}
                          label="Толщина стекла"
                        >
                          <MenuItem value={GLASS_THICKNESS.EIGHT.toString()}>8 мм</MenuItem>
                          <MenuItem value={GLASS_THICKNESS.TEN.toString()}>10 мм</MenuItem>
                        </Select>
                        {errors.glassThickness && <FormHelperText>{errors.glassThickness}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!isOpeningSize}
                        onChange={handleOpeningSizeChange}
                      />
                    }
                    label="Указать размеры стекла"
                  />
                  
                  {isOpeningSize ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Ширина проема (мм)"
                          type="number"
                          value={openingLength}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 5000)) {
                              setOpeningLength(value);
                            }
                          }}
                          inputProps={{ min: 10, max: 5000 }}
                          fullWidth
                          error={!!errors.openingLength}
                          helperText={errors.openingLength}
                          required
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Высота кабины (мм)"
                          type="number"
                          value={openingHeight}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 5000)) {
                              setOpeningHeight(value);
                            }
                          }}
                          inputProps={{ min: 10, max: 5000 }}
                          fullWidth
                          error={!!errors.openingHeight}
                          helperText={errors.openingHeight}
                          required
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <TextField
                          label="Ширина стационарного стекла (мм)"
                          type="number"
                          value={glasses[0].width}
                          onChange={handleGlassWidthChange('1')}
                          inputProps={{ min: 10, max: 5000 }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Ширина двери (мм)"
                          type="number"
                          value={doorWidth}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0 && value <= 5000) {
                              setDoorWidth(e.target.value);
                            }
                          }}
                          inputProps={{ min: 10, max: 5000 }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="Высота стекла (мм)"
                          type="number"
                          value={glasses[0].height}
                          onChange={handleGlassHeightChange('1')}
                          inputProps={{ min: 10, max: 5000 }}
                          fullWidth
                          required
                        />
                      </Grid>
                    </Grid>
                  )}

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.hardwareColor} required>
                        <InputLabel>Цвет фурнитуры</InputLabel>
                        <Select
                          value={hardwareColor}
                          label="Цвет фурнитуры"
                          onChange={(e: SelectChangeEvent) => setHardwareColor(e.target.value)}
                        >
                          <MenuItem value="chrome">Хром</MenuItem>
                          <MenuItem value="matte">Матовый</MenuItem>
                          <MenuItem value="black">Черный</MenuItem>
                          <MenuItem value="gold">Золотой</MenuItem>
                        </Select>
                        {errors.hardwareColor && <FormHelperText>{errors.hardwareColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenHardwareDialog}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Добавить фурнитуру
                      </Button>
                    </Grid>
                    {additionalHardware.customItems.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          {additionalHardware.customItems.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            >
                              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                              <Typography sx={{ minWidth: '80px' }}>
                                {item.count} шт.
                              </Typography>
                              <IconButton
                                onClick={() => removeCustomHardware(item.id)}
                                size="small"
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={calculatorStyles.checkboxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={delivery}
                          onChange={(e) => setDelivery(e.target.checked)}
                        />
                      }
                      label="Доставка"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={installation}
                          onChange={(e) => setInstallation(e.target.checked)}
                        />
                      }
                      label="Установка"
                    />
                  </Box>

                  <TextField
                    label="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                    fullWidth
                    multiline
                    rows={2}
                    helperText={`${comment.length}/2000`}
                  />
                </>
              )}

              {configuration === 'corner' && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassColor}>
                        <InputLabel>Цвет стекла</InputLabel>
                        <Select
                          value={glasses[0].color}
                          onChange={handleGlassColorChange('1')}
                          label="Цвет стекла"
                        >
                          <MenuItem value={GLASS_TYPES.CLEAR}>Прозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультрапрозрачное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструйное</MenuItem>
                          <MenuItem value={GLASS_TYPES.MATTE_FACTORY}>Матовое заводское</MenuItem>
                          <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит (Россия)</MenuItem>
                          <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит (Иран)</MenuItem>
                        </Select>
                        {errors.glassColor && <FormHelperText>{errors.glassColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors.glassThickness}>
                        <InputLabel>Толщина стекла</InputLabel>
                        <Select
                          value={glasses[0].thickness}
                          onChange={handleGlassThicknessChange('1')}
                          label="Толщина стекла"
                        >
                          <MenuItem value={GLASS_THICKNESS.EIGHT.toString()}>8 мм</MenuItem>
                          <MenuItem value={GLASS_THICKNESS.TEN.toString()}>10 мм</MenuItem>
                        </Select>
                        {errors.glassThickness && <FormHelperText>{errors.glassThickness}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={4}>
                      <TextField
                        label="Ширина (мм)"
                        type="number"
                        value={cornerWidth}
                        onChange={handleCornerWidthChange}
                        inputProps={{ min: 10, max: 5000 }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Длина (мм)"
                        type="number"
                        value={cornerLength}
                        onChange={handleCornerLengthChange}
                        inputProps={{ min: 10, max: 5000 }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Высота (мм)"
                        type="number"
                        value={glasses[0].height}
                        onChange={handleGlassHeightChange('1')}
                        inputProps={{ min: 10, max: 5000 }}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.hardwareColor} required>
                        <InputLabel>Цвет фурнитуры</InputLabel>
                        <Select
                          value={hardwareColor}
                          label="Цвет фурнитуры"
                          onChange={(e: SelectChangeEvent) => setHardwareColor(e.target.value)}
                        >
                          <MenuItem value="chrome">Хром</MenuItem>
                          <MenuItem value="matte">Матовый</MenuItem>
                          <MenuItem value="black">Черный</MenuItem>
                          <MenuItem value="gold">Золотой</MenuItem>
                        </Select>
                        {errors.hardwareColor && <FormHelperText>{errors.hardwareColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenHardwareDialog}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Добавить фурнитуру
                      </Button>
                    </Grid>
                    {additionalHardware.customItems.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          {additionalHardware.customItems.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            >
                              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                              <Typography sx={{ minWidth: '80px' }}>
                                {item.count} шт.
                              </Typography>
                              <IconButton
                                onClick={() => removeCustomHardware(item.id)}
                                size="small"
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={calculatorStyles.checkboxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={delivery}
                          onChange={(e) => setDelivery(e.target.checked)}
                        />
                      }
                      label="Доставка"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={installation}
                          onChange={(e) => setInstallation(e.target.checked)}
                        />
                      }
                      label="Установка"
                    />
                  </Box>

                  <TextField
                    label="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                    fullWidth
                    multiline
                    rows={2}
                    helperText={`${comment.length}/2000`}
                  />
                </>
              )}

              {configuration === 'unique' && (
                <Box sx={calculatorStyles.uniqueConfiguration}>
                  {glasses.map((glass, index) => (
                    <Box key={glass.id} sx={calculatorStyles.glassCard}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                          <Box sx={calculatorStyles.glassCardHeader}>
                            <TextField
                              label="Название стекла"
                              value={glass.name}
                              onChange={handleGlassNameChange(glass.id)}
                              fullWidth
                            />
                            {glasses.length > 1 && (
                              <IconButton 
                                onClick={() => removeGlass(glass.id)}
                                sx={calculatorStyles.deleteIcon}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors[`glassColor_${glass.id}`]}>
                            <InputLabel>Цвет стекла</InputLabel>
                            <Select
                              value={glass.color}
                              onChange={handleGlassColorChange(glass.id)}
                              label="Цвет стекла"
                            >
                              <MenuItem value={GLASS_TYPES.CLEAR}>Прозрачное</MenuItem>
                              <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультрапрозрачное</MenuItem>
                              <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструйное</MenuItem>
                              <MenuItem value={GLASS_TYPES.MATTE_FACTORY}>Матовое заводское</MenuItem>
                              <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                              <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит (Россия)</MenuItem>
                              <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит (Иран)</MenuItem>
                            </Select>
                            {errors[`glassColor_${glass.id}`] && <FormHelperText>{errors[`glassColor_${glass.id}`]}</FormHelperText>}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth error={!!errors[`glassThickness_${glass.id}`]}>
                            <InputLabel>Толщина стекла</InputLabel>
                            <Select
                              value={glass.thickness}
                              onChange={handleGlassThicknessChange(glass.id)}
                              label="Толщина стекла"
                            >
                              <MenuItem value={GLASS_THICKNESS.EIGHT.toString()}>8 мм</MenuItem>
                              <MenuItem value={GLASS_THICKNESS.TEN.toString()}>10 мм</MenuItem>
                            </Select>
                            {errors[`glassThickness_${glass.id}`] && <FormHelperText>{errors[`glassThickness_${glass.id}`]}</FormHelperText>}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Ширина (мм)"
                            type="number"
                            value={glass.width}
                            onChange={handleGlassWidthChange(glass.id)}
                            inputProps={{ min: 10, max: 5000 }}
                            fullWidth
                            error={!!errors[`glassWidth_${glass.id}`]}
                            helperText={errors[`glassWidth_${glass.id}`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Высота (мм)"
                            type="number"
                            value={glass.height}
                            onChange={handleGlassHeightChange(glass.id)}
                            inputProps={{ min: 10, max: 5000 }}
                            fullWidth
                            error={!!errors[`glassHeight_${glass.id}`]}
                            helperText={errors[`glassHeight_${glass.id}`]}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    onClick={addGlass}
                    variant="outlined"
                    fullWidth
                    sx={calculatorStyles.addGlassButton}
                  >
                    Добавить стекло
                  </Button>

                  <Grid container spacing={2} sx={calculatorStyles.inputGrid}>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.hardwareColor} required>
                        <InputLabel>Цвет фурнитуры</InputLabel>
                        <Select
                          value={hardwareColor}
                          label="Цвет фурнитуры"
                          onChange={(e: SelectChangeEvent) => setHardwareColor(e.target.value)}
                        >
                          <MenuItem value="chrome">Хром</MenuItem>
                          <MenuItem value="matte">Матовый</MenuItem>
                          <MenuItem value="black">Черный</MenuItem>
                          <MenuItem value="gold">Золотой</MenuItem>
                        </Select>
                        {errors.hardwareColor && <FormHelperText>{errors.hardwareColor}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        onClick={handleOpenHardwareDialog}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Добавить фурнитуру
                      </Button>
                    </Grid>
                    {additionalHardware.customItems.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                          {additionalHardware.customItems.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            >
                              <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                              <Typography sx={{ minWidth: '80px' }}>
                                {item.count} шт.
                              </Typography>
                              <IconButton
                                onClick={() => removeCustomHardware(item.id)}
                                size="small"
                                sx={{
                                  color: 'text.secondary',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    color: 'error.main'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={calculatorStyles.checkboxContainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={delivery}
                          onChange={(e) => setDelivery(e.target.checked)}
                        />
                      }
                      label="Доставка"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={installation}
                          onChange={(e) => setInstallation(e.target.checked)}
                        />
                      }
                      label="Установка"
                    />
                  </Box>

                  <TextField
                    label="Комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                    fullWidth
                    multiline
                    rows={2}
                    sx={calculatorStyles.commentField}
                    helperText={`${comment.length}/2000`}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 2
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNewProject}
                      fullWidth
                      size="large"
                    >
                      Новый проект
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      fullWidth
                      size="large"
                    >
                      Сохранить
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка - История проектов */}
        <Grid item xs={12} md={3}>
          <Box sx={calculatorStyles.projectHistory}>
            <Typography variant="h6" gutterBottom>
              История проектов
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List sx={calculatorStyles.list}>
              {filteredConfigs.map((config) => (
                <ListItem
                  key={config.id}
                  sx={calculatorStyles.projectCard}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tooltip title={config.customerName} placement="top">
                          <Typography sx={calculatorStyles.projectName}>
                            {config.customerName}
                            {config.configuration && (
                              <span style={{ fontWeight: 'normal', color: 'text.secondary' }}>
                                {' '}({config.configuration === 'glass' ? 'Стекляшка' :
                                  config.configuration === 'straight' ? 'Прямая раздвижная' :
                                  config.configuration === 'corner' ? 'Угловая раздвижная' :
                                  config.configuration === 'unique' ? 'Уникальная конфигурация' : config.configuration})
                              </span>
                            )}
                          </Typography>
                        </Tooltip>
                        <Chip 
                          label={config.status}
                          size="small"
                          color={
                            config.status === 'Рассчет' ? 'default' :
                            config.status === 'Согласован' ? 'info' :
                            config.status === 'Заказан' ? 'warning' :
                            config.status === 'Стекло доставлено' ? 'primary' :
                            config.status === 'Установка' ? 'secondary' :
                            config.status === 'Установлено' ? 'success' :
                            config.status === 'Оплачено' ? 'success' : 'default'
                          }
                          sx={{ 
                            height: '20px',
                            '& .MuiChip-label': {
                              px: 1,
                              fontSize: '0.75rem'
                            },
                            ...(config.status === 'Установлено' && {
                              backgroundColor: '#90EE90',
                              color: '#1B5E20',
                              '&:hover': {
                                backgroundColor: '#98FB98'
                              }
                            })
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Цена: {config.totalPrice.toFixed(2)} {currency === 'BYN' ? 'BYN' : '₾'}
                        </Typography>
                        {prices.showUsdPrice && (
                          <Typography variant="body2" color="text.secondary">
                            ~ {(config.totalPrice / usdRate).toFixed(2)} $
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {new Date(config.createdAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        {config.comment && (
                          <Tooltip title={config.comment} placement="top">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mt: 0.5
                              }}
                            >
                              {config.comment}
                            </Typography>
                          </Tooltip>
                        )}
                      </>
                    }
                    sx={{
                      '& .MuiListItemText-primary': calculatorStyles.projectName,
                      '& .MuiListItemText-secondary': calculatorStyles.projectDetails
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(config)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClick(config.id)}
                      sx={calculatorStyles.deleteIcon}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      <Snackbar 
        open={showSuccessMessage} 
        autoHideDuration={3000} 
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccessMessage} 
          severity="success" 
          sx={calculatorStyles.successMessage}
        >
          Проект успешно сохранен!
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: calculatorStyles.dialogPaper
        }}
      >
        <DialogTitle sx={calculatorStyles.dialogTitle}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={calculatorStyles.dialogActions}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={calculatorStyles.dialogButton}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="primary"
            sx={calculatorStyles.dialogButton}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSaveDialog}
        onClose={handleSaveDialogClose}
        PaperProps={{
          sx: {
            minWidth: '500px',
            maxWidth: '600px',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', pb: 1 }}>
          Сохранить изменения?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.1rem', color: 'text.primary' }}>
            Цена проекта была изменена. Выберите способ сохранения:
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleSaveDialogClose} color="inherit">
            Отменить
          </Button>
          <Box>
            <Button onClick={handleSave} color="primary" sx={{ mr: 1 }}>
              Сохранить без изменения цены
            </Button>
            <Button onClick={handleSave} color="error" variant="contained">
              Сохранить с новой ценой
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openHardwareDialog}
        onClose={handleCloseHardware}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Дополнительная фурнитура</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Список добавленной фурнитуры */}
            {additionalHardware.customItems.map(item => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                <TextField
                  type="number"
                  value={item.count}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0) {
                      updateCustomHardwareCount(item.id, value);
                    }
                  }}
                  inputProps={{ min: 0 }}
                  sx={{ width: '100px' }}
                />
                <IconButton 
                  onClick={() => {
                    removeCustomHardware(item.id);
                    calculatePrice(); // Добавляем расчет при удалении фурнитуры
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      color: 'primary.main'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {/* Форма добавления новой фурнитуры */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Autocomplete
                freeSolo
                options={getAvailableHardwareItems().filter(item => 
                  !additionalHardware.customItems.some(existingItem => 
                    existingItem.name === item
                  )
                )}
                value={newHardwareName}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setNewHardwareName(newValue);
                    addCustomHardware();
                  }
                }}
                onInputChange={(_, newInputValue) => {
                  setNewHardwareName(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Название фурнитуры"
                    fullWidth
                    error={newHardwareName.trim() !== '' && !getAvailableHardwareItems().includes(newHardwareName.trim())}
                    helperText={newHardwareName.trim() !== '' && !getAvailableHardwareItems().includes(newHardwareName.trim()) ? 
                      'Выберите фурнитуру из списка' : ''}
                  />
                )}
                renderOption={(props, option) => {
                  const isDisabled = additionalHardware.customItems.some(
                    item => item.name === option
                  );
                  return (
                    <li {...props} style={{ 
                      ...props.style,
                      opacity: isDisabled ? 0.5 : 1,
                      pointerEvents: isDisabled ? 'none' : 'auto'
                    }}>
                      {option}
                    </li>
                  );
                }}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                label="Количество"
                value={newHardwareCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 0) {
                    setNewHardwareCount(value);
                  }
                }}
                inputProps={{ min: 0 }}
                sx={{ width: '120px' }}
              />
              <Button
                variant="outlined"
                onClick={addCustomHardware}
                disabled={!newHardwareName.trim() || !getAvailableHardwareItems().includes(newHardwareName.trim())}
                sx={{ 
                  minWidth: '120px',
                  textTransform: 'none'
                }}
              >
                Добавить
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          gap: 1
        }}>
          <Button 
            onClick={handleCloseHardware}
            variant="outlined"
            sx={{ 
              minWidth: '120px',
              textTransform: 'none',
              borderRadius: 1
            }}
          >
            Закрыть
          </Button>
          <Button 
            onClick={handleSaveHardware}
            variant="contained"
            color="primary"
            disabled={!hardwareDialogChanged || (newHardwareName.trim() !== '' && !getAvailableHardwareItems().includes(newHardwareName.trim()))}
            sx={{ 
              minWidth: '120px',
              textTransform: 'none',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Детали расчета скопированы в буфер обмена
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Calculator; 