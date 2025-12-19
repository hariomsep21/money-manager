import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { User } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);

    useEffect(() => {
        setName(user.name);
    }, [user]);

    const handleSave = () => {
        updateUser({ name });
        setIsEditing(false);
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 className="page-title">Profile</h1>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <User size={50} color="var(--accent-primary)" />
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                        <input
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
                            <button className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Money Manager User</p>



                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
