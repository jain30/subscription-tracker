import { Redirect } from 'expo-router';

/**
 * App entry route — forwards into the main tab shell.
 * Future auth gates can replace this redirect without moving tabs.
 */
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
