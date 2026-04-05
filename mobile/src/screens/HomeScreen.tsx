import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Bot, Zap, ShieldAlert, Sparkles, Activity } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { scale, verticalScale, moderateScale, SIZES } from '../utils/scaling';

export default function HomeScreen({ navigation }: any) {
  const handleNav = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        
        {/* Hero Section */}
        <LinearGradient
          colors={['#4f46e5', '#3b82f6', '#0f172a']}
          style={styles.heroContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.heroContent}>
              <View style={styles.tag}>
                <Sparkles color="#fff" size={moderateScale(14)} />
                <Text style={styles.tagText}>Next-Gen IT Ops</Text>
              </View>

              <Text style={styles.title}>
                Supercharge your{'\n'}
                <Text style={styles.highlight}>Service Desk.</Text>
              </Text>

              <Text style={styles.subtitle}>
                Autonomous AI agents perfectly triage, prioritize, and resolve every ticket.
              </Text>

              <View style={styles.heroActions}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => handleNav('Submit')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryButtonText}>Get Help Now</Text>
                  <ArrowRight color="#4f46e5" size={moderateScale(20)} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => handleNav('Dashboard')}
                  activeOpacity={0.8}
                >
                  <Activity color="#fff" size={moderateScale(20)} />
                  <Text style={styles.secondaryButtonText}>Agent Portal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Features Content */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Platform Capabilities</Text>
          
          <FeatureCard 
            icon={<Bot color="#4f46e5" size={moderateScale(24)} />}
            title="AI Classification"
            description="Instantly categorizes requests and determines priority."
          />
          <FeatureCard 
            icon={<ShieldAlert color="#e11d48" size={moderateScale(24)} />}
            title="SLA Protection"
            description="Critical issues are instantly elevated."
          />
          <FeatureCard 
            icon={<Zap color="#d97706" size={moderateScale(24)} />}
            title="Instant Resolution"
            description="Generates actionable steps for known issues."
          />
          
          {/* Spacer for Floating Tab Bar */}
          <View style={{ height: verticalScale(100) }} />
        </View>

      </ScrollView>
    </View>
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
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(12),
    alignItems: 'center',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: scale(52),
    height: scale(52),
    borderRadius: moderateScale(16),
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  textContainer: { flex: 1 },
  title: { fontSize: moderateScale(16), fontWeight: '700', color: '#0f172a', marginBottom: moderateScale(4) },
  description: { fontSize: moderateScale(13), color: '#64748b', lineHeight: moderateScale(18) }
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { flexGrow: 1 },
  heroContainer: {
    borderBottomLeftRadius: moderateScale(40),
    borderBottomRightRadius: moderateScale(40),
    paddingBottom: verticalScale(30),
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroContent: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  tagText: { color: '#fff', fontWeight: '600', fontSize: moderateScale(12), marginLeft: scale(6) },
  title: { 
    fontSize: moderateScale(38), 
    fontWeight: '900', 
    color: '#fff', 
    lineHeight: moderateScale(46), 
    marginBottom: verticalScale(12) 
  },
  highlight: { color: '#fbbf24' },
  subtitle: { 
    fontSize: moderateScale(15), 
    color: 'rgba(255,255,255,0.85)', 
    lineHeight: moderateScale(24), 
    marginBottom: verticalScale(32),
    maxWidth: '90%'
  },
  heroActions: {
    flexDirection: 'column',
    gap: verticalScale(12),
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: { color: '#4f46e5', fontSize: moderateScale(16), fontWeight: 'bold', marginRight: scale(8) },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryButtonText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', marginLeft: scale(8) },
  featuresSection: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(30),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: verticalScale(16)
  }
});
