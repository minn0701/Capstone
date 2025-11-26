// 공통 스타일 테마

export const theme = {
  colors: {
    background: {
      primary: '#1e1e1e',
      secondary: '#2b2d31',
      tertiary: '#313338',
      hover: '#36393f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaa',
      tertiary: '#888',
      error: '#ff6666',
      success: '#66ff66',
      warning: '#ffaa00',
    },
    border: {
      default: '#444',
      hover: '#555',
      focus: '#5865f2',
    },
    button: {
      primary: '#5865f2',
      primaryHover: '#4752c4',
      success: '#4ade80',
      successHover: '#22c55e',
      danger: '#dc2626',
      dangerHover: '#b91c1c',
      disabled: '#555',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.85rem',
    md: '0.9rem',
    base: '1rem',
    lg: '1.2rem',
    xl: '1.5rem',
  },
};

export const commonStyles = {
  input: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.border.focus,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  button: {
    primary: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      backgroundColor: theme.colors.button.primary,
      color: theme.colors.text.primary,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.base,
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'background-color 0.2s',
      '&:hover:not(:disabled)': {
        backgroundColor: theme.colors.button.primaryHover,
      },
      '&:disabled': {
        backgroundColor: theme.colors.button.disabled,
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
    success: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      backgroundColor: theme.colors.button.success,
      color: theme.colors.text.primary,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.sm,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover:not(:disabled)': {
        backgroundColor: theme.colors.button.successHover,
      },
      '&:disabled': {
        backgroundColor: theme.colors.button.disabled,
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
    secondary: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.sm,
      cursor: 'pointer',
      transition: 'background-color 0.2s, border-color 0.2s',
      '&:hover:not(:disabled)': {
        backgroundColor: theme.colors.background.hover,
        borderColor: theme.colors.border.hover,
      },
      '&:disabled': {
        backgroundColor: theme.colors.button.disabled,
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
    danger: {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      backgroundColor: theme.colors.button.danger,
      color: theme.colors.text.primary,
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.sm,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover:not(:disabled)': {
        backgroundColor: theme.colors.button.dangerHover,
      },
      '&:disabled': {
        backgroundColor: theme.colors.button.disabled,
        cursor: 'not-allowed',
        opacity: 0.5,
      },
    },
  },
  card: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    marginBottom: theme.spacing.xl,
  },
  message: {
    success: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: '#1a3a1a',
      color: theme.colors.text.success,
      border: '1px solid #44ff44',
    },
    error: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: '#3a1a1a',
      color: theme.colors.text.error,
      border: '1px solid #ff4444',
    },
    warning: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: '#3a3a1a',
      color: theme.colors.text.warning,
      border: '1px solid #ffaa00',
    },
  },
};

