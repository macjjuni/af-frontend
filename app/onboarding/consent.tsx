import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAppStore from '@/store/useAppStore';

interface ConsentItem {
  id: string;
  title: string;
  required: boolean;
  detailLink?: string;
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'terms',
    title: '서비스 이용약관 동의',
    required: true,
    detailLink: '/legal/terms',
  },
  {
    id: 'privacy',
    title: '개인정보 처리방침 동의',
    required: true,
    detailLink: '/legal/privacy',
  },
  {
    id: 'aiNotice',
    title: 'AI 콘텐츠 이용 안내 및 한계점 고지',
    required: true,
    detailLink: '/legal/ai-notice',
  },
  {
    id: 'age',
    title: '만 15세 이상입니다',
    required: true,
  },
];

export default function ConsentScreen() {
  // region [hooks]
  const [consents, setConsents] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    aiNotice: false,
    age: false,
  });
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  // endregion

  // region [Privates]
  const allChecked = CONSENT_ITEMS.every((item) => consents[item.id]);
  // endregion

  // region [Events]
  function onToggleConsent(id: string) {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function onToggleAll() {
    const newValue = !allChecked;
    const newConsents: Record<string, boolean> = {};
    CONSENT_ITEMS.forEach((item) => {
      newConsents[item.id] = newValue;
    });
    setConsents(newConsents);
  }

  function onPressDetail(link?: string) {
    if (link) {
      router.push(link as any);
    }
  }

  async function onPressStart() {
    if (!allChecked) return;
    await completeOnboarding();
    router.replace('/');
  }

  function onPressBack() {
    router.back();
  }
  // endregion

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View
        className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16, paddingHorizontal: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onPressBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#7c3aed" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">약관 동의</Text>
          <View style={{ width: 28 }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 16,
        }}
      >
        {/* 전체 동의 */}
        <TouchableOpacity
          onPress={onToggleAll}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border-2 border-purple-600"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              전체 동의
            </Text>
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                allChecked ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {allChecked && <Ionicons name="checkmark" size={18} color="white" />}
            </View>
          </View>
        </TouchableOpacity>

        {/* 개별 동의 항목 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-100 dark:border-gray-700">
          {CONSENT_ITEMS.map((item, index) => (
            <View key={item.id}>
              <View className="flex-row items-center justify-between py-3">
                <TouchableOpacity
                  onPress={() => onToggleConsent(item.id)}
                  className="flex-1 flex-row items-center gap-3"
                  activeOpacity={0.7}
                >
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      consents[item.id]
                        ? 'bg-purple-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {consents[item.id] && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text className="text-base text-gray-700 dark:text-gray-200">
                    {item.required && (
                      <Text className="text-purple-600 dark:text-purple-400">(필수) </Text>
                    )}
                    {item.title}
                  </Text>
                </TouchableOpacity>

                {item.detailLink && (
                  <TouchableOpacity
                    onPress={() => onPressDetail(item.detailLink)}
                    className="ml-2"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
              {index < CONSENT_ITEMS.length - 1 && (
                <View className="h-px bg-gray-100 dark:bg-gray-700" />
              )}
            </View>
          ))}
        </View>

        {/* 안내 문구 */}
        <View className="px-2 py-4">
          <Text className="text-sm text-gray-500 dark:text-gray-400 leading-5">
            • 서비스 이용을 위해 필수 항목에 동의해 주세요.{'\n'}
            • 입력하신 정보는 운세 분석에만 사용되며 안전하게 보호됩니다.{'\n'}
            • 자세한 내용은 각 항목의 상세 내용을 확인해 주세요.
          </Text>
        </View>
      </ScrollView>

      {/* 시작하기 버튼 - 하단 고정 */}
      <View
        className="bg-gray-50 dark:bg-gray-900"
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 16,
          paddingTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={onPressStart}
          className={`flex-row justify-center items-center py-4 rounded-2xl ${
            allChecked
              ? 'bg-purple-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
          activeOpacity={allChecked ? 0.85 : 1}
          disabled={!allChecked}
        >
          <Text
            className={`text-lg font-bold ${
              allChecked
                ? 'text-white'
                : 'text-gray-500 dark:text-gray-500'
            }`}
          >
            동의하고 시작하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
