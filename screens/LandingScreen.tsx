import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { Gift } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LandingScreen() {
    const setStep = useWizardStore((state) => state.setStep);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Gift size={64} color={colors.primary} />
                </View>
                <ThemedText type="title" style={styles.title}>GiftWiz</ThemedText>
                <ThemedText style={styles.subtitle}>
                    The AI-powered gift concierge that knows exactly what they'll love.
                </ThemedText>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => setStep('context')}
                    activeOpacity={0.8}
                >
                    <ThemedText style={styles.buttonText}>Start Finding Gifts</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        padding: 20,
        borderRadius: 32,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    title: {
        fontSize: 48,
        lineHeight: 56,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 48,
        opacity: 0.7,
        maxWidth: 300,
    },
    button: {
        width: '100%',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
