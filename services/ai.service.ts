import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const SERPAPI_API_KEY = process.env.EXPO_PUBLIC_SERPAPI_API_KEY;

console.log('OpenAI Key present:', !!OPENAI_API_KEY, OPENAI_API_KEY ? `(starts with ${OPENAI_API_KEY.slice(0, 8)})` : '');

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        'HTTP-Referer': 'https://giftwiz.ai', // Optional for OpenRouter
        'X-Title': 'GiftWiz',
    }
});

export interface AISuggestion {
    title: string;
    query: string;
    reason: string;
}

export class AIService {
    /**
     * Generates specific gift search queries based on recipient and preferences
     */
    static async generateGiftIdeas(recipient: any, swipes: Record<string, number>): Promise<AISuggestion[]> {
        if (!OPENAI_API_KEY) {
            console.warn('OpenAI API Key missing, using mock ideas');
            return [
                { title: 'Instant Camera', query: 'Fujifilm Instax Mini 12', reason: 'Great for capturing memories' },
                { title: 'Smart Frame', query: 'Aura Carver Digital Frame', reason: 'Perfect for sharing photos' },
                { title: 'Wellness Kit', query: 'Self care gift basket', reason: 'Relaxing and thoughtful' }
            ];
        }

        const likes = Object.entries(swipes)
            .filter(([_, val]) => val === 1)
            .map(([id]) => id);

        const prompt = `
      Suggest 3 specific gift ideas for a ${recipient.age} year old ${recipient.relation} for a ${recipient.occasion}.
      The user expressed interest in: ${likes.join(', ')}.
      Return a JSON object with a "suggestions" key containing an array of 3 objects. 
      Each object must have "title", "query" (a specific 3-5 word product search term), and "reason".
    `;

        try {
            console.log('Sending request to OpenRouter with model: openai/gpt-4o-mini');
            const response = await openai.chat.completions.create({
                model: 'openai/gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
            });

            let content = response.choices[0].message.content;
            console.log('Raw AI Response:', content);

            if (!content) return [];

            // Clean markdown code blocks if present
            content = content.replace(/^```json\s*|```$/g, '').trim();

            const data = JSON.parse(content);

            // Handle case where AI wraps it in a 'suggestions' or 'gifts' key, or returns the array directly
            if (Array.isArray(data)) return data;
            if (data.suggestions && Array.isArray(data.suggestions)) return data.suggestions;
            if (data.gifts && Array.isArray(data.gifts)) return data.gifts;
            if (data.ideas && Array.isArray(data.ideas)) return data.ideas;

            // If it's an object but not an array, maybe it's just one idea or we can't find the array
            console.warn('AI JSON format unexpected:', data);
            return [];
        } catch (err) {
            console.error('OpenAI Error:', err);
            return [];
        }
    }

    /**
     * Fetches real product data from Google Shopping via SerpApi
     */
    static async searchProducts(query: string) {
        if (!SERPAPI_API_KEY) {
            // Return mock data if no key
            return {
                title: query,
                price: '$XX.XX',
                thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400',
                link: `https://www.google.com/search?q=${encodeURIComponent(query)}`
            };
        }

        try {
            const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`;
            const response = await fetch(url);
            const results = await response.json();

            const topResult = results.shopping_results?.[0];
            return {
                title: topResult?.title || query,
                price: topResult?.price || 'N/A',
                thumbnail: topResult?.thumbnail || '',
                link: topResult?.link || `https://www.google.com/search?q=${encodeURIComponent(query)}`
            };
        } catch (err) {
            console.error('SerpApi Error:', err);
            return null;
        }
    }
}
