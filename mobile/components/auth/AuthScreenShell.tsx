import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { AppHeader, ScreenContainer } from '@/components/ui';
import { useTheme } from '@/theme';

export type AuthScreenShellProps = {
  children: ReactNode;
  /** Optional stack title with back */
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  /** Soft brand wash behind content */
  brandWash?: boolean;
  scroll?: boolean;
  /** Extra bottom padding for sticky CTAs */
  contentBottomPad?: boolean;
  scrollRef?: React.RefObject<ScrollView | null>;
};

/**
 * Shared shell for welcome / login / register / password screens.
 */
export function AuthScreenShell({
  children,
  title,
  showBack = false,
  onBack,
  brandWash = true,
  scroll = true,
  contentBottomPad = true,
  scrollRef: externalScrollRef,
}: AuthScreenShellProps) {
  const { theme } = useTheme();
  const internalScrollRef = useRef<ScrollView>(null);
  const scrollRef = externalScrollRef ?? internalScrollRef;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates.height;
      setKeyboardHeight(height);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollRef]);

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={{ flex: 1 }}>
      {brandWash ? (
        <LinearGradient
          colors={[
            theme.colors.bg.brandWash,
            theme.colors.bg.app,
            theme.colors.bg.app,
          ]}
          locations={[0, 0.22, 1]}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      ) : null}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenContainer
          scrollRef={scrollRef}
          edges={['top', 'left', 'right']}
          scroll={scroll}
          style={{ backgroundColor: 'transparent' }}
          contentStyle={{
            flexGrow: 1,
            paddingTop: theme.spacing[2],
            paddingBottom: keyboardHeight > 0
              ? keyboardHeight + 80
              : (contentBottomPad ? theme.spacing[16] : theme.spacing[6]),
          }}
        >
          {title || showBack ? (
            <AppHeader
              title={title ?? ''}
              onBack={showBack ? handleBack : undefined}
            />
          ) : null}
          {children}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </View>
  );
}
