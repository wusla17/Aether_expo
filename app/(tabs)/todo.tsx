import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { useState } from 'react';

const initialTasks = [
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

type Task = (typeof initialTasks)[0];

import { Appbar, Button, Card, Checkbox, Chip, Text, useTheme } from 'react-native-paper';

import { moveToTrash } from '@/utils/database';

const TaskItem = ({ item, onDelete }: { item: Task, onDelete: (id: string) => void }) => {
	const theme = useTheme();
	return (
		<Card style={styles.taskCard}>
			<Card.Content>
				<View style={styles.taskHeader}>
					<Checkbox status={item.done ? 'checked' : 'unchecked'} />
					<Text style={styles.taskTitle}>{item.title}</Text>
					<View style={{ flex: 1 }} />
					<Button onPress={() => onDelete(item.id)}>Delete</Button>
				</View>
				<View style={styles.taskDetails}>
					{item.date && (
						<View style={styles.detailItem}>
							<Feather
								name="calendar"
								size={14}
								color={theme.colors.onSurfaceVariant}
							/>
							<Text style={styles.detailText}>{item.date}</Text>
						</View>
					)}
					{item.comments > 0 && (
						<View style={styles.detailItem}>
							<Feather
								name="message-square"
								size={14}
								color={theme.colors.onSurfaceVariant}
							/>
							<Text style={styles.detailText}>{item.comments}</Text>
						</View>
					)}
					{item.attachments > 0 && (
						<View style={styles.detailItem}>
							<Feather
								name="paperclip"
								size={14}
								color={theme.colors.onSurfaceVariant}
							/>
							<Text style={styles.detailText}>{item.attachments}</Text>
						</View>
					)}
					{item.tag && (
						<Chip
							icon={() => (
								<View
									style={[
										styles.tagIndicator,
										{ backgroundColor: item.tag.color },
									]}
								/>
							)}
							style={{ backgroundColor: `${item.tag.color}20` }}
						>
							{item.tag.name}
						</Chip>
					)}
				</View>
			</Card.Content>
		</Card>
	);
};

export default function TodoScreen() {
	const theme = useTheme();
	const [tasks, setTasks] = useState<Task[]>(initialTasks);

	const handleDelete = (id: string) => {
		moveToTrash(id, 'todo');
		setTasks(tasks.filter((task: Task) => task.id !== id));
	};

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.background },
			]}
		>
			<Appbar.Header>
				<Appbar.Content title="To-Do" />
			</Appbar.Header>

			<View style={styles.actionsContainer}>
				<Link href="/todo/new-task" asChild>
					<Button icon="plus" mode="contained">
						New Task
					</Button>
				</Link>
				<Button icon="filter-variant" mode="outlined">
					Filters
				</Button>
			</View>

			<FlatList
				data={tasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <TaskItem item={item} onDelete={handleDelete} />}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 16,
	},
	listContent: {
		paddingHorizontal: 16,
		paddingBottom: 40,
	},
	taskCard: {
		marginBottom: 16,
	},
	taskHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	taskTitle: {
		fontSize: 16,
		marginLeft: 8,
	},
	taskDetails: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		marginTop: 12,
		marginLeft: 40, // Align with checkbox
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 16,
		marginBottom: 8,
	},
	detailText: {
		marginLeft: 4,
		fontSize: 12,
	},
	tagIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 8,
	},
});