import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddFundsScreen from './src/screens/AddFundsScreen';
import ExchangeScreen from './src/screens/ExchangeScreen';
import LiveTradesScreen from './src/screens/LiveTradesScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000046',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 20,
              letterSpacing: 0.5,
            },
            headerRight: () => (
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontFamily: 'System',
                fontWeight: '300',
                marginRight: 15,
                letterSpacing: 1,
              }}>
                Dorukhan Ozgur
              </Text>
            ),
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Dashboard'
            }}
          />
          <Stack.Screen 
            name="AddFunds" 
            component={AddFundsScreen}
            options={{
              title: 'Add Funds'
            }}
          />
          <Stack.Screen 
            name="Exchange" 
            component={ExchangeScreen}
            options={{
              title: 'Exchange'
            }}
          />
          <Stack.Screen 
            name="LiveTrades" 
            component={LiveTradesScreen}
            options={{
              title: 'Live Trades'
            }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen}
            options={{
              title: 'History'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
