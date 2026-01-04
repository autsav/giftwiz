import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationService = {
    async requestPermissions() {
        if (Platform.OS === 'web' || !Device.isDevice) return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return true;
    },

    async scheduleOccasionReminder(title: string, date: Date) {
        if (Platform.OS === 'web') return;

        // Schedule 7 days before
        const reminderDate = new Date(date);
        reminderDate.setDate(reminderDate.getDate() - 7);
        reminderDate.setHours(9, 0, 0, 0); // 9 AM

        if (reminderDate < new Date()) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `🎁 Gift Reminder for ${title}`,
                body: `An upcoming occasion is just a week away! Let's find the perfect gift.`,
                data: { occasion: title },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: reminderDate,
            },
        });

        console.log(`Scheduled reminder for ${title} on ${reminderDate.toLocaleDateString()}`);
    }
};
