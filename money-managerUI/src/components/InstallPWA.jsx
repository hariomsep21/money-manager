import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function InstallPWA() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = async () => {
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
        const { outcome } = await promptInstall.userChoice;
        if (outcome === 'accepted') {
            setSupportsPWA(false);
        }
        setPromptInstall(null);
    };

    if (!supportsPWA) {
        return null;
    }

    return (
        <button
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-green-700 transition-colors z-50 cursor-pointer"
            onClick={onClick}
            id="pwa-install-btn"
            aria-label="Install App"
        >
            <Download size={20} />
            <span>Install App</span>
        </button>
    );
}
