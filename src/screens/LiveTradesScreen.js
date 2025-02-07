import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LiveTradesScreen = () => {
  const [trades, setTrades] = useState([]);
  const [trendingPairs, setTrendingPairs] = useState([
    { pair: 'USD/EUR', rate: 0.85, change: '+1.2%', trend: 'up' },
    { pair: 'EUR/TRY', rate: 32.5, change: '-0.8%', trend: 'down' },
    { pair: 'USD/TRY', rate: 27.8, change: '+0.5%', trend: 'up' },
    { pair: 'EUR/USD', rate: 1.18, change: '-0.3%', trend: 'down' },
  ]);

  useEffect(() => {
    generateRandomTrades();
    const interval = setInterval(generateRandomTrades, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateRandomTrades = () => {
    const newTrade = {
      id: Date.now(),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      amount: (Math.random() * 10000).toFixed(2),
      pair: ['USD/EUR', 'EUR/TRY', 'USD/TRY'][Math.floor(Math.random() * 3)],
      price: (Math.random() * 100).toFixed(2),
      time: new Date().toLocaleTimeString(),
    };

    setTrades(prevTrades => [newTrade, ...prevTrades].slice(0, 10));
  };

  const TrendingCard = ({ pair, rate, change, trend }) => (
    <Surface style={styles.trendingCard}>
      <LinearGradient
        colors={trend === 'up' ? ['#43a047', '#1b5e20'] : ['#e53935', '#c62828']}
        style={styles.trendingGradient}
      >
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingPair}>{pair}</Text>
          <MaterialCommunityIcons
            name={trend === 'up' ? 'trending-up' : 'trending-down'}
            size={24}
            color="white"
          />
        </View>
        <Text style={styles.trendingRate}>{rate}</Text>
        <Text style={styles.trendingChange}>{change}</Text>
      </LinearGradient>
    </Surface>
  );

  const TradeItem = ({ trade }) => (
    <Surface style={styles.tradeItem}>
      <View style={styles.tradeLeft}>
        <MaterialCommunityIcons
          name={trade.type === 'buy' ? 'arrow-bottom-right' : 'arrow-top-right'}
          size={24}
          color={trade.type === 'buy' ? '#43a047' : '#e53935'}
        />
        <View style={styles.tradeInfo}>
          <Text style={styles.tradePair}>{trade.pair}</Text>
          <Text style={styles.tradeTime}>{trade.time}</Text>
        </View>
      </View>
      <View style={styles.tradeRight}>
        <Text style={styles.tradeAmount}>${trade.amount}</Text>
        <Text style={[
          styles.tradeType,
          { color: trade.type === 'buy' ? '#43a047' : '#e53935' }
        ]}>
          {trade.type.toUpperCase()}
        </Text>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000046', '#1CB5E0']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Trades</Text>
          <IconButton
            icon="refresh"
            iconColor="white"
            size={24}
            onPress={generateRandomTrades}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingContainer}
        >
          {trendingPairs.map((item, index) => (
            <TrendingCard key={index} {...item} />
          ))}
        </ScrollView>

        <View style={styles.tradesContainer}>
          <Text style={styles.sectionTitle}>Recent Trades</Text>
          <ScrollView>
            {trades.map((trade) => (
              <TradeItem key={trade.id} trade={trade} />
            ))}
          </ScrollView>
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
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  trendingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  trendingCard: {
    width: width * 0.4,
    height: 120,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  trendingGradient: {
    flex: 1,
    padding: 15,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendingPair: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trendingRate: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trendingChange: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  tradesContainer: {
    flex: 1,
    backgroundColor: 'white',
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
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  tradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tradeInfo: {
    marginLeft: 10,
  },
  tradePair: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tradeTime: {
    fontSize: 12,
    color: '#666',
  },
  tradeRight: {
    alignItems: 'flex-end',
  },
  tradeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tradeType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default LiveTradesScreen;
