import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SettingCardItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
  iconBgClassName?: string;
  iconColor?: { light: string; dark: string };
  labelClassName?: string;
};

type SettingCardProps = {
  items: SettingCardItem[];
};

export default function SettingCard({ items }: SettingCardProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      className="rounded-2xl overflow-hidden text-lg"
      style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {items.map((item, index) => {
        const {
          icon,
          label,
          onPress,
          showArrow = true,
          iconBgClassName = 'bg-purple-100 dark:bg-purple-900',
          iconColor = { light: '#7c3aed', dark: '#c084fc' },
          labelClassName = 'text-gray-800 dark:text-gray-100',
        } = item;

        return (
          <TouchableOpacity
            key={label}
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row items-center px-4 py-3.5 ${
              index < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
            }`}
          >
            <View className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${iconBgClassName}`}>
              <Ionicons
                name={icon}
                size={20}
                color={isDark ? iconColor.dark : iconColor.light}
              />
            </View>
            <Text className={`flex-1 text-lg font-medium ${labelClassName}`}>
              {label}
            </Text>
            {showArrow && (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isDark ? '#4b5563' : '#d1d5db'}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type { SettingCardItem };
