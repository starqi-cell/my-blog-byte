export const lightTheme = {
  colors: {
    primary: '#1890ff',
    primaryHover: '#40a9ff',
    primaryActive: '#096dd9',
    secondary: '#52c41a',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
    
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceHover: '#fafafa',
    border: '#d9d9d9',
    divider: '#f0f0f0',
    
    text: '#262626',
    textSecondary: '#8c8c8c',
    textTertiary: '#bfbfbf',
    textInverse: '#ffffff',
    
    link: '#1890ff',
    linkHover: '#40a9ff',
    linkActive: '#096dd9',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHeavy: 'rgba(0, 0, 0, 0.15)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
    round: '50%',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },
  
  transition: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export const darkTheme: typeof lightTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#177ddc',
    primaryHover: '#3c9ae8',
    primaryActive: '#1765ad',
    
    background: '#141414',
    surface: '#1f1f1f',
    surfaceHover: '#262626',
    border: '#434343',
    divider: '#303030',
    
    text: '#e8e8e8',
    textSecondary: '#a6a6a6',
    textTertiary: '#595959',
    textInverse: '#141414',
    
    link: '#177ddc',
    linkHover: '#3c9ae8',
    linkActive: '#1765ad',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHeavy: 'rgba(0, 0, 0, 0.5)',
  },
};

export type Theme = typeof lightTheme;
