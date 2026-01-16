import { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

const FamilyContext = createContext();

const USERS = {
    DAD: { id: 'dad', name: 'Dad', color: 'var(--user-dad)', avatar: '👨‍🦲' },
    MOM: { id: 'mom', name: 'Granny Sue', color: 'var(--user-mom)', avatar: '👵🏼' },
    SIS: { id: 'sis', name: 'Auntie Sam', color: 'var(--user-sis)', avatar: '👩🏻' },
};

const KIDS = [
    { id: 'kid1', name: 'Donna', age: 11 },
    { id: 'kid2', name: 'Skyler', age: 8 },
];

const INITIAL_SCHEDULE = {}; // Start empty, will fill
const INITIAL_SHOPPING = [
    { id: 1, text: 'Milk', done: false, addedBy: 'dad' },
    { id: 2, text: 'Cereal', done: false, addedBy: 'mom' },
];

export function FamilyProvider({ children }) {
    // Load from local storage or default
    const [currentUser, setCurrentUser] = useState(() => {
        return localStorage.getItem('family_user') || null;
    });

    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem('family_schedule');
        return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    });

    const [shoppingList, setShoppingList] = useState(() => {
        const saved = localStorage.getItem('family_shopping');
        return saved ? JSON.parse(saved) : INITIAL_SHOPPING;
    });

    const [moods, setMoods] = useState(() => {
        const saved = localStorage.getItem('family_moods');
        return saved ? JSON.parse(saved) : {};
    });

    const [nextContact, setNextContact] = useState(() => {
        return localStorage.getItem('family_contact') || '';
    });

    const [notes, setNotes] = useState(() => {
        return localStorage.getItem('family_notes') || '';
    });

    const [photos, setPhotos] = useState(() => {
        const saved = localStorage.getItem('family_photos');
        return saved ? JSON.parse(saved) : [];
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('family_theme') || 'light';
    });

    // Effects to save
    useEffect(() => localStorage.setItem('family_user', currentUser || ''), [currentUser]);
    useEffect(() => localStorage.setItem('family_schedule', JSON.stringify(schedule)), [schedule]);
    useEffect(() => localStorage.setItem('family_shopping', JSON.stringify(shoppingList)), [shoppingList]);
    useEffect(() => localStorage.setItem('family_moods', JSON.stringify(moods)), [moods]);
    useEffect(() => localStorage.setItem('family_contact', nextContact), [nextContact]);
    useEffect(() => localStorage.setItem('family_notes', notes), [notes]);
    useEffect(() => localStorage.setItem('family_photos', JSON.stringify(photos)), [photos]);
    useEffect(() => localStorage.setItem('family_theme', theme), [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Actions
    const login = (userId) => setCurrentUser(userId);
    const logout = () => setCurrentUser(null);

    const updatePickup = (dateStr, userId) => {
        setSchedule(prev => ({
            ...prev,
            [dateStr]: {
                assignedTo: userId,
                lastEditedBy: USERS[Object.keys(USERS).find(key => USERS[key].id === currentUser)]?.name || 'Unknown',
                lastEditedAt: format(new Date(), 'MMM d, h:mm a')
            }
        }));
    };

    const addShoppingItem = (text) => {
        const newItem = {
            id: Date.now(),
            text,
            done: false,
            addedBy: currentUser
        };
        setShoppingList(prev => [...prev, newItem]);
    };

    const toggleShoppingItem = (id) => {
        setShoppingList(prev => prev.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    const deleteShoppingItem = (id) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    const updateMood = (dateStr, kidId, mood) => {
        setMoods(prev => ({
            ...prev,
            [dateStr]: {
                ...(prev[dateStr] || {}),
                [kidId]: mood
            }
        }));
    };

    const updateNotes = (newNotes) => setNotes(newNotes);

    const addPhoto = (photoData) => {
        setPhotos(prev => {
            const updated = [photoData, ...prev];
            // Keep only last 10 to save space
            return updated.slice(0, 10);
        });
    };

    const deletePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const CALENDAR_ID = 'c_9225dbf1d64c129f04d8ec499c70776a843d14fd5b96d4b704c5339c884c3007@group.calendar.google.com';

    return (
        <FamilyContext.Provider value={{
            USERS,
            KIDS,
            currentUser,
            login,
            logout,
            schedule,
            updatePickup,
            shoppingList,
            addShoppingItem,
            toggleShoppingItem,
            deleteShoppingItem,
            moods,
            updateMood,
            nextContact,
            setNextContact,
            notes,
            updateNotes,
            photos,
            addPhoto,
            deletePhoto,
            theme,
            setTheme,
            CALENDAR_ID
        }}>
            {children}
        </FamilyContext.Provider>
    );
}

export function useFamily() {
    return useContext(FamilyContext);
}
