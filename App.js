import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, Appearance } from 'react-native';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Image, Platform, Button, Modal, Animated } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import styles from './styles';
// Navigation için eklemeler
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Yeni bileşenleri import edelim
import AppointmentCard from './components/AppointmentCard';
import CustomButton from './components/CustomButton';
import InputField from './components/InputField';

// Utility fonksiyonları import edelim
import { getAppointments, saveAppointments, validateAppointmentForm } from './utils/storage';
import { getThemeColors } from './utils/theme';
import { validateEmail, validatePassword, validateName } from './utils/validation';

// Bildirim ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Randevular ekranı (modern tasarım)
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

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#f0f2f5' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', padding: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: isDark ? '#ffd600' : '#6200ee' }}>Randevu Ekle</Text>
      </View>
      {/* Randevu ekleme formu */}
      <View style={{ margin: 18, backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
        <InputField
          label="Başlık"
          value={title}
          onChangeText={setTitle}
          placeholder="Randevu başlığı giriniz"
          theme={theme}
          required={true}
          iconName="text-outline"
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
        <InputField
          label="Açıklama (Opsiyonel)"
          value={description}
          onChangeText={setDescription}
          placeholder="Açıklama giriniz"
          theme={theme}
          multiline={true}
          numberOfLines={3}
          iconName="chatbubble-outline"
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
        <CustomButton
          title="Randevu Ekle"
          onPress={addAppointment}
          theme={theme}
          iconName="add-circle-outline"
          size="large"
        />
      </View>
      {/* Randevu listesi modern kartlarla */}
      <FlatList
        data={[]}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 16, marginHorizontal: 18, marginVertical: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={32} color={isDark ? '#ffd600' : '#6200ee'} style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: isDark ? '#fff' : '#222' }}>{item.title}</Text>
              <Text style={{ color: isDark ? '#bbb' : '#666', fontSize: 15 }}>{item.date}</Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: '#ff4444', borderRadius: 8, padding: 8 }}>
              <Ionicons name="trash-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: isDark ? '#bbb' : '#aaa', marginTop: 40, fontSize: 16 }}>Henüz kayıtlı randevunuz yok.</Text>}
      />
    </View>
  );
}

// Randevularım ekranı (modern tasarım)
function MyAppointmentsScreen({ appointments, onDelete, onEdit, theme }) {
  const isDark = theme === 'dark';
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
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#f0f2f5' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', padding: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems: 'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: isDark ? '#ffd600' : '#6200ee' }}>Randevularım</Text>
      </View>
      <FlatList
        data={appointments}
        renderItem={({ item }) => (
          <AppointmentCard
            item={item}
            onDelete={onDelete}
            onEdit={handleEditOpen}
            theme={theme}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: isDark ? '#bbb' : '#aaa', marginTop: 40, fontSize: 16 }}>Henüz kayıtlı randevunuz yok.</Text>}
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

// Profil ekranı (modern tasarım)
function ProfileScreen({ theme, user, setUser, onLogout }) {
  const isDark = theme === 'dark';
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Emre Karataş',
    age: user?.age || '23',
    email: user?.email || user?.email || '',
    bio: user?.bio || '',
    photo: user?.photo || 'https://randomuser.me/api/portraits/men/32.jpg',
  });
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setProfile({ ...profile, photo: result.assets[0].uri });
    }
  };
  const handleSave = () => {
    setUser(profile);
    setEditMode(false);
  };
  return (
    <View style={{ flex:1, backgroundColor: isDark ? '#181a20' : '#f0f2f5', justifyContent:'center', alignItems:'center' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, width: 340 }}>
        <TouchableOpacity onPress={editMode ? pickImage : undefined} disabled={!editMode}>
          <Image
            source={{ uri: profile.photo }}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 3, borderColor: isDark ? '#ffd600' : '#eee' }}
          />
          {editMode && <Text style={{ color: isDark ? '#ffd600' : '#6200ee', textAlign:'center', marginBottom:10 }}>Fotoğrafı Değiştir</Text>}
        </TouchableOpacity>
        {editMode ? (
          <>
            <TextInput
              style={{ width: 220, borderWidth: 1, borderColor: isDark ? '#333' : '#888', borderRadius: 8, padding: 8, marginBottom: 10, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#181a20' : '#f6f6fa' }}
              value={profile.name}
              onChangeText={t => setProfile({ ...profile, name: t })}
              placeholder="Ad Soyad"
              placeholderTextColor={isDark ? '#bbb' : '#888'}
            />
            <TextInput
              style={{ width: 220, borderWidth: 1, borderColor: isDark ? '#333' : '#888', borderRadius: 8, padding: 8, marginBottom: 10, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#181a20' : '#f6f6fa' }}
              value={profile.age}
              onChangeText={t => setProfile({ ...profile, age: t })}
              placeholder="Yaş"
              keyboardType="numeric"
              placeholderTextColor={isDark ? '#bbb' : '#888'}
            />
            <TextInput
              style={{ width: 220, borderWidth: 1, borderColor: isDark ? '#333' : '#888', borderRadius: 8, padding: 8, marginBottom: 10, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#181a20' : '#f6f6fa' }}
              value={profile.email}
              onChangeText={t => setProfile({ ...profile, email: t })}
              placeholder="E-posta"
              autoCapitalize="none"
              placeholderTextColor={isDark ? '#bbb' : '#888'}
            />
            <TextInput
              style={{ width: 220, borderWidth: 1, borderColor: isDark ? '#333' : '#888', borderRadius: 8, padding: 8, marginBottom: 10, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#181a20' : '#f6f6fa' }}
              value={profile.bio}
              onChangeText={t => setProfile({ ...profile, bio: t })}
              placeholder="Biyografi"
              multiline
              placeholderTextColor={isDark ? '#bbb' : '#888'}
            />
            <View style={{ flexDirection:'row', marginTop:10 }}>
              <TouchableOpacity onPress={handleSave} style={{ backgroundColor: isDark ? '#ffd600' : '#6200ee', borderRadius: 8, padding: 10, marginRight: 10 }}>
                <Text style={{ color: isDark ? '#222' : '#fff', fontWeight:'bold' }}>Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditMode(false)} style={{ backgroundColor: '#888', borderRadius: 8, padding: 10 }}>
                <Text style={{ color: '#fff', fontWeight:'bold' }}>İptal</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: isDark ? '#fff' : '#222' }}>{profile.name}</Text>
            <Text style={{ fontSize: 18, color: isDark ? '#bbb' : '#666', marginBottom: 5 }}>Yaş: {profile.age}</Text>
            <Text style={{ fontSize: 16, color: isDark ? '#bbb' : '#666', marginBottom: 5 }}>{profile.email}</Text>
            <Text style={{ fontSize: 15, color: isDark ? '#bbb' : '#666', marginBottom: 15 }}>{profile.bio}</Text>
            <TouchableOpacity onPress={() => setEditMode(true)} style={{ backgroundColor: isDark ? '#ffd600' : '#6200ee', borderRadius: 8, padding: 10, marginBottom: 10 }}>
              <Text style={{ color: isDark ? '#222' : '#fff', fontWeight:'bold' }}>Profili Düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={{ backgroundColor: '#ff4444', borderRadius: 8, padding: 10 }}>
              <Text style={{ color: '#fff', fontWeight:'bold' }}>Çıkış Yap</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// Settings (Ayarlar) ekranı (modern tasarım)
function SettingsScreen({ theme, setTheme }) {
  const isDark = theme === 'dark';
  return (
    <View style={{ flex:1, backgroundColor: isDark ? '#181a20' : '#f0f2f5', justifyContent:'center', alignItems:'center' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, width: 340 }}>
        <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={48} color={isDark ? '#ffd600' : '#6200ee'} style={{ marginBottom: 10 }} />
        <Text style={{ fontSize: 24, fontWeight:'bold', color: isDark ? '#fff' : '#222', marginBottom: 30 }}>Ayarlar</Text>
        <TouchableOpacity
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ backgroundColor: isDark ? '#ffd600' : '#23242a', borderRadius: 12, padding: 18, marginBottom: 20, width: 220, alignItems:'center', borderWidth:1, borderColor: isDark ? '#ffd600' : '#333' }}>
          <Text style={{ color: isDark ? '#222' : '#ffd600', fontWeight:'bold', fontSize: 16 }}>{isDark ? 'Açık Tema' : 'Koyu Tema'}</Text>
        </TouchableOpacity>
        <Text style={{ color: isDark ? '#bbb' : '#888', marginTop: 40, fontSize: 13 }}>Uygulama v1.0</Text>
      </View>
    </View>
  );
}

// Mock kullanıcılar
const defaultUsers = [
  { email: 'test@mail.com', password: '123456', name: 'Test Kullanıcı', age: '25', bio: 'Deneme hesabı', photo: 'https://randomuser.me/api/portraits/men/32.jpg' }
];

// Giriş/Kayıt Ekranı (mock, gerçekçi)
function AuthScreen({ onLogin, theme, users, setUsers }) {
  const isDark = theme === 'dark';
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerInfo, setRegisterInfo] = useState({ name: '', age: '', bio: '' });

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setError('');
      onLogin(user);
    } else {
      setError('E-posta veya şifre hatalı!');
    }
  };

  const handleRegister = () => {
    if (!email || !password || !registerInfo.name) {
      setError('Tüm alanları doldurun!');
      return;
    }
    if (users.find(u => u.email === email)) {
      setError('Bu e-posta ile kayıtlı kullanıcı var!');
      return;
    }
    const newUser = { ...registerInfo, email, password, photo: 'https://randomuser.me/api/portraits/men/32.jpg' };
    setUsers([...users, newUser]);
    setError('');
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setRegisterInfo({ name: '', age: '', bio: '' });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#181a20' : '#f0f2f5', padding: 20 }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 16, padding: 28, width: 320, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems:'center' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: isDark ? '#ffd600' : '#6200ee' }}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
        <InputField
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          theme={theme}
          iconName="mail-outline"
          keyboardType="email-address"
          containerStyle={{ width: 250 }}
        />
        <InputField
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          theme={theme}
          iconName="lock-closed-outline"
          secureTextEntry={true}
          containerStyle={{ width: 250 }}
        />
        {!isLogin && (
          <>
            <InputField
              value={registerInfo.name}
              onChangeText={t => setRegisterInfo({ ...registerInfo, name: t })}
              placeholder="Ad Soyad"
              theme={theme}
              iconName="person-outline"
              containerStyle={{ width: 250 }}
            />
            <InputField
              value={registerInfo.age}
              onChangeText={t => setRegisterInfo({ ...registerInfo, age: t })}
              placeholder="Yaş"
              theme={theme}
              iconName="calendar-outline"
              keyboardType="numeric"
              containerStyle={{ width: 250 }}
            />
            <InputField
              value={registerInfo.bio}
              onChangeText={t => setRegisterInfo({ ...registerInfo, bio: t })}
              placeholder="Biyografi"
              theme={theme}
              iconName="document-text-outline"
              containerStyle={{ width: 250 }}
            />
          </>
        )}
        {!!error && <Text style={{ color: '#ff4444', marginBottom: 10 }}>{error}</Text>}
        <CustomButton
          title={isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          onPress={isLogin ? handleLogin : handleRegister}
          theme={theme}
          iconName={isLogin ? 'log-in-outline' : 'person-add-outline'}
          style={{ width: 250, marginBottom: 10 }}
        />
        <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(''); }}>
          <Text style={{ color: isDark ? '#ffd600' : '#6200ee', marginTop: 8 }}>{isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}</Text>
        </TouchableOpacity>
        {isLogin && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 13 }}>Örnek kullanıcı:</Text>
            <Text style={{ color: isDark ? '#ffd600' : '#6200ee', fontWeight:'bold', fontSize: 15 }}>test@mail.com / 123456</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Premium ekranı (modern tasarım)
function PremiumScreen({ theme }) {
  const isDark = theme === 'dark';
  const [isPremium, setIsPremium] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true })
    ]).start(() => setIsPremium(true));
  };
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#181a20' : '#f0f2f5', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
        <Ionicons name="star-outline" size={48} color={isDark ? '#ffd600' : '#ff9800'} style={{ marginBottom: 10 }} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: isDark ? '#ffd600' : '#ff9800' }}>Premium Özellikler</Text>
        {isPremium ? (
          <Text style={{ fontSize: 20, color: '#4caf50', marginBottom: 20 }}>Premium Üyelik Aktif!</Text>
        ) : (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handlePress} style={{ backgroundColor: isDark ? '#ffd600' : '#ff9800', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: isDark ? '#222' : '#fff', fontWeight: 'bold', fontSize: 18 }}>Premium Satın Al (Simülasyon)</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        <Text style={{ marginTop: 30, color: isDark ? '#bbb' : '#888' }}>Premium ile ek avantajlar elde edin!</Text>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');
  const [users, setUsers] = useState(defaultUsers);
  // Tema değişimi için dinleyici
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => listener.remove();
  }, []);

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

  const handleLogout = () => setUser(null);

  if (!user) {
    return <AuthScreen onLogin={setUser} theme={theme} users={users} setUsers={setUsers} />;
  }
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
            } else if (route.name === 'Premium') {
              iconName = 'star-outline';
            } else if (route.name === 'Ayarlar') {
              iconName = 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme === 'dark' ? '#ffd600' : '#6200ee',
          tabBarInactiveTintColor: theme === 'dark' ? '#bbb' : 'gray',
          headerStyle: { backgroundColor: theme === 'dark' ? '#222' : '#fff' },
          headerTitleStyle: { color: theme === 'dark' ? '#fff' : '#222' },
          tabBarStyle: { backgroundColor: theme === 'dark' ? '#222' : '#fff' },
          animationEnabled: true,
        })}
      >
        <Tab.Screen name="Randevular">
          {() => <HomeScreen onAddAppointment={handleAddAppointment} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Randevularım">
          {() => <MyAppointmentsScreen appointments={appointments} onDelete={handleDeleteAppointment} onEdit={handleEditAppointment} theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Profil">
          {() => <ProfileScreen theme={theme} user={user} setUser={setUser} onLogout={handleLogout} />}
        </Tab.Screen>
        <Tab.Screen name="Premium">
          {() => <PremiumScreen theme={theme} />}
        </Tab.Screen>
        <Tab.Screen name="Ayarlar">
          {() => <SettingsScreen theme={theme} setTheme={setTheme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
