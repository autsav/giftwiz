export interface SwipeCategory {
    id: string;
    label: string;
    description: string;
}

export const CATEGORIES_BY_RELATION: Record<string, SwipeCategory[]> = {
    'Partner': [
        { id: 'romantic', label: 'Romantic Experiences', description: 'Surprise dates or getaways' },
        { id: 'jewelry', label: 'Personalized Jewelry', description: 'Watches, necklaces, engraved items' },
        { id: 'tech', label: 'Latest Tech', description: 'Gadgets and productivity tools' },
        { id: 'wellness', label: 'Wellness & Relaxation', description: 'Spa days or self-care kits' }
    ],
    'Child': [
        { id: 'educational', label: 'STEM & Learning', description: 'Robotics, science kits, books' },
        { id: 'creative', label: 'Arts & Crafts', description: 'Drawing sets, musical instruments' },
        { id: 'active', label: 'Outdoor Action', description: 'Bikes, scooters, sports gear' },
        { id: 'toys', label: 'Fun & Play', description: 'Building blocks, dolls, puzzles' }
    ],
    'Parent': [
        { id: 'home', label: 'Personalized Home', description: 'Frames, kitchenware, custom decor' },
        { id: 'comfort', label: 'Cozy Comfort', description: 'Blankets, loungewear, high-end tea' },
        { id: 'books', label: 'Books & Culture', description: 'Bestsellers, magazines, hobby books' },
        { id: 'garden', label: 'Garden & Nature', description: 'Planting kits, outdoor decor' }
    ],
    'Friend': [
        { id: 'social', label: 'Social Games', description: 'Board games, party activities' },
        { id: 'style', label: 'Self Style', description: 'Accessories, trendy decor' },
        { id: 'foodie', label: 'Gourmet Treats', description: 'Coffee sets, snack boxes' },
        { id: 'tech', label: 'Tech Gadgets', description: 'Cool peripherals and novelties' }
    ]
};

export const DEFAULT_CATEGORIES: SwipeCategory[] = [
    { id: 'practical', label: 'Practical Items', description: 'Daily utility and essentials' },
    { id: 'whimsical', label: 'Whimsical & Fun', description: 'Funny gifts and novelties' },
    { id: 'experience', label: 'Experiences', description: 'Events, classes, or tickets' },
];

export function getSwipeCategories(relation: string): SwipeCategory[] {
    return CATEGORIES_BY_RELATION[relation] || DEFAULT_CATEGORIES;
}
