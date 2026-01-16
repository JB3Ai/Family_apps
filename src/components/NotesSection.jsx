import { useFamily } from '../contexts/FamilyContext';
import { Pencil, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotesSection() {
    const { notes, updateNotes } = useFamily();
    const [localNotes, setLocalNotes] = useState(notes);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    // Debounced save or manual save
    const handleChange = (e) => {
        setLocalNotes(e.target.value);
    };

    const handleBlur = () => {
        if (localNotes !== notes) {
            setIsSaving(true);
            updateNotes(localNotes);
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    return (
        <div className="card">
            <div className="title-section" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pencil size={24} className="theme-sis" />
                    <span>Family Scribble Pad</span>
                </div>
                {isSaving && <span style={{ fontSize: '12px', color: 'var(--status-green)' }}>Saved</span>}
            </div>

            <textarea
                value={localNotes}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Type any notes, reminders, or messages here..."
                style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid #e5e7eb',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    resize: 'vertical',
                    outline: 'none'
                }}
            />
        </div>
    );
}
