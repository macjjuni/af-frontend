import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet from './BottomSheet';

// region [types]
export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

interface SelectPickerProps<T> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
}
// endregion

export default function SelectPicker<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: SelectPickerProps<T>) {
  // region [hooks]
  const [open, setOpen] = useState(false);
  // endregion

  // region [Privates]
  const selectedLabel = options.find((o) => o.value === value)?.label ?? String(value);
  // endregion

  // region [Events]
  function onSelect(val: T) {
    onChange(val);
    setOpen(false);
  }
  // endregion

  return (
    <>
      <View className="flex-1">
        <Text className="text-md text-gray-400 dark:text-gray-500 mb-1">{label}</Text>
        <TouchableOpacity
          onPress={() => !disabled && setOpen(true)}
          className={`flex-row items-center justify-between py-3 px-3 rounded-xl border ${
            disabled
              ? 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700'
              : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
          }`}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <Text className={`text-md font-medium ${disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}`}>
            {selectedLabel}
          </Text>
          <Text className={`text-md ${disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400'}`}>▼</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={`${label} 선택`}>
        <FlatList
          data={options}
          keyExtractor={(item) => String(item.value)}
          getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
          initialScrollIndex={Math.max(0, options.findIndex((o) => o.value === value))}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelect(item.value)}
              className={`px-5 py-3 border-b border-gray-50 dark:border-gray-700 ${item.value === value ? 'bg-purple-50 dark:bg-purple-900/30' : ''}`}
            >
              <Text className={`text-xl ${item.value === value ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-800 dark:text-gray-100'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    </>
  );
}
