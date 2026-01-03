import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export interface GiftEvent {
    id: string;
    title: string;
    startDate: string;
    relation?: string;
}

export class CalendarService {
    static async requestPermissions() {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const { status: remindStatus } = await Calendar.requestRemindersPermissionsAsync();
            return status === 'granted';
        }
        return false;
    }

    static async getUpcomingBirthdays(): Promise<GiftEvent[]> {
        if (Platform.OS === 'web') return [];

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return [];

        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const calendarIds = calendars.map(c => c.id);

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 2); // Look 2 months ahead

        const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);

        // Filter for things that look like birthdays or anniversaries
        return events
            .filter(e =>
                e.title.toLowerCase().includes('birthday') ||
                e.title.toLowerCase().includes('anniversary')
            )
            .map(e => ({
                id: e.id,
                title: e.title,
                startDate: e.startDate,
            }));
    }
}
