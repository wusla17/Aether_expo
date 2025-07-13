import * as SQLite from 'expo-sqlite';

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

const db = SQLite.openDatabaseSync('aether.db');

export async function initDb() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, createdAt INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, task TEXT NOT NULL, completed INTEGER NOT NULL, createdAt INTEGER NOT NULL);
  `);
}

export async function saveNote(note: Note) {
  await db.runAsync(
    'INSERT OR REPLACE INTO notes (id, title, content, createdAt) VALUES (?, ?, ?, ?);',
    note.id,
    note.title,
    note.content,
    note.createdAt
  );
}

export async function getNoteById(id: string): Promise<Note | null> {
  const note = await db.getFirstAsync<Note>('SELECT * FROM notes WHERE id = ?;', id);
  return note;
}

export async function getAllNotes(): Promise<Note[]> {
  const notes = await db.getAllAsync<Note>('SELECT * FROM notes ORDER BY createdAt DESC;');
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
