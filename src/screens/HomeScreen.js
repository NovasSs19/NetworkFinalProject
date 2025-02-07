import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const HomeScreen = ({ navigation }) => {
  const [balances, setBalances] = useState({
    USD: 0,
    EUR: 0,
    TRY: 0,
  });

  useEffect(() => {
    loadBalances();
    const interval = setInterval(loadBalances, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBalances = async () => {
    try {
      const savedBalances = await AsyncStorage.getItem('userBalances');
      if (savedBalances) {
        setBalances(JSON.parse(savedBalances));
      }
    } catch (error) {
      console.error('Error loading balances:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userBalances');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'TRY': return '₺';
      default: return '';
    }
  };

  const getCardGradient = (index) => {
    const gradients = [
      ['#1e3c72', '#2a5298'],
      ['#2193b0', '#6dd5ed'],
      ['#cc2b5e', '#753a88']
    ];
    return gradients[index % gradients.length];
  };

  const QuickActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Surface style={[styles.actionIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={28} color="white" />
      </Surface>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000046', '#1CB5E0']}
        style={styles.background}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.titleText}>Currency Exchange</Text>
          </View>
          <IconButton
            icon="logout"
            iconColor="white"
            size={24}
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          pagingEnabled
        >
          {Object.entries(balances).map(([currency, amount], index) => (
            <Surface key={currency} style={styles.card}>
              <LinearGradient
                colors={getCardGradient(index)}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardHeader}>
                  <MaterialCommunityIcons
                    name={currency === 'USD' ? 'currency-usd' : currency === 'EUR' ? 'currency-eur' : 'currency-try'}
                    size={32}
                    color="white"
                  />
                  <Text style={styles.cardCurrency}>{currency}</Text>
                </View>
                <Text style={styles.cardAmount}>
                  {getCurrencySymbol(currency)}{amount.toFixed(2)}
                </Text>
                <Text style={styles.cardLabel}>Available Balance</Text>
              </LinearGradient>
            </Surface>
          ))}
        </ScrollView>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <QuickActionButton
              icon="cash-plus"
              label="Add Funds"
              color="#4CAF50"
              onPress={() => navigation.navigate('AddFunds')}
            />
            <QuickActionButton
              icon="swap-horizontal"
              label="Exchange"
              color="#2196F3"
              onPress={() => navigation.navigate('Exchange')}
            />
            <QuickActionButton
              icon="chart-line"
              label="Live Trades"
              color="#9C27B0"
              onPress={() => navigation.navigate('LiveTrades')}
            />
            <QuickActionButton
              icon="history"
              label="History"
              color="#FF9800"
              onPress={() => navigation.navigate('History')}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  titleText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    marginRight: 20,
    borderRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardCurrency: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  actionsContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default HomeScreen;
