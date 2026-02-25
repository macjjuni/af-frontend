import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { OnboardingPage } from '@/constants/onboarding';

interface OnboardingScreenProps {
  page: OnboardingPage;
}

export default function OnboardingScreen({ page }: OnboardingScreenProps) {
  // region [hooks]
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  return (
    <View className="flex-1 items-center justify-center px-8">
      {page.lottieSource ? (
        <LottieView
          source={page.lottieSource}
          autoPlay
          loop
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
      ) : (
        <Ionicons
          name={page.iconName!}
          size={120}
          color={page.iconColor}
          style={{ marginTop: 48, marginBottom: 48 }}
        />
      )}
      <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
        {page.title}
      </Text>
      <Text className="text-lg text-gray-600 dark:text-gray-400 text-center leading-7">
        {page.description}
      </Text>
    </View>
  );
}
