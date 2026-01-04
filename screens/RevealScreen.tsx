import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Share } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ShoppingBag, Star, RefreshCcw, Sparkles, Share2 } from 'lucide-react-native';
import { GiftRepository } from '@/db/repository';
import { AIService } from '@/services/ai.service';
import { SharingUtils } from '@/utils/sharing';

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    reason: string;
    link: string;
    rating: number;
    reviews: number;
}

export default function RevealScreen() {
    const { recipient, swipes, currentProfileId, reset } = useWizardStore();
    const [loading, setLoading] = useState(true);
    const [recs, setRecs] = useState<Product[]>([]);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const loadRealRecommendations = async () => {
        try {
            console.log('Starting AI recommendation flow for:', recipient.relation);
            // 1. Generate ideas via LLM
            const ideas = await AIService.generateGiftIdeas(recipient, swipes);
            console.log('AI generated ideas:', ideas);

            if (!ideas || ideas.length === 0) {
                console.warn('AI returned no ideas. Check OpenRouter key/logic.');
            }

            // 2. Fetch real products via SerpApi
            const results: Product[] = [];
            for (let i = 0; i < ideas.length; i++) {
                const idea = ideas[i];
                console.log('Searching for product:', idea.query);
                const product = await AIService.searchProducts(idea.query);
                if (product) {
                    console.log('Found product:', product.title);
                    results.push({
                        id: String(i),
                        title: product.title,
                        price: product.price,
                        image: product.thumbnail || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
                        reason: idea.reason,
                        link: product.link,
                        rating: product.rating,
                        reviews: product.reviews
                    });
                }
            }
            console.log('Final results to display:', results.length);
            setRecs(results);
            setLoading(false);

            // 3. Save to Local DB
            const profileId = currentProfileId;
            for (const rec of results) {
                await GiftRepository.saveRecommendation({
                    profile_id: profileId || 'default_tester_profile',
                    product_title: rec.title,
                    product_image_url: rec.image,
                    price: rec.price,
                    purchase_link: rec.link,
                    is_saved: 0,
                    status: 'suggested'
                });
            }
        } catch (err) {
            console.error('AI Flow Error in RevealScreen:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRealRecommendations();
    }, []);

    const handleShare = async () => {
        await SharingUtils.shareGiftList(recipient.relation, recs);
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <View style={styles.magicIcon}>
                    <Sparkles size={48} color={colors.primary} />
                </View>
                <ThemedText style={styles.loadingTitle}>Curating your gifts...</ThemedText>
                <ThemedText style={styles.loadingSubtitle}>AI is searching for the perfect matches for your {recipient.relation}...</ThemedText>
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <View>
                            <ThemedText type="title" style={styles.title}>The Reveal</ThemedText>
                            <ThemedText style={styles.subtitle}>Curated for your {recipient.relation}</ThemedText>
                        </View>
                        <TouchableOpacity
                            style={[styles.shareBtn, { backgroundColor: colors.primary + '15' }]}
                            onPress={handleShare}
                        >
                            <Share2 size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {recs.map((rec) => (
                    <View key={rec.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                        <Image
                            source={{ uri: rec.image }}
                            style={styles.image}
                            contentFit="contain"
                            transition={1000}
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.priceRow}>
                                <ThemedText style={styles.price}>{rec.price}</ThemedText>
                                <View style={styles.rating}>
                                    <Star size={14} color={colors.accent} fill={colors.accent} />
                                    <ThemedText style={styles.ratingText}>{rec.rating}</ThemedText>
                                    <ThemedText style={styles.reviewsText}>({rec.reviews})</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.productTitle} numberOfLines={2}>{rec.title}</ThemedText>
                            <ThemedText style={styles.reason}>{rec.reason}</ThemedText>

                            <TouchableOpacity
                                style={[styles.buyButton, { backgroundColor: colors.primary }]}
                                onPress={() => rec.link ? Linking.openURL(rec.link) : null}
                                activeOpacity={0.8}
                            >
                                <ShoppingBag size={18} color="#FFF" />
                                <ThemedText style={styles.buyButtonText}>Buy Now via Amazon</ThemedText>
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    shareBtn: {
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
        lineHeight: 44,
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
    reviewsText: {
        fontSize: 12,
        opacity: 0.5,
        marginLeft: 2,
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
