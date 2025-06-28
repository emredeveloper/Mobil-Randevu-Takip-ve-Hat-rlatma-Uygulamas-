// Uygulama sabitleri
export const APP_CONFIG = {
  name: 'Mobil - Randevu',
  version: '1.0.0',
  author: 'Cihat Emre Karataş',
  description: 'Modern Randevu Yönetim Uygulaması'
};

// Randevu kategorileri
export const APPOINTMENT_CATEGORIES = [
  { label: 'Sağlık', value: 'health', icon: 'medical-outline', color: '#4CAF50' },
  { label: 'İş', value: 'work', icon: 'briefcase-outline', color: '#2196F3' },
  { label: 'Kişisel', value: 'personal', icon: 'person-outline', color: '#FF9800' },
  { label: 'Eğitim', value: 'education', icon: 'school-outline', color: '#9C27B0' },
  { label: 'Sosyal', value: 'social', icon: 'people-outline', color: '#E91E63' },
  { label: 'Spor', value: 'sports', icon: 'fitness-outline', color: '#FF5722' },
  { label: 'Alışveriş', value: 'shopping', icon: 'bag-outline', color: '#795548' },
  { label: 'Seyahat', value: 'travel', icon: 'airplane-outline', color: '#607D8B' }
];

// Bildirim zamanları
export const NOTIFICATION_TIMES = [
  { label: '5 dakika önce', value: 5 },
  { label: '15 dakika önce', value: 15 },
  { label: '30 dakika önce', value: 30 },
  { label: '1 saat önce', value: 60 },
  { label: '2 saat önce', value: 120 },
  { label: '1 gün önce', value: 1440 },
  { label: 'Bildirimi kapat', value: 0 }
];

// Tekrarlama seçenekleri
export const REPEAT_OPTIONS = [
  { label: 'Tekrarlanmaz', value: 'none' },
  { label: 'Her gün', value: 'daily' },
  { label: 'Her hafta', value: 'weekly' },
  { label: 'Her ay', value: 'monthly' },
  { label: 'Her yıl', value: 'yearly' }
];

// Öncelik seviyeleri
export const PRIORITY_LEVELS = [
  { label: 'Düşük', value: 'low', color: '#4CAF50' },
  { label: 'Normal', value: 'normal', color: '#FF9800' },
  { label: 'Yüksek', value: 'high', color: '#F44336' },
  { label: 'Acil', value: 'urgent', color: '#9C27B0' }
];

// Durum kodları
export const STATUS_TYPES = [
  { label: 'Beklemede', value: 'pending', color: '#FF9800' },
  { label: 'Onaylandı', value: 'confirmed', color: '#4CAF50' },
  { label: 'İptal edildi', value: 'cancelled', color: '#F44336' },
  { label: 'Tamamlandı', value: 'completed', color: '#2196F3' },
  { label: 'Ertelendi', value: 'postponed', color: '#9E9E9E' }
];

// Varsayılan ayarlar
export const DEFAULT_SETTINGS = {
  notifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
  reminderMinutes: 15,
  language: 'tr',
  theme: 'auto', // auto, light, dark
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h', // 12h, 24h
  firstDayOfWeek: 1, // 0: Pazar, 1: Pazartesi
  autoBackup: true,
  biometricAuth: false
};

// API endpoints (gelecek için)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.myfirstapp.com',
  AUTH: '/auth',
  APPOINTMENTS: '/appointments',
  USERS: '/users',
  NOTIFICATIONS: '/notifications',
  SYNC: '/sync'
};

// Hata mesajları
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin',
  VALIDATION_ERROR: 'Lütfen tüm alanları doğru doldurun',
  AUTH_ERROR: 'Giriş bilgileri hatalı',
  PERMISSION_ERROR: 'Bu işlem için izin gerekli',
  UNKNOWN_ERROR: 'Beklenmeyen bir hata oluştu'
};

// Başarı mesajları
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: 'Randevu başarıyla oluşturuldu',
  APPOINTMENT_UPDATED: 'Randevu başarıyla güncellendi',
  APPOINTMENT_DELETED: 'Randevu başarıyla silindi',
  PROFILE_UPDATED: 'Profil başarıyla güncellendi',
  SETTINGS_SAVED: 'Ayarlar başarıyla kaydedildi'
};

// Animasyon süreleri
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
};

// Boyut sabitleri
export const SIZES = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  AVATAR_SIZE: 120,
  ICON_SIZE: 24,
  BUTTON_HEIGHT: 48
};

export default {
  APP_CONFIG,
  APPOINTMENT_CATEGORIES,
  NOTIFICATION_TIMES,
  REPEAT_OPTIONS,
  PRIORITY_LEVELS,
  STATUS_TYPES,
  DEFAULT_SETTINGS,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATIONS,
  SIZES
}; 