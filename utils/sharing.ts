import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { Platform, Alert } from 'react-native';

export class SharingUtils {
    static async shareGiftList(relation: string, products: any[]) {
        const message = `Check out these gift ideas for my ${relation}!\n\n` +
            products.map(p => `- ${p.title}: ${p.price}`).join('\n');

        if (Platform.OS === 'web') {
            await Clipboard.setStringAsync(message);
            alert('Gift list copied to clipboard!');
            return;
        }

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            // In a real app, we might generate an image or a PDF, 
            // but for now we'll share text or copy to clipboard
            await Clipboard.setStringAsync(message);
            Alert.alert('Copied', 'Gift list copied to clipboard. You can now paste it anywhere!');
        } else {
            await Clipboard.setStringAsync(message);
        }
    }

    static async copyToClipboard(text: string) {
        await Clipboard.setStringAsync(text);
        if (Platform.OS !== 'web') {
            Alert.alert('Copied!', 'Link copied to clipboard.');
        }
    }
}
