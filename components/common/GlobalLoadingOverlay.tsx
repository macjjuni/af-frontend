import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import useAppStore from '@/store/useAppStore';

export default function GlobalLoadingOverlay() {
  // region [hooks]
  const globalLoading = useAppStore((state) => state.globalLoading);
  // endregion

  return (
    <Modal
      visible={globalLoading.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/55">
        <View className="items-center">
          <LottieView
            source={require('@/assets/lotties/ai.json')}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
          {globalLoading.message && (
            <Text className="mt-4 text-center text-base text-white px-8">
              {globalLoading.message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
