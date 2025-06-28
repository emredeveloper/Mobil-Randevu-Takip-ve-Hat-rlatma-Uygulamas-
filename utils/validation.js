// Email validasyonu
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, error: 'Email adresi gereklidir' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Geçerli bir email adresi giriniz' };
  }
  
  return { valid: true };
};

// Şifre validasyonu
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Şifre gereklidir' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Şifre en az 6 karakter olmalıdır' };
  }
  
  if (password.length > 50) {
    return { valid: false, error: 'Şifre en fazla 50 karakter olabilir' };
  }
  
  // Güçlü şifre kontrolü (opsiyonel)
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  return { 
    valid: true, 
    strength: strength,
    strengthText: strength < 2 ? 'Zayıf' : strength < 3 ? 'Orta' : strength < 4 ? 'Güçlü' : 'Çok Güçlü'
  };
};

// İsim validasyonu
export const validateName = (name) => {
  if (!name) {
    return { valid: false, error: 'İsim gereklidir' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'İsim en az 2 karakter olmalıdır' };
  }
  
  if (name.trim().length > 50) {
    return { valid: false, error: 'İsim en fazla 50 karakter olabilir' };
  }
  
  const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'İsim sadece harflerden oluşmalıdır' };
  }
  
  return { valid: true };
};

// Yaş validasyonu
export const validateAge = (age) => {
  if (!age) {
    return { valid: false, error: 'Yaş gereklidir' };
  }
  
  const ageNum = parseInt(age);
  
  if (isNaN(ageNum)) {
    return { valid: false, error: 'Yaş sayı olmalıdır' };
  }
  
  if (ageNum < 13) {
    return { valid: false, error: 'Yaş 13\'ten küçük olamaz' };
  }
  
  if (ageNum > 120) {
    return { valid: false, error: 'Yaş 120\'den büyük olamaz' };
  }
  
  return { valid: true };
};

// Telefon numarası validasyonu
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Telefon numarası gereklidir' };
  }
  
  // Türkiye telefon numarası formatı
  const phoneRegex = /^(\+90|0)?5[0-9]{9}$/;
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Geçerli bir telefon numarası giriniz (05xxxxxxxxx)' };
  }
  
  return { valid: true };
};

// Randevu başlığı validasyonu
export const validateAppointmentTitle = (title) => {
  if (!title) {
    return { valid: false, error: 'Randevu başlığı gereklidir' };
  }
  
  if (title.trim().length < 3) {
    return { valid: false, error: 'Başlık en az 3 karakter olmalıdır' };
  }
  
  if (title.trim().length > 100) {
    return { valid: false, error: 'Başlık en fazla 100 karakter olabilir' };
  }
  
  return { valid: true };
};

// Randevu tarihi validasyonu
export const validateAppointmentDate = (date) => {
  if (!date) {
    return { valid: false, error: 'Tarih seçiniz' };
  }
  
  const selectedDate = new Date(date);
  const now = new Date();
  
  // Geçmiş tarih kontrolü
  if (selectedDate < now) {
    return { valid: false, error: 'Geçmiş tarih seçilemez' };
  }
  
  // Çok uzak gelecek tarihi kontrolü (1 yıl)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (selectedDate > oneYearFromNow) {
    return { valid: false, error: 'En fazla 1 yıl sonraki tarih seçilebilir' };
  }
  
  return { valid: true };
};

// Açıklama validasyonu
export const validateDescription = (description) => {
  if (description && description.length > 500) {
    return { valid: false, error: 'Açıklama en fazla 500 karakter olabilir' };
  }
  
  return { valid: true };
};

// Genel form validasyonu
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(fieldName => {
    const fieldValue = fields[fieldName];
    const fieldRules = rules[fieldName];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const result = rule(fieldValue);
        if (!result.valid) {
          errors[fieldName] = result.error;
          isValid = false;
        }
      }
    });
  });
  
  return { isValid, errors };
};

// Kullanıcı kayıt formu validasyonu
export const validateRegisterForm = (formData) => {
  const rules = {
    name: [validateName],
    email: [validateEmail],
    password: [validatePassword],
    age: [validateAge]
  };
  
  return validateForm(formData, rules);
};

// Kullanıcı giriş formu validasyonu
export const validateLoginForm = (formData) => {
  const rules = {
    email: [validateEmail],
    password: [(password) => {
      if (!password) {
        return { valid: false, error: 'Şifre gereklidir' };
      }
      return { valid: true };
    }]
  };
  
  return validateForm(formData, rules);
};

// Randevu formu validasyonu
export const validateAppointmentForm = (formData) => {
  const rules = {
    title: [validateAppointmentTitle],
    date: [validateAppointmentDate],
    description: [validateDescription]
  };
  
  return validateForm(formData, rules);
};

// Profil güncelleme formu validasyonu
export const validateProfileForm = (formData) => {
  const rules = {
    name: [validateName],
    email: [validateEmail],
    age: [validateAge]
  };
  
  if (formData.phone) {
    rules.phone = [validatePhone];
  }
  
  return validateForm(formData, rules);
};

// Şifre değiştirme formu validasyonu
export const validatePasswordChangeForm = (formData) => {
  const rules = {
    currentPassword: [(password) => {
      if (!password) {
        return { valid: false, error: 'Mevcut şifre gereklidir' };
      }
      return { valid: true };
    }],
    newPassword: [validatePassword],
    confirmPassword: [(confirmPassword) => {
      if (!confirmPassword) {
        return { valid: false, error: 'Şifre tekrarı gereklidir' };
      }
      if (confirmPassword !== formData.newPassword) {
        return { valid: false, error: 'Şifreler eşleşmiyor' };
      }
      return { valid: true };
    }]
  };
  
  return validateForm(formData, rules);
};

// Veri temizleme fonksiyonları
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // XSS koruması için basit temizlik
    .substring(0, 1000); // Uzunluk sınırı
};

export const sanitizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const sanitizeName = (name) => {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa çevir
    .replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, ''); // Sadece harfler ve boşluk
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateAge,
  validatePhone,
  validateAppointmentTitle,
  validateAppointmentDate,
  validateDescription,
  validateForm,
  validateRegisterForm,
  validateLoginForm,
  validateAppointmentForm,
  validateProfileForm,
  validatePasswordChangeForm,
  sanitizeInput,
  sanitizeEmail,
  sanitizeName
};
