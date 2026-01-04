import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Camera, Sparkles, TrendingUp, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface TrendingItem {
    id: string;
    title: string;
    image: string;
    price: string;
    rating: number;
    tags: string[];
    link: string;
}

const CATEGORIES = [
    { title: 'Techies', icon: '💻', color: '#6366F1' },
    { title: 'Foodies', icon: '🍳', color: '#F59E0B' },
    { title: 'Decor', icon: '🪴', color: '#10B981' },
    { title: 'Wellness', icon: '🧘', color: '#EC4899' },
];

const TRENDING: TrendingItem[] = [
    {
        id: '1',
        title: 'Smart Coffee Warmer',
        image: 'https://images.unsplash.com/photo-1544333346-601267605d3c?w=400',
        price: '$29.99',
        rating: 4.8,
        tags: ['Office', 'Practical'],
        link: 'https://www.amazon.com/s?k=smart+coffee+warmer&tag=giftwiz-20'
    },
    {
        id: '2',
        title: 'Portable Photo Printer',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
        price: '$89.00',
        rating: 4.7,
        tags: ['Photography', 'Tech'],
        link: 'https://www.amazon.com/s?k=portable+photo+printer&tag=giftwiz-20'
    },
    {
        id: '3',
        title: 'Weighted Sleep Mask',
        image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=400',
        price: '$34.50',
        rating: 4.9,
        tags: ['Wellness', 'Cozy'],
        link: 'https://www.amazon.com/s?k=weighted+sleep+mask&tag=giftwiz-20'
    },
    {
        id: '4',
        title: 'AeroPress Coffee Maker',
        image: 'https://images.unsplash.com/photo-1520173043194-dc3983d93ee5?w=400',
        price: '$39.95',
        rating: 4.9,
        tags: ['Coffee', 'Outdoor'],
        link: 'https://www.amazon.com/s?k=aeropress&tag=giftwiz-20'
    }
];

export default function DiscoveryScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const handleOpenLink = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error('Error opening link:', err);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Discovery</ThemedText>
                    <ThemedText style={styles.subtitle}>Find what's trending in the gift world</ThemedText>
                </View>

                {/* Multi-Modal AI Hook (UI Only) */}
                <TouchableOpacity style={[styles.visualSearchBtn, { backgroundColor: colors.primary }]}>
                    <Camera size={24} color="#FFF" />
                    <ThemedText style={styles.visualSearchText}>Visual Search (AI Photo)</ThemedText>
                    <View style={styles.aiBadge}>
                        <ThemedText style={styles.aiBadgeText}>NEW</ThemedText>
                    </View>
                </TouchableOpacity>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={20} color={colors.primary} />
                        <ThemedText style={styles.sectionTitle}>Trending Categories</ThemedText>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity key={cat.title} style={[styles.catCard, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}>
                                <ThemedText style={styles.catIcon}>{cat.icon}</ThemedText>
                                <ThemedText style={styles.catTitle}>{cat.title}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Sparkles size={20} color={colors.primary} />
                        <ThemedText style={styles.sectionTitle}>Gifts Everyone Loves</ThemedText>
                    </View>
                    <View style={styles.grid}>
                        {TRENDING.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.muted + '20' }]}
                                onPress={() => handleOpenLink(item.link)}
                            >
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <View style={styles.tagRow}>
                                        <ThemedText style={styles.itemTag}>{item.tags[0]}</ThemedText>
                                    </View>
                                    <ThemedText style={styles.itemTitle} numberOfLines={1}>{item.title}</ThemedText>
                                    <View style={styles.priceRow}>
                                        <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
                                        <ThemedText style={styles.itemRating}>⭐ {item.rating}</ThemedText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[styles.discoveryTip, { backgroundColor: colors.primary + '10' }]}>
                    <Info size={20} color={colors.primary} />
                    <ThemedText style={[styles.tipText, { color: colors.primary }]}>
                        Tip: Swipe right on gifts you love in the Wizard to help us personalize these trends!
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
    },
    scroll: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 40,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
    },
    visualSearchBtn: {
        marginHorizontal: 24,
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    visualSearchText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    aiBadge: {
        backgroundColor: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    aiBadgeText: {
        color: '#6366F1',
        fontSize: 10,
        fontWeight: '900',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    catScroll: {
        paddingLeft: 24,
    },
    catCard: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 20,
        marginRight: 12,
        alignItems: 'center',
        borderWidth: 1,
        minWidth: 100,
    },
    catIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    catTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 18,
    },
    gridItem: {
        width: (width - 60) / 2,
        margin: 6,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#F1F5F9',
    },
    itemInfo: {
        padding: 12,
    },
    tagRow: {
        marginBottom: 4,
    },
    itemTag: {
        fontSize: 10,
        fontWeight: '700',
        opacity: 0.5,
        textTransform: 'uppercase',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '800',
    },
    itemRating: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    discoveryTip: {
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    }
});
