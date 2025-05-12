import React from 'react';
import { Box, Button, FormControlLabel, Checkbox } from '@mui/material';
import type { AdditionalHardware } from '../types';

interface AddHardwareButtonProps {
  delivery: boolean;
  installation: boolean;
  setDelivery: (value: boolean) => void;
  setInstallation: (value: boolean) => void;
  setOpenHardwareDialog: (value: boolean) => void;
  additionalHardware: AdditionalHardware;
  removeCustomHardware: (id: string) => void;
}

export const AddHardwareButton: React.FC<AddHardwareButtonProps> = ({
  delivery,
  installation,
  setDelivery,
  setInstallation,
  setOpenHardwareDialog,
  additionalHardware,
  removeCustomHardware
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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

      <Button
        variant="outlined"
        onClick={() => setOpenHardwareDialog(true)}
        fullWidth
        sx={{ mb: 2 }}
      >
        Добавить фурнитуру
      </Button>
    </Box>
  );
}; 