import React from 'react';
import { Text } from 'react-native';

type SettingSectionTitleProps = {
  title: string;
  isFirst?: boolean;
};

export default function SettingSectionTitle({ title, isFirst = false }: SettingSectionTitleProps) {
  return (
    <Text className={`text-md font-semibold text-gray-400 dark:text-gray-500 mb-3 px-1 ${isFirst ? '' : 'mt-8'}`}>
      {title}
    </Text>
  );
}
