import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    mostTraded: 'USD/EUR',
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    // Örnek işlem verileri
    const sampleTransactions = [
      {
        id: 1,
        type: 'exchange',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 1000,
        rate: 0.85,
        date: '2024-02-07',
        time: '14:30',
        status: 'completed'
      },
      {
        id: 2,
        type: 'deposit',
        currency: 'USD',
        amount: 5000,
        date: '2024-02-06',
        time: '10:15',
        status: 'completed'
      },
      {
        id: 3,
        type: 'exchange',
        fromCurrency: 'EUR',
        toCurrency: 'TRY',
        amount: 2000,
        rate: 32.5,
        date: '2024-02-06',
        time: '09:45',
        status: 'completed'
      },
      {
        id: 4,
        type: 'withdrawal',
        currency: 'EUR',
        amount: 1500,
        date: '2024-02-05',
        time: '16:20',
        status: 'completed'
      },
      {
        id: 5,
        type: 'exchange',
        fromCurrency: 'TRY',
        toCurrency: 'USD',
        amount: 27800,
        rate: 0.036,
        date: '2024-02-05',
        time: '11:30',
        status: 'completed'
      }
    ];

    setTransactions(sampleTransactions);
    
    // İstatistikleri hesapla
    const stats = {
      totalTransactions: sampleTransactions.length,
      totalVolume: sampleTransactions.reduce((sum, t) => sum + t.amount, 0),
      mostTraded: 'USD/EUR'
    };
    setStats(stats);
  };

  const StatCard = ({ title, value, icon, colors }) => (
    <Surface style={styles.statCard}>
      <LinearGradient
        colors={colors}
        style={styles.statGradient}
      >
        <MaterialCommunityIcons name={icon} size={24} color="white" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </Surface>
  );

  const TransactionItem = ({ transaction }) => {
    const getIcon = () => {
      switch (transaction.type) {
        case 'exchange': return 'swap-horizontal';
        case 'deposit': return 'arrow-down';
        case 'withdrawal': return 'arrow-up';
        default: return 'circle';
      }
    };

    const getStatusColor = () => {
      switch (transaction.status) {
        case 'completed': return '#4CAF50';
        case 'pending': return '#FFC107';
        case 'failed': return '#F44336';
        default: return '#9E9E9E';
      }
    };

    return (
      <Surface style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={24}
            color="#1976D2"
          />
        </View>
        <View style={styles.transactionInfo}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionType}>
              {transaction.type === 'exchange'
                ? `${transaction.fromCurrency} → ${transaction.toCurrency}`
                : `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} ${transaction.currency}`}
            </Text>
            <Text style={styles.transactionAmount}>
              {transaction.type === 'exchange'
                ? `${transaction.amount} ${transaction.fromCurrency}`
                : `${transaction.amount} ${transaction.currency}`}
            </Text>
          </View>
          <View style={styles.transactionFooter}>
            <Text style={styles.transactionDate}>
              {transaction.date} {transaction.time}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{transaction.status}</Text>
            </View>
          </View>
        </View>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000046', '#1CB5E0']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <IconButton
            icon="refresh"
            iconColor="white"
            size={24}
            onPress={loadTransactions}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon="chart-bar"
            colors={['#1976D2', '#1565C0']}
          />
          <StatCard
            title="Total Volume"
            value={`$${stats.totalVolume.toLocaleString()}`}
            icon="cash"
            colors={['#43A047', '#2E7D32']}
          />
          <StatCard
            title="Most Traded Pair"
            value={stats.mostTraded}
            icon="trending-up"
            colors={['#7B1FA2', '#6A1B9A']}
          />
        </ScrollView>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <ScrollView>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statCard: {
    width: width * 0.4,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  statGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  transactionsContainer: {
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
  transactionItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
