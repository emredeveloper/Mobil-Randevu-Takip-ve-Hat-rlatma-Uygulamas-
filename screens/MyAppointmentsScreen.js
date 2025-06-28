import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from 'react-native-vector-icons';

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
      alert('Lütfen bir başlık giriniz');
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
          <View style={{ backgroundColor: isDark ? '#23242a' : '#fff', borderRadius: 16, marginHorizontal: 18, marginVertical: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="list-circle-outline" size={32} color={isDark ? '#ffd600' : '#6200ee'} style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: isDark ? '#fff' : '#222' }}>{item.title}</Text>
              <Text style={{ color: isDark ? '#bbb' : '#666', fontSize: 15 }}>{new Date(item.date).toLocaleString('tr-TR')}</Text>
              {item.description ? <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 14 }}>{item.description}</Text> : null}
            </View>
            <TouchableOpacity style={{ backgroundColor: '#ff4444', borderRadius: 8, padding: 8 }} onPress={() => onDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: isDark ? '#bbb' : '#aaa', marginTop: 40, fontSize: 16 }}>Henüz kayıtlı randevunuz yok.</Text>}
      />
      {/* Düzenleme Modalı */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Randevuyu Düzenle</Text>
            <Text style={{ color: '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Başlık</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 10 }}
              placeholder="Randevu başlığı giriniz"
              value={editData?.title || ''}
              onChangeText={t => setEditData({ ...editData, title: t })}
            />
            <Text style={{ color: '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Konu</Text>
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
            <Text style={{ color: '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Açıklama (Opsiyonel)</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 10, minHeight: 60 }}
              placeholder="Açıklama giriniz"
              value={editData?.description || ''}
              onChangeText={t => setEditData({ ...editData, description: t })}
              multiline
              numberOfLines={3}
            />
            <Text style={{ color: '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Tarih</Text>
            <TouchableOpacity 
              style={{ marginBottom: 10, backgroundColor: '#f6f6fa', borderRadius: 8, padding: 10, alignItems: 'center' }}
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
            <Text style={{ color: '#6200ee', fontWeight: 'bold', marginBottom: 6 }}>Saat</Text>
            <TouchableOpacity 
              style={{ marginBottom: 10, backgroundColor: '#f6f6fa', borderRadius: 8, padding: 10, alignItems: 'center' }}
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

export default MyAppointmentsScreen; 