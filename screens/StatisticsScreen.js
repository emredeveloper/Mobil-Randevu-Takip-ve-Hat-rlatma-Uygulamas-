import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APPOINTMENT_CATEGORIES } from '../utils/constants';

const { width } = Dimensions.get('window');

const StatisticsScreen = ({ appointments = [], theme = 'light' }) => {
  const isDark = theme === 'dark';

  const statistics = useMemo(() => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    const stats = {
      total: appointments.length,
      completed: appointments.filter(app => new Date(app.date) < now).length,
      upcoming: appointments.filter(app => new Date(app.date) > now).length,
      thisWeek: appointments.filter(app => new Date(app.date) > thisWeek).length,
      thisMonth: appointments.filter(app => new Date(app.date) > thisMonth).length,
      thisYear: appointments.filter(app => new Date(app.date) > thisYear).length,
      categories: {}
    };

    // Kategorilere göre istatistik
    APPOINTMENT_CATEGORIES.forEach(category => {
      stats.categories[category.value] = appointments.filter(
        app => app.category === category.value || app.topic === category.label
      ).length;
    });

    return stats;
  }, [appointments]);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={{
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 16,
      padding: 20,
      margin: 8,
      flex: 1,
      minWidth: (width - 48) / 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: isDark ? '#fff' : '#333',
          marginLeft: 12,
        }}>
          {title}
        </Text>
      </View>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: color,
        marginBottom: 4,
      }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: 14,
          color: isDark ? '#bbb' : '#666',
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const CategoryChart = () => (
    <View style={{
      backgroundColor: isDark ? '#23242a' : '#fff',
      borderRadius: 16,
      padding: 20,
      margin: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#fff' : '#333',
        marginBottom: 16,
      }}>
        Kategori Dağılımı
      </Text>
      {APPOINTMENT_CATEGORIES.map(category => {
        const count = statistics.categories[category.value] || 0;
        const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0;
        
        return (
          <View key={category.value} style={{ marginBottom: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={category.color} 
                  style={{ marginRight: 8 }}
                />
                <Text style={{
                  fontSize: 14,
                  color: isDark ? '#fff' : '#333',
                }}>
                  {category.label}
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#333',
              }}>
                {count}
              </Text>
            </View>
            <View style={{
              height: 6,
              backgroundColor: isDark ? '#333' : '#f0f0f0',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                width: `${percentage}%`,
                backgroundColor: category.color,
                borderRadius: 3,
              }} />
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? '#181a20' : '#f0f2f5' 
    }}>
      <View style={{
        backgroundColor: isDark ? '#23242a' : '#fff',
        padding: 18,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: isDark ? '#ffd600' : '#6200ee',
        }}>
          İstatistikler
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Genel İstatistikler */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 8,
          paddingTop: 16,
        }}>
          <StatCard
            title="Toplam Randevu"
            value={statistics.total}
            icon="calendar"
            color="#6200ee"
          />
          <StatCard
            title="Gelecek Randevular"
            value={statistics.upcoming}
            icon="arrow-forward-circle"
            color="#4CAF50"
          />
          <StatCard
            title="Tamamlanan"
            value={statistics.completed}
            icon="checkmark-circle"
            color="#2196F3"
          />
          <StatCard
            title="Bu Hafta"
            value={statistics.thisWeek}
            icon="calendar-outline"
            color="#FF9800"
          />
        </View>

        {/* Kategori Dağılımı */}
        <CategoryChart />

        {/* Detaylı İstatistikler */}
        <View style={{
          backgroundColor: isDark ? '#23242a' : '#fff',
          borderRadius: 16,
          padding: 20,
          margin: 8,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#333',
            marginBottom: 16,
          }}>
            Detaylı İstatistikler
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: isDark ? '#bbb' : '#666' }}>Bu Ay:</Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: 'bold' }}>
              {statistics.thisMonth}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: isDark ? '#bbb' : '#666' }}>Bu Yıl:</Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: 'bold' }}>
              {statistics.thisYear}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: isDark ? '#bbb' : '#666' }}>Tamamlanma Oranı:</Text>
            <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: 'bold' }}>
              {statistics.total > 0 ? Math.round((statistics.completed / statistics.total) * 100) : 0}%
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatisticsScreen; 