import { Redirect } from 'expo-router';

/**
 * App entry — always hand off to the brand splash.
 * Splash resolves Supabase session / onboarding and routes onward.
 */
export default function Index() {
  return <Redirect href="/(auth)/splash" />;
}
