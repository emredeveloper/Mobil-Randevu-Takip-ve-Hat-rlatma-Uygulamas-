import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Notifications from 'expo-notifications';

function HomeScreen({ onAddAppointment, theme }) {
  const isDark = theme === 'dark';
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Sağlık');
  const [description, setDescription] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Bildirim izinleri olmadan hatırlatmalar çalışmayabilir!');
      }
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('Bildirim alındı:', notification);
      });
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Bildirim tıklandı:', response);
      });
      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    })();
  }, []);

  async function scheduleLocalNotification(appointment) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🏷️ ' + appointment.title,
          body: `⏰ ${new Date(appointment.date).toLocaleString('tr-TR')}${appointment.description ? `\n📝 ${appointment.description}` : ''}`,
          data: { appointmentId: appointment.id },
          sound: true,
          priority: 'high',
        },
        trigger: {
          date: new Date(appointment.date),
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Bildirim planlanırken hata oluştu:', error);
      return null;
    }
  }

  const addAppointment = async () => {
    if (!title.trim()) {
      alert('Lütfen bir başlık giriniz');
      return;
    }
    const newAppointment = {
      id: Math.random().toString(),
      title,
      topic,
      description,
      date: date.toISOString(),
      notificationId: null,
    };
    try {
      const notificationId = await scheduleLocalNotification(newAppointment);
      newAppointment.notificationId = notificationId;
      onAddAppointment(newAppointment);
      setTitle('');
      setDescription('');
      const formattedTime = new Date(date).toLocaleString('tr-TR');
      alert(`Randevu başarıyla eklendi.\nHatırlatma: ${formattedTime}`);
    } catch (error) {
      alert('Randevu eklenirken bir hata oluştu');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#f0f2f5' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', padding: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: isDark ? '#ffd600' : '#6200ee' }}>Randevu Ekle</Text>
      </View>
      <View style={{ margin: 18, backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
        <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Başlık</Text>
        <TextInput style={{ backgroundColor: isDark ? '#181a20' : '#f6f6fa', color: isDark ? '#fff' : '#222', borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#333' : '#eee', padding: 10, marginBottom: 10 }} placeholder="Randevu başlığı giriniz" placeholderTextColor={isDark ? '#bbb' : '#888'} value={title} onChangeText={setTitle} />
        <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Konu</Text>
        <View style={{ borderWidth: 1, borderColor: isDark ? '#333' : '#ddd', borderRadius: 5, marginBottom: 10, backgroundColor: isDark ? '#181a20' : '#f6f6fa', minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
          <Picker
            selectedValue={topic}
            onValueChange={(itemValue) => setTopic(itemValue)}
            style={{ minHeight: 44, width: '100%' }}
            itemStyle={{ fontSize: 16 }}
            dropdownIconColor={isDark ? '#ffd600' : '#6200ee'}
          >
            <Picker.Item label="Sağlık" value="Sağlık" />
            <Picker.Item label="İş" value="İş" />
            <Picker.Item label="Kişisel" value="Kişisel" />
          </Picker>
        </View>
        <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Açıklama (Opsiyonel)</Text>
        <TextInput
          style={{ backgroundColor: isDark ? '#181a20' : '#f6f6fa', color: isDark ? '#fff' : '#222', borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#333' : '#eee', padding: 10, marginBottom: 10, minHeight: 60 }}
          placeholder="Açıklama giriniz"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          placeholderTextColor={isDark ? '#bbb' : '#888'}
        />
        <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Tarih</Text>
        <TouchableOpacity 
          style={{ marginBottom: 10, backgroundColor: isDark ? '#181a20' : '#f6f6fa', borderRadius: 8, padding: 10, alignItems: 'center' }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold' }}>{date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
        <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Saat</Text>
        <TouchableOpacity 
          style={{ marginBottom: 10, backgroundColor: isDark ? '#181a20' : '#f6f6fa', borderRadius: 8, padding: 10, alignItems: 'center' }}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold' }}>{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeTime}
          />
        )}
        <TouchableOpacity style={{ backgroundColor: isDark ? '#ffd600' : '#6200ee', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 }} onPress={addAppointment}>
          <Text style={{ color: isDark ? '#222' : '#fff', fontWeight: 'bold', fontSize: 16 }}>Randevu Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen; 