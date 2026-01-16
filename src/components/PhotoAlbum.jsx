import { useRef } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { Image, Trash2, Upload } from 'lucide-react';

export default function PhotoAlbum() {
    const { photos, addPhoto, deletePhoto, USERS, currentUser } = useFamily();
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Basic validation
            if (file.size > 2000000) { // 2MB limit
                alert("Photo is too large! Please choose a smaller one (under 2MB).");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const timestamp = new Date().toISOString();
                addPhoto({
                    data: reader.result,
                    uploadedBy: currentUser,
                    id: Date.now(),
                    date: timestamp
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getUserName = (id) => Object.values(USERS).find(u => u.id === id)?.name || 'Unknown';

    return (
        <div className="card">
            <div className="title-section" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Image size={24} className="theme-dad" />
                    <span>Family Album</span>
                </div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '8px 16px', fontSize: '14px', background: 'var(--primary)' }}
                >
                    <Upload size={16} /> Add Photo
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginTop: '16px'
            }}>
                {photos.length === 0 && <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No photos yet</div>}

                {photos.map((photo, index) => (
                    <div key={photo.id} style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', aspectRatio: '1/1' }}>
                        <img
                            src={photo.data}
                            alt="Family Upload"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            padding: '4px 8px',
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            fontSize: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{getUserName(photo.uploadedBy)}</span>
                            <button
                                onClick={() => deletePhoto(index)}
                                style={{ background: 'none', border: 'none', color: '#faa', cursor: 'pointer', padding: '4px' }}
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
