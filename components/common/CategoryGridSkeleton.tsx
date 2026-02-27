import React from 'react';
import { View } from 'react-native';
import Skeleton from './Skeleton';

interface CategoryGridSkeletonProps {
  count?: number;
  cardWidth: number;
}

export default function CategoryGridSkeleton({ count = 4, cardWidth }: CategoryGridSkeletonProps) {
  return (
    <View className="flex-row flex-wrap gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 items-center justify-center py-7"
          style={{
            width: cardWidth,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {/* 아이콘 영역 */}
          <Skeleton width={56} height={56} borderRadius={12} className="mb-3" />

          {/* 텍스트 영역 */}
          <Skeleton width={80} height={16} borderRadius={4} />
        </View>
      ))}
    </View>
  );
}
