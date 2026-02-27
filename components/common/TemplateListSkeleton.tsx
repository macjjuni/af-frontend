import React from 'react';
import { View } from 'react-native';
import Skeleton from './Skeleton';

interface TemplateListSkeletonProps {
  count?: number;
}

export default function TemplateListSkeleton({ count = 5 }: TemplateListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-5 justify-center"
          style={{
            height: 100,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 gap-1 pr-3">
              {/* 제목 */}
              <Skeleton width="70%" height={24} borderRadius={4} className="mb-1" />

              {/* 설명 */}
              <Skeleton width="90%" height={16} borderRadius={4} />
            </View>

            {/* 화살표 아이콘 영역 */}
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
        </View>
      ))}
    </>
  );
}
