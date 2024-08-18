import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SensorTypes, setUpdateIntervalForType, accelerometer } from 'react-native-sensors';
import { map, filter } from 'rxjs/operators';

const useStepTracker = () => {
  const [steps, setSteps] = useState(0);
  const [accData, setAccData] = useState([]);
  const [lastPeakTime, setLastPeakTime] = useState(0);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const savedUserId = await AsyncStorage.getItem('@userId');
        setUserId(JSON.parse(savedUserId));
      } catch (e) {
        console.error('Failed to load userId.', e);
      }
    };

    const loadSteps = async () => {
      try {
        const savedSteps = await AsyncStorage.getItem(`@steps_${userId}`);
        if (savedSteps !== null) {
          setSteps(parseInt(savedSteps, 10));
        }
      } catch (e) {
        console.error('Failed to load steps.', e);
      }
    };

    loadUserId();
    loadSteps();

    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: 'Activity Recognition Permission',
            message: 'We need access to your activity data to count your steps.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Activity recognition permission denied');
        }
      }
    };

    requestPermission();
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    const subscription = accelerometer
      .pipe(
        map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z) - 9.81),
        filter((magnitude) => magnitude > 0.1)
      )
      .subscribe((magnitude) => {
        setAccData((prevData) => {
          const newData = [...prevData, magnitude];
          if (newData.length > 50) newData.shift();
          return newData;
        });
      });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (accData.length < 50) return;
    const peakThreshold = 1.0;
    const peakDetectionInterval = 300;
    const currentTime = Date.now();
    const isPeak = accData[24] > peakThreshold &&
                   accData[24] > accData[23] &&
                   accData[24] > accData[25] &&
                   (currentTime - lastPeakTime > peakDetectionInterval);
    if (isPeak) {
      setSteps((prevSteps) => {
        const newSteps = prevSteps + 1;
        sendStepToServer(userId, newSteps);
        return newSteps;
      });
      setLastPeakTime(currentTime);
    }
  }, [accData, userId]);

  const sendStepToServer = async (userId, steps) => {
    try {
      const timestamp = Date.now();
      console.log('Sending steps data:', { userId, steps, timestamp });
      const response = await fetch('https://c703-218-239-146-55.ngrok-free.app/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, steps, timestamp }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      console.log('Server response:', data);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.log('Error sending steps data:', error);
      setError('Failed to send steps data to server.'); // Set error message
    }
  };

  return { steps, error };
};

export default useStepTracker;
