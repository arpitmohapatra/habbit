import { openDB } from 'idb';

const DB_NAME = 'habit-tracker';
const STORE_NAME = 'habits';
const COMPLETIONS_STORE = 'completions';
const SETTINGS_STORE = 'settings';

async function initDB() {
  const db = await openDB(DB_NAME, 3, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(COMPLETIONS_STORE)) {
          const completionsStore = db.createObjectStore(COMPLETIONS_STORE, { keyPath: 'id', autoIncrement: true });
          completionsStore.createIndex('habitId', 'habitId', { unique: false });
          completionsStore.createIndex('date', 'date', { unique: false });
        }
      }
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      }
    },
  });
  return db;
}

export async function getAllHabits() {
  const db = await initDB();
  const habits = await db.getAll(STORE_NAME);
  const completions = await db.getAll(COMPLETIONS_STORE);
  
  // Calculate streaks and attach completion data
  return habits.map(habit => {
    const habitCompletions = completions
      .filter(c => c.habitId === habit.id)
      .map(c => new Date(c.date));
    
    const currentStreak = calculateCurrentStreak(habitCompletions);
    const bestStreak = calculateBestStreak(habitCompletions);
    const completionRate = calculateCompletionRate(habitCompletions, habit.createdAt);
    
    return {
      ...habit,
      currentStreak,
      bestStreak,
      completionRate,
      completedDates: habitCompletions.map(d => d.toISOString()),
    };
  });
}

export async function getHabit(id) {
  const db = await initDB();
  const habit = await db.get(STORE_NAME, id);
  if (!habit) return null;
  
  const completions = await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId', id);
  const completionDates = completions.map(c => new Date(c.date));
  
  const currentStreak = calculateCurrentStreak(completionDates);
  const bestStreak = calculateBestStreak(completionDates);
  const completionRate = calculateCompletionRate(completionDates, habit.createdAt);
  
  return {
    ...habit,
    currentStreak,
    bestStreak,
    completionRate,
    completedDates: completionDates.map(d => d.toISOString()),
  };
}

export async function addHabit(habit) {
  const db = await initDB();
  const habitWithDefaults = {
    name: habit.name,
    description: habit.description || '',
    icon: habit.icon || 'circle',
    frequency: habit.frequency || 'daily',
    isRecurring: habit.isRecurring !== undefined ? habit.isRecurring : true,
    selectedDays: habit.selectedDays || [],
    reminders: habit.reminders || [],
    createdAt: new Date().toISOString(),
    currentStreak: 0,
    bestStreak: 0,
    completionRate: 0,
  };
  return await db.add(STORE_NAME, habitWithDefaults);
}

export async function updateHabit(habit) {
  const db = await initDB();
  return await db.put(STORE_NAME, habit);
}

export async function deleteHabit(id) {
  const db = await initDB();
  // Delete all completions for this habit
  const completions = await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId', id);
  for (const completion of completions) {
    await db.delete(COMPLETIONS_STORE, completion.id);
  }
  return await db.delete(STORE_NAME, id);
}

export async function toggleHabitCompletion(habitId, date) {
  const db = await initDB();
  const dateStr = new Date(date).toISOString().split('T')[0];
  
  // Check if completion already exists
  const completions = await db.getAllFromIndex(COMPLETIONS_STORE, 'habitId', habitId);
  const existing = completions.find(c => {
    const cDate = new Date(c.date).toISOString().split('T')[0];
    return cDate === dateStr;
  });
  
  if (existing) {
    // Remove completion
    await db.delete(COMPLETIONS_STORE, existing.id);
    return false;
  } else {
    // Add completion
    await db.add(COMPLETIONS_STORE, {
      habitId,
      date: new Date(date).toISOString(),
    });
    return true;
  }
}

function calculateCurrentStreak(completionDates) {
  if (completionDates.length === 0) return 0;
  
  const sorted = [...completionDates].sort((a, b) => b - a);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const date of sorted) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (checkDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

function calculateBestStreak(completionDates) {
  if (completionDates.length === 0) return 0;
  
  const sorted = [...completionDates].sort((a, b) => a - b);
  let bestStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else {
      bestStreak = Math.max(bestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(bestStreak, currentStreak);
}

function calculateCompletionRate(completionDates, createdAt) {
  if (!createdAt) return 0;
  
  const startDate = new Date(createdAt);
  const today = new Date();
  const daysSinceCreation = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation === 0) return 0;
  
  return Math.round((completionDates.length / daysSinceCreation) * 100);
}

// User Settings Functions
export async function getUserName() {
  const db = await initDB();
  const setting = await db.get(SETTINGS_STORE, 'userName');
  return setting ? setting.value : null;
}

export async function saveUserName(name) {
  const db = await initDB();
  await db.put(SETTINGS_STORE, { key: 'userName', value: name });
}

export async function isFirstTimeUser() {
  const name = await getUserName();
  return name === null;
}
