import { getDB } from './database';
import * as Crypto from 'expo-crypto';

export interface RecipientProfile {
    id: string;
    user_id: string;
    name: string;
    relation: string;
    age: string;
    occasion: string;
    budget_min: number;
    budget_max: number;
    created_at?: string;
}

export interface Recommendation {
    id: string;
    profile_id: string;
    product_title: string;
    product_image_url: string;
    price: string;
    purchase_link: string;
    is_saved: number;
    created_at?: string;
}

export const GiftRepository = {
    async saveProfile(profile: Omit<RecipientProfile, 'id'>) {
        const db = await getDB();
        const id = Crypto.randomUUID();
        await db.runAsync(
            'INSERT INTO recipient_profiles (id, user_id, name, relation, age, occasion, budget_min, budget_max) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, profile.user_id, profile.name, profile.relation, profile.age, profile.occasion, profile.budget_min, profile.budget_max]
        );
        return id;
    },

    async getProfiles(userId: string) {
        const db = await getDB();
        return await db.getAllAsync<RecipientProfile>(
            'SELECT * FROM recipient_profiles WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
    },

    async saveRecommendation(rec: Omit<Recommendation, 'id'>) {
        const db = await getDB();
        const id = Crypto.randomUUID();
        await db.runAsync(
            'INSERT INTO recommendations (id, profile_id, product_title, product_image_url, price, purchase_link, is_saved) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, rec.profile_id, rec.product_title, rec.product_image_url, rec.price, rec.purchase_link, rec.is_saved]
        );
        return id;
    },

    async getRecommendations(profileId: string) {
        const db = await getDB();
        return await db.getAllAsync<Recommendation>(
            'SELECT * FROM recommendations WHERE profile_id = ?',
            [profileId]
        );
    },

    async toggleSaveRecommendation(id: string, isSaved: boolean) {
        const db = await getDB();
        await db.runAsync(
            'UPDATE recommendations SET is_saved = ? WHERE id = ?',
            [isSaved ? 1 : 0, id]
        );
    },

    async saveSwipeSession(profileId: string, preferences: any, rejectedTags: any) {
        const db = await getDB();
        const id = Crypto.randomUUID();
        await db.runAsync(
            'INSERT INTO swipe_sessions (id, profile_id, preferences, rejected_tags) VALUES (?, ?, ?, ?)',
            [id, profileId, JSON.stringify(preferences), JSON.stringify(rejectedTags)]
        );
        return id;
    }
};
