Özet
----------------
Bu mobil uygulama, kullanıcıların randevularını kolayca takip edebilmesi ve zamanında hatırlatmalar alabilmesi amacıyla geliştirilmiştir. Uygulama, randevu ekleme, düzenleme, silme ve bildirim gönderme gibi temel işlevleri sunar. Tüm randevular cihazda kalıcı olarak **AsyncStorage** ile localde saklanır. React Native ve Expo altyapısı ile geliştirilen uygulama, kullanıcı dostu arayüzü ve kolay kullanımı ile öne çıkar. Proje kapsamında, kullanıcıların randevularını unutmaması ve günlük yaşamlarını daha verimli planlaması hedeflenmiştir.

Giriş
---------------------
Projenin amacı, kullanıcıların randevu ve önemli etkinliklerini unutmadan yönetebileceği, hatırlatıcı bildirimler alabileceği bir mobil uygulama sunmaktır. Özellikle yoğun iş temposuna sahip bireyler, öğrenciler ve sağlık takibi yapan hastalar için unutkanlık sorununa çözüm getirmek hedeflenmiştir. Hedef kitle; bireysel kullanıcılar, öğrenciler, çalışanlar ve sağlık takibi yapan hastalardır.

Yöntem ve Teknolojiler (Methodology)
-------------------------------------
1. Kullanılan Teknolojiler
- Programlama Dili: JavaScript (React Native)
- Framework: React Native, Expo
- Veritabanı: **AsyncStorage** (localde kalıcı veri saklama)
- Ek Kütüphaneler: react-native-elements, @react-native-picker/picker, expo-notifications, @react-native-async-storage/async-storage

2. Sistem Mimarisi
- Frontend: React Native ile geliştirilen mobil kullanıcı arayüzü
- Backend: Lokal AsyncStorage (sunucuya ihtiyaç yok)
- API: Expo Notifications ile cihazda bildirim gönderimi

3. Algoritmalar ve Akış
- Kullanıcı randevu ekler, bilgiler AsyncStorage ile localde saklanır.
- Randevu zamanı geldiğinde bildirim gönderilir.
- Kullanıcı randevuları listeleyebilir, düzenleyebilir veya silebilir.
- Tüm işlemler state ve local storage ile senkronize çalışır.

Uygulama Geliştirme Süreci
--------------------------
1. Tasarım (UI/UX)
- Modern ve sade bir arayüz tasarlandı.
- Randevu ekleme, listeleme ve düzenleme ekranları oluşturuldu.
- Kullanıcı senaryoları: Randevu ekleme, silme, düzenleme, bildirim alma.

2. Kod Yapısı
- Ana bileşenler: App.js, styles.js
- Randevu ekleme, silme ve düzenleme fonksiyonları ayrı ayrı tanımlandı.
- AsyncStorage işlemleri için CRUD fonksiyonları yazıldı.

3. Test ve Hata Yönetimi
- Manuel kullanıcı testleri ile işlevler denendi.
- Expo Go ve development build ile testler yapıldı.
- Karşılaşılan hatalar: Expo Go ile local storage çalışmama sorunu yok, native modüller için development build önerildi.

Sonuçlar ve Tartışma
---------------------
- Uygulama, randevu takibi ve hatırlatma konusunda başarılı sonuçlar verdi.
- Kullanıcılar randevularını kolayca ekleyip yönetebildi.
- Eksik kalan/geliştirilebilir yönler: Bulut yedekleme, kullanıcı hesabı, kategoriye göre filtreleme, daha gelişmiş bildirim seçenekleri.
- Kullanıcı geri bildirimleri: Kullanımı kolay, arayüz sade ve anlaşılır.

Kullanıcı Kılavuzu
------------------
Kurulum:
1. Bilgisayarınızda Node.js ve npm kurulu olmalı.
2. Proje klasöründe terminal açın.
3. Gerekli paketleri yüklemek için:
   npm install
4. Expo CLI yüklü değilse:
   npm install -g expo-cli
5. Gerekli native paketleri yüklemek için:
   npx expo install expo-notifications @react-native-picker/picker react-native-elements @react-native-async-storage/async-storage
6. Android cihazda test için:
   npx expo run:android
   (Cihazınızda USB hata ayıklama açık olmalı veya emülatör başlatılmalı)
7. iOS cihazda test için (Mac gereklidir):
   npx expo run:ios
8. Sadece Expo Go ile test etmek için:
   npx expo start
   ve çıkan QR kodunu Expo Go ile okutun.

Kullanım:
1. Uygulamayı açın.
2. "Randevular" sekmesinden yeni randevu ekleyin (başlık, konu, açıklama, tarih ve saat seçin).
3. "Randevularım" sekmesinde eklediğiniz randevuları görebilir, düzenleyebilir veya silebilirsiniz.
4. Randevu zamanı geldiğinde cihazınıza bildirim gelir.
5. Profil sekmesinde örnek profil bilgisi görüntülenir.

Notlar:
- AsyncStorage ile kalıcı veri saklama için uygulamayı Expo Go veya development build ile çalıştırabilirsiniz.
- Randevu ekleme, silme ve düzenleme işlemleri anında local storage'a kaydedilir.

Ekler
-----
- Kaynak kod: (Proje dizininde App.js, styles.js ve ilgili dosyalar)
- Kullanılan kütüphaneler: @react-native-async-storage/async-storage, expo-notifications, react-native-elements, @react-native-picker/picker
- Referanslar: Expo ve React Native resmi dokümantasyonları

- Uygulamanın Expo üzerinden yayınlanan son haline aşağıdaki bağlantıdan ulaşabilirsiniz:

  Expo Yayın Linki:
  https://expo.dev/preview/update?message=ilk%20g%C3%BCncelleme&updateRuntimeVersion=1.0.0&createdAt=2025-06-02T10%3A35%3A14.538Z&slug=exp&projectId=ff59008e-0c44-4ff0-b45b-8ee024114a23&group=a67ce4bb-d624-4e41-b25d-0cafaa38424b

- Ayrıca, aşağıdaki QR kodu telefonunuzun kamerası veya bir QR kod okuyucu ile tarayarak uygulamayı doğrudan açabilirsiniz:

- Not: Uygulamayı açmak için Expo Go uygulamasının telefona yüklü olması gerekmektedir. 
