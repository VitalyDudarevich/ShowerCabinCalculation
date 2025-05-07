import { SxProps, Theme } from '@mui/material';

export const calculatorStyles = {
  root: {
    p: 0.4,
    '& .MuiToolbar-root.MuiToolbar-regular': {
      minHeight: '32px !important',
      height: '32px !important',
      padding: '0 16px !important'
    },
    '& .MuiToolbar-root .MuiTypography-h6': {
      fontSize: '1rem !important',
      lineHeight: '32px !important',
      margin: '0 !important'
    },
    '& .MuiToolbar-root .MuiButton-root': {
      padding: '4px 8px !important',
      minHeight: '32px !important',
      height: '32px !important',
      margin: '0 !important'
    },
    '& .MuiToolbar-root .MuiButtonBase-root': {
      padding: '4px 8px !important',
      minHeight: '32px !important',
      height: '32px !important',
      margin: '0 !important'
    }
  },
  topBar: {
    p: 1,
    position: { xs: 'sticky', md: 'static' },
    top: 0,
    zIndex: 1000,
    backgroundColor: 'background.paper',
    boxShadow: { xs: '0 2px 4px rgba(0,0,0,0.1)', md: 'none' }
  },
  topBarContent: {
    display: 'flex',
    gap: 0.5
  },
  leftColumn: {
    p: 3,
    height: '100%'
  },
  list: {
    pl: 0
  },
  listItem: {
    pl: 0,
    py: 0.5
  },
  listItemText: {
    '& .MuiListItemText-primary': {
      fontSize: '0.9rem',
      lineHeight: 1.2,
      fontWeight: 'bold'
    }
  },
  priceContainer: {
    mt: 2
  },
  priceChange: {
    mb: 1
  },
  price: {
    color: 'inherit'
  },
  mainContent: {
    p: 3,
    height: '100%'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  inputGrid: {
    mt: 2
  },
  checkboxContainer: {
    display: 'flex',
    gap: 2,
    mt: 2
  },
  uniqueConfiguration: {
    mt: 2
  },
  glassCard: {
    mb: 3,
    p: 2,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1
  },
  glassCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2
  },
  addGlassButton: {
    mt: 1,
    mb: 3
  },
  addHardwareButton: {
    mt: 1
  },
  addedHardware: {
    mt: 2,
    p: 2,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1
  },
  addedHardwareTitle: {
    mb: 1
  },
  addedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1
  },
  itemName: {
    flex: 1
  },
  commentField: {
    mt: 2
  },
  projectHistory: {
    height: '100%'
  },
  projectCard: {
    pl: 2,
    pr: 2,
    py: 1.5,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    mb: 1,
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  },
  projectName: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical'
  },
  projectDetails: {
    fontSize: '0.8rem'
  },
  deleteIcon: {
    color: 'text.secondary',
    '&:hover': {
      backgroundColor: 'action.hover',
      color: 'primary.main'
    }
  },
  dialogButton: {
    minWidth: '120px',
    textTransform: 'none',
    borderRadius: 1
  },
  dialogActions: {
    px: 3,
    py: 2,
    gap: 1
  },
  dialogPaper: {
    minWidth: '300px',
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  },
  dialogTitle: {
    fontSize: '1.2rem',
    pb: 1
  },
  successMessage: {
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
  }
} as const;

export type CalculatorStyles = typeof calculatorStyles; 