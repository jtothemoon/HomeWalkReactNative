import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from './styles/splashStyles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000); // 2초 후에 로그인 화면으로 이동
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default SplashScreen;