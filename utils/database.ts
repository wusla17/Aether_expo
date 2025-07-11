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

const db = SQLite.openDatabase('aether.db');

export function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, createdAt INTEGER NOT NULL);',
        [],
        () => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, task TEXT NOT NULL, completed INTEGER NOT NULL, createdAt INTEGER NOT NULL);',
            [],
            () => resolve(),
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function saveNote(note: Note): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO notes (id, title, content, createdAt) VALUES (?, ?, ?, ?);',
        [note.id, note.title, note.content, note.createdAt],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getNoteById(id: string): Promise<Note | undefined> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM notes WHERE id = ?;',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0));
          } else {
            resolve(undefined);
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getAllNotes(): Promise<Note[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM notes ORDER BY createdAt DESC;',
        [],
        (_, { rows }) => {
          const notes: Note[] = [];
          for (let i = 0; i < rows.length; i++) {
            notes.push(rows.item(i));
          }
          resolve(notes);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function deleteNote(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM notes WHERE id = ?;',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getNotes(): Promise<Note[]> {
  return getAllNotes();
}

export function addTodo(task: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO todos (task, completed, createdAt) VALUES (?, 0, ?);',
        [task, Date.now()],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function deleteTodo(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM todos WHERE id = ?;',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getTodos(): Promise<Todo[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM todos ORDER BY createdAt DESC;',
        [],
        (_, { rows }) => {
          const todos: Todo[] = [];
          for (let i = 0; i < rows.length; i++) {
            todos.push(rows.item(i));
          }
          resolve(todos);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function updateTodo(id: number, task: string, completed: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE todos SET task = ?, completed = ? WHERE id = ?;',
        [task, completed ? 1 : 0, id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
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