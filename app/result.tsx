import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { calculateSaju, createChart, calculateNatal, type SajuResult } from '@orrery/core'
import { useSaju, useFortune, useTemplates, useRewardedAd } from '@/hooks'
import type { PromptTemplate } from '@/hooks'
import useAppStore from '@/store/useAppStore'
import {
  BottomSheet, PillarTable, RelationList, SinsalList, DaewoonList, SewoonList,
} from '@/components'
import { sajuToText, ziweiToText, natalToText } from '@/utils/textExport'


export default function ResultScreen() {

  // region [hooks]
  const { birthForm, deviceId, setFortuneResult } = useAppStore()
  const { saju, error: sajuError } = useSaju(birthForm)
  const fortune = useFortune()
  const { data: templatesData, isLoading: templatesLoading } = useTemplates()
  const { showAd } = useRewardedAd()
  const [isBuilding, setIsBuilding] = useState(false)
  const [devChartText, setDevChartText] = useState<string | null>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()
  // endregion


  // region [Privates]
  function formatBirthDate(): string {
    const { year, month, day, hour, minute, unknownTime, cityName, gender } = birthForm
    const base = `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
    const time = unknownTime ? '시간 미상' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    return `${base} ${time} / ${gender === 'M' ? '남성' : '여성'} / ${cityName}`
  }

  async function buildChartData(): Promise<string> {
    const sajuData = calculateSaju(birthForm)
    const parts = [sajuToText(sajuData)]
    if (!birthForm.unknownTime) {
      const chart = createChart(
        birthForm.year, birthForm.month, birthForm.day,
        birthForm.hour, birthForm.minute, birthForm.gender === 'M',
      )
      parts.push(ziweiToText(chart))
    }
    const natal = await calculateNatal(birthForm)
    parts.push(natalToText(natal))
    return parts.join('\n\n')
  }

  // endregion

  // region [Events]
  function onPressBack() {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  function onPressFortune(templateId: number) {
    if (!saju) return
    showAd(async () => {
      setIsBuilding(true)
      try {
        const chartData = await buildChartData()
        fortune.mutate({ chartData, deviceID: deviceId, promptTemplateId: templateId })
      } finally {
        setIsBuilding(false)
      }
    })
  }

  async function onPressDebugChart() {
    try {
      const text = await buildChartData()
      setDevChartText(text)
    } catch (e) {
      setDevChartText(`[ERROR]\n${e instanceof Error ? e.stack ?? e.message : String(e)}`)
    }
  }
  // endregion

  // region [Life Cycles]
  useEffect(() => {
    if (sajuError) console.warn('[Result] 사주 오류:', sajuError)
  }, [sajuError])

  useEffect(() => {
    if (fortune.isSuccess) {
      setFortuneResult(fortune.data)
      router.push('/fortune')
    }
  }, [fortune.isSuccess])

  useFocusEffect(useCallback(() => {
    fortune.reset()
  }, []))
  // endregion

  const isPending = isBuilding || fortune.isPending

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950" style={{ paddingTop: insets.top }}>
      {sajuError ? (
        <ErrorView message={sajuError}/>
      ) : !saju ? (
        <LoadingView/>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32, gap: 12 }}
        >
          <SajuContent
            saju={saju}
            unknownTime={birthForm.unknownTime}
            fortune={fortune}
            templates={templatesData?.templates}
            templatesLoading={templatesLoading}
            onPressFortune={onPressFortune}
            onPressBack={onPressBack}
            onPressDebugChart={onPressDebugChart}
            formatBirthDate={formatBirthDate}
          />
        </ScrollView>
      )}

      {/* 전역 로딩 오버레이 */}
      <Modal visible={isPending} transparent animationType="fade">
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center" style={{ minWidth: 200 }}>
            <ActivityIndicator size="large" color="#7c3aed"/>
            <Text className="text-gray-800 dark:text-gray-100 text-lg font-medium mt-4">운세 분석 중...</Text>
            <Text className="text-gray-400 text-md mt-1">잠시만 기다려주세요</Text>
          </View>
        </View>
      </Modal>

      {/* DEV: Chart Data 미리보기 */}
      {__DEV__ && (
        <BottomSheet
          visible={devChartText !== null}
          onClose={() => setDevChartText(null)}
          title="[DEV] Chart Data"
          maxHeight="80%"
        >
          <ScrollView className="p-4">
            <Text selectable style={{ fontFamily: 'monospace', fontSize: 11, lineHeight: 17, color: '#374151' }}>
              {devChartText}
            </Text>
          </ScrollView>
        </BottomSheet>
      )}
    </View>
  )
}

// region [Sub Component - SajuContent]
interface SajuContentProps {
  saju: SajuResult;
  unknownTime: boolean;
  fortune: ReturnType<typeof useFortune>;
  templates: PromptTemplate[] | undefined;
  templatesLoading: boolean;
  onPressFortune: (templateId: number) => void;
  onPressBack: () => void;
  onPressDebugChart: () => void;
  formatBirthDate: () => string;
}

function SajuContent({
                       saju,
                       unknownTime,
                       fortune,
                       templates,
                       templatesLoading,
                       onPressFortune,
                       onPressBack,
                       onPressDebugChart,
                       formatBirthDate,
                     }: SajuContentProps) {
  const ganzis = saju.pillars.map((p) => p.pillar.ganzi)

  return (
    <>
      <View
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-row justify-between">
        <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200">기본정보</Text>
        <Text className="text-lg text-gray-800 dark:text-gray-100" numberOfLines={1}>
          {formatBirthDate()}
        </Text>
      </View>

      {/* 사주팔자 */}
      <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">사주팔자</Text>
        <PillarTable pillars={saju.pillars} unknownTime={unknownTime}/>
      </View>

      {/* 대운 */}
      <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <DaewoonList daewoon={saju.daewoon} unknownTime={unknownTime}/>
      </View>

      {/* 세운 */}
      <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <SewoonList
          birthYear={saju.input.year}
          daewoon={saju.daewoon}
          dayStem={saju.pillars[1].pillar.stem}
          yearBranch={saju.pillars[3].pillar.branch}
        />
      </View>

      {/* 팔자 관계 */}
      {(saju.relations.pairs.size > 0 ||
        saju.relations.triple.length > 0 ||
        saju.relations.directional.length > 0) && (
        <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <RelationList relations={saju.relations} pillars={ganzis}/>
        </View>
      )}

      {/* 신살 */}
      {(saju.specialSals.yangin.length > 0 || saju.specialSals.baekho || saju.specialSals.goegang) && (
        <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <SinsalList sals={saju.specialSals}/>
        </View>
      )}

      {/* AI 운세 분석 버튼 */}

      {fortune.isError ? (
        <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <Text className="text-red-600 dark:text-red-400 text-sm">
            {fortune.error instanceof Error ? fortune.error.message : '오류가 발생했습니다.'}
          </Text>
        </View>
      ) : (
        <View>
          <TemplateButtons
            templates={templates}
            isLoading={templatesLoading}
            onPress={onPressFortune}
          />
        </View>
      )}

      {__DEV__ && (
        <TouchableOpacity
          onPress={onPressDebugChart}
          className="justify-center items-center rounded-xl py-2.5 border border-dashed border-orange-400"
          activeOpacity={0.7}
        >
          <Text className="text-orange-500 font-medium text-sm">[DEV] Chart Data 확인</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onPressBack}
        className="justify-center items-center rounded-xl py-3 bg-gray-200 dark:bg-gray-600"
        activeOpacity={0.7}
      >
        <Text className="text-xl font-semibold text-gray-700 dark:text-gray-200">뒤로가기</Text>
      </TouchableOpacity>
    </>
  )
}

// endregion

// region [Sub Component - TemplateButtons]
interface TemplateButtonsProps {
  templates: PromptTemplate[] | undefined;
  isLoading: boolean;
  onPress: (templateId: number) => void;
}

function TemplateButtons({ templates, isLoading, onPress }: TemplateButtonsProps) {
  if (isLoading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator color="#7c3aed"/>
      </View>
    )
  }

  if (!templates || templates.length === 0) return null

  return (
    <View className="gap-2">
      {templates.map((t) => (
        <TouchableOpacity
          key={t.promptTemplateId}
          onPress={() => onPress(t.promptTemplateId)}
          className="bg-purple-600 border-purple-600 py-3 rounded-xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-md">{t.buttonText}</Text>
          <Text className="text-gray-200 text-sm">하루 5회 제한</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// endregion

// region [Sub Components - 공통]
function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#6b7280"/>
    </View>
  )
}

function ErrorView({ message }: { message: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-red-500 text-sm text-center">{message}</Text>
    </View>
  )
}

// endregion
