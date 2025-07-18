import * as SQLite from 'expo-sqlite';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  lastAccessedAt: number; // New field
};

export type Todo = {
  id: number;
  task: string;
  completed: number;
  createdAt: number;
};

export type TrashItem = {
  id: number;
  item_id: string | number;
  item_type: 'note' | 'todo';
  item_data: string;
  trashedAt: number;
};

export type SearchResult = {
  id: string | number;
  name: string;
  description: string;
  type: 'note' | 'todo';
  createdAt: number;
  lastAccessedAt?: number; // Optional for search results
};

const db = SQLite.openDatabaseSync('aether.db');

export async function initDb() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, createdAt INTEGER NOT NULL, lastAccessedAt INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, task TEXT NOT NULL, completed INTEGER NOT NULL, createdAt INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS trash (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, item_id TEXT NOT NULL, item_type TEXT NOT NULL, item_data TEXT NOT NULL, trashedAt INTEGER NOT NULL);
  `);
}

export async function saveNote(note: Note) {
  await db.runAsync(
    'INSERT OR REPLACE INTO notes (id, title, content, createdAt, lastAccessedAt) VALUES (?, ?, ?, ?, ?);',
    note.id,
    note.title,
    note.content,
    note.createdAt,
    note.lastAccessedAt || Date.now() // Set lastAccessedAt on save if not provided
  );
}

export async function saveTodo(todo: Todo) {
  await db.runAsync(
    'INSERT OR REPLACE INTO todos (id, task, completed, createdAt) VALUES (?, ?, ?, ?);',
    todo.id,
    todo.task,
    todo.completed,
    todo.createdAt
  );
}

export async function getNoteById(id: string): Promise<Note | null> {
  const note = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?;', id);
  return note;
}

export async function updateNoteLastAccessed(id: string) {
  await db.runAsync('UPDATE notes SET lastAccessedAt = ? WHERE id = ?;', Date.now(), id);
}

export async function getAllNotes(): Promise<Note[]> {
  const notes = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY lastAccessedAt DESC;'); // Order by lastAccessedAt
  return notes;
}

export async function deleteNote(id: string) {
  await db.runAsync('DELETE FROM notes WHERE id = ?;', id);
}

export function getNotes(): Promise<Note[]> {
  return getAllNotes();
}

export async function addTodo(task: string) {
  await db.runAsync('INSERT INTO todos (task, completed, createdAt) VALUES (?, 0, ?);', task, Date.now());
}

export async function deleteTodo(id: number) {
  await db.runAsync('DELETE FROM todos WHERE id = ?;', id);
}

export async function getTodos(): Promise<Todo[]> {
  const todos = await db.getAllAsync<Todo>('SELECT * FROM todos ORDER BY createdAt DESC;');
  return todos;
}

export async function updateTodo(id: number, task: string, completed: boolean) {
  await db.runAsync('UPDATE todos SET task = ?, completed = ? WHERE id = ?;', task, completed ? 1 : 0, id);
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
      createdAt: note.createdAt,
      lastAccessedAt: note.lastAccessedAt,
    }));

  const todoResults: SearchResult[] = todos
    .filter(todo => todo.task.toLowerCase().includes(lowerQuery))
    .map(todo => ({
      id: todo.id,
      name: todo.task,
      description: '',
      type: 'todo',
      createdAt: todo.createdAt,
    }));

  return [...noteResults, ...todoResults];
}

export async function clearDb() {
  await db.execAsync(`
    DELETE FROM notes;
    DELETE FROM todos;
    DELETE FROM trash;
  `);
}

export async function moveToTrash(itemId: string | number, itemType: 'note' | 'todo') {
  let item;
  if (itemType === 'note') {
    item = await getNoteById(itemId as string);
    if (item) {
      await deleteNote(itemId as string);
    }
  } else {
    // You'll need a way to get a todo by its ID
    // For now, let's assume you have a function getTodoById
    // item = await getTodoById(itemId as number);
    // if (item) {
    //   await deleteTodo(itemId as number);
    // }
  }

  if (item) {
    const compressedData = JSON.stringify(item); // In a real app, you'd use a compression library
    await db.runAsync(
      'INSERT INTO trash (item_id, item_type, item_data, trashedAt) VALUES (?, ?, ?, ?);',
      itemId,
      itemType,
      compressedData,
      Date.now()
    );
  }
}

export async function getTrashedItems() {
  const items = await db.getAllAsync<TrashItem>('SELECT * FROM trash ORDER BY trashedAt DESC;');
  return items.map(item => {
    const data = JSON.parse(item.item_data);
    return {
      id: item.id,
      item_id: item.item_id,
      type: item.item_type,
      title: data.title || data.task,
    };
  });
}

export async function restoreFromTrash(id: number) {
  const item = await db.getFirstAsync<TrashItem>('SELECT * FROM trash WHERE id = ?;', id);
  if (item) {
    const data = JSON.parse(item.item_data);
    if (item.item_type === 'note') {
      await saveNote(data);
    } else {
      await saveTodo(data);
    }
    await db.runAsync('DELETE FROM trash WHERE id = ?;', id);
  }
}

export async function permanentlyDelete(id: number) {
  await db.runAsync('DELETE FROM trash WHERE id = ?;', id);
}
