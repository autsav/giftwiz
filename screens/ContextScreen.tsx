import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWizardStore } from '@/store/useWizardStore';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GiftRepository } from '@/db/repository';

export default function ContextScreen() {
    const { recipient, updateRecipient, setStep } = useWizardStore();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const relations = ['Partner', 'Parent', 'Friend', 'Child', 'Colleague'];
    const occasions = ['Birthday', 'Anniversary', 'Holiday', 'Graduation', 'Just Because'];

    const isReady = recipient.relation && recipient.occasion && recipient.age;

    return (
        <ThemedView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.backButton} onPress={() => setStep('landing')}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <ThemedText type="title" style={styles.title}>Tell us about them</ThemedText>

                <View style={styles.section}>
                    <ThemedText style={styles.label}>Who is it for?</ThemedText>
                    <View style={styles.chipContainer}>
                        {relations.map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[
                                    styles.chip,
                                    recipient.relation === r && { backgroundColor: colors.primary, borderColor: colors.primary }
                                ]}
                                onPress={() => updateRecipient({ relation: r })}
                            >
                                <ThemedText style={[
                                    styles.chipText,
                                    recipient.relation === r && { color: '#FFF' }
                                ]}>{r}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.label}>What's the occasion?</ThemedText>
                    <View style={styles.chipContainer}>
                        {occasions.map((o) => (
                            <TouchableOpacity
                                key={o}
                                style={[
                                    styles.chip,
                                    recipient.occasion === o && { backgroundColor: colors.primary, borderColor: colors.primary }
                                ]}
                                onPress={() => updateRecipient({ occasion: o })}
                            >
                                <ThemedText style={[
                                    styles.chipText,
                                    recipient.occasion === o && { color: '#FFF' }
                                ]}>{o}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.label}>How old are they?</ThemedText>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.muted + '40' }]}
                        placeholder="e.g. 25"
                        placeholderTextColor={colors.muted}
                        value={recipient.age}
                        onChangeText={(text) => updateRecipient({ age: text })}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.section}>
                    <ThemedText style={styles.label}>What's your budget?</ThemedText>
                    <View style={styles.chipContainer}>
                        {[
                            { label: 'Under $25', range: [0, 25] },
                            { label: '$25 - $50', range: [25, 50] },
                            { label: '$50 - $100', range: [50, 100] },
                            { label: '$100 - $250', range: [100, 250] },
                            { label: '$250+', range: [250, 1000] },
                        ].map((b) => (
                            <TouchableOpacity
                                key={b.label}
                                style={[
                                    styles.chip,
                                    recipient.budget[0] === b.range[0] && recipient.budget[1] === b.range[1] &&
                                    { backgroundColor: colors.primary, borderColor: colors.primary }
                                ]}
                                onPress={() => updateRecipient({ budget: b.range as [number, number] })}
                            >
                                <ThemedText style={[
                                    styles.chipText,
                                    recipient.budget[0] === b.range[0] && recipient.budget[1] === b.range[1] &&
                                    { color: '#FFF' }
                                ]}>{b.label}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        { backgroundColor: isReady ? colors.primary : colors.muted + '40' }
                    ]}
                    disabled={!isReady}
                    onPress={async () => {
                        if (!isReady) return;
                        try {
                            const profileId = await GiftRepository.saveProfile({
                                user_id: 'guest_user',
                                name: 'Recent Recipient',
                                relation: recipient.relation,
                                age: recipient.age,
                                occasion: recipient.occasion,
                                budget_min: recipient.budget[0],
                                budget_max: recipient.budget[1],
                            });
                            useWizardStore.getState().setCurrentProfileId(profileId);
                            console.log('Saved to profile table:', profileId);
                            setStep('swiping');
                        } catch (err) {
                            console.error('DB Error:', err);
                            setStep('swiping');
                        }
                    }}
                >
                    <ThemedText style={[styles.nextButtonText, !isReady && { color: colors.muted }]}>Next</ThemedText>
                    <ArrowRight size={20} color={isReady ? "#FFF" : colors.muted} />
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },
    backButton: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        fontWeight: '800',
    },
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        opacity: 0.8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    nextButton: {
        height: 60,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
