import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Step = 'landing' | 'context' | 'swiping' | 'reveal';

interface Recipient {
    relation: string;
    age: string;
    occasion: string;
    budget: [number, number];
}

interface WizardState {
    step: Step;
    recipient: Recipient;
    currentProfileId: string | null;
    swipes: Record<string, number>;
    recommendations: any[];
    setStep: (step: Step) => void;
    setCurrentProfileId: (id: string | null) => void;
    updateRecipient: (updates: Partial<Recipient>) => void;
    recordSwipe: (cardId: string, direction: 'left' | 'right') => void;
    setRecommendations: (recs: any[]) => void;
    reset: () => void;
}

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            step: 'landing',
            recipient: {
                relation: '',
                age: '',
                occasion: '',
                budget: [0, 100],
            },
            currentProfileId: null,
            swipes: {},
            recommendations: [],
            setStep: (step) => set({ step }),
            setCurrentProfileId: (id) => set({ currentProfileId: id }),
            updateRecipient: (updates) => set((state) => ({
                recipient: { ...state.recipient, ...updates }
            })),
            recordSwipe: (cardId, direction) => set((state) => ({
                swipes: { ...state.swipes, [cardId]: direction === 'right' ? 1 : -1 }
            })),
            setRecommendations: (recommendations) => set({ recommendations }),
            reset: () => set({
                step: 'landing',
                recipient: {
                    relation: '',
                    age: '',
                    occasion: '',
                    budget: [0, 100],
                },
                currentProfileId: null,
                swipes: {},
                recommendations: [],
            }),
        }),
        {
            name: 'giftwiz-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
