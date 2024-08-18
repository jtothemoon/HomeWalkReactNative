import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import styles from './styles/splashStyles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2초 후에 로그인 화면으로 이동
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../src/assets/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.text}>HomeWalk</Text>
      <ActivityIndicator 
        animating={true} 
        color={MD2Colors.blue500} 
        size="large" 
        style={styles.indicator}
      />
    </View>
  );
};

export default SplashScreen;
