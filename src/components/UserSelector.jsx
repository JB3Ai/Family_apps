import { useFamily } from '../contexts/FamilyContext';

export default function UserSelector() {
    const { USERS, login } = useFamily();

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-color)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <h1 className="title-large" style={{ marginBottom: '40px' }}>Who are you?</h1>
            <div style={{ display: 'grid', gap: '20px', width: '100%', maxWidth: '300px' }}>
                {Object.values(USERS).map(user => (
                    <button
                        key={user.id}
                        onClick={() => login(user.id)}
                        style={{
                            padding: '24px',
                            border: `2px solid ${user.color}`,
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--card-bg)',
                            fontSize: '24px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <span style={{ fontSize: '32px' }}>{user.avatar}</span>
                        <span style={{ color: user.color }}>{user.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
