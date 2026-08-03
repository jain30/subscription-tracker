import { StyleSheet, Text, View } from 'react-native';

/**
 * Foundation placeholder route required by expo-router.
 * No application features are implemented here.
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Tracker</Text>
      <Text style={styles.subtitle}>Project foundation ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
});
