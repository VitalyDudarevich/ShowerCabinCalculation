import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { CustomHardwareItem, PriceConfig } from '../types';

interface AdditionalHardwareDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (items: CustomHardwareItem[]) => void;
  hardwareColor: string;
  prices: PriceConfig;
  existingItems?: CustomHardwareItem[];
}

export const AdditionalHardwareDialog: React.FC<AdditionalHardwareDialogProps> = ({
  open,
  onClose,
  onSave,
  hardwareColor,
  prices,
  existingItems = []
}) => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customItems, setCustomItems] = useState<CustomHardwareItem[]>(existingItems);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCustomItems(existingItems);
    setHasChanges(false);
  }, [existingItems]);

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

  const getItemPrice = (itemName: string): number => {
    switch (itemName) {
      case 'Петля 90 градусов':
        return prices.hinge90;
      case 'Петля 180 градусов':
        return prices.hinge180;
      case 'Петля 135 градусов':
        return prices.hinge135;
      case 'Ручка':
        return prices.handleKnob;
      case 'Крепление палка стена-стекло':
        return prices.mountingWallGlass;
      case 'Крепление палка стена-стекло-стекло':
        return prices.mountingWallGlassGlass;
      case 'Раздвижная система':
        switch (hardwareColor) {
          case 'chrome':
            return prices.slidingChrome;
          case 'matte':
            return prices.slidingMatte;
          case 'black':
            return prices.slidingBlack;
          case 'gold':
            return prices.slidingGold;
          default:
            return 0;
        }
      case 'Дополнительная направляющая':
        return prices.additionalRail;
      case 'Дополнительный профиль':
        return prices.profileTube;
      default:
        return 0;
    }
  };

  const handleAddItem = () => {
    if (!selectedItem) return;

    const newItem: CustomHardwareItem = {
      id: Date.now().toString(),
      name: selectedItem,
      quantity: quantity,
      price: getItemPrice(selectedItem)
    };

    setCustomItems([...customItems, newItem]);
    setSelectedItem('');
    setQuantity(1);
    setHasChanges(true);
  };

  const handleRemoveItem = (id: string) => {
    setCustomItems(customItems.filter(item => item.id !== id));
    setHasChanges(true);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCustomItems(customItems.map(item =>
      item.id === id ? { 
        ...item, 
        quantity: newQuantity,
        price: getItemPrice(item.name)
      } : item
    ));
    setHasChanges(true);
  };

  const handleClose = () => {
    setSelectedItem('');
    setQuantity(1);
    setCustomItems(existingItems);
    setHasChanges(false);
    onClose();
  };

  const handleSave = () => {
    onSave(customItems);
    setSelectedItem('');
    setQuantity(1);
    setHasChanges(false);
    onClose();
  };

  const availableItems = getAvailableHardwareItems();
  const addedItemNames = customItems.map(item => item.name);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          '& .MuiDialogContent-root': {
            paddingTop: '24px !important'
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Дополнительная фурнитура</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mt: 2 }}>
            <FormControl sx={{ flex: 2 }} variant="outlined">
              <InputLabel id="hardware-select-label">Название фурнитуры</InputLabel>
              <Select
                labelId="hardware-select-label"
                value={selectedItem}
                label="Название фурнитуры"
                onChange={(e: SelectChangeEvent) => setSelectedItem(e.target.value)}
              >
                {availableItems.map((item) => (
                  <MenuItem 
                    key={item} 
                    value={item}
                    disabled={addedItemNames.includes(item)}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="number"
              label="Количество"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              sx={{ flex: 1 }}
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              disabled={!selectedItem}
              sx={{ height: '56px', flex: 1 }}
            >
              Добавить
            </Button>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Добавленная фурнитура:
        </Typography>
        <List>
          {customItems.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.name}
                secondary={`Цена: ${item.price} ₾`}
              />
              <ListItemSecondaryAction>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, style: { width: '60px' } }}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ 
            flex: 1,
            height: '56px',
            textTransform: 'none',
            borderRadius: 1
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!hasChanges}
          sx={{ 
            flex: 1,
            height: '56px',
            textTransform: 'none',
            borderRadius: 1
          }}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 