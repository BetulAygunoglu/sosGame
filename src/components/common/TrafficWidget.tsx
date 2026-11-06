import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

interface TrafficWidgetProps {
  lat?: number;
  lon?: number;
  regionName?: string;
}

const { width } = Dimensions.get('window');

// Trafik durumu tipi
interface TrafficData {
  status: 'low' | 'moderate' | 'high' | 'severe';
  density: number; // 0-100 arası yoğunluk
  description: string;
  averageSpeed: number; // Ortalama hız km/s
  roadCondition: string;
}

const TrafficWidget: React.FC<TrafficWidgetProps> = ({ 
  lat, 
  lon, 
  regionName = 'Bölgenizdeki' 
}) => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek API entegrasyonu yerine statik veri kullanıyoruz
    const fetchTrafficData = async () => {
      try {
        // Statik trafik verisi - gerçek API ile değiştirilecek
        setTrafficData({
          status: 'moderate',
          density: 45,
          description: 'Orta yoğunlukta trafik',
          averageSpeed: 32,
          roadCondition: 'Normal'
        });
      } catch (error) {
        console.error('Trafik verisi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchTrafficData();
    }, 500); // Yükleme görüntüsünü göstermek için küçük bir gecikme
  }, [lat, lon]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!trafficData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Trafik verisi alınamadı</Text>
      </View>
    );
  }

  // Trafik durumuna göre renk teması
  const getTrafficTheme = () => {
    const { status } = trafficData;
    
    // Düşük trafik - yeşil tonları
    if (status === 'low') return { 
      color: '#4CAF50',
      secondaryColor: '#81C784',
      backgroundColor: '#E8F5E9'
    }; 
    
    // Orta trafik - sarı/turuncu tonları
    if (status === 'moderate') return { 
      color: '#FF9800',
      secondaryColor: '#FFB74D',
      backgroundColor: '#FFF3E0' 
    }; 
    
    // Yüksek trafik - turuncu/kırmızı tonları
    if (status === 'high') return { 
      color: '#F44336',
      secondaryColor: '#E57373',
      backgroundColor: '#FFEBEE'
    }; 
    
    // Aşırı trafik - koyu kırmızı tonları
    if (status === 'severe') return { 
      color: '#C62828',
      secondaryColor: '#EF5350',
      backgroundColor: '#FFEBEE'
    }; 
    
    // Varsayılan 
    return { 
      color: '#FF9800',
      secondaryColor: '#FFB74D',
      backgroundColor: '#FFF3E0'
    }; 
  };

  const theme = getTrafficTheme();

  // Trafik durumu ikon bileşeni
  const TrafficStatusIcon = () => {
    const { status } = trafficData;
    
    return (
      <View style={[styles.trafficLightContainer, { borderColor: theme.color }]}>
        <View style={[
          styles.trafficLight, 
          styles.redLight, 
          status === 'severe' || status === 'high' ? { backgroundColor: '#D50000' } : { backgroundColor: '#FFCDD2' }
        ]} />
        <View style={[
          styles.trafficLight, 
          styles.yellowLight, 
          status === 'moderate' ? { backgroundColor: '#FFC107' } : { backgroundColor: '#FFECB3' }
        ]} />
        <View style={[
          styles.trafficLight, 
          styles.greenLight, 
          status === 'low' ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#C8E6C9' }
        ]} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.roadLines}>
        <View style={styles.roadLine} />
        <View style={styles.roadLine} />
        <View style={styles.roadLine} />
      </View>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Trafik Durumu</Text>
          <Text style={styles.subtitle}>{regionName}</Text>
        </View>
        <TrafficStatusIcon />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={[styles.statusBox, { backgroundColor: `${theme.color}20` }]}>
          <Text style={[styles.statusText, { color: theme.color }]}>
            {trafficData.description}
          </Text>
        </View>
        
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <View style={[styles.metricCircle, { borderColor: theme.color }]}>
              <Text style={[styles.metricValue, { color: theme.color }]}>
                {trafficData.averageSpeed}
              </Text>
            </View>
            <Text style={styles.metricLabel}>km/s</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.metricItem}>
            <View style={[styles.densityMeter, { borderColor: theme.secondaryColor }]}>
              <View 
                style={[
                  styles.densityFill, 
                  { width: `${trafficData.density}%`, backgroundColor: theme.color }
                ]} 
              />
            </View>
            <Text style={styles.metricLabel}>Yoğunluk: %{trafficData.density}</Text>
          </View>
        </View>
        
        <View style={styles.roadInfo}>
          <Text style={styles.roadCondition}>
            Yol durumu: <Text style={{ fontWeight: 'bold' }}>{trafficData.roadCondition}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  roadLines: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    opacity: 0.07,
  },
  roadLine: {
    width: 80,
    height: 8,
    backgroundColor: '#333',
    marginVertical: 20,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  trafficLightContainer: {
    width: 24,
    height: 70,
    backgroundColor: '#424242',
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  trafficLight: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  redLight: {
    backgroundColor: '#FFCDD2',
  },
  yellowLight: {
    backgroundColor: '#FFECB3',
  },
  greenLight: {
    backgroundColor: '#C8E6C9',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 4,
  },
  statusBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 15,
  },
  densityMeter: {
    width: 120,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  densityFill: {
    height: '100%',
    borderRadius: 6,
  },
  roadInfo: {
    marginTop: 4,
  },
  roadCondition: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    width: width * 0.85,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  errorContainer: {
    width: width * 0.85,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    margin: 10,
    shadowColor: '#FF6666',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrafficWidget; 