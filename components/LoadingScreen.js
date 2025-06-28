import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ visible, message = 'Yükleniyor...', theme = 'light' }) => {
  const isDark = theme === 'dark';
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Giriş animasyonu
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Döndürme animasyonu
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();

      return () => spinAnimation.stop();
    } else {
      // Çıkış animasyonu
      Animated.parallel([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: opacityValue,
      }}
    >
      <Animated.View
        style={{
          backgroundColor: isDark ? '#23242a' : '#ffffff',
          borderRadius: 20,
          padding: 40,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 10,
          transform: [{ scale: scaleValue }],
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
            marginBottom: 20,
          }}
        >
          <Ionicons
            name="refresh-outline"
            size={48}
            color={isDark ? '#ffd600' : '#6200ee'}
          />
        </Animated.View>
        
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#fff' : '#333',
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export default LoadingScreen; 