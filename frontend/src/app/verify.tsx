import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyEmail } from '../lib/api';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmail(email!, code);
      await AsyncStorage.setItem('token', res.token);
      router.replace('/home');
    } catch (err: any) {
      Alert.alert('Verification Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <View className="flex-1 px-6 justify-center">
        <Text className="text-white text-3xl font-bold mb-2">Verify Your Email</Text>
        <Text className="text-gray-400 text-base mb-8">
          We sent a verification code to {email}. Check your inbox.
        </Text>

        <Text className="text-gray-300 text-sm mb-1">Verification Code</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-6 text-center text-2xl tracking-widest"
          placeholder="000000"
          placeholderTextColor="#666"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className="bg-[#E94560] py-4 rounded-xl items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/signin')}
          className="items-center"
        >
          <Text className="text-gray-400">Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}