// Tema renk paletleri
export const colors = {
  light: {
    // Ana renkler
    primary: '#6200ee',
    primaryLight: '#7c4dff',
    primaryDark: '#3700b3',
    secondary: '#03dac6',
    secondaryLight: '#66fff9',
    secondaryDark: '#00a896',
    
    // Arka plan renkleri
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceVariant: '#f6f6fa',
    
    // Metin renkleri
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onBackground: '#222222',
    onSurface: '#222222',
    onSurfaceVariant: '#666666',
    
    // Durum renkleri
    success: '#4caf50',
    warning: '#ff9800',
    error: '#ff4444',
    info: '#2196f3',
    
    // Gri tonları
    grey50: '#fafafa',
    grey100: '#f5f5f5',
    grey200: '#eeeeee',
    grey300: '#e0e0e0',
    grey400: '#bdbdbd',
    grey500: '#9e9e9e',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#212121',
    
    // Özel renkler
    border: '#e0e0e0',
    placeholder: '#888888',
    disabled: '#cccccc',
    shadow: '#000000',
  },
  
  dark: {
    // Ana renkler
    primary: '#ffd600',
    primaryLight: '#ffff52',
    primaryDark: '#c7a500',
    secondary: '#03dac6',
    secondaryLight: '#66fff9',
    secondaryDark: '#00a896',
    
    // Arka plan renkleri
    background: '#181a20',
    surface: '#23242a',
    surfaceVariant: '#2a2b32',
    
    // Metin renkleri
    onPrimary: '#222222',
    onSecondary: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onSurfaceVariant: '#bbbbbb',
    
    // Durum renkleri
    success: '#4caf50',
    warning: '#ff9800',
    error: '#ff4444',
    info: '#2196f3',
    
    // Gri tonları
    grey50: '#1a1a1a',
    grey100: '#2d2d2d',
    grey200: '#404040',
    grey300: '#595959',
    grey400: '#737373',
    grey500: '#8c8c8c',
    grey600: '#a6a6a6',
    grey700: '#bfbfbf',
    grey800: '#d9d9d9',
    grey900: '#f2f2f2',
    
    // Özel renkler
    border: '#333333',
    placeholder: '#bbbbbb',
    disabled: '#666666',
    shadow: '#000000',
  }
};

// Tipografi
export const typography = {
  // Font boyutları
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  
  // Font ağırlıkları
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Satır yükseklikleri
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
  }
};

// Spacing (boşluklar)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius değerleri
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow değerleri
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Tema yardımcı fonksiyonları
export const getThemeColors = (theme) => {
  return colors[theme] || colors.light;
};

export const createThemeStyles = (theme) => {
  const themeColors = getThemeColors(theme);
  
  return {
    container: {
      backgroundColor: themeColors.background,
    },
    surface: {
      backgroundColor: themeColors.surface,
    },
    card: {
      backgroundColor: themeColors.surface,
      borderRadius: borderRadius.lg,
      ...shadows.md,
    },
    text: {
      primary: {
        color: themeColors.onSurface,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.normal,
      },
      secondary: {
        color: themeColors.onSurfaceVariant,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.normal,
      },
      heading: {
        color: themeColors.onSurface,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
      },
    },
    button: {
      primary: {
        backgroundColor: themeColors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
      },
      secondary: {
        backgroundColor: themeColors.secondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
      },
    },
    input: {
      backgroundColor: themeColors.surfaceVariant,
      borderColor: themeColors.border,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      color: themeColors.onSurface,
    }
  };
};

// Animasyon sabitleri
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  }
};

// Breakpoint değerleri (responsive tasarım için)
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  getThemeColors,
  createThemeStyles,
  animations,
  breakpoints
};
