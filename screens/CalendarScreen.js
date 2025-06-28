import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CalendarScreen = ({ appointments = [], theme = 'light', onAppointmentPress }) => {
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === date.toDateString();
    });
  };

  // Takvim günlerini hesapla
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Pazartesi = 0
    
    const days = [];
    
    // Önceki ayın günleri
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date: date,
        isCurrentMonth: false,
        appointments: getAppointmentsForDate(date)
      });
    }
    
    // Bu ayın günleri
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date,
        isCurrentMonth: true,
        appointments: getAppointmentsForDate(date)
      });
    }
    
    // Sonraki ayın günleri
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: date,
        isCurrentMonth: false,
        appointments: getAppointmentsForDate(date)
      });
    }
    
    return days;
  }, [currentMonth, appointments]);

  const selectedDateAppointments = useMemo(() => {
    return getAppointmentsForDate(selectedDate);
  }, [selectedDate, appointments]);

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const DayCell = ({ dayData }) => {
    const { date, isCurrentMonth, appointments } = dayData;
    const hasAppointments = appointments.length > 0;
    const selected = isSelected(date);
    const today = isToday(date);

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(date)}
        style={{
          width: (width - 32) / 7,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: selected 
            ? (isDark ? '#ffd600' : '#6200ee')
            : 'transparent',
          marginVertical: 2,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: today ? 'bold' : 'normal',
          color: selected
            ? (isDark ? '#222' : '#fff')
            : isCurrentMonth
              ? (isDark ? '#fff' : '#333')
              : (isDark ? '#666' : '#ccc'),
        }}>
          {date.getDate()}
        </Text>
        {hasAppointments && (
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: selected
              ? (isDark ? '#222' : '#fff')
              : (isDark ? '#ffd600' : '#6200ee'),
            position: 'absolute',
            bottom: 4,
          }} />
        )}
      </TouchableOpacity>
    );
  };

  const AppointmentItem = ({ appointment }) => (
    <TouchableOpacity
      onPress={() => onAppointmentPress && onAppointmentPress(appointment)}
      style={{
        backgroundColor: isDark ? '#23242a' : '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: isDark ? '#ffd600' : '#6200ee',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Ionicons 
          name="time-outline" 
          size={16} 
          color={isDark ? '#ffd600' : '#6200ee'} 
          style={{ marginRight: 8 }}
        />
        <Text style={{
          fontSize: 14,
          color: isDark ? '#bbb' : '#666',
          fontWeight: '500',
        }}>
          {new Date(appointment.date).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#fff' : '#333',
        marginBottom: 4,
      }}>
        {appointment.title}
      </Text>
      {appointment.description && (
        <Text style={{
          fontSize: 14,
          color: isDark ? '#bbb' : '#666',
        }}>
          {appointment.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? '#181a20' : '#f0f2f5' 
    }}>
      {/* Header */}
      <View style={{
        backgroundColor: isDark ? '#23242a' : '#fff',
        padding: 18,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={isDark ? '#ffd600' : '#6200ee'} 
            />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#333',
          }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={isDark ? '#ffd600' : '#6200ee'} 
            />
          </TouchableOpacity>
        </View>

        {/* Gün isimleri */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 8,
        }}>
          {dayNames.map(day => (
            <Text key={day} style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#bbb' : '#666',
              width: (width - 32) / 7,
              textAlign: 'center',
            }}>
              {day}
            </Text>
          ))}
        </View>

        {/* Takvim */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
          {calendarDays.map((dayData, index) => (
            <DayCell key={index} dayData={dayData} />
          ))}
        </View>
      </View>

      {/* Seçili günün randevuları */}
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
        }}>
          <Ionicons 
            name="calendar" 
            size={20} 
            color={isDark ? '#ffd600' : '#6200ee'} 
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#333',
          }}>
            {selectedDate.toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
          <Text style={{
            fontSize: 16,
            color: isDark ? '#bbb' : '#666',
            marginLeft: 8,
          }}>
            ({selectedDateAppointments.length} randevu)
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {selectedDateAppointments.length > 0 ? (
            selectedDateAppointments.map(appointment => (
              <AppointmentItem 
                key={appointment.id} 
                appointment={appointment} 
              />
            ))
          ) : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 60,
            }}>
              <Ionicons 
                name="calendar-outline" 
                size={64} 
                color={isDark ? '#333' : '#ccc'} 
                style={{ marginBottom: 16 }}
              />
              <Text style={{
                fontSize: 18,
                color: isDark ? '#666' : '#999',
                textAlign: 'center',
              }}>
                Bu gün için randevu yok
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default CalendarScreen; 