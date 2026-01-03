import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { SwipeCard } from '@/components/SwipeCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { X, Heart, Sparkles } from 'lucide-react-native';
import { getSwipeCategories } from '@/utils/wizard-logic';

export default function SwipeScreen() {
    const { recipient, recordSwipe, setStep } = useWizardStore();
    const [initialCount, setInitialCount] = useState(0);
    const [cards, setCards] = useState<{ id: string; label: string }[]>([]);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    useEffect(() => {
        const dynamicCategories = getSwipeCategories(recipient.relation);
        const formattedCards = [...dynamicCategories].reverse();
        setCards(formattedCards);
        setInitialCount(dynamicCategories.length);
    }, [recipient.relation]);

    const handleSwipe = (id: string, direction: 'left' | 'right') => {
        recordSwipe(id, direction);
        setCards((prev) => prev.filter((c) => c.id !== id));
    };

    useEffect(() => {
        if (initialCount > 0 && cards.length === 0) {
            setTimeout(() => {
                setStep('reveal');
            }, 800);
        }
    }, [cards, initialCount, setStep]);

    const progress = initialCount > 0 ? ((initialCount - cards.length) / initialCount) * 100 : 0;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { backgroundColor: colors.primary, width: `${progress}%` }]} />
                </View>
                <View style={styles.titleRow}>
                    <Sparkles size={24} color={colors.accent} />
                    <ThemedText style={styles.title}>Gift Wizard</ThemedText>
                </View>
                <ThemedText style={styles.subtitle}>Help us refine recommendations for your {recipient.relation}</ThemedText>
            </View>

            <View style={styles.cardContainer}>
                {cards.length > 0 ? (
                    cards.map((card, index) => (
                        <SwipeCard
                            key={card.id}
                            id={card.id}
                            label={card.label}
                            onSwipe={handleSwipe}
                            index={index}
                        />
                    ))
                ) : (
                    <View style={styles.analyzing}>
                        <ThemedText style={styles.analyzingText}>Analyzing preferences...</ThemedText>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <View style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                    <X size={32} color="#EF4444" />
                </View>
                <View style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                    <Heart size={32} color="#10B981" />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    progressContainer: {
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 2,
        marginBottom: 24,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzing: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzingText: {
        fontSize: 20,
        fontWeight: '600',
        opacity: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        paddingBottom: 60,
    },
    iconButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
});
