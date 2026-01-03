import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

export async function shareGiftCollection(profileId: string, relation: string) {
    const publicUrl = `https://giftwiz.ai/share/${profileId}`;

    if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(publicUrl);
        alert('Public link copied to clipboard!');
        return;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
        await Sharing.shareAsync(publicUrl, {
            dialogTitle: `Check out these gifts for my ${relation}!`,
            UTI: 'public.plain-text'
        });
    } else {
        await Clipboard.setStringAsync(publicUrl);
        Alert.alert('Link Copied', 'Public sharing is not available on this device, so we copied the link to your clipboard.');
    }
}
