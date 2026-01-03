export interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    reason: string;
    category: string;
}

export const PRODUCT_POOL: Product[] = [
    // Tech
    {
        id: 't1',
        title: 'Fujifilm Instax Mini 12',
        price: '$79.99',
        image: 'https://images.unsplash.com/photo-1526170315873-3a921fab4703?w=400',
        reason: 'Perfect for capturing memories at any occasion.',
        category: 'tech'
    },
    {
        id: 't2',
        title: 'Ember Temperature Control Mug',
        price: '$129.95',
        image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=400',
        reason: 'A premium practical gift for daily use.',
        category: 'tech'
    },
    {
        id: 't3',
        title: 'Noise Cancelling Headphones',
        price: '$249.00',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        reason: 'Ideal for focus and travel.',
        category: 'tech'
    },
    // Outdoors
    {
        id: 'o1',
        title: 'YETI Rambler 20 oz Tumbler',
        price: '$35.00',
        image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=400',
        reason: 'Keeps drinks at the perfect temperature all day.',
        category: 'outdoors'
    },
    {
        id: 'o2',
        title: 'Ultralight Camping Hammock',
        price: '$45.00',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
        reason: 'For the nature lover who enjoys relaxing.',
        category: 'outdoors'
    },
    // Fitness
    {
        id: 'f1',
        title: 'Theragun Mini Massager',
        price: '$179.00',
        image: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=400',
        reason: 'Essential for post-workout recovery.',
        category: 'fitness'
    },
    // Cooking
    {
        id: 'c1',
        title: 'Artisanal Olive Oil Set',
        price: '$55.00',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbadcbaf?w=400',
        reason: 'Upgrade their kitchen with premium flavors.',
        category: 'cooking'
    },
    // Books/Home
    {
        id: 'h1',
        title: 'Aura Carver Smart Frame',
        price: '$149.00',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        reason: 'Combines tech with personal sentiment.',
        category: 'home'
    }
];

export function generateRecommendations(swipes: Record<string, number>, recipient: any): Product[] {
    // Get categories with positive swipes
    const likedCategories = Object.entries(swipes)
        .filter(([_, value]) => value === 1)
        .map(([key]) => key);

    // If no likes, pick random categories
    const categoriesToPick = likedCategories.length > 0 ? likedCategories : ['tech', 'home'];

    // Filter pool
    let filtered = PRODUCT_POOL.filter(p => categoriesToPick.includes(p.category));

    // If we don't have enough, add some more
    if (filtered.length < 3) {
        const remaining = PRODUCT_POOL.filter(p => !filtered.includes(p));
        filtered = [...filtered, ...remaining.slice(0, 3 - filtered.length)];
    }

    // Shuffle and pick 3
    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
}
