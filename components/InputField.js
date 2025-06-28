import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  theme = 'light',
  iconName,
  editable = true,
  required = false,
  style,
  containerStyle,
  labelStyle,
  errorStyle,
  maxLength
}) => {
  const isDark = theme === 'dark';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = {
    marginBottom: error ? 4 : 16,
    ...containerStyle
  };

  const labelStyles = {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: isDark ? '#ffd600' : '#6200ee',
    ...labelStyle
  };

  const inputContainerStyles = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: isDark ? '#181a20' : '#f6f6fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: error 
      ? '#ff4444' 
      : isFocused 
        ? (isDark ? '#ffd600' : '#6200ee')
        : (isDark ? '#333' : '#eee'),
    paddingHorizontal: 12,
    paddingVertical: multiline ? 12 : 0,
    minHeight: multiline ? numberOfLines * 20 + 24 : 44,
  };

  const inputStyles = {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#fff' : '#222',
    paddingVertical: multiline ? 0 : 12,
    textAlignVertical: multiline ? 'top' : 'center',
    ...style
  };

  const errorStyles = {
    fontSize: 14,
    color: '#ff4444',
    marginTop: 4,
    marginLeft: 4,
    ...errorStyle
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>
          {label}
          {required && <Text style={{ color: '#ff4444' }}>*</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyles}>
        {iconName && (
          <Ionicons 
            name={iconName} 
            size={20} 
            color={isDark ? '#bbb' : '#666'} 
            style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }} 
          />
        )}
        
        <TextInput
          style={inputStyles}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#bbb' : '#888'}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ marginLeft: 8, marginTop: multiline ? 2 : 0 }}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={isDark ? '#bbb' : '#666'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={errorStyles}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
