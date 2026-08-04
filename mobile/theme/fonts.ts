/**
 * Font asset map for `expo-font` / `useFonts`.
 *
 * Loads only the weights we use in typography tokens to keep startup lean.
 * Font family string keys must match `fontFamily` in `tokens/typography.ts`.
 */

import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

export const fontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} as const;
