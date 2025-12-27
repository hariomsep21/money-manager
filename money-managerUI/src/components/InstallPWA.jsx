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
       <></>
    );
}
