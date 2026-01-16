import { useState } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { ShoppingCart, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function ShoppingList() {
    const { shoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, USERS } = useFamily();
    const [newItem, setNewItem] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        addShoppingItem(newItem);
        setNewItem('');
    };

    const getUserColor = (id) => Object.values(USERS).find(u => u.id === id)?.color || '#ccc';

    return (
        <div className="card">
            <div className="title-section">
                <ShoppingCart size={24} className="theme-sis" />
                <span>Kids' Shopping List</span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add item..."
                />
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 16px' }}>
                    <Plus size={24} />
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shoppingList.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>List is empty</p>}
                {shoppingList.map(item => (
                    <div
                        key={item.firebaseId}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: item.done ? 'var(--card-bg-accent)' : 'var(--card-bg)',
                            border: '1px solid var(--input-border)',
                            borderRadius: 'var(--radius-sm)',
                        }}
                    >
                        <button
                            onClick={() => toggleShoppingItem(item.firebaseId)}
                            className="btn-icon"
                            style={{ color: item.done ? 'var(--status-green)' : 'var(--text-muted)' }}
                        >
                            {item.done ? <CheckCircle /> : <Circle />}
                        </button>

                        <div style={{ flex: 1, textDecoration: item.done ? 'line-through' : 'none' }}>
                            {item.text}
                        </div>

                        {item.addedBy && (
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: getUserColor(item.addedBy)
                                }}
                                title={`Added by ${item.addedBy}`}
                            />
                        )}

                        <button
                            onClick={() => deleteShoppingItem(item.firebaseId)}
                            className="btn-icon"
                            style={{ color: 'var(--status-red)' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
