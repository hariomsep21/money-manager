import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in animation
        setIsVisible(true);

        // Navigate to main app after 2.5 seconds
        const timer = setTimeout(() => {
            navigate('/transactions');
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--bg-secondary)',
            transition: 'opacity 1s ease-in-out',
            opacity: isVisible ? 1 : 0
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
                    transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                    transition: 'transform 1s ease-out'
                }}>
                    <Wallet size={64} color="white" />
                </div>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                }}>
                    FinTrack
                </h1>
                <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.5px'
                }}>
                    Track Your Finances Smartly
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
