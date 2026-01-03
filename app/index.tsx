import React from 'react';
import { useWizardStore } from '@/store/useWizardStore';
import LandingScreen from '@/screens/LandingScreen';
import ContextScreen from '@/screens/ContextScreen';
import SwipeScreen from '@/screens/SwipeScreen';
import RevealScreen from '@/screens/RevealScreen';

export default function WizardFlow() {
    const step = useWizardStore((state) => state.step);

    switch (step) {
        case 'landing':
            return <LandingScreen />;
        case 'context':
            return <ContextScreen />;
        case 'swiping':
            return <SwipeScreen />;
        case 'reveal':
            return <RevealScreen />;
        default:
            return <LandingScreen />;
    }
}
