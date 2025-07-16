import moment from 'moment';

export interface SearchItem {
  id: string;
  type: 'note' | 'todo' | 'calendar';
  title: string;
  content: string;
  date: string; // YYYY-MM-DD format
}

const dummyData: SearchItem[] = [
  // Notes
  {
    id: 'note-1',
    type: 'note',
    title: 'Meeting Notes',
    content: 'Discussed project timelines and resource allocation. Follow up with John.',
    date: '2025-07-14',
  },
  {
    id: 'note-2',
    type: 'note',
    title: 'Idea for new feature',
    content: 'Implement a dark mode toggle and user customizable themes.',
    date: '2025-07-13',
  },
  {
    id: 'note-3',
    type: 'note',
    title: 'Research on AI',
    content: 'Read articles on generative AI and large language models.',
    date: '2025-07-05',
  },
  {
    id: 'note-4',
    type: 'note',
    title: 'Weekly Sync',
    content: 'Reviewed progress on sprint goals. Identified blockers.',
    date: '2025-07-15',
  },

  // Todos
  {
    id: 'todo-1',
    type: 'todo',
    title: 'Finish report',
    content: 'Complete the Q2 financial report and send to manager.',
    date: '2025-07-15',
  },
  {
    id: 'todo-2',
    type: 'todo',
    title: 'Buy groceries',
    content: 'Milk, eggs, bread, vegetables, fruits.',
    date: '2025-07-14',
  },
  {
    id: 'todo-3',
    type: 'todo',
    title: 'Call client X',
    content: 'Discuss contract renewal and new project proposal.',
    date: '2025-07-10',
  },
  {
    id: 'todo-4',
    type: 'todo',
    title: 'Prepare presentation',
    content: 'Create slides for the upcoming team meeting.',
    date: '2025-07-16',
  },

  // Calendar Events
  {
    id: 'cal-1',
    type: 'calendar',
    title: 'Team Standup',
    content: 'Daily team meeting at 9 AM.',
    date: '2025-07-15',
  },
  {
    id: 'cal-2',
    type: 'calendar',
    title: 'Dentist Appointment',
    content: 'Check-up at 3 PM.',
    date: '2025-07-12',
  },
  {
    id: 'cal-3',
    type: 'calendar',
    title: 'Project Deadline',
    content: 'Final submission for Project Alpha.',
    date: '2025-06-28',
  },
  {
    id: 'cal-4',
    type: 'calendar',
    title: 'Client Demo',
    content: 'Demonstrate new features to client Beta.',
    date: '2025-07-17',
  },
];

export const searchData = (query: string): SearchItem[] => {
  if (!query) {
    return [];
  }
  const lowerCaseQuery = query.toLowerCase();
  return dummyData.filter(item =>
    item.title.toLowerCase().includes(lowerCaseQuery) ||
    item.content.toLowerCase().includes(lowerCaseQuery)
  );
};

export const getRecentSearches = (searchedItems: SearchItem[]) => {
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const thisWeek = moment().startOf('week');
  const thisMonth = moment().startOf('month');

  const recent: { title: string; items: SearchItem[] }[] = [
    { title: 'Today', items: [] },
    { title: 'Yesterday', items: [] },
    { title: 'This week', items: [] },
    { title: 'This month', items: [] },
    { title: 'Older', items: [] },
  ];

  searchedItems.forEach(item => {
    const itemDate = moment(item.date);
    if (itemDate.isSame(today, 'day')) {
      recent[0].items.push(item);
    } else if (itemDate.isSame(yesterday, 'day')) {
      recent[1].items.push(item);
    } else if (itemDate.isSameOrAfter(thisWeek, 'day')) {
      recent[2].items.push(item);
    } else if (itemDate.isSameOrAfter(thisMonth, 'day')) {
      recent[3].items.push(item);
    } else {
      recent[4].items.push(item);
    }
  });

  // Filter out empty groups
  return recent.filter(group => group.items.length > 0);
};
