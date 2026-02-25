import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ScreenHeaderProps {
  title: string;
  centerTitle?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export default function ScreenHeader({
  title,
  centerTitle = false,
  rightAction,
  onBack,
}: ScreenHeaderProps) {
  // region [hooks]
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  // region [Events]
  function onPressBack() {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }
  // endregion

  if (centerTitle) {
    return (
      <View
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#7c3aed" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
          {rightAction ?? <View style={{ width: 28 }} />}
        </View>
      </View>
    );
  }

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="px-4 pb-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-row items-center"
    >
      <TouchableOpacity onPress={onPressBack} className="mr-3" activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">{title}</Text>
      {rightAction}
    </View>
  );
}
