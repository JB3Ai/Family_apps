import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PWAInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIOSDevice);

        const handleBeforeInstallPrompt = (e) => {
            // Prevent the default browser prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Filter out if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            alert("To install on iPhone/iPad:\n1. Tap the 'Share' icon (square with arrow up) at the bottom.\n2. Scroll down and tap 'Add to Home Screen'.");
            return;
        }

        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // On iOS, we always show it if not in standalone mode, as a guide
    const showButton = isInstallable || (isIOS && !window.matchMedia('(display-mode: standalone)').matches);

    if (!showButton) return null;

    return (
        <div style={{
            marginTop: '24px',
            padding: '20px',
            textAlign: 'center',
            borderTop: '1px border-dashed var(--text-muted)',
            opacity: 0.8
        }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Want easier access? Install Family Sync on your phone!
            </p>
            <button
                onClick={handleInstallClick}
                className="btn-primary"
                style={{
                    background: 'var(--text-main)',
                    color: 'var(--card-bg)',
                    maxWidth: '300px',
                    margin: '0 auto'
                }}
            >
                <Download size={18} />
                Install App
            </button>
        </div>
    );
}
