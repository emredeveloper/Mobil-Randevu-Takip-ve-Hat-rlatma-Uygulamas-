import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';

const DatePickerModal = ({
  visible,
  onClose,
  onSelectDate,
  onSelectTime,
  initialDate = new Date(),
  mode = 'both', // 'date', 'time', 'both'
  theme = 'light',
  title = 'Tarih ve Saat Seç'
}) => {
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMode, setCurrentMode] = useState('date');

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setCurrentMode('date');
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setCurrentMode('time');
    setShowTimePicker(true);
  };

  const handleConfirm = () => {
    if (mode === 'date' && onSelectDate) {
      onSelectDate(selectedDate);
    } else if (mode === 'time' && onSelectTime) {
      onSelectTime(selectedDate);
    } else if (mode === 'both') {
      onSelectDate && onSelectDate(selectedDate);
      onSelectTime && onSelectTime(selectedDate);
    }
    onClose();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: isDark ? '#23242a' : '#ffffff',
          borderRadius: 20,
          padding: 24,
          width: '90%',
          maxWidth: 400,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 10,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#333',
            }}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDark ? '#fff' : '#333'} 
              />
            </TouchableOpacity>
          </View>

          {/* Date Selection */}
          {(mode === 'date' || mode === 'both') && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#ffd600' : '#6200ee',
                marginBottom: 8,
              }}>
                Tarih
              </Text>
              <TouchableOpacity
                onPress={showDatePickerModal}
                style={{
                  backgroundColor: isDark ? '#181a20' : '#f6f6fa',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isDark ? '#333' : '#e0e0e0',
                }}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={isDark ? '#ffd600' : '#6200ee'} 
                  style={{ marginRight: 12 }}
                />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#fff' : '#333',
                  fontWeight: '500',
                }}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Time Selection */}
          {(mode === 'time' || mode === 'both') && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#ffd600' : '#6200ee',
                marginBottom: 8,
              }}>
                Saat
              </Text>
              <TouchableOpacity
                onPress={showTimePickerModal}
                style={{
                  backgroundColor: isDark ? '#181a20' : '#f6f6fa',
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isDark ? '#333' : '#e0e0e0',
                }}
              >
                <Ionicons 
                  name="time-outline" 
                  size={20} 
                  color={isDark ? '#ffd600' : '#6200ee'} 
                  style={{ marginRight: 12 }}
                />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#fff' : '#333',
                  fontWeight: '500',
                }}>
                  {formatTime(selectedDate)}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <CustomButton
              title="İptal"
              onPress={onClose}
              variant="outline"
              theme={theme}
              style={{ flex: 1, marginRight: 8 }}
            />
            <CustomButton
              title="Onayla"
              onPress={handleConfirm}
              theme={theme}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>

          {/* Date/Time Picker */}
          {(showDatePicker || showTimePicker) && (
            <DateTimePicker
              value={selectedDate}
              mode={currentMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal; 