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
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../lib/api';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      await AsyncStorage.setItem('token', res.token);
      router.replace('/home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <View className="flex-1 px-6 justify-center">
        <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-gray-400 text-base mb-8">
          Sign in to continue. We've got your back.
        </Text>

        <Text className="text-gray-300 text-sm mb-1">Email</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-4"
          placeholder="your@email.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-gray-300 text-sm mb-1">Password</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-6"
          placeholder="Enter your password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-[#E94560] py-4 rounded-xl items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/signup')}
          className="items-center"
        >
          <Text className="text-gray-400">
            Don't have an account?{' '}
            <Text className="text-[#E94560] font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}