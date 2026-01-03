import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { Gift, Calendar as CalendarIcon, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { requestCalendarPermissions, getUpcomingGiftEvents, GiftEvent } from '@/services/calendarService';

export default function LandingScreen() {
    const setStep = useWizardStore((state) => state.setStep);
    const updateRecipient = useWizardStore((state) => state.updateRecipient);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [events, setEvents] = useState<GiftEvent[]>([]);

    useEffect(() => {
        async function initCalendar() {
            const hasPermission = await requestCalendarPermissions();
            if (hasPermission) {
                const upcoming = await getUpcomingGiftEvents();
                setEvents(upcoming);
            }
        }
        initCalendar();
    }, []);

    const startWithEvent = (event: GiftEvent) => {
        const relationMatch = event.title.match(/(?:for|with|'s)\s+(\w+)/i);
        updateRecipient({
            occasion: event.type.charAt(0).toUpperCase() + event.type.slice(1),
            relation: relationMatch ? relationMatch[1] : ''
        });
        setStep('context');
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Gift size={48} color={colors.primary} />
                    </View>
                    <ThemedText type="title" style={styles.title}>GiftWiz</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        The AI-powered gift concierge that knows exactly what they'll love.
                    </ThemedText>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={() => setStep('context')}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.buttonText}>Start Finding Gifts</ThemedText>
                    </TouchableOpacity>
                </View>

                {events.length > 0 && (
                    <View style={styles.eventsSection}>
                        <View style={styles.sectionHeader}>
                            <CalendarIcon size={20} color={colors.text} />
                            <ThemedText style={styles.sectionTitle}>Upcoming Occasions</ThemedText>
                        </View>

                        {events.map((event) => (
                            <TouchableOpacity
                                key={event.id}
                                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}
                                onPress={() => startWithEvent(event)}
                            >
                                <View style={styles.eventInfo}>
                                    <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                                    <ThemedText style={styles.eventDate}>
                                        {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </ThemedText>
                                </View>
                                <View style={[styles.eventBadge, { backgroundColor: colors.primary + '15' }]}>
                                    <ThemedText style={[styles.eventBadgeText, { color: colors.primary }]}>Find Gift</ThemedText>
                                    <ChevronRight size={14} color={colors.primary} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 24,
        paddingTop: 80,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconContainer: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 24,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.6,
        maxWidth: 280,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    eventsSection: {
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    eventDate: {
        fontSize: 13,
        opacity: 0.5,
    },
    eventBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    eventBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    }
});
