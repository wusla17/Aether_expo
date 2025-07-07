/// <reference types="nativewind/types" />
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

interface QuickAccessCardProps {
  title: string;
  onPress: () => void;
}

const HomeScreen = () => {
  const theme = useTheme();
  const router = useRouter();

  const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, onPress }) => (
    <TouchableOpacity
      className="mb-4 h-20 justify-center rounded-xl px-4 bg-surface"
      onPress={onPress}
    >
      <Text className="text-base text-on-surface">
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View className="px-4 pb-3 pt-12">
        <Text className="text-xl font-bold text-on-background">
          WUSLA
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Jump back in */}
        <View className="mt-4 px-4">
          <Text className="mb-3 text-sm opacity-80 text-on-surface">
            Jump back in
          </Text>
          <QuickAccessCard title="New Blog Post Series" onPress={() => router.push('/search')} />
        </View>

        {/* Private Section */}
        <View className="mt-4 px-4">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconButton icon="lock" size={20} iconColor={theme.colors.onSurface} />
              <Text className="ml-1 text-base text-on-surface">
                Private
              </Text>
            </View>
            <IconButton
              icon="plus"
              size={20}
              iconColor={theme.colors.onSurface}
              onPress={() => router.push('/note/new')}
            />
          </TouchableOpacity>
          <Text className="text-on-surface ml-14 opacity-60">
            No pages inside
          </Text>
        </View>

        {/* Teamspaces Section */}
        <View className="mt-4 px-4">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconButton icon="account-group" size={20} iconColor={theme.colors.onSurface} />
              <Text className="ml-1 text-base text-on-surface">
                Teamspaces
              </Text>
            </View>
            <IconButton icon="plus" size={20} iconColor={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-3 flex-row items-center rounded-lg p-3 bg-surface"
            onPress={() => router.push('/(tabs)/todo')}
          >
            <IconButton icon="home" size={20} iconColor="#FF6F00" />
            <Text className="text-on-surface">WUSLA HQ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
