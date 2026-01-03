import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Sparkles, Calendar, ArrowRight, Gift } from 'lucide-react-native';
import { CalendarService, GiftEvent } from '@/services/calendar.service';

export default function LandingScreen() {
    const { setStep } = useWizardStore();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [events, setEvents] = useState<GiftEvent[]>([]);

    useEffect(() => {
        const loadEvents = async () => {
            if (Platform.OS !== 'web') {
                const upcoming = await CalendarService.getUpcomingBirthdays();
                setEvents(upcoming);
            }
        };
        loadEvents();
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.hero}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                        <Gift size={40} color={colors.primary} />
                    </View>
                    <ThemedText type="title" style={styles.title}>GiftWiz</ThemedText>
                    <ThemedText style={styles.subtitle}>
                        The AI-powered gift concierge that knows exactly what they'll love.
                    </ThemedText>

                    <TouchableOpacity
                        style={[styles.startButton, { backgroundColor: colors.primary }]}
                        onPress={() => setStep('context')}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.buttonText}>Start Finding Gifts</ThemedText>
                        <ArrowRight size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {events.length > 0 && (
                    <View style={styles.eventSection}>
                        <View style={styles.sectionHeader}>
                            <Calendar size={18} color={colors.primary} />
                            <ThemedText style={styles.sectionTitle}>Upcoming Events</ThemedText>
                        </View>
                        {events.map((event) => (
                            <TouchableOpacity
                                key={event.id}
                                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}
                                onPress={() => setStep('context')}
                            >
                                <View style={styles.eventInfo}>
                                    <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                                    <ThemedText style={styles.eventDate}>
                                        {new Date(event.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                    </ThemedText>
                                </View>
                                <View style={[styles.findBtn, { backgroundColor: colors.primary + '10' }]}>
                                    <Sparkles size={16} color={colors.primary} />
                                    <ThemedText style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>Find Gift</ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>10k+</ThemedText>
                        <ThemedText style={styles.statLabel}>Gifts Found</ThemedText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <ThemedText style={styles.statNumber}>98%</ThemedText>
                        <ThemedText style={styles.statLabel}>Happy Users</ThemedText>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        marginBottom: 12,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        opacity: 0.6,
        paddingHorizontal: 20,
        lineHeight: 28,
        marginBottom: 40,
    },
    startButton: {
        height: 64,
        paddingHorizontal: 32,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    eventSection: {
        marginBottom: 40,
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
        opacity: 0.8,
    },
    eventCard: {
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    eventDate: {
        fontSize: 13,
        opacity: 0.5,
    },
    findBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.05)',
    }
});
