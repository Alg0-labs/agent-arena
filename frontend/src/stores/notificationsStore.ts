import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'win' | 'loss' | 'battle' | 'info';
  read: boolean;
  timestamp: string;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Battle Result',
    message: 'Phantom Analyst won the MI vs DC battle! +300 INTEL',
    type: 'win',
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n2',
    title: 'New Battle',
    message: 'Iron Oracle challenges you on US-Iran sanctions',
    type: 'battle',
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n3',
    title: '7-Day Streak!',
    message: 'You hit a 7-day login streak. Keep it up for bonus INTEL!',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: initialNotifications,
  unreadCount: 2,

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  markRead: (id: string) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: `n${Date.now()}`, read: false },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),
}));
