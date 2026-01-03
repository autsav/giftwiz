import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface CardProps {
    id: string;
    label: string;
    onSwipe: (id: string, direction: 'left' | 'right') => void;
    index: number;
}

export const SwipeCard = ({ id, label, onSwipe, index }: CardProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? 'right' : 'left';
                translateX.value = withSpring(
                    direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
                    { damping: 20, stiffness: 90 }
                );
                runOnJS(onSwipe)(id, direction);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-15, 0, 15],
            Extrapolate.CLAMP
        );

        const scale = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [0.95, 1, 0.95],
            Extrapolate.CLAMP
        );

        return {
            zIndex: 100 - index,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` },
                { scale },
            ],
        };
    });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.muted + '20',
                },
                animatedStyle
            ]}>
                <ThemedText style={styles.label}>{label}</ThemedText>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: SCREEN_WIDTH - 48,
        height: 400,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        padding: 24,
    },
    label: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
    },
});
