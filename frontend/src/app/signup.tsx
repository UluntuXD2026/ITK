import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { registerUser } from '../lib/api';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const roles = ['student', 'teacher', 'counselor', 'parent'];

  const handleRegister = async () => {
    if (!firstName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        school,
        password,
        role,
      });
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-white text-3xl font-bold mb-2">Join ITK</Text>
        <Text className="text-gray-400 text-base mb-6">
          You're not alone. We're in this together.
        </Text>

        <Text className="text-gray-300 text-sm mb-1">First Name *</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-3"
          placeholder="Your first name"
          placeholderTextColor="#666"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text className="text-gray-300 text-sm mb-1">Last Name</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-3"
          placeholder="Your last name"
          placeholderTextColor="#666"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text className="text-gray-300 text-sm mb-1">Email *</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-3"
          placeholder="your@email.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-gray-300 text-sm mb-1">Phone Number</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-3"
          placeholder="+27 12 345 6789"
          placeholderTextColor="#666"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text className="text-gray-300 text-sm mb-1">School / Organization</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-3"
          placeholder="Name of your school"
          placeholderTextColor="#666"
          value={school}
          onChangeText={setSchool}
        />

        <Text className="text-gray-300 text-sm mb-1">I am a...</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {roles.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              className={`px-4 py-2 rounded-full ${
                role === r ? 'bg-[#E94560]' : 'bg-[#2D2D44]'
              }`}
            >
              <Text className="text-white capitalize">{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-300 text-sm mb-1">Password *</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-6"
          placeholder="Create a password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-[#E94560] py-4 rounded-xl items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/signin')}
          className="items-center mb-8"
        >
          <Text className="text-gray-400">
            Already have an account?{' '}
            <Text className="text-[#E94560] font-bold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}