import { View } from 'react-native';
import { useMemo } from 'react';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export default function PageIndicator({ currentPage, totalPages }: PageIndicatorProps) {
  const indicators = useMemo(
    () => Array.from({ length: totalPages }),
    [totalPages]
  );

  return (
    <View className="flex-row items-center justify-center gap-2">
      {indicators.map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            index === currentPage
              ? 'bg-purple-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      ))}
    </View>
  );
}
