import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Image, Platform, Button, Modal } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import styles from './styles';
// Navigation için eklemeler
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Bildirim ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Ana ekran (Randevu Takip)
function HomeScreen({ onAddAppointment }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Sağlık');
  const [description, setDescription] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  // Bildirim izinlerini iste
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Bildirim izinleri olmadan hatırlatmalar çalışmayabilir!');
      }
      // Uygulama açıkken bildirim gelirse çalışır
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // Konsola bildirim bilgisi yazdırılır
        console.log('Bildirim alındı:', notification);
      });
      // Bildirime tıklanırsa çalışır
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Bildirim tıklandı:', response);
      });
      // Bileşen kapanınca dinleyicileri temizle
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

  // Randevu için bildirim planla
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
      // Bildirim planlanırken hata olursa
      console.error('Bildirim planlanırken hata oluştu:', error);
      return null;
    }
  }

  // Planlanan bildirimi iptal et
  async function cancelScheduledNotification(notificationId) {
    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (error) {
      // Bildirim iptal edilirken hata olursa
      console.error('Bildirim iptal edilirken hata oluştu:', error);
    }
  }

  // Randevu ekle
  const addAppointment = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık giriniz');
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
      // Bildirimi planla ve id'yi kaydet
      const notificationId = await scheduleLocalNotification(newAppointment);
      newAppointment.notificationId = notificationId;
      onAddAppointment(newAppointment);
      setTitle('');
      setDescription('');
      const formattedTime = new Date(date).toLocaleString('tr-TR');
      Alert.alert('Başarılı', `Randevu başarıyla eklendi.\nHatırlatma: ${formattedTime}`);
    } catch (error) {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Randevu eklenirken bir hata oluştu');
    }
  };

  // Tarih seçildiğinde sadece gün/ay/yıl güncellenir
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

  // Saat seçildiğinde sadece saat/dakika güncellenir
  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  // Randevu kartını ekrana basar
  const renderAppointment = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const now = new Date();
    const isPastAppointment = appointmentDate < now;
    return (
      <Card containerStyle={[
        styles.card,
        isPastAppointment && styles.pastAppointment,
        { borderLeftWidth: 6, borderLeftColor: isPastAppointment ? '#bbb' : '#6200ee', marginHorizontal: 0, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }
      ]}>
        <View style={styles.appointmentItem}>
          <View style={styles.appointmentInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 13, color: '#fff', backgroundColor: '#6200ee', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 }}>{item.topic}</Text>
              <Text style={[styles.appointmentTitle, { color: isPastAppointment ? '#bbb' : '#222', fontSize: 17 }]}>{item.title}</Text>
            </View>
            <Text style={[styles.appointmentDate, { fontWeight: 'bold', color: isPastAppointment ? '#bbb' : '#6200ee' }]}> 
              {appointmentDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })} - {appointmentDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.description ? (
              <Text style={styles.appointmentDescription}>{item.description}</Text>
            ) : null}
            {isPastAppointment && (
              <Text style={styles.pastAppointmentText}>Tamamlandı</Text>
            )}
          </View>
          <TouchableOpacity 
            onPress={() => cancelScheduledNotification(item.notificationId)}
            style={[styles.deleteButton, { backgroundColor: '#ffeaea', borderRadius: 8 }]}
          >
            <Icon name="delete" color="#ff4444" />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f0f2f5' }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}> 
        <Text style={[styles.headerText, { color: '#6200ee', fontSize: 26 }]}>Randevularım</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={[styles.formContainer, { marginTop: 10, marginBottom: 0 }]}> 
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
            <Text style={styles.inputLabel}>Başlık</Text>
            <TextInput
              style={styles.input}
              placeholder="Randevu başlığı giriniz"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.inputLabel}>Konu</Text>
            <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10, backgroundColor: '#f6f6fa', minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
              <Picker
                selectedValue={topic}
                onValueChange={(itemValue) => setTopic(itemValue)}
                style={{ minHeight: 44, width: '100%' }}
                itemStyle={{ fontSize: 16 }}
                dropdownIconColor="#6200ee"
              >
                <Picker.Item label="Sağlık" value="Sağlık" />
                <Picker.Item label="İş" value="İş" />
                <Picker.Item label="Kişisel" value="Kişisel" />
              </Picker>
            </View>
            <Text style={styles.inputLabel}>Açıklama (Opsiyonel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Açıklama giriniz"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.inputLabel}>Tarih</Text>
            <TouchableOpacity 
              style={[styles.dateButton, { marginBottom: 10, backgroundColor: '#f6f6fa' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: '#222', fontWeight: 'bold' }}>{date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
              />
            )}
            <Text style={styles.inputLabel}>Saat</Text>
            <TouchableOpacity 
              style={[styles.dateButton, { marginBottom: 10, backgroundColor: '#f6f6fa' }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: '#222', fontWeight: 'bold' }}>{date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeTime}
              />
            )}
            <Button
              title="Randevu Ekle"
              onPress={addAppointment}
              buttonStyle={[styles.addButton, { marginTop: 8, backgroundColor: '#6200ee' }]}
            />
          </View>
        </View>
        <FlatList
          data={[]}
          renderItem={renderAppointment}
          keyExtractor={item => item.id}
          style={[styles.list, { flex: 1 }]}
          contentContainerStyle={[styles.listContent, { paddingTop: 0, paddingBottom: 30 }]}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 }}>Henüz kayıtlı randevunuz yok.</Text>}
        />
      </View>
    </View>
  );
}

// Randevularım ekranı (sadece eklenen randevuların listesi)
function MyAppointmentsScreen({ appointments, onDelete, onEdit }) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editDate, setEditDate] = useState(new Date());
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [showEditTimePicker, setShowEditTimePicker] = useState(false);

  const handleEditOpen = (item) => {
    setEditData({ ...item });
    setEditDate(new Date(item.date));
    setEditModalVisible(true);
  };
  const handleEditSave = () => {
    if (!editData.title.trim()) {
      Alert.alert('Hata', 'Lütfen bir başlık giriniz');
      return;
    }
    onEdit({ ...editData, date: editDate.toISOString() });
    setEditModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f0f2f5', flex: 1 }]}> 
      <View style={[styles.header, { backgroundColor: '#fff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }]}> 
        <Text style={[styles.headerText, { color: '#6200ee', fontSize: 26 }]}>Randevularım</Text>
      </View>
      <FlatList
        data={appointments}
        renderItem={({ item }) => (
          <Card containerStyle={[
            styles.card,
            { borderLeftWidth: 6, borderLeftColor: '#6200ee', marginHorizontal: 0, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }
          ]}>
            <View style={styles.appointmentItem}>
              <View style={styles.appointmentInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: '#fff', backgroundColor: '#6200ee', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 }}>{item.topic}</Text>
                  <Text style={[styles.appointmentTitle, { color: '#222', fontSize: 17 }]}>{item.title}</Text>
                </View>
                <Text style={[styles.appointmentDate, { fontWeight: 'bold', color: '#6200ee' }]}> 
                  {new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })} - {new Date(item.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {item.description ? (
                  <Text style={styles.appointmentDescription}>{item.description}</Text>
                ) : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleEditOpen(item)} style={{ marginRight: 8, backgroundColor: '#e3e3fa', borderRadius: 8, padding: 8 }}>
                  <Text style={{ color: '#6200ee', fontWeight: 'bold' }}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)} style={{ backgroundColor: '#ffeaea', borderRadius: 8, padding: 8 }}>
                  <Text style={{ color: '#ff4444', fontWeight: 'bold' }}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        keyExtractor={item => item.id}
        style={[styles.list, { flex: 1 }]}
        contentContainerStyle={[styles.listContent, { paddingTop: 0, paddingBottom: 30 }]}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 }}>Henüz kayıtlı randevunuz yok.</Text>}
      />
      {/* Düzenleme Modalı */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Randevuyu Düzenle</Text>
            <Text style={styles.inputLabel}>Başlık</Text>
            <TextInput
              style={styles.input}
              placeholder="Randevu başlığı giriniz"
              value={editData?.title || ''}
              onChangeText={t => setEditData({ ...editData, title: t })}
            />
            <Text style={styles.inputLabel}>Konu</Text>
            <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10, backgroundColor: '#f6f6fa', minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
              <Picker
                selectedValue={editData?.topic}
                onValueChange={v => setEditData({ ...editData, topic: v })}
                style={{ minHeight: 44, width: '100%' }}
                itemStyle={{ fontSize: 16 }}
                dropdownIconColor="#6200ee"
              >
                <Picker.Item label="Sağlık" value="Sağlık" />
                <Picker.Item label="İş" value="İş" />
                <Picker.Item label="Kişisel" value="Kişisel" />
              </Picker>
            </View>
            <Text style={styles.inputLabel}>Açıklama (Opsiyonel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Açıklama giriniz"
              value={editData?.description || ''}
              onChangeText={t => setEditData({ ...editData, description: t })}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.inputLabel}>Tarih</Text>
            <TouchableOpacity 
              style={[styles.dateButton, { marginBottom: 10, backgroundColor: '#f6f6fa' }]}
              onPress={() => setShowEditDatePicker(true)}
            >
              <Text style={{ color: '#222', fontWeight: 'bold' }}>{editDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            </TouchableOpacity>
            {showEditDatePicker && (
              <DateTimePicker
                value={editDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEditDatePicker(false);
                  if (selectedDate) {
                    const newDate = new Date(editDate);
                    newDate.setFullYear(selectedDate.getFullYear());
                    newDate.setMonth(selectedDate.getMonth());
                    newDate.setDate(selectedDate.getDate());
                    setEditDate(newDate);
                  }
                }}
              />
            )}
            <Text style={styles.inputLabel}>Saat</Text>
            <TouchableOpacity 
              style={[styles.dateButton, { marginBottom: 10, backgroundColor: '#f6f6fa' }]}
              onPress={() => setShowEditTimePicker(true)}
            >
              <Text style={{ color: '#222', fontWeight: 'bold' }}>{editDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showEditTimePicker && (
              <DateTimePicker
                value={editDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowEditTimePicker(false);
                  if (selectedTime) {
                    const newDate = new Date(editDate);
                    newDate.setHours(selectedTime.getHours());
                    newDate.setMinutes(selectedTime.getMinutes());
                    setEditDate(newDate);
                  }
                }}
              />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <Button title="İptal" color="#aaa" onPress={() => setEditModalVisible(false)} />
              <View style={{ width: 10 }} />
              <Button title="Kaydet" color="#6200ee" onPress={handleEditSave} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Profil ekranı
function ProfileScreen() {
  return (
    <View style={[styles.container, {justifyContent:'center', alignItems:'center'}]}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>John Doe</Text>
      <Text style={{ fontSize: 18, color: '#666', marginBottom: 5 }}>Yaş: 28</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [appointments, setAppointments] = useState([]);

  // Uygulama açıldığında localden randevuları yükle
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const json = await AsyncStorage.getItem('appointments');
        if (json) setAppointments(JSON.parse(json));
      } catch (e) {
        console.log('Randevular yüklenemedi:', e);
      }
    };
    loadAppointments();
  }, []);

  // Her değişiklikte localde sakla
  useEffect(() => {
    AsyncStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Randevu ekle
  const handleAddAppointment = (appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  // Randevu sil
  const handleDeleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Randevu düzenle
  const handleEditAppointment = (edited) => {
    setAppointments(prev => prev.map(a => a.id === edited.id ? { ...a, ...edited } : a));
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Randevular') {
              iconName = 'calendar-outline';
            } else if (route.name === 'Profil') {
              iconName = 'person-circle-outline';
            } else if (route.name === 'Randevularım') {
              iconName = 'list-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Randevular" children={() => <HomeScreen onAddAppointment={handleAddAppointment} />} />
        <Tab.Screen name="Randevularım" children={() => <MyAppointmentsScreen appointments={appointments} onDelete={handleDeleteAppointment} onEdit={handleEditAppointment} />} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
