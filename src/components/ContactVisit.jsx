import { useFamily } from '../contexts/FamilyContext';
import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ContactVisit() {
    const { nextContact, setNextContact } = useFamily();

    // Handle parsing to format required by datetime-local input
    // Stored as ISO string usually, but input needs yyyy-MM-ddThh:mm
    const inputValue = nextContact ? nextContact.slice(0, 16) : '';

    const handleChange = (e) => {
        setNextContact(e.target.value);
    };

    return (
        <div className="card">
            <div className="title-section">
                <Clock size={24} className="theme-dad" />
                <span>Next Contact Visit</span>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                When are the kids visiting Mom?
            </div>

            <input
                type="datetime-local"
                value={inputValue}
                onChange={handleChange}
                style={{
                    fontSize: '18px',
                    fontWeight: '500'
                }}
            />

            {nextContact && (
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--primary)20',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)'
                }}>
                    <strong>Scheduled:</strong> {format(parseISO(nextContact), 'EEEE, MMM d @ h:mm a')}
                </div>
            )}
        </div>
    );
}
