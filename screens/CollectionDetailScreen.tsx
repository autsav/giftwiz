import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GiftRepository, Recommendation } from '@/db/repository';
import { ShoppingBag, Star, ArrowLeft } from 'lucide-react-native';

interface Props {
    profileId: string;
    relation: string;
    onBack: () => void;
}

export default function CollectionDetailScreen({ profileId, relation, onBack }: Props) {
    const [recs, setRecs] = useState<Recommendation[]>([]);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    useEffect(() => {
        const loadRecs = async () => {
            const data = await GiftRepository.getRecommendations(profileId);
            setRecs(data);
        };
        loadRecs();
    }, [profileId]);

    const handleOpenLink = async (title: string) => {
        const url = 'https://www.google.com/search?q=' + encodeURIComponent(title);
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error('Error opening link:', err);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>{relation}'s Gifts</ThemedText>
                    <ThemedText style={styles.subtitle}>Curated specially for them</ThemedText>
                </View>

                {recs.map((rec) => (
                    <View key={rec.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                        <Image source={{ uri: rec.product_image_url }} style={styles.image} />
                        <View style={styles.cardContent}>
                            <View style={styles.priceRow}>
                                <ThemedText style={styles.price}>{rec.price}</ThemedText>
                                <View style={styles.rating}>
                                    <Star size={14} color={colors.accent} fill={colors.accent} />
                                    <ThemedText style={styles.ratingText}>4.8</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.productTitle}>{rec.product_title}</ThemedText>

                            <TouchableOpacity
                                style={[styles.buyButton, { backgroundColor: colors.primary }]}
                                onPress={() => handleOpenLink(rec.product_title)}
                                activeOpacity={0.8}
                            >
                                <ShoppingBag size={18} color="#FFF" />
                                <ThemedText style={styles.buyButtonText}>Get it now</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {recs.length === 0 && (
                    <ThemedText style={styles.noData}>No gift recommendations found.</ThemedText>
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
        paddingTop: 60,
    },
    backButton: {
        marginBottom: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    card: {
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: 200,
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
        fontSize: 22,
        fontWeight: '800',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
    },
    productTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    buyButton: {
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    noData: {
        textAlign: 'center',
        marginTop: 40,
        opacity: 0.5,
    }
});
