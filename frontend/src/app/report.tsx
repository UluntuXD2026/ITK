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
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitReport } from '../lib/api';

const reportTypes = ['physical', 'verbal', 'cyber', 'social', 'other'];

export default function ReportScreen() {
  const [type, setType] = useState('');
  const [bullyName, setBullyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!type || !description) {
      Alert.alert('Error', 'Please select a type and provide a description.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please sign in first.');
        router.push('/signin');
        return;
      }

      await submitReport(token, {
        type,
        bullyName: bullyName || undefined,
        description,
        location: location || undefined,
        isAnonymous,
      });

      Alert.alert('Report Submitted', 'Thank you for speaking up. We take every report seriously.', [
        { text: 'OK', onPress: () => router.push('/home') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <ScrollView className="flex-1 px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-[#E94560]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-2">Report Bullying</Text>
        <Text className="text-gray-400 text-base mb-6">
          Your voice matters. We believe you.
        </Text>

        <Text className="text-gray-300 text-sm mb-1">Type of Bullying *</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {reportTypes.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className={`px-4 py-2 rounded-full ${
                type === t ? 'bg-[#E94560]' : 'bg-[#2D2D44]'
              }`}
            >
              <Text className="text-white capitalize">{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-300 text-sm mb-1">Name of the bully (optional)</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-4"
          placeholder="Who is doing this?"
          placeholderTextColor="#666"
          value={bullyName}
          onChangeText={setBullyName}
        />

        <Text className="text-gray-300 text-sm mb-1">Description *</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-4 min-h-[100px]"
          placeholder="Tell us what happened..."
          placeholderTextColor="#666"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text className="text-gray-300 text-sm mb-1">Where did it happen? (optional)</Text>
        <TextInput
          className="bg-[#2D2D44] text-white px-4 py-3 rounded-xl mb-4"
          placeholder="Location / school area"
          placeholderTextColor="#666"
          value={location}
          onChangeText={setLocation}
        />

        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-gray-300 text-sm flex-1">
            Report anonymously (your name won't be visible)
          </Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#2D2D44', true: '#E94560' }}
            thumbColor={isAnonymous ? '#fff' : '#666'}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="bg-[#E94560] py-4 rounded-xl items-center mb-8"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Submit Report</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}