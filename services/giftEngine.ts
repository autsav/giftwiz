import OpenAI from 'openai';
import { getJson } from 'serpapi';
import { Product } from '@/utils/recommendations';

// Initialize with placeholders - keys should be in .env
const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // For dev/mobile testing
});

export async function fetchRealRecommendations(recipient: any, swipes: Record<string, number>): Promise<Product[]> {
    try {
        // 1. Generate Search Queries using GPT
        const likedFeatures = Object.keys(swipes).filter(k => swipes[k] === 1).join(', ');
        const prompt = `
      Suggest 3 specific gift search queries for a ${recipient.relation} (Age: ${recipient.age}) for the occasion of ${recipient.occasion}.
      The user liked these categories: ${likedFeatures}.
      Keep queries concise and optimized for Google Shopping.
      Return ONLY the 3 queries separated by newlines.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });

        const queries = completion.choices[0].message?.content?.split('\n').filter(q => q.trim()) || [];

        // 2. Fetch results from SerpApi
        const recommendations: Product[] = [];

        for (const query of queries.slice(0, 3)) {
            try {
                const results = await getJson({
                    engine: "google_shopping",
                    q: query,
                    api_key: process.env.EXPO_PUBLIC_SERPAPI_API_KEY || '',
                });

                const topItem = results.shopping_results?.[0];
                if (topItem) {
                    recommendations.push({
                        id: topItem.product_id || Math.random().toString(),
                        title: topItem.title,
                        price: topItem.price,
                        image: topItem.thumbnail,
                        reason: `Great fit for someone who loves ${likedFeatures}.`,
                        category: 'dynamic'
                    });
                }
            } catch (err) {
                console.error(`SerpApi error for query "${query}":`, err);
            }
        }

        // Fallback if APIs fail or return no results
        if (recommendations.length === 0) {
            throw new Error('No recommendations found');
        }

        return recommendations;
    } catch (error) {
        console.error('GiftEngine error:', error);
        throw error;
    }
}
