import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Bot, Zap, ShieldAlert, Sparkles, Activity } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tag}>
          <Sparkles color="#4f46e5" size={16} />
          <Text style={styles.tagText}>Welcome to the future of IT</Text>
        </View>

        <Text style={styles.title}>
          Supercharge your{'\n'}
          <Text style={styles.highlight}>Service Desk.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Autonomous AI agents perfectly triage, prioritize, and suggest resolutions for every single ticket instantly.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Submit')}
          >
            <Text style={styles.primaryButtonText}>Get Help Now</Text>
            <ArrowRight color="#fff" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Activity color="#4f46e5" size={20} />
            <Text style={styles.secondaryButtonText}>Agent Portal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <FeatureCard 
            icon={<Bot color="#4f46e5" size={28} />}
            title="AI Classification"
            description="Instantly categorizes requests and determines priority."
          />
          <FeatureCard 
            icon={<ShieldAlert color="#e11d48" size={28} />}
            title="SLA Protection"
            description="Critical issues are instantly elevated."
          />
          <FeatureCard 
            icon={<Zap color="#d97706" size={28} />}
            title="Instant Resolution"
            description="Generates actionable steps for known issues."
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <View style={featureStyles.card}>
      <View style={featureStyles.iconContainer}>{icon}</View>
      <View style={featureStyles.textContainer}>
        <Text style={featureStyles.title}>{title}</Text>
        <Text style={featureStyles.description}>{description}</Text>
      </View>
    </View>
  );
}

const featureStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  description: { fontSize: 13, color: '#64748b' }
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  tagText: { color: '#4338ca', fontWeight: '600', fontSize: 13, marginLeft: 6 },
  title: { fontSize: 40, fontWeight: '900', color: '#0f172a', lineHeight: 46, marginBottom: 16 },
  highlight: { color: '#4f46e5' },
  subtitle: { fontSize: 16, color: '#475569', lineHeight: 24, marginBottom: 32 },
  actions: { marginBottom: 40 },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: { color: '#0f172a', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  features: { flex: 1, justifyContent: 'flex-end' },
});
