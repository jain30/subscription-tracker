import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export type AnimatedSectionProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Soft fade + upward settle for Insights sections. Honors Reduce Motion.
 */
export function AnimatedSection({
  children,
  delay = 0,
  style,
}: AnimatedSectionProps) {
  const { theme, reduceMotion } = useTheme();
  const [opacity] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));
  const [translateY] = useState(
    () => new Animated.Value(reduceMotion ? 0 : theme.motion.enter.translateY),
  );

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: theme.motion.duration.enter,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: theme.motion.duration.enter,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [
    delay,
    opacity,
    reduceMotion,
    theme.motion.duration.enter,
    theme.motion.enter.translateY,
    translateY,
  ]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
