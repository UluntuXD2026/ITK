import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReports, Report } from '../lib/api';

const statusColors: Record<string, string> = {
  submitted: '#FFC107',
  reviewed: '#2196F3',
  resolved: '#4CAF50',
};

export default function MyReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }
      const data = await getReports(token);
      setReports(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <View className="flex-1 px-6 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-[#E94560]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-2xl font-bold mb-6">My Reports</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#E94560" />
        ) : reports.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-gray-400 text-lg mb-2">No reports yet</Text>
            <Text className="text-gray-500 text-center">
              If you're going through something,{'\n'}you don't have to go through it alone.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/report')}
              className="bg-[#E94560] px-8 py-3 rounded-full mt-4"
            >
              <Text className="text-white font-bold">Report Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView>
            {reports.map((report) => (
              <View
                key={report._id}
                className="bg-[#2D2D44] p-4 rounded-xl mb-3"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white font-bold capitalize">
                    {report.type} bullying
                  </Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusColors[report.status] + '33' }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: statusColors[report.status] }}
                    >
                      {report.status}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-300 text-sm mb-1" numberOfLines={2}>
                  {report.description}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {new Date(report.createdAt).toLocaleDateString()}
                  {report.isAnonymous ? ' • Anonymous' : ''}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}