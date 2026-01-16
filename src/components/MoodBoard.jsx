import { useFamily } from '../contexts/FamilyContext';
import { Smile } from 'lucide-react';
import { format } from 'date-fns';

const MOODS = [
    { label: 'Happy', emoji: '😊', value: 'happy', color: '#10b981' },
    { label: 'Neutral', emoji: '😐', value: 'neutral', color: '#f59e0b' },
    { label: 'Sad', emoji: '😢', value: 'sad', color: '#6366f1' },
    { label: 'Upset', emoji: '😠', value: 'upset', color: '#ef4444' },
];

export default function MoodBoard() {
    const { KIDS, moods, updateMood } = useFamily();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysMoods = moods[todayStr] || {};

    return (
        <div className="card">
            <div className="title-section">
                <Smile size={24} className="theme-mom" />
                <span>Daily Mood Board</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {KIDS.map(kid => {
                    const currentMoodVal = todaysMoods[kid.id];
                    const currentMood = MOODS.find(m => m.value === currentMoodVal);

                    return (
                        <div key={kid.id}>
                            <div style={{ marginBottom: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{kid.name}</span>
                                {currentMood && (
                                    <span style={{ fontSize: '20px' }}>{currentMood.emoji}</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                {MOODS.map(mood => (
                                    <button
                                        key={mood.value}
                                        onClick={() => updateMood(todayStr, kid.id, mood.value)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: 'var(--radius-sm)',
                                            border: currentMoodVal === mood.value ? `2px solid ${mood.color}` : '1px solid var(--input-border)',
                                            background: currentMoodVal === mood.value ? `${mood.color}20` : 'var(--card-bg)',
                                            cursor: 'pointer',
                                            fontSize: '24px',
                                            transition: 'all 0.2s',
                                            transform: currentMoodVal === mood.value ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                        title={mood.label}
                                    >
                                        {mood.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
