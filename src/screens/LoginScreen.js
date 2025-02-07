import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { TextInput, Button, Title, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      // Test için basit bir işlem
      await AsyncStorage.setItem('userToken', 'test-token');
      
      // Test için örnek bakiyeler
      const initialBalances = {
        USD: 1000,
        EUR: 850,
        TRY: 27800
      };
      await AsyncStorage.setItem('userBalances', JSON.stringify(initialBalances));
      
      navigation.replace('Home');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1', '#0277bd']}
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <Surface style={styles.logoSurface}>
            <MaterialCommunityIcons name="currency-exchange" size={64} color="#1a237e" />
          </Surface>
          <Title style={styles.title}>Currency Exchange</Title>
          <Text style={styles.subtitle}>Your Global Financial Partner</Text>
        </View>

        <View style={styles.formContainer}>
          <Surface style={styles.formSurface}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
              theme={{
                colors: { primary: '#1a237e' },
              }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              theme={{
                colors: { primary: '#1a237e' },
              }}
            />

            <LinearGradient
              colors={['#1a237e', '#0d47a1']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                labelStyle={styles.loginButtonLabel}
              >
                Login
              </Button>
            </LinearGradient>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              style={styles.registerButton}
              labelStyle={styles.registerButtonLabel}
            >
              Don't have an account? Register
            </Button>
          </Surface>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}> 2024 Currency Exchange</Text>
          <Text style={styles.footerText}>All rights reserved</Text>
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
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSurface: {
    width: 100,
    height: 100,
    borderRadius: 50,
    elevation: 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  formSurface: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 4,
    width: width - 40,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  loginButtonGradient: {
    borderRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  loginButton: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    elevation: 0,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 16,
  },
  registerButtonLabel: {
    color: '#1a237e',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});

export default LoginScreen;
