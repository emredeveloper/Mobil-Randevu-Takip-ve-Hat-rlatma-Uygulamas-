import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Ara...', 
  theme = 'light',
  onFocus,
  onBlur,
  style,
  autoFocus = false 
}) => {
  const isDark = theme === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const clearSearch = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  const borderColor = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [isDark ? '#333' : '#e0e0e0', isDark ? '#ffd600' : '#6200ee'],
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? '#181a20' : '#f6f6fa',
          borderRadius: 25,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 16,
          marginVertical: 8,
          borderWidth: 1,
          borderColor: borderColor,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        },
        style,
      ]}
    >
      <Ionicons 
        name="search-outline" 
        size={20} 
        color={isDark ? '#bbb' : '#666'} 
        style={{ marginRight: 12 }}
      />
      
      <TextInput
        ref={inputRef}
        style={{
          flex: 1,
          fontSize: 16,
          color: isDark ? '#fff' : '#333',
          paddingVertical: 0,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#bbb' : '#888'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      
      {value ? (
        <TouchableOpacity onPress={clearSearch} style={{ marginLeft: 8 }}>
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={isDark ? '#bbb' : '#666'} 
          />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

export default SearchBar; 