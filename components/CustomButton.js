import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  theme = 'light',
  variant = 'primary', // primary, secondary, outline, danger
  size = 'medium', // small, medium, large
  iconName,
  iconPosition = 'left' // left, right
}) => {
  const isDark = theme === 'dark';
  
  const getButtonStyle = () => {
    let baseStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 20;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = isDark ? '#333' : '#f0f0f0';
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = isDark ? '#ffd600' : '#6200ee';
        break;
      case 'danger':
        baseStyle.backgroundColor = '#ff4444';
        break;
      default: // primary
        baseStyle.backgroundColor = isDark ? '#ffd600' : '#6200ee';
    }

    // Disabled state
    if (disabled) {
      baseStyle.backgroundColor = '#ccc';
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    let baseTextStyle = {
      fontWeight: 'bold',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
    }

    // Color variations
    switch (variant) {
      case 'secondary':
        baseTextStyle.color = isDark ? '#fff' : '#333';
        break;
      case 'outline':
        baseTextStyle.color = isDark ? '#ffd600' : '#6200ee';
        break;
      case 'danger':
        baseTextStyle.color = '#fff';
        break;
      default: // primary
        baseTextStyle.color = isDark ? '#222' : '#fff';
    }

    if (disabled) {
      baseTextStyle.color = '#999';
    }

    return baseTextStyle;
  };

  const iconColor = () => {
    if (disabled) return '#999';
    
    switch (variant) {
      case 'secondary':
        return isDark ? '#fff' : '#333';
      case 'outline':
        return isDark ? '#ffd600' : '#6200ee';
      case 'danger':
        return '#fff';
      default: // primary
        return isDark ? '#222' : '#fff';
    }
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size={size === 'small' ? 'small' : 'small'} 
          color={iconColor()} 
        />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <Ionicons 
              name={iconName} 
              size={iconSize} 
              color={iconColor()} 
              style={{ marginRight: title ? 8 : 0 }} 
            />
          )}
          
          {title && (
            <Text style={[getTextStyle(), textStyle]}>
              {title}
            </Text>
          )}
          
          {iconName && iconPosition === 'right' && (
            <Ionicons 
              name={iconName} 
              size={iconSize} 
              color={iconColor()} 
              style={{ marginLeft: title ? 8 : 0 }} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
