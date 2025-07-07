/// <reference types="nativewind/types" />
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { FunnelIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';

export default function SearchScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView className="flex-1 px-4 pt-4 bg-black">
      {/* Search bar with filter */}
      <View className="flex-row items-center bg-neutral-900 rounded-full px-4 py-2 mt-2">
        <MagnifyingGlassIcon color="#a1a1aa" size={20} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#a1a1aa"
          className="flex-1 ml-3 text-white"
        />
        <TouchableOpacity className="ml-2">
          <FunnelIcon color="#a1a1aa" size={20} />
        </TouchableOpacity>
      </View>

      {/* Optional: Add filtered search results or categories here */}
    </ThemedView>
  );
}
