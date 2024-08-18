import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme as PaperTheme } from 'react-native-paper';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createStackNavigator();

// React Native Paper 테마 설정
const theme = {
  ...PaperTheme,
  colors: {
    ...PaperTheme.colors,
    primary: '#546E7A', // 청회색
    background: '#ECEFF1', // 매우 연한 청회색
    text: '#37474F', // 진한 청회색
  },
  fonts: {
    regular: {
      fontFamily: 'GoormSansRegular',
    },
    medium: {
      fontFamily: 'GoormSansMedium',
    },
    bold: {
      fontFamily: 'GoormSansBold',
    },
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
