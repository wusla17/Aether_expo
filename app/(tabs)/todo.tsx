/// <reference types="nativewind/types" />
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const tasks = [
  {
    id: '1',
    title: 'Finish user onboarding',
    date: 'Tomorrow',
    comments: 1,
    attachments: 0,
    tag: null,
    done: false,
  },
  {
    id: '2',
    title: 'Solve the Dabble prioritisation issue',
    date: 'Jan 8, 2022',
    comments: 2,
    attachments: 1,
    tag: { name: 'LaunchPad', color: '#6c5ce7' },
    done: false,
  },
  {
    id: '3',
    title: 'Hold to reorder on mobile',
    date: 'Jan 10, 2022',
    comments: 0,
    attachments: 0,
    tag: { name: 'Dabble', color: '#e74c3c' },
    done: false,
  },
  {
    id: '4',
    title: 'Update onboarding workflow templates',
    date: null,
    comments: 0,
    attachments: 0,
    tag: null,
    done: true,
  },
  {
    id: '5',
    title: 'Connect time tracking with tasks',
    date: null,
    comments: 0,
    attachments: 0,
    tag: null,
    done: true,
  },
];

type Task = (typeof tasks)[0];

const TaskItem = ({ item }: { item: Task }) => {
  const theme = useTheme();
  return (
    <View
      className="mb-3 rounded-xl border border-outline bg-surface p-4"
    >
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-3">
          {item.done ? (
            <View
              className="h-6 w-6 items-center justify-center rounded-md bg-primary"
            >
              <MaterialIcons name="check" size={16} color={theme.colors.surface} />
            </View>
          ) : (
            <View
              className="h-6 w-6 rounded-md border-2 border-outline"
            />
          )}
        </TouchableOpacity>
        <Text className="text-base font-medium text-on-surface">
          {item.title}
        </Text>
      </View>
      <View className="ml-9 mt-3 flex-row flex-wrap items-center gap-4">
        {item.date && (
          <View className="flex-row items-center gap-1.5">
            <Feather name="calendar" size={14} color={theme.colors.onSurfaceVariant} />
            <Text className="text-sm text-on-surface-variant">
              {item.date}
            </Text>
          </View>
        )}
        {item.comments > 0 && (
          <View className="flex-row items-center gap-1.5">
            <Feather name="message-square" size={14} color={theme.colors.onSurfaceVariant} />
            <Text className="text-sm text-on-surface-variant">
              {item.comments}
            </Text>
          </View>
        )}
        {item.attachments > 0 && (
          <View className="flex-row items-center gap-1.5">
            <Feather name="paperclip" size={14} color={theme.colors.onSurfaceVariant} />
            <Text className="text-sm text-on-surface-variant">
              {item.attachments}
            </Text>
          </View>
        )}
        {item.tag && (
          <View
            className="flex-row items-center rounded-md px-2 py-1"
            style={{ backgroundColor: `${item.tag.color}20` }}
          >
            <View
              className="mr-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: item.tag.color }}
            />
            <Text className="text-xs font-semibold" style={{ color: item.tag.color }}>
              {item.tag.name}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default function TodoScreen() {
  const theme = useTheme();

  return (
    <View
      className="flex-1 px-5 pt-12"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Text className="mb-6 text-3xl font-bold text-on-background">
        To-Do
      </Text>

      <View className="mb-6 flex-row gap-3">
        <Link href="/todo/new-task" asChild>
          <TouchableOpacity
            className="flex-row items-center gap-2 rounded-lg bg-primary px-4 py-2.5"
          >
            <MaterialIcons name="add" size={18} color={theme.colors.onPrimary} />
            <Text className="text-sm font-semibold text-on-primary">
              New Task
            </Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity
          className="flex-row items-center gap-2 rounded-lg border border-outline bg-surface px-4 py-2.5"
        >
          <Feather name="filter" size={16} color={theme.colors.onSurface} />
          <Text className="text-sm font-semibold text-on-surface">
            Filters
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem item={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
