import AsyncStorage from '@react-native-async-storage/async-storage';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

export type Todo = {
  id: number;
  task: string;
  completed: number;
  createdAt: number;
};

export type SearchResult = {
  id: string | number;
  name: string;
  description: string;
  type: 'note' | 'todo';
};

export async function initDb(): Promise<void> {
  // Placeholder for database initialization logic
  // For now, just ensure storage keys are ready or perform any setup if needed
  return Promise.resolve();
}

export async function saveNote(note: Note): Promise<void> {
  const existing = await getAllNotes();
  const updated = [...existing.filter(n => n.id !== note.id), note];
  await AsyncStorage.setItem('notes', JSON.stringify(updated));
}

export async function getNoteById(id: string): Promise<Note | undefined> {
  const notes = await getAllNotes();
  return notes.find(note => note.id === id);
}

export async function getAllNotes(): Promise<Note[]> {
  const raw = await AsyncStorage.getItem('notes');
  return raw ? JSON.parse(raw) : [];
}

export async function deleteNote(id: string): Promise<void> {
  const notes = await getAllNotes();
  const updated = notes.filter(n => n.id !== id);
  await AsyncStorage.setItem('notes', JSON.stringify(updated));
}

export async function getNotes(): Promise<Note[]> {
  return getAllNotes();
}

export async function addTodo(task: string): Promise<void> {
  const todos = await getTodos();
  const newTodo: Todo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task,
    completed: 0,
    createdAt: Date.now(),
  };
  const updated = [...todos, newTodo];
  await AsyncStorage.setItem('todos', JSON.stringify(updated));
}

export async function deleteTodo(id: number): Promise<void> {
  const todos = await getTodos();
  const updated = todos.filter(t => t.id !== id);
  await AsyncStorage.setItem('todos', JSON.stringify(updated));
}

export async function getTodos(): Promise<Todo[]> {
  const raw = await AsyncStorage.getItem('todos');
  return raw ? JSON.parse(raw) : [];
}

export async function updateTodo(id: number, task: string, completed: boolean): Promise<void> {
  const todos = await getTodos();
  const updated = todos.map(t => 
    t.id === id ? { ...t, task, completed: completed ? 1 : 0 } : t
  );
  await AsyncStorage.setItem('todos', JSON.stringify(updated));
}

export async function searchNotesAndTodos(query: string): Promise<SearchResult[]> {
  const notes = await getAllNotes();
  const todos = await getTodos();
  const lowerQuery = query.toLowerCase();
  
  const noteResults: SearchResult[] = notes
    .filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery)
    )
    .map(note => ({
      id: note.id,
      name: note.title,
      description: note.content,
      type: 'note',
    }));
  
  const todoResults: SearchResult[] = todos
    .filter(todo => todo.task.toLowerCase().includes(lowerQuery))
    .map(todo => ({
      id: todo.id,
      name: todo.task,
      description: '',
      type: 'todo',
    }));
  
  return [...noteResults, ...todoResults];
}
