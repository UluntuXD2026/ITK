import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding_v2');
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
        return;
      }
      router.replace('/home');
    } catch {
      router.replace('/home');
    }
  };

  return (
    <View className="flex-1 bg-[#1A1A2E] items-center justify-center">
      <ActivityIndicator size="large" color="#E94560" />
    </View>
  );
}