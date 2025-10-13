import { useTheme, useMediaQuery } from '@mui/material';

// Breakpoint values
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Custom hook for responsive design
export const useResponsive = () => {
  const theme = useTheme();
  
  return {
    isMobile: useMediaQuery(theme.breakpoints.down('sm')),
    isTablet: useMediaQuery(theme.breakpoints.between('sm', 'md')),
    isDesktop: useMediaQuery(theme.breakpoints.up('md')),
    isLarge: useMediaQuery(theme.breakpoints.up('lg')),
    isXLarge: useMediaQuery(theme.breakpoints.up('xl')),
  };
};

// Responsive grid columns helper
export const getResponsiveColumns = (mobile = 1, tablet = 2, desktop = 3, large = 4) => ({
  xs: `repeat(${mobile}, 1fr)`,
  sm: `repeat(${tablet}, 1fr)`,
  md: `repeat(${desktop}, 1fr)`,
  lg: `repeat(${large}, 1fr)`,
});

// Responsive spacing helper
export const getResponsiveSpacing = (mobile = 2, tablet = 3, desktop = 4) => ({
  xs: mobile,
  sm: tablet,
  md: desktop,
});

// Responsive typography helper
export const getResponsiveTypography = (mobileSize: string, desktopSize: string) => ({
  fontSize: mobileSize,
  '@media (min-width:600px)': {
    fontSize: desktopSize,
  },
});

// Container padding helper
export const getContainerPadding = () => ({
  px: { xs: 2, sm: 3, md: 4 },
});

// Card margin helper for mobile
export const getCardMargin = () => ({
  mx: { xs: 1, sm: 0 },
});

// Touch-friendly button sizing
export const getTouchFriendlyButton = () => ({
  minHeight: 44,
  minWidth: 44,
  '@media (max-width:599px)': {
    fontSize: '0.875rem',
    padding: '8px 16px',
  },
});

// Mobile-first grid system
export const getMobileGrid = (columns: { xs?: number; sm?: number; md?: number; lg?: number }) => ({
  display: 'grid',
  gridTemplateColumns: {
    xs: `repeat(${columns.xs || 1}, 1fr)`,
    sm: `repeat(${columns.sm || 2}, 1fr)`,
    md: `repeat(${columns.md || 3}, 1fr)`,
    lg: `repeat(${columns.lg || 4}, 1fr)`,
  },
  gap: { xs: 2, sm: 3 },
});

// Safe area padding for mobile devices
export const getSafeAreaPadding = () => ({
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  paddingLeft: 'env(safe-area-inset-left)',
  paddingRight: 'env(safe-area-inset-right)',
});

// Responsive font sizes
export const responsiveFontSizes = {
  h1: { xs: '1.75rem', sm: '2.5rem' },
  h2: { xs: '1.5rem', sm: '2rem' },
  h3: { xs: '1.25rem', sm: '1.5rem' },
  h4: { xs: '1.125rem', sm: '1.25rem' },
  body1: { xs: '0.875rem', sm: '1rem' },
  body2: { xs: '0.75rem', sm: '0.875rem' },
};

// Mobile navigation height
export const getMobileNavHeight = () => ({
  height: { xs: 56, sm: 64 },
});

// Responsive modal/dialog sizing
export const getResponsiveModal = () => ({
  width: { xs: '95vw', sm: '80vw', md: '60vw', lg: '40vw' },
  maxWidth: '600px',
  margin: { xs: 1, sm: 2 },
});