import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export default function TabHeader({ title, rightAction }: TabHeaderProps) {
  // region [hooks]
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // endregion

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="px-5 pb-4 bg-gray-50 dark:bg-gray-900 flex-row items-center justify-between"
    >
      <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
        {title}
      </Text>
      {rightAction}
    </View>
  );
}
