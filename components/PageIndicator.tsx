import { View } from 'react-native';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export default function PageIndicator({ currentPage, totalPages }: PageIndicatorProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentPage
              ? 'bg-purple-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        />
      ))}
    </View>
  );
}
