import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface PriceConfig {
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
  mountingWall: number;
  mountingWallGlassGlass: number;
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
  mountingGlass: number;
  mountingPipe: number;
  mountingPipePipe: number;
}

const AdminPanel: React.FC = () => {
  const [prices, setPrices] = useState<PriceConfig>(() => {
    const savedPrices = localStorage.getItem('showerPrices');
    if (savedPrices) {
      const parsedPrices = JSON.parse(savedPrices);
      return {
        ...parsedPrices,
        currency: parsedPrices.currency || 'BYN',
        showUsdPrice: parsedPrices.showUsdPrice ?? true,
        slidingSystem: parsedPrices.slidingSystem || 0
      };
    }
    return {
      glassClear8mm: 0,
      glassClear10mm: 0,
      glassTinted8mm: 0,
      glassTinted10mm: 0,
      profile8mm: 0,
      profile10mm: 0,
      mountingWall: 0,
      mountingWallGlassGlass: 0,
      slidingSystem: 0,
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
      currency: 'BYN',
      usdRate: 1,
      showUsdPrice: true,
      hinge90: 0,
      hinge180: 0,
      hinge135: 0,
      uniquePrice: 0,
      installationUnique: 0,
      mountingGlass: 0,
      mountingPipe: 0,
      mountingPipePipe: 0
    };
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrices = localStorage.getItem('showerPrices');
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('showerPrices', JSON.stringify(prices));
    setSaved(true);
  };

  const handlePriceChange = (field: keyof PriceConfig, value: string | boolean) => {
    if (field === 'currency') {
      setPrices(prev => ({ ...prev, [field]: value as 'BYN' | 'GEL' }));
    } else if (field === 'showUsdPrice') {
      setPrices(prev => ({ ...prev, [field]: value as boolean }));
    } else {
      const numValue = value === '' ? 0 : parseFloat(value as string);
      setPrices(prev => ({ ...prev, [field]: numValue }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Настройка цен
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} direction="row" alignItems="center" sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Typography variant="h6">
                  Настройки валюты
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prices.showUsdPrice}
                      onChange={(e) => handlePriceChange('showUsdPrice', e.target.checked)}
                    />
                  }
                  label="Показывать цены в USD"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid container spacing={2} direction="row" alignItems="flex-start">
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Валюта</InputLabel>
                    <Select
                      value={prices.currency}
                      label="Валюта"
                      onChange={(e) => handlePriceChange('currency', e.target.value)}
                    >
                      <MenuItem value="BYN">BYN</MenuItem>
                      <MenuItem value="GEL">GEL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Курс USD"
                    value={prices.usdRate || ''}
                    onChange={(e) => handlePriceChange('usdRate', e.target.value)}
                    fullWidth
                    type="number"
                    inputProps={{ inputMode: 'decimal', step: '0.01' }}
                    helperText="Курс USD к выбранной валюте"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Базовая стоимость конструкций
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Базовая стоимость стекляшки"
                  type="number"
                  value={prices.glassPrice}
                  onChange={(e) => handlePriceChange('glassPrice', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Базовая стоимость прямой раздвижной"
                  type="number"
                  value={prices.straightPrice}
                  onChange={(e) => handlePriceChange('straightPrice', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Базовая стоимость угловой раздвижной"
                  type="number"
                  value={prices.cornerPrice}
                  onChange={(e) => handlePriceChange('cornerPrice', e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Базовая стоимость уникальной конфигурации"
                  type="number"
                  value={prices.uniquePrice}
                  onChange={(e) => handlePriceChange('uniquePrice', e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Фиксатор"
                  type="number"
                  value={prices.additionalRail}
                  onChange={(e) => handlePriceChange('additionalRail', e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Стекло
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло прозрачное 8 мм (${prices.currency})`}
                  value={prices.glassClear8mm || ''}
                  onChange={(e) => handlePriceChange('glassClear8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло прозрачное 10 мм (${prices.currency})`}
                  value={prices.glassClear10mm || ''}
                  onChange={(e) => handlePriceChange('glassClear10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Ультра Прозрачное 8 мм (${prices.currency})`}
                  value={prices.glassUltraClear8mm || ''}
                  onChange={(e) => handlePriceChange('glassUltraClear8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Ультра Прозрачное 10 мм (${prices.currency})`}
                  value={prices.glassUltraClear10mm || ''}
                  onChange={(e) => handlePriceChange('glassUltraClear10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Матовое Пескоструй 8 мм (${prices.currency})`}
                  value={prices.glassMatteSandblasted8mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteSandblasted8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Матовое Пескоструй 10 мм (${prices.currency})`}
                  value={prices.glassMatteSandblasted10mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteSandblasted10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Матовое Заводское 10 мм (${prices.currency})`}
                  value={prices.glassMatteFactory10mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteFactory10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Тонированное 8 мм (${prices.currency})`}
                  value={prices.glassTinted8mm || ''}
                  onChange={(e) => handlePriceChange('glassTinted8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Стекло Тонированное 10 мм (${prices.currency})`}
                  value={prices.glassTinted10mm || ''}
                  onChange={(e) => handlePriceChange('glassTinted10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Профили
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Профиль 8 мм (${prices.currency})`}
                  value={prices.profile8mm || ''}
                  onChange={(e) => handlePriceChange('profile8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Профиль 10 мм (${prices.currency})`}
                  value={prices.profile10mm || ''}
                  onChange={(e) => handlePriceChange('profile10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Крепления
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Крепление стекло-стекло (${prices.currency})`}
                  value={prices.mountingGlass || ''}
                  onChange={(e) => handlePriceChange('mountingGlass', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Палка стена-стекло (${prices.currency})`}
                  value={prices.mountingWall || ''}
                  onChange={(e) => handlePriceChange('mountingWall', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Крепление труба-стекло (${prices.currency})`}
                  value={prices.mountingPipe || ''}
                  onChange={(e) => handlePriceChange('mountingPipe', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Уголок труба-труба (${prices.currency})`}
                  value={prices.mountingPipePipe || ''}
                  onChange={(e) => handlePriceChange('mountingPipePipe', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Петли
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Петля 90 градусов (${prices.currency})`}
                  value={prices.hinge90 || ''}
                  onChange={(e) => handlePriceChange('hinge90', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Петля 180 градусов (${prices.currency})`}
                  value={prices.hinge180 || ''}
                  onChange={(e) => handlePriceChange('hinge180', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Петля 135 градусов (${prices.currency})`}
                  value={prices.hinge135 || ''}
                  onChange={(e) => handlePriceChange('hinge135', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ручки
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Ручка кноб (${prices.currency})`}
                  value={prices.handleKnob || ''}
                  onChange={(e) => handlePriceChange('handleKnob', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Ручка скоба маленькая (${prices.currency})`}
                  value={prices.handleBracketSmall || ''}
                  onChange={(e) => handlePriceChange('handleBracketSmall', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Ручка скоба большая (${prices.currency})`}
                  value={prices.handleBracketLarge || ''}
                  onChange={(e) => handlePriceChange('handleBracketLarge', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Дополнительные услуги
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Доставка (${prices.currency})`}
                  value={prices.delivery || ''}
                  onChange={(e) => handlePriceChange('delivery', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Установка Стекляшки (${prices.currency})`}
                  value={prices.installationGlass || ''}
                  onChange={(e) => handlePriceChange('installationGlass', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Установка Раздвижная прямая (${prices.currency})`}
                  value={prices.installationStraight || ''}
                  onChange={(e) => handlePriceChange('installationStraight', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Установка Раздвижная угловая (${prices.currency})`}
                  value={prices.installationCorner || ''}
                  onChange={(e) => handlePriceChange('installationCorner', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Установка Уникальной конфигурации (${prices.currency})`}
                  value={prices.installationUnique || ''}
                  onChange={(e) => handlePriceChange('installationUnique', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Раздвижная система
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={`Раздвижная система (${prices.currency})`}
                  value={prices.slidingSystem || ''}
                  onChange={(e) => handlePriceChange('slidingSystem', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={`Профильная труба (рельса) (${prices.currency})`}
                  value={prices.profileTube || ''}
                  onChange={(e) => handlePriceChange('profileTube', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleSave}>
          Сохранить цены
        </Button>

        {saved && (
          <>
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
                zIndex: 999
              }}
            />
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2,
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                minWidth: '400px',
                fontSize: '1.1rem',
                py: 2,
                '& .MuiAlert-message': {
                  fontSize: '1.1rem'
                }
              }}
              action={
                <Button 
                  color="inherit" 
                  size="large" 
                  onClick={() => setSaved(false)}
                  sx={{ fontSize: '1.1rem' }}
                >
                  OK
                </Button>
              }
            >
              Цены успешно сохранены!
            </Alert>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminPanel; 