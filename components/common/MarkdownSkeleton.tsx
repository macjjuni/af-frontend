import React from 'react';
import { View, Dimensions } from 'react-native';
import Skeleton from './Skeleton';

export default function MarkdownSkeleton() {
  // region [hooks]
  const screenHeight = Dimensions.get('window').height;
  // 타이틀(~60) + 상단패딩(~32) + 카드패딩(~40) + 하단버튼영역(~90) + 여유(~100) = 약 320
  const contentHeight = screenHeight - 320;
  // endregion

  return (
    <View style={{ height: contentHeight, justifyContent: 'space-between', paddingVertical: 8 }}>
      {/* 제목 */}
      <Skeleton width="60%" height={24} borderRadius={4} />

      {/* 단락 1 */}
      <View className="gap-2">
        <Skeleton width="100%" height={18} borderRadius={4} />
        <Skeleton width="95%" height={18} borderRadius={4} />
        <Skeleton width="88%" height={18} borderRadius={4} />
      </View>

      {/* 소제목 */}
      <Skeleton width="50%" height={22} borderRadius={4} />

      {/* 단락 2 */}
      <View className="gap-2">
        <Skeleton width="98%" height={18} borderRadius={4} />
        <Skeleton width="92%" height={18} borderRadius={4} />
        <Skeleton width="96%" height={18} borderRadius={4} />
        <Skeleton width="85%" height={18} borderRadius={4} />
      </View>

      {/* 소제목 */}
      <Skeleton width="55%" height={22} borderRadius={4} />

      {/* 단락 3 */}
      <View className="gap-2">
        <Skeleton width="100%" height={18} borderRadius={4} />
        <Skeleton width="90%" height={18} borderRadius={4} />
        <Skeleton width="94%" height={18} borderRadius={4} />
      </View>

      {/* 소제목 */}
      <Skeleton width="48%" height={22} borderRadius={4} />

      {/* 단락 4 */}
      <View className="gap-2">
        <Skeleton width="97%" height={18} borderRadius={4} />
        <Skeleton width="91%" height={18} borderRadius={4} />
        <Skeleton width="88%" height={18} borderRadius={4} />
      </View>
    </View>
  );
}
