import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Help is one tap away',
    description: 'Quickly alert trusted Heroes when you need support',
    image: require('../../assets/images/Onboarding_1.png'), // Update path if your images folder is named differently
    showSkip: true,
  },
  {
    id: '2',
    title: 'Your Heroes are notified',
    description: 'SMS, email and in-app alerts are sent instantly to your support network',
    image: require('../../assets/images/Onboarding_2.png'),
    showSkip: true,
  },
  {
    id: '3',
    title: 'Someone is looking out for you',
    description: 'Stay connected to people who care about your safety',
    image: require('../../assets/images/Onboarding_3.png'),
    showSkip: false,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const completeOnboarding = async () => {
    try {
      // Save onboarding flag so user doesn't see it next launch
      await AsyncStorage.setItem('hasSeenOnboarding_v2', 'true');
      router.replace('/signin'); 
    } catch {
      router.replace('/signin');
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }} className="flex-1 justify-end items-center relative pb-12">
            
            {/* Background Illustration Artwork */}
            <Image 
              source={item.image} 
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
            
            {/* Context/Typography Block */}
            <View className="w-full px-8 mb-8 mt-auto">
              <Text className="text-white text-3xl font-bold mb-3 tracking-wide text-left">
                {item.title}
              </Text>
              <Text className="text-gray-200 text-base font-normal leading-6 text-left">
                {item.description}
              </Text>
            </View>

            {/* Custom Circular Indicators Layout */}
            <View className="flex-row justify-center items-center mb-8">
              {SLIDES.map((_, index) => (
                <View
                  key={index}
                  className={`h-2.5 w-2.5 rounded-full mx-1 ${
                    index === currentIndex ? 'bg-white' : 'border border-white bg-transparent'
                  }`}
                />
              ))}
            </View>

            {/* CTA Elements */}
            <View className="w-full px-6">
              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.85}
                className="bg-white w-full py-4 rounded-xl items-center mb-3"
              >
                {/* Purple text matching branding colors */}
                <Text className="text-[#3A1D4E] text-base font-bold">
                  Next
                </Text>
              </TouchableOpacity>

              {item.showSkip ? (
                <TouchableOpacity onPress={completeOnboarding} className="w-full py-2 items-center">
                  <Text className="text-gray-300 text-sm font-semibold capitalize tracking-wider">
                    Skip
                  </Text>
                </TouchableOpacity>
              ) : (
                // Hidden spacer to keep matching heights across slides
                <View className="h-9" />
              )}
            </View>

          </View>
        )}
      />
    </SafeAreaView>
  );
}