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
}

const AdminPanel: React.FC = () => {
  const [prices, setPrices] = useState<PriceConfig>({
    glassClear8mm: 0,
    glassClear10mm: 0,
    glassUltraClear8mm: 0,
    glassUltraClear10mm: 0,
    glassMatteSandblasted8mm: 0,
    glassMatteSandblasted10mm: 0,
    glassMatteFactory10mm: 0,
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

  const handlePriceChange = (field: keyof PriceConfig, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setPrices(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Настройка цен
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Стекло
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Стекло прозрачное 8 мм (₾)"
                  value={prices.glassClear8mm || ''}
                  onChange={(e) => handlePriceChange('glassClear8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло прозрачное 10 мм (₾)"
                  value={prices.glassClear10mm || ''}
                  onChange={(e) => handlePriceChange('glassClear10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Ультра Прозрачное 8 мм (₾)"
                  value={prices.glassUltraClear8mm || ''}
                  onChange={(e) => handlePriceChange('glassUltraClear8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Ультра Прозрачное 10 мм (₾)"
                  value={prices.glassUltraClear10mm || ''}
                  onChange={(e) => handlePriceChange('glassUltraClear10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Матовое Пескоструй 8 мм (₾)"
                  value={prices.glassMatteSandblasted8mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteSandblasted8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Матовое Пескоструй 10 мм (₾)"
                  value={prices.glassMatteSandblasted10mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteSandblasted10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Матовое Заводское 10 мм (₾)"
                  value={prices.glassMatteFactory10mm || ''}
                  onChange={(e) => handlePriceChange('glassMatteFactory10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Тонированное 8 мм (₾)"
                  value={prices.glassTinted8mm || ''}
                  onChange={(e) => handlePriceChange('glassTinted8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Стекло Тонированное 10 мм (₾)"
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Профили
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Профиль Хром (₾)"
                  value={prices.profileChrome8mm || ''}
                  onChange={(e) => handlePriceChange('profileChrome8mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Профиль Матовый (₾)"
                  value={prices.profileMatte10mm || ''}
                  onChange={(e) => handlePriceChange('profileMatte10mm', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Профиль Черный (₾)"
                  value={prices.profileBlack || ''}
                  onChange={(e) => handlePriceChange('profileBlack', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Профиль Золотой (₾)"
                  value={prices.profileGold || ''}
                  onChange={(e) => handlePriceChange('profileGold', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Крепления
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Крепление палка стена-стекло (₾)"
                  value={prices.mountingWallGlass || ''}
                  onChange={(e) => handlePriceChange('mountingWallGlass', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Крепление палка стена-стекло-стекло (₾)"
                  value={prices.mountingWallGlassGlass || ''}
                  onChange={(e) => handlePriceChange('mountingWallGlassGlass', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Раздвижные системы
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Раздвижка хром (₾)"
                  value={prices.slidingChrome || ''}
                  onChange={(e) => handlePriceChange('slidingChrome', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Раздвижка матовая (₾)"
                  value={prices.slidingMatte || ''}
                  onChange={(e) => handlePriceChange('slidingMatte', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Раздвижка черная (₾)"
                  value={prices.slidingBlack || ''}
                  onChange={(e) => handlePriceChange('slidingBlack', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Раздвижка золото (₾)"
                  value={prices.slidingGold || ''}
                  onChange={(e) => handlePriceChange('slidingGold', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Дополнительная направляющая (фиксатор) (₾)"
                  value={prices.additionalRail || ''}
                  onChange={(e) => handlePriceChange('additionalRail', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Профильная труба (рельса) (₾)"
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ручки
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ручка кноб (₾)"
                  value={prices.handleKnob || ''}
                  onChange={(e) => handlePriceChange('handleKnob', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ручка скоба маленькая (₾)"
                  value={prices.handleBracketSmall || ''}
                  onChange={(e) => handlePriceChange('handleBracketSmall', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ручка скоба большая (₾)"
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

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Дополнительные услуги
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Доставка (₾)"
                  value={prices.delivery || ''}
                  onChange={(e) => handlePriceChange('delivery', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Установка Стекляшки (₾)"
                  value={prices.installationGlass || ''}
                  onChange={(e) => handlePriceChange('installationGlass', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Установка Раздвижная прямая (₾)"
                  value={prices.installationStraight || ''}
                  onChange={(e) => handlePriceChange('installationStraight', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Установка Раздвижная угловая (₾)"
                  value={prices.installationCorner || ''}
                  onChange={(e) => handlePriceChange('installationCorner', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Базовая стоимость конструкций
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Стекляшка (₾)"
                  value={prices.glassPrice || ''}
                  onChange={(e) => handlePriceChange('glassPrice', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Прямая раздвижная (₾)"
                  value={prices.straightPrice || ''}
                  onChange={(e) => handlePriceChange('straightPrice', e.target.value)}
                  fullWidth
                  type="text"
                  inputProps={{ inputMode: 'decimal' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Угловая раздвижная (₾)"
                  value={prices.cornerPrice || ''}
                  onChange={(e) => handlePriceChange('cornerPrice', e.target.value)}
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