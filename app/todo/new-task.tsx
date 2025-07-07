import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addTodo } from '../../utils/database';

export default function NewTaskScreen() {
  const [task, setTask] = useState<string>('');
  const router = useRouter();

  const handleCreateTask = async () => {
    if (task.trim() === '') return;
    await addTodo(task);
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F8F9FF] p-5">
      {/* Close Button */}
      <TouchableOpacity onPress={() => router.back()} className="self-end">
        <Ionicons name="close" size={28} color="#555" />
      </TouchableOpacity>

      {/* Input Field */}
      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Enter new task"
        placeholderTextColor="#aaa"
        className="my-7 border-b border-gray-300 px-2.5 text-xl text-gray-800"
      />

      {/* Date & Priority */}
      <View className="mb-7 flex-row gap-4">
        <TouchableOpacity className="flex-row items-center rounded-2xl bg-white p-2.5">
          <Ionicons name="calendar-outline" size={18} color="#555" />
          <Text className="ml-1.5 text-gray-800">Today</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center rounded-2xl bg-white p-2.5">
          <Ionicons name="radio-button-on" size={18} color="#2962FF" />
        </TouchableOpacity>
      </View>

      {/* Icons Row */}
      <View className="mb-7 flex-row gap-5">
        <Ionicons name="document-outline" size={24} color="#777" />
        <Ionicons name="flag-outline" size={24} color="#777" />
        <Ionicons name="repeat-outline" size={24} color="#777" />
      </View>

      {/* Create Button */}
      <TouchableOpacity
        disabled={task.trim() === ''}
        onPress={handleCreateTask}
        className={`absolute bottom-7 self-center rounded-3xl px-7 py-3 flex-row items-center ${
          task.trim() === '' ? 'bg-gray-300' : 'bg-[#2962FF]'
        }`}
      >
        <Text className="mr-2.5 font-semibold text-white">New task</Text>
        <Ionicons name="chevron-up" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}