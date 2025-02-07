import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const ExchangeScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [balances, setBalances] = useState({
    USD: 0,
    EUR: 0,
    TRY: 0
  });

  useEffect(() => {
    loadBalances();
  }, []);

  const loadBalances = async () => {
    try {
      const savedBalances = await AsyncStorage.getItem('userBalances');
      if (savedBalances) {
        setBalances(JSON.parse(savedBalances));
      }
    } catch (error) {
      console.error('Error loading balances:', error);
      Alert.alert('Error', 'Failed to load balances');
    }
  };

  const getExchangeRate = (from, to) => {
    const rates = {
      USD: { EUR: 0.85, TRY: 27.5 },
      EUR: { USD: 1.18, TRY: 32.5 },
      TRY: { USD: 0.036, EUR: 0.031 }
    };
    return rates[from][to];
  };

  const handleExchange = async () => {
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }

      if (fromCurrency === toCurrency) {
        Alert.alert('Error', 'Please select different currencies');
        return;
      }

      if (amountNum > balances[fromCurrency]) {
        Alert.alert('Error', 'Insufficient balance');
        return;
      }

      const rate = getExchangeRate(fromCurrency, toCurrency);
      const convertedAmount = amountNum * rate;

      const newBalances = { ...balances };
      newBalances[fromCurrency] -= amountNum;
      newBalances[toCurrency] += convertedAmount;

      await AsyncStorage.setItem('userBalances', JSON.stringify(newBalances));
      setBalances(newBalances);
      setAmount('');

      Alert.alert('Success', 'Exchange completed successfully');
    } catch (error) {
      console.error('Exchange error:', error);
      Alert.alert('Error', 'Failed to complete exchange');
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

  return (
    <LinearGradient
      colors={['#000046', '#1CB5E0']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Title style={styles.title}>Currency Exchange</Title>

        <View style={styles.balanceContainer}>
          {Object.entries(balances).map(([curr, amount]) => (
            <Text key={curr} style={styles.balanceText}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol(curr)}</Text>
              <Text style={styles.balanceAmount}>{amount.toFixed(2)}</Text>
              <Text style={styles.currencyCode}> {curr}</Text>
            </Text>
          ))}
        </View>

        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#fff' } }}
          outlineColor="rgba(255,255,255,0.3)"
          placeholderTextColor="#fff"
        />

        <View style={styles.currencyContainer}>
          <View style={styles.currencySection}>
            <Text style={styles.label}>From:</Text>
            <View style={styles.buttonGroup}>
              {['USD', 'EUR', 'TRY'].map((currency) => (
                <Button
                  key={currency}
                  mode={fromCurrency === currency ? 'contained' : 'outlined'}
                  onPress={() => setFromCurrency(currency)}
                  style={[
                    styles.currencyButton,
                    fromCurrency === currency && styles.selectedCurrencyButton
                  ]}
                  labelStyle={[
                    styles.currencyButtonLabel,
                    fromCurrency === currency && styles.selectedCurrencyLabel
                  ]}
                >
                  {currency}
                </Button>
              ))}
            </View>
          </View>

          <View style={styles.currencySection}>
            <Text style={styles.label}>To:</Text>
            <View style={styles.buttonGroup}>
              {['USD', 'EUR', 'TRY'].map((currency) => (
                <Button
                  key={currency}
                  mode={toCurrency === currency ? 'contained' : 'outlined'}
                  onPress={() => setToCurrency(currency)}
                  style={[
                    styles.currencyButton,
                    toCurrency === currency && styles.selectedCurrencyButton
                  ]}
                  labelStyle={[
                    styles.currencyButtonLabel,
                    toCurrency === currency && styles.selectedCurrencyLabel
                  ]}
                >
                  {currency}
                </Button>
              ))}
            </View>
          </View>
        </View>

        {fromCurrency !== toCurrency && (
          <View style={styles.rateContainer}>
            <Text style={styles.rateText}>
              <Text style={styles.rateValue}>1 {fromCurrency}</Text>
              <Text style={styles.rateEquals}> = </Text>
              <Text style={styles.rateValue}>{getExchangeRate(fromCurrency, toCurrency)} {toCurrency}</Text>
            </Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleExchange}
          style={styles.exchangeButton}
          labelStyle={styles.exchangeButtonLabel}
        >
          Exchange Now
        </Button>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  balanceText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 5,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 55,
    fontSize: 18,
  },
  currencyContainer: {
    marginBottom: 25,
  },
  currencySection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  selectedCurrencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  currencyButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'white',
  },
  selectedCurrencyLabel: {
    color: '#fff',
  },
  rateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rateText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  rateValue: {
    fontWeight: '700',
    color: '#fff',
  },
  rateEquals: {
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  exchangeButton: {
    marginTop: 10,
    padding: 5,
    height: 55,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  exchangeButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default ExchangeScreen;
