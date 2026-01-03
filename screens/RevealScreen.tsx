import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ShoppingBag, Star, RefreshCcw, Sparkles, Share2 } from 'lucide-react-native';
import { GiftRepository } from '@/db/repository';
import { generateRecommendations, Product } from '@/utils/recommendations';
import { fetchRealRecommendations } from '@/services/giftEngine';
import { shareGiftCollection } from '@/utils/sharing';

const MOCK_RECS = [
    {
        id: '1',
        title: 'Fujifilm Instax Mini 12',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1526170315873-3a921fab4703?w=400',
        reason: 'Perfect for capturing memories at any occasion.',
    },
    {
        id: '2',
        title: 'Aura Carver Smart Frame',
        price: '$149.00',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        reason: 'Combines tech with personal sentiment beautifully.',
    },
    {
        id: '3',
        title: 'Ember Temperature Control Mug',
        price: '$129.95',
        image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400',
        reason: 'A premium practical gift for daily use.',
    }
];

export default function RevealScreen() {
    const { recipient, swipes, currentProfileId, reset } = useWizardStore();
    const [loading, setLoading] = useState(true);
    const [recs, setRecs] = useState<Product[]>([]);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleOpenLink = async (title: string) => {
        const url = 'https://www.google.com/search?q=' + encodeURIComponent(title);
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.warn("Don't know how to open URI: " + url);
                // Fallback for some environments: just try opening regardless or log
                await Linking.openURL(url);
            }
        } catch (err) {
            console.error('Error opening link:', err);
        }
    };

    useEffect(() => {
        const loadGifts = async () => {
            let dynamicRecs: Product[] = [];

            try {
                // Try fetching real AI results if keys exist
                if (process.env.EXPO_PUBLIC_OPENAI_API_KEY && process.env.EXPO_PUBLIC_SERPAPI_API_KEY) {
                    dynamicRecs = await fetchRealRecommendations(recipient, swipes);
                } else {
                    console.log('Skipping AI: Missing API keys');
                    dynamicRecs = generateRecommendations(swipes, recipient);
                }
            } catch (err) {
                console.error('AI Fetch failed, falling back to mock:', err);
                dynamicRecs = generateRecommendations(swipes, recipient);
            }

            setRecs(dynamicRecs);

            // Save recommendations to local DB
            try {
                const profileId = currentProfileId;
                for (const rec of dynamicRecs) {
                    await GiftRepository.saveRecommendation({
                        profile_id: profileId || 'default_tester_profile',
                        product_title: rec.title,
                        product_image_url: rec.image,
                        price: rec.price,
                        purchase_link: 'https://google.com?q=' + encodeURIComponent(rec.title),
                        is_saved: 0,
                    });
                }
                setLoading(false);
                console.log('Saved dynamic recommendations to local sqlite');
            } catch (err) {
                console.error('Local DB save error:', err);
                setLoading(false);
            }
        };

        loadGifts();
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <View style={styles.magicIcon}>
                    <Sparkles size={48} color={colors.primary} />
                </View>
                <ThemedText style={styles.loadingTitle}>Wizard is working...</ThemedText>
                <ThemedText style={styles.loadingSubtitle}>Finding the perfect gifts for your {recipient.relation}...</ThemedText>
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                    <View>
                        <ThemedText type="title" style={styles.title}>The Reveal</ThemedText>
                        <ThemedText style={styles.subtitle}>Gift ideas for your {recipient.relation}</ThemedText>
                    </View>
                    <TouchableOpacity
                        style={[styles.shareButton, { backgroundColor: colors.primary + '15' }]}
                        onPress={() => shareGiftCollection(currentProfileId || 'default', recipient.relation)}
                    >
                        <Share2 size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {recs.map((rec) => (
                    <View key={rec.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                        <Image source={{ uri: rec.image }} style={styles.image} />
                        <View style={styles.cardContent}>
                            <View style={styles.priceRow}>
                                <ThemedText style={styles.price}>{rec.price}</ThemedText>
                                <View style={styles.rating}>
                                    <Star size={14} color={colors.accent} fill={colors.accent} />
                                    <ThemedText style={styles.ratingText}>4.8</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.productTitle}>{rec.title}</ThemedText>
                            <ThemedText style={styles.reason}>{rec.reason}</ThemedText>

                            <TouchableOpacity
                                style={[styles.buyButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleOpenLink(rec.title)}
                                activeOpacity={0.8}
                            >
                                <ShoppingBag size={18} color="#FFF" />
                                <ThemedText style={styles.buyButtonText}>Buy Now</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.resetButton} onPress={reset}>
                    <RefreshCcw size={18} color={colors.primary} />
                    <ThemedText style={[styles.resetButtonText, { color: colors.primary }]}>Start Over</ThemedText>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
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
        paddingTop: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    magicIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    loadingTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
    },
    loadingSubtitle: {
        fontSize: 16,
        opacity: 0.6,
        textAlign: 'center',
        maxWidth: 250,
        lineHeight: 24,
    },
    header: {
        marginBottom: 32,
    },
    shareButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        opacity: 0.6,
    },
    card: {
        borderRadius: 28,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 220,
        backgroundColor: '#F1F5F9',
    },
    cardContent: {
        padding: 24,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#D97706',
    },
    productTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    reason: {
        fontSize: 15,
        opacity: 0.7,
        lineHeight: 22,
        marginBottom: 24,
    },
    buyButton: {
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    resetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 24,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '700',
    }
});
