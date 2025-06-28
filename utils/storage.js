import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage anahtarları
export const STORAGE_KEYS = {
  APPOINTMENTS: '@appointments',
  USER_DATA: '@user_data',
  THEME: '@theme',
  SETTINGS: '@settings',
  LOGIN_STATUS: '@login_status'
};

// Genel storage fonksiyonları
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Veri kaydetme hatası:', error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Veri okuma hatası:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Veri silme hatası:', error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Tüm verileri silme hatası:', error);
    return false;
  }
};

// Randevu işlemleri
export const saveAppointments = async (appointments) => {
  return await storeData(STORAGE_KEYS.APPOINTMENTS, appointments);
};

export const getAppointments = async () => {
  const appointments = await getData(STORAGE_KEYS.APPOINTMENTS);
  return appointments || [];
};

export const addAppointment = async (appointment) => {
  try {
    const appointments = await getAppointments();
    const newAppointments = [...appointments, appointment];
    return await saveAppointments(newAppointments);
  } catch (error) {
    console.error('Randevu ekleme hatası:', error);
    return false;
  }
};

export const updateAppointment = async (appointmentId, updatedAppointment) => {
  try {
    const appointments = await getAppointments();
    const updatedAppointments = appointments.map(app => 
      app.id === appointmentId ? { ...app, ...updatedAppointment } : app
    );
    return await saveAppointments(updatedAppointments);
  } catch (error) {
    console.error('Randevu güncelleme hatası:', error);
    return false;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const appointments = await getAppointments();
    const filteredAppointments = appointments.filter(app => app.id !== appointmentId);
    return await saveAppointments(filteredAppointments);
  } catch (error) {
    console.error('Randevu silme hatası:', error);
    return false;
  }
};

// Kullanıcı işlemleri
export const saveUserData = async (userData) => {
  return await storeData(STORAGE_KEYS.USER_DATA, userData);
};

export const getUserData = async () => {
  return await getData(STORAGE_KEYS.USER_DATA);
};

export const updateUserData = async (updates) => {
  try {
    const currentUser = await getUserData();
    const updatedUser = { ...currentUser, ...updates };
    return await saveUserData(updatedUser);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    return false;
  }
};

// Tema işlemleri
export const saveTheme = async (theme) => {
  return await storeData(STORAGE_KEYS.THEME, theme);
};

export const getTheme = async () => {
  const theme = await getData(STORAGE_KEYS.THEME);
  return theme || 'light';
};

// Oturum işlemleri
export const saveLoginStatus = async (isLoggedIn, userData = null) => {
  const success1 = await storeData(STORAGE_KEYS.LOGIN_STATUS, isLoggedIn);
  if (userData) {
    const success2 = await saveUserData(userData);
    return success1 && success2;
  }
  return success1;
};

export const getLoginStatus = async () => {
  return await getData(STORAGE_KEYS.LOGIN_STATUS);
};

export const logout = async () => {
  const success1 = await removeData(STORAGE_KEYS.LOGIN_STATUS);
  const success2 = await removeData(STORAGE_KEYS.USER_DATA);
  return success1 && success2;
};

// Ayarlar işlemleri
export const saveSettings = async (settings) => {
  return await storeData(STORAGE_KEYS.SETTINGS, settings);
};

export const getSettings = async () => {
  const settings = await getData(STORAGE_KEYS.SETTINGS);
  return settings || {
    notifications: true,
    soundEnabled: true,
    reminderMinutes: 15,
    language: 'tr'
  };
};

export const updateSettings = async (updates) => {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    return await saveSettings(updatedSettings);
  } catch (error) {
    console.error('Ayarlar güncelleme hatası:', error);
    return false;
  }
};

// Veri doğrulama fonksiyonları
export const validateAppointment = (appointment) => {
  if (!appointment.title || appointment.title.trim() === '') {
    return { valid: false, error: 'Başlık gereklidir' };
  }
  if (!appointment.date) {
    return { valid: false, error: 'Tarih gereklidir' };
  }
  if (new Date(appointment.date) < new Date()) {
    return { valid: false, error: 'Geçmiş tarih seçilemez' };
  }
  return { valid: true };
};

export const validateUserData = (userData) => {
  if (!userData.email || !userData.email.includes('@')) {
    return { valid: false, error: 'Geçerli email adresi gereklidir' };
  }
  if (!userData.password || userData.password.length < 6) {
    return { valid: false, error: 'Şifre en az 6 karakter olmalıdır' };
  }
  if (!userData.name || userData.name.trim() === '') {
    return { valid: false, error: 'İsim gereklidir' };
  }
  return { valid: true };
};
