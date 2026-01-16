import { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { db } from '../firebase';
import { ref, onValue, set, push, remove, update } from 'firebase/database';

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

export function FamilyProvider({ children }) {
    // CURRENT USER & THEME stay local (device-specific)
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('family_user') || null);
    const [theme, setTheme] = useState(() => localStorage.getItem('family_theme') || 'light');

    // SHARED DATA (Synced with Firebase)
    const [schedule, setSchedule] = useState({});
    const [shoppingList, setShoppingList] = useState([]);
    const [moods, setMoods] = useState({});
    const [nextContact, setNextContact] = useState('');
    const [notes, setNotes] = useState('');
    const [photos, setPhotos] = useState([]);

    // 1. Firebase Listeners (Real-time Sync)
    useEffect(() => {
        const refs = [
            { path: 'schedule', setter: setSchedule, type: 'object' },
            { path: 'shoppingList', setter: setShoppingList, type: 'array' },
            { path: 'moods', setter: setMoods, type: 'object' },
            { path: 'nextContact', setter: setNextContact, type: 'string' },
            { path: 'notes', setter: setNotes, type: 'string' },
            { path: 'photos', setter: setPhotos, type: 'array' },
        ];

        const unsubscribes = refs.map(({ path, setter, type }) => {
            const dbRef = ref(db, path);
            return onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (type === 'array') {
                    setter(data ? Object.entries(data).map(([key, value]) => ({ ...value, firebaseId: key })) : []);
                } else if (type === 'string') {
                    setter(data || '');
                } else {
                    setter(data || {});
                }
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    // 2. Local State Persistence (User & Theme)
    useEffect(() => localStorage.setItem('family_user', currentUser || ''), [currentUser]);
    useEffect(() => localStorage.setItem('family_theme', theme), [theme]);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // ACTIONS (Write to Firebase)
    const login = (userId) => setCurrentUser(userId);
    const logout = () => setCurrentUser(null);

    const updatePickup = (dateStr, userId) => {
        const userName = Object.values(USERS).find(u => u.id === currentUser)?.name || 'Unknown';
        set(ref(db, `schedule/${dateStr}`), {
            assignedTo: userId,
            lastEditedBy: userName,
            lastEditedAt: format(new Date(), 'MMM d, h:mm a')
        });
    };

    const addShoppingItem = (text) => {
        const newItem = {
            text,
            done: false,
            addedBy: currentUser,
            createdAt: Date.now()
        };
        push(ref(db, 'shoppingList'), newItem);
    };

    const toggleShoppingItem = (firebaseId) => {
        const item = shoppingList.find(i => i.firebaseId === firebaseId);
        if (item) {
            update(ref(db, `shoppingList/${firebaseId}`), { done: !item.done });
        }
    };

    const deleteShoppingItem = (firebaseId) => {
        remove(ref(db, `shoppingList/${firebaseId}`));
    };

    const updateMood = (dateStr, kidId, mood) => {
        set(ref(db, `moods/${dateStr}/${kidId}`), mood);
    };

    const updateNotes = (newNotes) => {
        set(ref(db, 'notes'), newNotes);
    };

    const updateNextContact = (val) => {
        set(ref(db, 'nextContact'), val);
    };

    const addPhoto = (photoData) => {
        push(ref(db, 'photos'), photoData);
        // Note: In a real app, you'd prune old photos periodically
    };

    const deletePhoto = (firebaseId) => {
        remove(ref(db, `photos/${firebaseId}`));
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
            setNextContact: updateNextContact,
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
