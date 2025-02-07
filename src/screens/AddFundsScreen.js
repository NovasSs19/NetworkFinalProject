import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const AddFundsScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [balances, setBalances] = useState({
    USD: 0,
    EUR: 0,
    TRY: 0,
  });

  const quickAmounts = [100, 500, 1000, 5000];

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
    }
  };

  const handleAddFunds = async () => {
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      const newBalances = { ...balances };
      newBalances[currency] = (newBalances[currency] || 0) + amountNum;

      await AsyncStorage.setItem('userBalances', JSON.stringify(newBalances));
      setBalances(newBalances);
      setAmount('');
      alert('Funds added successfully!');
    } catch (error) {
      console.error('Add funds error:', error);
      alert('Failed to add funds. Please try again.');
    }
  };

  const CurrencyOption = ({ curr, selected, onSelect }) => (
    <TouchableOpacity onPress={() => onSelect(curr)}>
      <Surface style={[
        styles.currencyOption,
        selected && styles.selectedCurrency
      ]}>
        <MaterialCommunityIcons
          name={curr === 'USD' ? 'currency-usd' : curr === 'EUR' ? 'currency-eur' : 'currency-try'}
          size={24}
          color={selected ? 'white' : '#333'}
        />
        <Text style={[
          styles.currencyText,
          selected && styles.selectedCurrencyText
        ]}>
          {curr}
        </Text>
      </Surface>
    </TouchableOpacity>
  );

  const QuickAmountButton = ({ value }) => (
    <TouchableOpacity
      style={styles.quickAmountButton}
      onPress={() => setAmount(value.toString())}
    >
      <Surface style={styles.quickAmount}>
        <Text style={styles.quickAmountText}>
          {currency} {value.toLocaleString()}
        </Text>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000046', '#1CB5E0']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Funds</Text>
          <IconButton
            icon="refresh"
            iconColor="white"
            size={24}
            onPress={loadBalances}
          />
        </View>

        <View style={styles.content}>
          <Surface style={styles.card}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>
                {currency} {balances[currency]?.toFixed(2)}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.amountInput}
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>

            <View style={styles.currencySelector}>
              <Text style={styles.selectorLabel}>Select Currency</Text>
              <View style={styles.optionsContainer}>
                {['USD', 'EUR', 'TRY'].map(curr => (
                  <CurrencyOption
                    key={curr}
                    curr={curr}
                    selected={curr === currency}
                    onSelect={setCurrency}
                  />
                ))}
              </View>
            </View>

            <View style={styles.quickAmounts}>
              <Text style={styles.quickAmountsLabel}>Quick Select</Text>
              <View style={styles.quickAmountsGrid}>
                {quickAmounts.map(value => (
                  <QuickAmountButton key={value} value={value} />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddFunds}
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Add Funds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Surface>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  balanceInfo: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  amountInput: {
    backgroundColor: 'white',
  },
  currencySelector: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  selectedCurrency: {
    backgroundColor: '#1976D2',
  },
  currencyText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedCurrencyText: {
    color: 'white',
  },
  quickAmounts: {
    marginBottom: 20,
  },
  quickAmountsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '48%',
    marginBottom: 10,
  },
  quickAmount: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddFundsScreen;
