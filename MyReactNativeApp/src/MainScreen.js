import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      <Text style={styles.title}>Welcome {userId}</Text>
      <Text style={styles.steps}>Steps: {steps}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default MainScreen;
