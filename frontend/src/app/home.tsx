import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '../lib/api';

const moods = [
  { emoji: '😊', label: 'Good', color: '#4CAF50' },
  { emoji: '😐', label: 'Okay', color: '#FFC107' },
  { emoji: '😢', label: 'Sad', color: '#2196F3' },
  { emoji: '😠', label: 'Angry', color: '#FF5722' },
  { emoji: '😫', label: 'Over-whelmed', color: '#9C27B0' },
];

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const user = await getMe(token);
        setUserName(user.firstName || 'there');
      }
    } catch {
      // not critical
    }
  };

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    setAlertSent(false);
  };

  const handleSOS = () => {
    const distressMoods = ['Angry', 'Sad', 'Overwhelmed'];
    if (selectedMood && distressMoods.includes(selectedMood)) {
      setAlertSent(true);
      Alert.alert(
        'Help is on the way!',
        'Your heroes have been notified. Stay strong - you are not alone.'
      );
    } else {
      Alert.alert(
        'Send Alert?',
        "You can send an alert even if you're feeling okay. Your heroes will be notified.",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Alert',
            style: 'destructive',
            onPress: () => {
              setAlertSent(true);
              Alert.alert(
                'Help is on the way!',
                'Your heroes have been notified. Stay strong - you are not alone.'
              );
            },
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    setAlertSent(false);
    Alert.alert("Alert Cancelled", "You're all safe. We're here for you if you need us.");
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/signin');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <ScrollView className="flex-1 px-5 pt-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">
              Welcome back, {userName}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Your feelings are valid. You matter.
            </Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} className="p-2">
            <Text className="text-gray-400">Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-white text-lg font-semibold mb-1">
            How are you feeling today?
          </Text>
          <Text className="text-gray-400 text-sm mb-5">
            We are here to listen, not judge.
          </Text>

          <View className="flex-row justify-between">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  key={mood.label}
                  onPress={() => handleMoodSelect(mood.label)}
                  className="items-center"
                  style={{ width: 60 }}
                >
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center mb-1"
                    style={{
                      backgroundColor: isSelected ? mood.color : '#2D2D44',
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected ? mood.color : 'transparent',
                    }}
                  >
                    <Text className="text-2xl">{mood.emoji}</Text>
                  </View>
                  <Text
                    className="text-xs text-center"
                    style={{
                      color: isSelected ? '#FFFFFF' : '#9CA3AF',
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                  >
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={handleSOS}
            activeOpacity={0.8}
            className="w-48 h-48 rounded-full items-center justify-center"
            style={{
              backgroundColor: alertSent ? '#4CAF50' : '#E94560',
              shadowColor: alertSent ? '#4CAF50' : '#E94560',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Text className="text-white text-lg font-bold text-center">
              {alertSent ? 'Help is\nComing!' : 'Help\nMe'}
            </Text>
          </TouchableOpacity>
        </View>

        {alertSent ? (
          <View className="items-center mb-6">
            <Text className="text-green-400 text-lg font-bold">
              Help is on the way!
            </Text>
            <Text className="text-gray-300 text-center mt-1">
              Your heroes have been alerted. You are not alone.
            </Text>
            <TouchableOpacity
              onPress={handleCancel}
              className="mt-4 px-8 py-3 rounded-full border border-gray-500"
            >
              <Text className="text-gray-300 font-semibold">Cancel Alert</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center mb-6">
            {selectedMood && ['Angry', 'Sad', 'Overwhelmed'].includes(selectedMood) ? (
              <Text className="text-gray-300 text-center">
                We are here for you. Tap the button above to reach your heroes.
              </Text>
            ) : (
              <Text className="text-gray-400 text-center">
                Your heroes are standing by if you ever need them.
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push('/report')}
          className="bg-[#0F3460] py-4 px-6 rounded-xl flex-row items-center justify-center mb-4"
        >
          <Text className="text-white text-lg font-bold">Report Bullying</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/reports')}
          className="bg-[#2D2D44] py-4 px-6 rounded-xl flex-row items-center justify-center mb-8"
        >
          <Text className="text-white text-lg font-bold">My Reports</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}