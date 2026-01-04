import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GiftRepository, RecipientProfile } from '@/db/repository';
import { BookMarked, User, Calendar, ChevronRight } from 'lucide-react-native';
import CollectionDetailScreen from './CollectionDetailScreen';

export default function SavedGiftsScreen() {
    const [profiles, setProfiles] = useState<RecipientProfile[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<RecipientProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const loadData = async () => {
        try {
            const data = await GiftRepository.getProfiles('guest_user');
            setProfiles(data);
        } catch (err) {
            console.error('Failed to load profiles', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const filteredProfiles = profiles.filter(p => {
        // Simple logic: older than 30 days or explicitly marked could go to history
        // For now, let's just show all in 'Active' and none in 'History' unless we implement a 'Archive' feature
        if (activeTab === 'active') return true;
        return false;
    });

    if (selectedProfile) {
        return (
            <CollectionDetailScreen
                profileId={selectedProfile.id}
                relation={selectedProfile.relation}
                onBack={() => {
                    setSelectedProfile(null);
                    loadData(); // Refresh list when coming back
                }}
            />
        );
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title" style={styles.title}>My Collections</ThemedText>
                <ThemedText style={styles.subtitle}>People you're finding gifts for</ThemedText>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && { borderBottomColor: colors.primary }]}
                    onPress={() => setActiveTab('active')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'active' && { color: colors.primary }]}>Active</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'history' && { borderBottomColor: colors.primary }]}
                    onPress={() => setActiveTab('history')}
                >
                    <ThemedText style={[styles.tabText, activeTab === 'history' && { color: colors.primary }]}>Gift History</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {filteredProfiles.length === 0 ? (
                    <View style={styles.empty}>
                        <BookMarked size={64} color={colors.muted} />
                        <ThemedText style={styles.emptyText}>
                            {activeTab === 'active' ? 'No lists saved yet.' : 'No gift history yet.'}
                        </ThemedText>
                        <ThemedText style={styles.emptySubtext}>
                            {activeTab === 'active' ? 'Complete a gift search to see it here.' : 'Mark a gift as purchased to see it in your history.'}
                        </ThemedText>
                    </View>
                ) : (
                    filteredProfiles.map((profile) => (
                        <TouchableOpacity
                            key={profile.id}
                            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}
                            onPress={() => setSelectedProfile(profile)}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                                    <User size={24} color={colors.primary} />
                                </View>
                                <View style={styles.cardTitleContent}>
                                    <ThemedText style={styles.cardTitle}>{profile.relation}</ThemedText>
                                    <ThemedText style={styles.cardSubtitle}>{profile.occasion}</ThemedText>
                                </View>
                                <ChevronRight size={20} color={colors.muted} />
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.meta}>
                                    <Calendar size={14} color={colors.muted} />
                                    <ThemedText style={styles.metaText}>
                                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </ThemedText>
                                </View>
                                <View style={styles.badge}>
                                    <ThemedText style={[styles.badgeText, { color: colors.primary }]}>View Gifts</ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    tab: {
        paddingVertical: 12,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.5,
    },
    scroll: {
        padding: 24,
        paddingTop: 0,
    },
    empty: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        gap: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        opacity: 0.8,
    },
    emptySubtext: {
        fontSize: 16,
        opacity: 0.5,
        textAlign: 'center',
        maxWidth: 200,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardTitleContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardSubtitle: {
        fontSize: 14,
        opacity: 0.5,
        marginTop: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 16,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        opacity: 0.5,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
});
