<<<<<<< HEAD
# 📅 MyFirstApp - Randevu Yönetim Uygulaması

Modern ve kullanıcı dostu bir randevu yönetim uygulaması. React Native ve Expo ile geliştirilmiştir.

## 🚀 Özellikler

### 📱 Ana Özellikler
- **Randevu Yönetimi**: Randevu ekleme, düzenleme ve silme
- **Bildirim Sistemi**: Randevu hatırlatmaları için yerel bildirimler
- **Tema Desteği**: Açık ve koyu tema seçenekleri
- **Kullanıcı Profili**: Profil düzenleme ve fotoğraf yükleme
- **Kategorilendirme**: Sağlık, İş, Kişisel randevu kategorileri
- **Tarih/Saat Seçimi**: Kullanıcı dostu tarih ve saat seçim arayüzü

### 🎨 Teknik Özellikler
- **Modern UI/UX**: Material Design prensipleri
- **Responsive Tasarım**: Farklı ekran boyutlarına uyum
- **Form Validasyonu**: Kapsamlı veri doğrulama
- **Veri Saklama**: AsyncStorage ile yerel veri saklama
- **Animasyonlar**: Smooth kullanıcı deneyimi
- **Koyu/Açık Tema**: Otomatik sistem teması algılama

## 📋 Gereksinimler

- Node.js (18.0.0 veya üzeri)
- npm veya yarn
- Expo CLI
- iOS Simulator veya Android Emulator (geliştirme için)

## 🛠️ Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <proje-url>
cd MyFirstApp
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
```

3. **Uygulamayı başlatın:**
```bash
npm start
# veya
yarn start
```

4. **Platform seçin:**
```bash
# iOS için
npm run ios

# Android için
npm run android

# Web için
npm run web
```

## 📁 Proje Yapısı

```
MyFirstApp/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── AppointmentCard.js    # Randevu kartı bileşeni
│   ├── CustomButton.js       # Özelleştirilebilir buton
│   └── InputField.js         # Özelleştirilebilir input alanı
├── screens/             # Ekran bileşenleri
│   ├── HomeScreen.js         # Ana ekran (randevu ekleme)
│   └── MyAppointmentsScreen.js # Randevularım ekranı
├── utils/               # Yardımcı fonksiyonlar
│   ├── storage.js            # Veri saklama işlemleri
│   ├── theme.js              # Tema ve renk yönetimi
│   └── validation.js         # Form validasyonu
├── android/             # Android platform dosyaları
├── App.js               # Ana uygulama dosyası
├── app.json             # Expo konfigürasyonu
├── package.json         # NPM bağımlılıkları
├── styles.js            # Global stil tanımları
└── README.md            # Bu dosya
```

## 🎯 Kullanım

### Randevu Ekleme
1. "Randevular" sekmesine gidin
2. Randevu bilgilerini doldurun:
   - Başlık (zorunlu)
   - Kategori (Sağlık/İş/Kişisel)
   - Açıklama (opsiyonel)
   - Tarih ve saat
3. "Randevu Ekle" butonuna tıklayın

### Randevu Yönetimi
- "Randevularım" sekmesinden randevularınızı görüntüleyin
- Geçmiş randevular otomatik olarak işaretlenir
- Düzenleme ve silme işlemleri için kart üzerindeki butonları kullanın

### Profil Yönetimi
- "Profil" sekmesinden kişisel bilgilerinizi düzenleyin
- Profil fotoğrafı yükleyebilirsiniz
- Çıkış yapabilirsiniz

## 🔧 Konfigürasyon

### Bildirim Ayarları
Bildirimler `App.js` dosyasındaki `Notifications.setNotificationHandler` ile yapılandırılır.

### Tema Özelleştirme
Tema ayarları `utils/theme.js` dosyasında tanımlanmıştır. Renk paletini bu dosyadan özelleştirebilirsiniz.

### Veri Saklama
Uygulama verileri AsyncStorage ile yerel olarak saklanır. `utils/storage.js` dosyasında tüm veri işlemleri tanımlanmıştır.

## 📱 Platform Desteği

- ✅ iOS
- ✅ Android  
- ✅ Web

## 🎨 Tema Sistemi

Uygulama otomatik olarak sistem temasını algılar ve iki tema sunar:

### Açık Tema
- Ana renk: #6200ee (Mor)
- Arka plan: #f0f2f5 (Açık gri)
- Yüzey: #ffffff (Beyaz)

### Koyu Tema
- Ana renk: #ffd600 (Altın sarısı)
- Arka plan: #181a20 (Koyu gri)
- Yüzey: #23242a (Koyu)

## 🛡️ Güvenlik

- Form validasyonu ile XSS koruması
- Güvenli veri saklama
- Input sanitization

## 🧪 Test

```bash
# Testleri çalıştır
npm test

# Coverage raporu
npm run test:coverage
```

## 📦 Build

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
expo build:android --type apk
expo build:ios --type archive
```

## 🤝 Katkı Sağlama

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👤 Geliştirici

**Emre Karataş**
- GitHub: [@emrekaratas](https://github.com/emrekaratas)
- Email: emre@example.com

## 🙏 Teşekkürler

- [Expo](https://expo.dev/) - Geliştirme platformu
- [React Native](https://reactnative.dev/) - Framework
- [React Navigation](https://reactnavigation.org/) - Navigasyon
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) - Veri saklama

## 📝 Sürüm Geçmişi

### v1.0.0 (2024)
- ✨ İlk sürüm
- 📱 Randevu yönetimi
- 🔔 Bildirim sistemi
- 🎨 Tema desteği
- 👤 Kullanıcı profili

## 🐛 Bilinen Sorunlar

- iOS'ta bildirim sesleri bazen çalışmayabilir
- Web versiyonunda kamera erişimi sınırlı

## 🔮 Gelecek Özellikler

- [ ] Bulut senkronizasyonu
- [ ] Sosyal medya entegrasyonu
- [ ] Takvim entegrasyonu
- [ ] Push notifications
- [ ] Çoklu dil desteği
- [ ] Offline mod

## 📞 Destek

Herhangi bir sorunuz veya probleminiz varsa:
- GitHub Issues kullanın
- Email: support@myfirstapp.com 
=======
- Uygulamanın Expo üzerinden yayınlanan son haline aşağıdaki bağlantıdan ulaşabilirsiniz:

  Expo Yayın Linki:
  https://expo.dev/preview/update?message=ilk%20g%C3%BCncelleme&updateRuntimeVersion=1.0.0&createdAt=2025-06-02T10%3A35%3A14.538Z&slug=exp&projectId=ff59008e-0c44-4ff0-b45b-8ee024114a23&group=a67ce4bb-d624-4e41-b25d-0cafaa38424b

- Ayrıca, aşağıdaki QR kodu telefonunuzun kamerası veya bir QR kod okuyucu ile tarayarak uygulamayı doğrudan açabilirsiniz:

- Not: Uygulamayı açmak için Expo Go uygulamasının telefona yüklü olması gerekmektedir. 
>>>>>>> 73a14867aa98b081735b9701766a631cb73c2716
