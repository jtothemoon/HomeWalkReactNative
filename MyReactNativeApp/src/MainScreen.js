import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import useStepTracker from './hooks/useStepTracker';
import styles from './styles/mainStyles';

const MainScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { steps, error } = useStepTracker(userId);

  useEffect(() => {
    const saveSteps = async () => {
      try {
        await AsyncStorage.setItem(`@steps_${userId}`, steps.toString());
      } catch (e) {
        console.error('Failed to save steps.', e);
      }
    };

    saveSteps();
  }, [steps, userId]);

  const handleLogout = async () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘도 좋은 하루 되세요. {userId} 님</Text>
      <Text style={styles.steps}>걸음수: {steps}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

export default MainScreen;
