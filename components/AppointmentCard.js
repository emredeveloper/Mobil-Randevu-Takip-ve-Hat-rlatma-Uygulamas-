import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppointmentCard = ({ item, onDelete, onEdit, theme }) => {
  const isDark = theme === 'dark';
  const isPast = new Date(item.date) < new Date();

  return (
    <View 
      style={{ 
        backgroundColor: isDark ? '#23242a' : '#fff', 
        borderRadius: 16, 
        marginHorizontal: 18, 
        marginVertical: 8, 
        padding: 16, 
        shadowColor: '#000', 
        shadowOpacity: 0.08, 
        shadowRadius: 8, 
        shadowOffset: { width: 0, height: 2 },
        opacity: isPast ? 0.7 : 1,
        borderLeftWidth: 4,
        borderLeftColor: isPast ? '#888' : (isDark ? '#ffd600' : '#6200ee')
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Ionicons 
          name={isPast ? "time-outline" : "calendar-outline"} 
          size={24} 
          color={isPast ? '#888' : (isDark ? '#ffd600' : '#6200ee')} 
          style={{ marginRight: 12 }} 
        />
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontWeight: 'bold', 
            fontSize: 18, 
            color: isDark ? '#fff' : '#222',
            textDecorationLine: isPast ? 'line-through' : 'none'
          }}>
            {item.title}
          </Text>
          <Text style={{ 
            color: isDark ? '#bbb' : '#666', 
            fontSize: 14,
            fontWeight: '600',
            marginTop: 2
          }}>
            {item.topic}
          </Text>
        </View>
        {isPast && (
          <View style={{ 
            backgroundColor: '#888', 
            paddingHorizontal: 8, 
            paddingVertical: 4, 
            borderRadius: 12 
          }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
              Geçmiş
            </Text>
          </View>
        )}
      </View>

      <Text style={{ 
        color: isDark ? '#bbb' : '#666', 
        fontSize: 15,
        marginBottom: 8
      }}>
        📅 {new Date(item.date).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: 'long', 
          year: 'numeric'
        })}
      </Text>

      <Text style={{ 
        color: isDark ? '#bbb' : '#666', 
        fontSize: 15,
        marginBottom: item.description ? 8 : 12
      }}>
        🕒 {new Date(item.date).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>

      {item.description && (
        <Text style={{ 
          color: isDark ? '#bbb' : '#888', 
          fontSize: 14,
          fontStyle: 'italic',
          marginBottom: 12
        }}>
          💭 {item.description}
        </Text>
      )}

      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: isDark ? '#333' : '#eee',
        paddingTop: 12,
        marginTop: 8
      }}>
        {!isPast && onEdit && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: isDark ? '#ffd600' : '#6200ee', 
              borderRadius: 8, 
              padding: 8,
              marginRight: 8
            }} 
            onPress={() => onEdit(item)}
          >
            <Ionicons name="pencil-outline" size={20} color={isDark ? '#222' : '#fff'} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#ff4444', 
            borderRadius: 8, 
            padding: 8 
          }} 
          onPress={() => onDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppointmentCard;
