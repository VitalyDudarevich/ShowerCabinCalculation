import React from 'react';
import { Box, Typography, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { CustomHardwareItem } from '../types';

interface CustomHardwareListProps {
  items: CustomHardwareItem[];
  currency: 'BYN' | 'GEL';
  onQuantityChange: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export const CustomHardwareList: React.FC<CustomHardwareListProps> = ({
  items,
  currency,
  onQuantityChange,
  onRemove,
  onAdd
}) => {
  return (
    <Box>
      {items.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2
          }}
        >
          <Typography sx={{ flex: 1 }}>{item.name}</Typography>
          <TextField
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 0) {
                onQuantityChange(index, value);
              }
            }}
            inputProps={{ min: 0 }}
            sx={{ width: '100px' }}
          />
          <IconButton
            onClick={() => onRemove(index)}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'error.main'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        onClick={onAdd}
        startIcon={<AddIcon />}
        fullWidth
        sx={{ mt: 2 }}
      >
        Добавить фурнитуру
      </Button>
    </Box>
  );
}; 