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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  additionalRail: number;
  profileTube: number;
  glassUltraClear8mm: number;
  glassUltraClear10mm: number;
  glassMatteSandblasted8mm: number;
  glassMatteSandblasted10mm: number;
  glassMatteFactory10mm: number;
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
  totalPrice: number;
  status: string;
  profileCount: number | '';
  comment: string;
  calculationDetails: string[];
  originalPrice?: number;
  delivery: boolean;
  installation: boolean;
  originalStatus: string;
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

const GLASS_TYPES = {
  CLEAR: 'clear',
  ULTRA_CLEAR: 'ultra-clear',
  MATTE_SANDBLASTED: 'matte-sandblasted',
  MATTE_FACTORY: 'matte-factory',
  BRONZE: 'bronze',
  GRAPHITE_RUS: 'graphite-rus',
  GRAPHITE_IRAN: 'graphite-iran'
} as const;

const GLASS_THICKNESS = {
  EIGHT: '8',
  TEN: '10'
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

const Calculator: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [configuration, setConfiguration] = useState<string>('');
  const [glassColor, setGlassColor] = useState<string>('');
  const [glassThickness, setGlassThickness] = useState<string>('');
  const [glassHeight, setGlassHeight] = useState<string>('');
  const [glassWidth, setGlassWidth] = useState<string>('');
  const [hardwareColor, setHardwareColor] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [status, setStatus] = useState<ProjectStatus>('Рассчет');
  const [profileCount, setProfileCount] = useState<number | ''>(1);
  const [comment, setComment] = useState<string>('');
  const [calculationDetails, setCalculationDetails] = useState<string[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    additionalRail: 0,
    profileTube: 0,
    glassUltraClear8mm: 0,
    glassUltraClear10mm: 0,
    glassMatteSandblasted8mm: 0,
    glassMatteSandblasted10mm: 0,
    glassMatteFactory10mm: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [priceChanged, setPriceChanged] = useState<boolean>(false);
  const [changedDetails, setChangedDetails] = useState<{ [key: string]: boolean }>({});
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openNewProjectDialog, setOpenNewProjectDialog] = useState(false);
  const [delivery, setDelivery] = useState<boolean>(true);
  const [installation, setInstallation] = useState<boolean>(true);
  const [originalStatus, setOriginalStatus] = useState<ProjectStatus>('Рассчет');
  const [config, setConfig] = useState<ShowerConfig>(defaultConfig);
  const [projectName, setProjectName] = useState('');
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

  // Сохраняем состояние калькулятора при изменении
  useEffect(() => {
    const saveState = () => {
      const calculatorState = {
        customerName,
        configuration,
        glassColor,
        glassThickness,
        glassHeight,
        glassWidth,
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
    glassColor,
    glassThickness,
    glassHeight,
    glassWidth,
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
        setPrices(JSON.parse(savedPrices));
      }
      const savedConfigurations = localStorage.getItem('savedConfigurations');
      if (savedConfigurations) {
        setSavedConfigs(JSON.parse(savedConfigurations));
      }

      // Восстанавливаем состояние калькулятора
      const savedCalculatorState = localStorage.getItem('calculatorState');
      if (savedCalculatorState) {
        const state = JSON.parse(savedCalculatorState);
        setCustomerName(state.customerName || '');
        setConfiguration(state.configuration || '');
        setGlassColor(state.glassColor || 'clear');
        setGlassThickness(state.glassThickness || '8');
        setGlassHeight(state.glassHeight || '');
        setGlassWidth(state.glassWidth || '');
        setHardwareColor(state.hardwareColor || '');
        setProfileCount(state.profileCount || 1);
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
        glassColor,
        glassThickness,
        glassHeight,
        glassWidth,
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
    glassColor,
    glassThickness,
    glassHeight,
    glassWidth,
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

  const calculatePrice = () => {
    if (configuration === 'straight' && isOpeningSize) {
      if (!openingLength || !openingHeight) return;
    } else {
      if (!glassHeight || !glassWidth) return;
    }

    const details: string[] = [];
    let total = 0;

    // Стоимость стекла
    let glassPrice = 0;
    if (glassColor === GLASS_TYPES.CLEAR) {
      glassPrice = Math.ceil(glassThickness === GLASS_THICKNESS.EIGHT ? prices.glassClear8mm : prices.glassClear10mm);
    } else if (glassColor === GLASS_TYPES.ULTRA_CLEAR) {
      glassPrice = Math.ceil(glassThickness === GLASS_THICKNESS.EIGHT ? prices.glassUltraClear8mm : prices.glassUltraClear10mm);
    } else if (glassColor === GLASS_TYPES.MATTE_SANDBLASTED) {
      glassPrice = Math.ceil(glassThickness === GLASS_THICKNESS.EIGHT ? prices.glassMatteSandblasted8mm : prices.glassMatteSandblasted10mm);
    } else if (glassColor === GLASS_TYPES.MATTE_FACTORY) {
      glassPrice = Math.ceil(prices.glassMatteFactory10mm);
    } else if ([GLASS_TYPES.BRONZE, GLASS_TYPES.GRAPHITE_RUS, GLASS_TYPES.GRAPHITE_IRAN].includes(glassColor as any)) {
      glassPrice = Math.ceil(glassThickness === GLASS_THICKNESS.EIGHT ? prices.glassTinted8mm : prices.glassTinted10mm);
    }

    let glassArea = 0;
    if (configuration === 'straight' && isOpeningSize) {
      // Расчет для прямой раздвижной по размерам проема
      const length = parseFloat(openingLength);
      const height = parseFloat(openingHeight);
      
      // Расчет размеров стекла
      const totalWidth = length + 30; // Ширина проема + 30 мм
      const doorWidth = Math.floor(totalWidth / 2); // Дверь и стационарное стекло одинакового размера
      const stationaryWidth = totalWidth - doorWidth; // Оставшаяся часть
      
      // Расчет площади стекла
      glassArea = totalWidth * height / 1000000; // конвертируем в м²
      
      // Добавляем детали расчета
      details.push(`Размеры проема: ${length} x ${height} мм`);
      details.push(`Общая ширина кабины: ${totalWidth} мм`);
      details.push(`Ширина двери: ${doorWidth} мм`);
      details.push(`Ширина стационарного стекла: ${stationaryWidth} мм`);
    } else if (configuration === 'straight' && !isOpeningSize) {
      // Расчет по размерам стекла
      if (!glassHeight || !glassWidth || !doorWidth) return;
      
      const height = parseFloat(glassHeight);
      const stationaryWidth = parseFloat(glassWidth);
      const doorWidthValue = parseFloat(doorWidth);
      
      // Расчет площади стекла
      const doorArea = doorWidthValue * height / 1000000;
      const stationaryArea = stationaryWidth * height / 1000000;
      glassArea = doorArea + stationaryArea;
      
      // Добавляем детали расчета
      details.push(`Высота: ${height} мм`);
      details.push(`Ширина двери: ${doorWidthValue} мм`);
      details.push(`Ширина стационарного стекла: ${stationaryWidth} мм`);
    } else {
      // Обычный расчет по размерам стекла
      glassArea = parseFloat(glassHeight) * parseFloat(glassWidth) / 1000000;
    }

    const glassCost = glassPrice * glassArea;
    total += glassCost;
    const glassTypeText = GLASS_TYPE_TEXT[glassColor as keyof typeof GLASS_TYPE_TEXT] || 'тонированное';

    if (configuration === 'straight' && isOpeningSize) {
      details.push(`Стекло ${glassTypeText} ${glassThickness} мм (${glassArea.toFixed(2)} м²): ${Math.ceil(glassCost)} ₾`);
    } else if (configuration === 'straight' && !isOpeningSize) {
      details.push(`Стекло ${glassTypeText} ${glassThickness} мм (${glassArea.toFixed(2)} м²): ${Math.ceil(glassCost)} ₾`);
    } else {
      details.push(`Стекло ${glassTypeText} ${glassThickness} мм (${glassArea.toFixed(2)} м²): ${Math.ceil(glassCost)} ₾`);
    }

    // Стоимость профилей
    let profilePrice = 0;
    console.log('Prices:', prices);
    console.log('Hardware Color:', hardwareColor);
    console.log('Glass Thickness:', glassThickness);
    
    if (hardwareColor === 'chrome') {
      if (glassThickness === '8') {
        profilePrice = prices.profileChrome8mm;
      } else if (glassThickness === '10') {
        profilePrice = prices.profileChrome8mm;
      }
    } else if (hardwareColor === 'matte') {
      if (glassThickness === '8') {
        profilePrice = prices.profileMatte10mm;
      } else if (glassThickness === '10') {
        profilePrice = prices.profileMatte10mm;
      }
    } else if (hardwareColor === 'black') {
      profilePrice = prices.profileBlack;
    } else if (hardwareColor === 'gold') {
      profilePrice = prices.profileGold;
    }

    console.log('Selected Profile Price:', profilePrice);
    console.log('Profile Count:', profileCount);

    const profileCost = profilePrice * (profileCount === '' ? 0 : profileCount);
    total += profileCost;
    details.push(`Профили (${profileCount} шт.): ${profileCost.toFixed(2)} ₾`);

    // Стоимость раздвижной системы
    if (configuration === 'straight') {
      let slidingPrice = 0;
      if (hardwareColor === 'chrome' && prices.slidingChrome) {
        slidingPrice = prices.slidingChrome;
      } else if (hardwareColor === 'matte' && prices.slidingMatte) {
        slidingPrice = prices.slidingMatte;
      } else if (hardwareColor === 'black' && prices.slidingBlack) {
        slidingPrice = prices.slidingBlack;
      } else if (hardwareColor === 'gold' && prices.slidingGold) {
        slidingPrice = prices.slidingGold;
      }

      if (slidingPrice > 0) {
        total += slidingPrice;
        details.push(`Раздвижная система: ${slidingPrice.toFixed(2)} ₾`);
      }

      // Дополнительная направляющая
      if (additionalRail && prices.additionalRail) {
        total += prices.additionalRail;
        details.push(`Дополнительная направляющая: ${prices.additionalRail.toFixed(2)} ₾`);
      }

      // Профильная труба
      if (prices.profileTube) {
        total += prices.profileTube;
        details.push(`Профильная труба: ${prices.profileTube.toFixed(2)} ₾`);
      }
    }

    // Стоимость доставки
    if (delivery) {
      total += prices.delivery;
      details.push(`Доставка: ${prices.delivery} ₾`);
    }

    // Стоимость установки
    if (installation) {
      if (configuration === 'glass') {
        total += prices.installationGlass;
        details.push(`Установка стекляшки: ${prices.installationGlass} ₾`);
      } else if (configuration === 'straight') {
        total += prices.installationStraight;
        details.push(`Установка прямой раздвижной: ${prices.installationStraight} ₾`);
      } else if (configuration === 'corner') {
        total += prices.installationCorner;
        details.push(`Установка угловой раздвижной: ${prices.installationCorner} ₾`);
      }
    }

    // Дополнительная направляющая
    if (configuration === 'straight' && additionalRail) {
      total += prices.additionalRail;
      details.push(`Дополнительная направляющая: ${prices.additionalRail} ₾`);
    }

    // Добавляем базовую стоимость конструкции в конец
    if (configuration === 'glass') {
      total += prices.glassPrice;
      details.push(`Базовая стоимость стекляшки: ${prices.glassPrice} ₾`);
    } else if (configuration === 'straight') {
      total += prices.straightPrice;
      details.push(`Базовая стоимость прямой раздвижной: ${prices.straightPrice} ₾`);
    } else if (configuration === 'corner') {
      total += prices.cornerPrice;
      details.push(`Базовая стоимость угловой раздвижной: ${prices.cornerPrice} ₾`);
    }

    setCalculationDetails(details);
    setTotalPrice(total);
  };

  useEffect(() => {
    calculatePrice();
  }, [glassHeight, glassWidth, glassThickness, glassColor, hardwareColor, profileCount, configuration, prices, delivery, installation, isOpeningSize, openingLength, openingHeight, additionalRail, glassType, profileType]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!customerName) newErrors.customerName = 'Введите имя заказчика';
    if (!configuration) newErrors.configuration = 'Выберите конфигурацию';
    if (!glassColor) newErrors.glassColor = 'Выберите цвет стекла';
    if (!glassThickness) newErrors.glassThickness = 'Выберите толщину стекла';
    if (!hardwareColor) newErrors.hardwareColor = 'Выберите цвет фурнитуры';

    // Проверка размеров в зависимости от конфигурации
    if (configuration === 'straight' && isOpeningSize) {
      if (!openingLength) {
        newErrors.openingLength = 'Введите длину проема';
      } else {
        const length = parseFloat(openingLength);
        if (isNaN(length) || length < 0 || length > 5000) {
          newErrors.openingLength = 'Длина проема должна быть от 0 до 5000 мм';
        }
      }
      
      if (!openingHeight) {
        newErrors.openingHeight = 'Введите высоту проема';
      } else {
        const height = parseFloat(openingHeight);
        if (isNaN(height) || height < 0 || height > 5000) {
          newErrors.openingHeight = 'Высота проема должна быть от 0 до 5000 мм';
        }
      }
    } else if (configuration === 'straight' && !isOpeningSize) {
      if (!glassHeight) newErrors.glassHeight = 'Введите высоту стекла';
      if (!glassWidth) newErrors.glassWidth = 'Введите ширину стационарного стекла';
      if (!doorWidth) newErrors.doorWidth = 'Введите ширину двери';
    } else {
      if (!glassHeight) newErrors.glassHeight = 'Введите высоту стекла';
      if (!glassWidth) newErrors.glassWidth = 'Введите ширину стекла';
    }

    if (profileCount !== '' && (profileCount < 0 || profileCount > 9)) {
      newErrors.profileCount = 'Количество профилей должно быть от 0 до 9';
    }

    // Проверка на уникальность имени только при создании нового проекта
    if (!editingId) {
      const isNameExists = savedConfigs.some(config => 
        config.customerName === customerName
      );
      if (isNameExists) {
        newErrors.customerName = 'Проект с таким именем уже существует';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newConfig: SavedConfiguration = {
      id: editingId || Date.now().toString(),
      customerName,
      configuration,
      glassColor,
      glassThickness,
      glassHeight,
      glassWidth,
      hardwareColor,
      totalPrice,
      status: status as string,
      profileCount: profileCount === '' ? 0 : profileCount,
      comment,
      calculationDetails,
      originalPrice: totalPrice,
      delivery,
      installation,
      originalStatus: status as string,
    };

    let updatedConfigs;
    if (editingId) {
      updatedConfigs = savedConfigs.map(config => 
        config.id === editingId ? newConfig : config
      );
    } else {
      updatedConfigs = [...savedConfigs, newConfig];
    }

    setSavedConfigs(updatedConfigs);
    localStorage.setItem('savedConfigurations', JSON.stringify(updatedConfigs));
    setEditingId(null);
    setPriceChanged(false);
    setChangedDetails({});
    setShowSuccessMessage(true);
  };

  const handleEdit = (config: SavedConfiguration) => {
    setCustomerName(config.customerName);
    setConfiguration(config.configuration);
    setGlassColor(config.glassColor);
    setGlassThickness(config.glassThickness);
    setGlassHeight(config.glassHeight);
    setGlassWidth(config.glassWidth);
    setHardwareColor(config.hardwareColor);
    setTotalPrice(config.totalPrice);
    setOriginalPrice(config.totalPrice);
    setStatus(config.status as ProjectStatus);
    setProfileCount(config.profileCount === '' ? 0 : config.profileCount);
    setComment(config.comment);
    setCalculationDetails(config.calculationDetails);
    setEditingId(config.id);
    setPriceChanged(false);
    setChangedDetails({});
    setDelivery(config.delivery);
    setInstallation(config.installation);
    setIsOpeningSize(false);
    setOpeningLength('');
    setOpeningHeight('');
    setAdditionalRail(false);
    setGlassType('stationary');
  };

  const handleDelete = (id: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== id);
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('savedConfigurations', JSON.stringify(updatedConfigs));
  };

  const handleNewProject = () => {
    setCustomerName('');
    setConfiguration('');
    setGlassColor('clear');
    setGlassThickness('8');
    setHardwareColor('');
    setGlassHeight('');
    setGlassWidth('');
    setDoorWidth('');
    setProfileCount(1);
    setDelivery(true);
    setInstallation(true);
    setAdditionalRail(false);
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
    setOpenNewProjectDialog(false);
    localStorage.removeItem('calculatorState');
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as ProjectStatus;
    setStatus(newStatus);
    if (editingId) {
      const updatedConfigs = savedConfigs.map(config => 
        config.id === editingId ? { ...config, status: newStatus } : config
      );
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('savedConfigurations', JSON.stringify(updatedConfigs));
    }
  };

  const handleSaveDialogClose = () => {
    setOpenSaveDialog(false);
  };

  const handleConfigurationChange = (e: SelectChangeEvent) => {
    const newConfiguration = e.target.value;
    setConfiguration(newConfiguration);
    setGlassColor('clear');
    setGlassThickness('8');
    setHardwareColor('');
    setGlassHeight('');
    setGlassWidth('');
    setDoorWidth('');
    setProfileCount(1);
    setDelivery(true);
    setInstallation(true);
    setAdditionalRail(false);
    setComment('');
    setErrors({});
  };

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
    setGlassColor('clear');
    setGlassThickness('8');
    setHardwareColor('');
    setProfileCount(1);
    setGlassHeight('');
    setGlassWidth('');
    setDoorWidth('');
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

  const filteredConfigs = savedConfigs.filter(config => 
    config.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewProjectDialogClose = () => {
    setOpenNewProjectDialog(false);
  };

  const handleNewProjectSave = () => {
    handleSave();
    handleNewProjectDialogClose();
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} sx={{ pl: '50px' }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Детали расчета:
          </Typography>
          <List sx={{ pl: 0 }}>
            {customerName && (
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemText 
                  primary={`Заказ: ${customerName}`}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                      fontWeight: 'bold'
                    } 
                  }}
                />
              </ListItem>
            )}
            {comment && (
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemText 
                  primary={`Комментарий: ${comment}`}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                      fontStyle: 'italic'
                    } 
                  }}
                />
              </ListItem>
            )}
            {calculationDetails.map((detail, index) => (
              <ListItem key={index} sx={{ pl: 0, py: 0.5 }}>
                <ListItemText 
                  primary={detail} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                      color: changedDetails[detail] ? 'error.main' : 'inherit'
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            {priceChanged && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Старая стоимость: {originalPrice.toFixed(2)} ₾
              </Typography>
            )}
            <Typography 
              variant="h6" 
              sx={{ 
                color: priceChanged ? 'error.main' : 'inherit'
              }}
            >
              Итоговая стоимость: {totalPrice.toFixed(2)} ₾
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const textToCopy = [
                  customerName ? `Заказ: ${customerName}` : '',
                  comment ? `Комментарий: ${comment}` : '',
                  ...calculationDetails,
                  `Итоговая стоимость: ${totalPrice.toFixed(2)} ₾`
                ].filter(Boolean).join('\n');
                navigator.clipboard.writeText(textToCopy);
              }}
              sx={{ mt: 2 }}
            >
              Скопировать детали
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {editingId ? 'Редактирование' : 'Новый проект'}
            </Typography>
            <Box>
              <Button 
                variant="outlined" 
                onClick={handleNewProject} 
                sx={{ mr: 1 }}
              >
                Новый проект
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                {editingId ? 'Сохранить' : 'Сохранить проект'}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
              label="Заказ"
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
                <MenuItem value="straight-swing">Прямая распашная</MenuItem>
                <MenuItem value="corner-swing">Угловая распашная</MenuItem>
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
                        value={glassColor}
                        onChange={(e) => {
                          setGlassColor(e.target.value);
                          setErrors(prev => ({ ...prev, glassColor: '' }));
                        }}
                        label="Цвет стекла"
                      >
                        <MenuItem value={GLASS_TYPES.CLEAR}>Обычное</MenuItem>
                        <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультра Прозрачное</MenuItem>
                        <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструй</MenuItem>
                        <MenuItem value={GLASS_TYPES.MATTE_FACTORY} disabled={glassThickness === GLASS_THICKNESS.EIGHT}>Матовое заводское</MenuItem>
                        <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                        <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит Рус</MenuItem>
                        <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит Иран</MenuItem>
                      </Select>
                      {errors.glassColor && (
                        <FormHelperText>{errors.glassColor}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
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
                </Grid>

                <FormControl fullWidth error={!!errors.glassThickness} required>
                  <InputLabel>Толщина стекла</InputLabel>
                  <Select
                    value={glassThickness}
                    label="Толщина стекла"
                    onChange={(e: SelectChangeEvent) => setGlassThickness(e.target.value)}
                  >
                    <MenuItem value={GLASS_THICKNESS.EIGHT} disabled={glassColor === GLASS_TYPES.MATTE_FACTORY}>8 мм</MenuItem>
                    <MenuItem value={GLASS_THICKNESS.TEN}>10 мм</MenuItem>
                  </Select>
                  {errors.glassThickness && <FormHelperText>{errors.glassThickness}</FormHelperText>}
                </FormControl>

                <TextField
                  label="Количество профиля"
                  type="number"
                  value={profileCount}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : parseInt(e.target.value);
                    if (value === '' || (value >= 0 && value <= 9)) {
                      setProfileCount(value);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setProfileCount(0);
                    }
                  }}
                  inputProps={{ min: 0, max: 9 }}
                  fullWidth
                  error={!!errors.profileCount}
                  helperText={errors.profileCount}
                  required
                />

                <TextField
                  label="Высота стекла (мм)"
                  type="number"
                  value={glassHeight}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0 && value <= 5000) {
                      setGlassHeight(e.target.value);
                    }
                  }}
                  inputProps={{ min: 0, max: 5000 }}
                  fullWidth
                  error={!!errors.glassHeight}
                  helperText={errors.glassHeight}
                  required
                />

                <TextField
                  label="Ширина стекла (мм)"
                  type="number"
                  value={glassWidth}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0 && value <= 5000) {
                      setGlassWidth(e.target.value);
                    }
                  }}
                  inputProps={{ min: 0, max: 5000 }}
                  fullWidth
                  error={!!errors.glassWidth}
                  helperText={errors.glassWidth}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
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
                  <>
                    <TextField
                      label="Длина проема (мм)"
                      type="number"
                      value={openingLength}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 5000)) {
                          setOpeningLength(value);
                        }
                      }}
                      inputProps={{ min: 0, max: 5000 }}
                      fullWidth
                      error={!!errors.openingLength}
                      helperText={errors.openingLength}
                      required
                    />
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
                      inputProps={{ min: 0, max: 5000 }}
                      fullWidth
                      error={!!errors.openingHeight}
                      helperText={errors.openingHeight}
                      required
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      label="Высота стекла (мм)"
                      type="number"
                      value={glassHeight}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 0 && value <= 5000) {
                          setGlassHeight(e.target.value);
                        }
                      }}
                      inputProps={{ min: 0, max: 5000 }}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Ширина стационарного стекла (мм)"
                      type="number"
                      value={glassWidth}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 0 && value <= 5000) {
                          setGlassWidth(e.target.value);
                        }
                      }}
                      inputProps={{ min: 0, max: 5000 }}
                      fullWidth
                      required
                    />
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
                      inputProps={{ min: 0, max: 5000 }}
                      fullWidth
                      required
                    />
                  </>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth error={!!errors.glassColor} required>
                      <InputLabel>Цвет стекла</InputLabel>
                      <Select
                        value={glassColor}
                        label="Цвет стекла"
                        onChange={(e: SelectChangeEvent) => setGlassColor(e.target.value)}
                      >
                        <MenuItem value={GLASS_TYPES.CLEAR}>Обычное</MenuItem>
                        <MenuItem value={GLASS_TYPES.ULTRA_CLEAR}>Ультра Прозрачное</MenuItem>
                        <MenuItem value={GLASS_TYPES.MATTE_SANDBLASTED}>Матовое пескоструй</MenuItem>
                        <MenuItem value={GLASS_TYPES.MATTE_FACTORY} disabled={glassThickness === GLASS_THICKNESS.EIGHT}>Матовое заводское</MenuItem>
                        <MenuItem value={GLASS_TYPES.BRONZE}>Бронза</MenuItem>
                        <MenuItem value={GLASS_TYPES.GRAPHITE_RUS}>Графит Рус</MenuItem>
                        <MenuItem value={GLASS_TYPES.GRAPHITE_IRAN}>Графит Иран</MenuItem>
                      </Select>
                      {errors.glassColor && <FormHelperText>{errors.glassColor}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
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
                </Grid>

                <FormControl fullWidth error={!!errors.glassThickness} required>
                  <InputLabel>Толщина стекла</InputLabel>
                  <Select
                    value={glassThickness}
                    label="Толщина стекла"
                    onChange={(e: SelectChangeEvent) => setGlassThickness(e.target.value)}
                  >
                    <MenuItem value={GLASS_THICKNESS.EIGHT} disabled={glassColor === GLASS_TYPES.MATTE_FACTORY}>8 мм</MenuItem>
                    <MenuItem value={GLASS_THICKNESS.TEN}>10 мм</MenuItem>
                  </Select>
                  {errors.glassThickness && <FormHelperText>{errors.glassThickness}</FormHelperText>}
                </FormControl>

                <TextField
                  label="Количество профиля"
                  type="number"
                  value={profileCount}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : parseInt(e.target.value);
                    if (value === '' || (value >= 0 && value <= 9)) {
                      setProfileCount(value);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setProfileCount(0);
                    }
                  }}
                  inputProps={{ min: 0, max: 9 }}
                  fullWidth
                  error={!!errors.profileCount}
                  helperText={errors.profileCount}
                  required
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
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

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={additionalRail}
                      onChange={(e) => setAdditionalRail(e.target.checked)}
                    />
                  }
                  label="Дополнительная направляющая"
                />

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
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Typography variant="h6" gutterBottom>
          Сохраненные проекты
        </Typography>
        <TextField
          label="Поиск по имени"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <Stack spacing={2}>
          {filteredConfigs.map((config) => (
            <Paper 
              key={config.id} 
              sx={{ 
                position: 'relative', 
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Tooltip title={config.customerName} placement="top">
                  <Typography 
                    component="span" 
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      maxWidth: '200px',
                      display: '-webkit-box'
                    }}
                  >
                    {config.customerName}
                  </Typography>
                </Tooltip>
                <Chip 
                  label={config.status} 
                  color={
                    config.status === 'Оплачено' ? 'success' :
                    config.status === 'Рассчет' ? 'default' :
                    'primary'
                  }
                  size="small"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="span" variant="body2">
                  Стоимость: {config.totalPrice.toFixed(2)} ₾
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton edge="end" onClick={() => handleEdit(config)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(config.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              {config.comment && (
                <Tooltip title={config.comment} placement="top">
                  <Typography 
                    component="span" 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1, 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box'
                    }}
                  >
                    {config.comment}
                  </Typography>
                </Tooltip>
              )}
            </Paper>
          ))}
        </Stack>
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
          sx={{ 
            width: '100%',
            backgroundColor: '#4caf50',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            },
            '& .MuiAlert-message': {
              color: 'white'
            },
            '& .MuiAlert-action': {
              color: 'white'
            }
          }}
        >
          Проект успешно сохранен!
        </Alert>
      </Snackbar>

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
        open={openNewProjectDialog}
        onClose={handleNewProjectDialogClose}
      >
        <DialogTitle>Сохранить новый проект?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы хотите сохранить новый проект?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleNewProjectDialogClose} color="inherit">
            Отменить
          </Button>
          <Button onClick={handleNewProjectSave} color="primary" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Calculator; 