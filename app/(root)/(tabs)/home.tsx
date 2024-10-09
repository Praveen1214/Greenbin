import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Platform, StatusBar, Dimensions,StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [recycleStats, setRecycleStats] = useState(null);

  useEffect(() => {
    // Simulating API call to fetch recycle stats
    setTimeout(() => {
      setRecycleStats([20, 45, 28, 80, 99, 43]);
    }, 1000);
  }, []);

  const platformSpecificStyle = Platform.select({
    ios: "mb-1",
    android: "mt-2 mb-2"
  });

   const colors = {
    primary: '#4CAF50',
    lightPrimary: '#81C784',
    darkPrimary: '#388E3C',
    accent: '#FFC107',
    background: '#F1F8E9',
    text: '#212121',
    textLight: '#757575',
  };

  const screenWidth = Dimensions.get("window").width;

  const actions = [
    { icon: 'calendar', text: 'Book a Pickup', navigateTo: 'Book_a_pickup', gradient: ['#4CAF50', '#45a049'] },
    { icon: 'refresh-cw', text: 'Recycle', navigateTo: 'Recycle', gradient: ['#2196F3', '#1E88E5'] },
    { icon: 'book-open', text: 'Learn', navigateTo: 'Learn', gradient: ['#FF9800', '#F57C00'] },
    { icon: 'file-text', text: 'News', navigateTo: 'News', gradient: ['#9C27B0', '#8E24AA'] },
  ];

  
  const SimpleBarChart = ({ data }) => {
    const maxValue = Math.max(...data);
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 200, paddingVertical: 10 }}>
        {data.map((value, index) => (
          <View key={index} style={{ flex: 1, marginHorizontal: 2 }}>
            <View 
              style={{
                height: (value / maxValue) * 180,
                backgroundColor: '#4CAF50',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            />
            <Text style={{ textAlign: 'center', marginTop: 5 }}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 bg-gray-100 ${platformSpecificStyle}`}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
          <View>
            <Text style={{ color: '#4CAF50', fontSize: 14 }}>Welcome</Text>
            <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>Abhishek Peiris</Text>
          </View>
          <TouchableOpacity style={{ padding: 8 }}>
            <Feather name="bell" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Enhanced Main Banner */}
        <View style={{ backgroundColor: colors.darkPrimary, borderRadius: 30, margin: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 21, fontWeight: 'bold', marginBottom: 8 }}>Don't throw away,</Text>
            <Text style={{ color: colors.accent, fontSize: 18, fontWeight: 'bold' }}>recycle for another day</Text>
            <Text style={{ color: 'white', fontSize: 16, marginTop: 12, opacity: 0.8 }}>Recycle with us</Text>
            <TouchableOpacity 
              style={{ backgroundColor: 'white', borderRadius: 25, paddingVertical: 12, paddingHorizontal: 24, alignSelf: 'flex-start', marginTop: 20, elevation: 3 }}
              onPress={() => navigation.navigate('Book_a_pickup')}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Book a Pickup</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://example.com/recycling-illustration.png' }}
            style={{ width: 120, height: 120, marginLeft: 20 }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        {actions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={28} color="white" />
              </View>
              <Text style={styles.actionText}>{item.text}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>

       
{/* Enhanced Contact Us */}
<View style={{ backgroundColor: 'white', borderRadius: 20, margin: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Contact Us</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{
              backgroundColor: colors.lightPrimary,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 15,
              paddingVertical: 12,
              paddingHorizontal: 20,
              flex: 1,
              marginRight: 8,
            }}>
              <Feather name="mail" size={24} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>Send Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: colors.primary,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 15,
              paddingVertical: 12,
              paddingHorizontal: 20,
              flex: 1,
              marginLeft: 8,
            }}>
              <Feather name="phone" size={24} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientBackground: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});


export default HomeScreen;