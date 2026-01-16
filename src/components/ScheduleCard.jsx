import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import { useFamily } from '../contexts/FamilyContext';
import { Calendar, UserCheck } from 'lucide-react';
import clsx from 'clsx';

export default function ScheduleCard() {
    const { schedule, updatePickup, USERS, currentUser } = useFamily();

    // Get start of current week (assuming Sunday start, but we show Mon-Fri)
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start

    const days = Array.from({ length: 5 }).map((_, i) => addDays(weekStart, i));

    const handleToggle = (dateStr) => {
        // Cycle: Dad -> Mom (Granny) -> Sis (Auntie) -> Null
        const currentData = schedule[dateStr] || {};
        const currentId = currentData.assignedTo;

        let next = null;
        if (currentId === 'dad') next = 'mom';
        else if (currentId === 'mom') next = 'sis';
        else if (currentId === 'sis') next = null;
        else next = 'dad';

        updatePickup(dateStr, next);
    };

    const getUserForId = (id) => Object.values(USERS).find(u => u.id === id);

    return (
        <div className="card">
            <div className="title-section">
                <Calendar size={24} className="theme-dad" />
                <span>School Collection</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayData = schedule[dateStr] || {};
                    const pickupId = dayData.assignedTo;
                    const pickupUser = getUserForId(pickupId);
                    const isToday = isSameDay(day, today);
                    const lastEditedText = dayData.lastEditedBy ? `Last edit by ${dayData.lastEditedBy} at ${dayData.lastEditedAt}` : '';

                    return (
                        <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div
                                onClick={() => handleToggle(dateStr)}
                                style={{
                                    padding: '16px',
                                    borderRadius: 'var(--radius-md)',
                                    background: pickupUser ? pickupUser.color : 'var(--card-bg-accent)',
                                    color: pickupUser ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: isToday ? '3px solid var(--text-main)' : 'none',
                                    position: 'relative',
                                    transition: 'all 0.2s',
                                    boxShadow: pickupUser ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <span style={{ fontWeight: '700', fontSize: '18px' }}>
                                        {format(day, 'EEEE')}
                                    </span>
                                    <span style={{ fontSize: '14px', opacity: 0.9 }}>
                                        {format(day, 'MMM d')}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {pickupUser ? (
                                        <>
                                            <span style={{ fontSize: '24px' }}>{pickupUser.avatar}</span>
                                            <span style={{ fontWeight: '600' }}>{pickupUser.name}</span>
                                        </>
                                    ) : (
                                        <span style={{ fontStyle: 'italic' }}>Tap to set</span>
                                    )}
                                </div>
                            </div>

                            {lastEditedText && (
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px' }}>
                                    {lastEditedText}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Sunday Notification Logic is handled mostly by UI prompting, 
          but here we just show the visual week. */}
        </div>
    );
}
