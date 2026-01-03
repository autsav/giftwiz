import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export interface GiftEvent {
    id: string;
    title: string;
    startDate: string | Date;
    type: 'birthday' | 'anniversary' | 'holiday' | 'other';
}

export async function requestCalendarPermissions() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
        const { status: reminderStatus } = await Calendar.requestRemindersPermissionsAsync();
        return status === 'granted' && (Platform.OS === 'ios' ? reminderStatus === 'granted' : true);
    }
    return false;
}

export async function getUpcomingGiftEvents(): Promise<GiftEvent[]> {
    try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const calendarIds = calendars.map(c => c.id);

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30); // Next 30 days

        const events = await Calendar.getEventsAsync(calendarIds, startDate, endDate);

        return events.map(event => {
            let type: GiftEvent['type'] = 'other';
            const title = event.title.toLowerCase();

            if (title.includes('birthday') || title.includes('bday')) type = 'birthday';
            else if (title.includes('anniversary')) type = 'anniversary';
            else if (title.includes('wedding')) type = 'anniversary';
            else if (title.includes('christmas') || title.includes('hanukkah')) type = 'holiday';

            return {
                id: event.id,
                title: event.title,
                startDate: event.startDate,
                type
            };
        }).filter(e => e.type !== 'other'); // Only return potentially gift-worthy events
    } catch (error) {
        console.error('Calendar error:', error);
        return [];
    }
}
