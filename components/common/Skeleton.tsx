import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className = '',
}: SkeletonProps) {
  // region [hooks]
  const opacity = useRef(new Animated.Value(0.5)).current;
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ])
    ).start();
  }, []);
  // endregion

  return (
    <Animated.View
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        opacity,
      }}
    />
  );
}
