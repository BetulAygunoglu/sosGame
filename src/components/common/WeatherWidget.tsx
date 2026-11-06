import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import axios from 'axios';

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

const { width } = Dimensions.get('window');

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<{ temp: number; description: string; icon: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeather({
            temp: 20,
            description: "Açık",
            icon: "01d",
          });
        setLoading(false);
        return true;
        const apiKey = 'YOUR_OPEN_WEATHER_API_KEY'; // Gerçek API anahtarınızı buraya ekleyin
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`
        );
        const data = response.data;
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } catch (error) {
        console.error('Hava durumu API hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Hava durumu bilgisi alınamadı</Text>
      </View>
    );
  }

  // Hava durumu durumuna göre renk temaları
  const getWeatherTheme = () => {
    const icon = weather.icon;
    
    // Güneşli gündüz - sıcak turuncu/sarı tonları
    if (icon.includes('01d')) return { 
      color: '#FF7E00', 
      bgColor: '#FFFCF2',
      gradientColors: ['#FFE17D', '#FFB347']
    }; 
    
    // Açık gece - mor/lacivert tonları
    if (icon.includes('01n')) return { 
      color: '#585CCA', 
      bgColor: '#F5F6FF',
      gradientColors: ['#9BA0FF', '#585CCA']
    }; 
    
    // Az bulutlu - mavi/turkuaz tonları
    if (icon.includes('02')) return { 
      color: '#00B2FF', 
      bgColor: '#F0FAFF',
      gradientColors: ['#B6EAFF', '#00B2FF']
    }; 
    
    // Çok bulutlu - gri/mavi tonları
    if (icon.includes('03') || icon.includes('04')) return { 
      color: '#6E7B8C', 
      bgColor: '#F6F9FC',
      gradientColors: ['#A8B8CC', '#6E7B8C']
    }; 
    
    // Yağmurlu - koyu mavi tonları
    if (icon.includes('09') || icon.includes('10')) return { 
      color: '#0070E0', 
      bgColor: '#EEF6FF',
      gradientColors: ['#83BDFF', '#0070E0']
    }; 
    
    // Gök gürültülü - lacivert/mor tonları
    if (icon.includes('11')) return { 
      color: '#4A4F9F', 
      bgColor: '#F1F2FF',
      gradientColors: ['#8A90F8', '#4A4F9F']
    }; 
    
    // Karlı - açık mavi/beyaz tonları
    if (icon.includes('13')) return { 
      color: '#66A5D4', 
      bgColor: '#F5FBFF',
      gradientColors: ['#B8E0FF', '#66A5D4']
    }; 
    
    // Sisli - gri/beyaz tonları
    if (icon.includes('50')) return { 
      color: '#91A0B2', 
      bgColor: '#F8FAFD',
      gradientColors: ['#C5D0DF', '#91A0B2']
    }; 
    
    // Varsayılan - sarı/turuncu tonları
    return { 
      color: '#FF9800', 
      bgColor: '#FFFAF0',
      gradientColors: ['#FFDB8C', '#FF9800']
    }; 
  };

  const theme = getWeatherTheme();

  // Hava durumu açıklamasını büyük harfle başlat
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Hava durumu ikonuna göre açıklama simgesi seç
  const getWeatherEmoji = () => {
    const icon = weather.icon;
    if (icon.includes('01d')) return '☀️';
    if (icon.includes('01n')) return '🌙';
    if (icon.includes('02')) return '⛅';
    if (icon.includes('03') || icon.includes('04')) return '☁️';
    if (icon.includes('09')) return '🌧️';
    if (icon.includes('10')) return '🌦️';
    if (icon.includes('11')) return '⛈️';
    if (icon.includes('13')) return '❄️';
    if (icon.includes('50')) return '🌫️';
    return '🌡️';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      {/* Şık renk gradyanı arka planı */}
      <View style={styles.gradientContainer}>
        <View style={[styles.gradientBall, { backgroundColor: theme.gradientColors[0] }]} />
        <View style={[styles.gradientBall, { backgroundColor: theme.gradientColors[1], right: -40, top: -30 }]} />
      </View>
      
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Hava Durumu</Text>
          <Text style={styles.dateText}>Bugün</Text>
        </View>
        <Text style={styles.emoji}>{getWeatherEmoji()}</Text>
      </View>
      
      <View style={styles.mainContent}>
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: theme.color }]}>{weather.temp.toFixed(0)}</Text>
          <Text style={[styles.degree, { color: theme.color }]}>°C</Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <View style={[styles.iconBackground, { backgroundColor: `${theme.color}20` }]}>
            <Image
              source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` }}
              style={styles.weatherIcon}
            />
          </View>
          <Text style={[styles.description, { color: theme.color }]}>
            {capitalizeFirstLetter(weather.description)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    maxHeight:210,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
  },
  gradientContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  gradientBall: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -60,
    right: -20,
    opacity: 0.8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emoji: {
    fontSize: 32,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    zIndex: 2,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 58,
    fontWeight: 'bold',
  },
  degree: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  descriptionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  weatherIcon: {
    width: 70,
    height: 70,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    width: width * 0.85,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9F0',
    borderRadius: 24,
    margin: 10,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 240, 200, 0.6)',
  },
  errorContainer: {
    width: width * 0.85,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 24,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 180, 0.6)',
    shadowColor: '#FF6666',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default WeatherWidget; 