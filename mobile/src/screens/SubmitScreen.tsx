import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, MapPin, AlignLeft, Target, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { API_URL } from '../config';
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function SubmitScreen() {
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const descRef = useRef<TextInput>(null);
  const locRef = useRef<TextInput>(null);

  const submitRequest = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);
    try {
      await axios.post(API_URL, formData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSuccess(true);
      setFormData({ title: '', description: '', location: '' });
    } catch (error) {
      console.error(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successCard}>
          <CheckCircle color="#10b981" size={moderateScale(80)} />
          <Text style={styles.successTitle}>Submitted!</Text>
          <Text style={styles.successSubtitle}>Our AI Agent has received your request and is triaging it.</Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { width: '100%' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIsSuccess(false); 
            }}
          >
            <Text style={styles.primaryButtonText}>New Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Get IT Help</Text>
            <Text style={styles.headerSubtitle}>Provide the details so our AI agent can resolve your query magically.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Target color="#4f46e5" size={moderateScale(16)} />
                <Text style={styles.label}>Subject</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="E.g., Complete Network Outage"
                placeholderTextColor="#94a3b8"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                returnKeyType="next"
                onSubmitEditing={() => descRef.current?.focus()}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <AlignLeft color="#4f46e5" size={moderateScale(16)} />
                <Text style={styles.label}>Detailed Description</Text>
              </View>
              <TextInput
                ref={descRef}
                style={[styles.input, styles.textArea]}
                placeholder="What specifically is happening?"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <MapPin color="#4f46e5" size={moderateScale(16)} />
                <Text style={styles.label}>Location</Text>
              </View>
              <TextInput
                ref={locRef}
                style={styles.input}
                placeholder="E.g., 2nd Floor, Room 204"
                placeholderTextColor="#94a3b8"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                returnKeyType="send"
                onSubmitEditing={submitRequest}
              />
            </View>
          </View>
        </ScrollView>

        {/* Sticky Footer for Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={submitRequest}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Send to AI Agent</Text>
                <Send color="#fff" size={moderateScale(18)} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: scale(24), paddingBottom: verticalScale(120) },
  header: { marginBottom: verticalScale(24) },
  headerTitle: { fontSize: moderateScale(32), fontWeight: '900', color: '#0f172a', marginBottom: verticalScale(8) },
  headerSubtitle: { fontSize: moderateScale(15), color: '#475569', lineHeight: moderateScale(22) },
  formContainer: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: moderateScale(24),
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: { marginBottom: verticalScale(20) },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(8) },
  label: { fontSize: moderateScale(14), fontWeight: '700', color: '#334155', marginLeft: scale(6) },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    fontSize: moderateScale(15),
    color: '#0f172a',
    fontWeight: '500'
  },
  textArea: { height: verticalScale(120), textAlignVertical: 'top' },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? verticalScale(100) : verticalScale(90),
    left: scale(24),
    right: scale(24),
    backgroundColor: 'transparent'
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold', marginRight: scale(8) },
  successContainer: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  successCard: {
    backgroundColor: '#fff',
    padding: scale(32),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    width: '85%',
    shadowColor: '#10b981',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 5
  },
  successTitle: { fontSize: moderateScale(24), fontWeight: '900', color: '#0f172a', marginTop: verticalScale(20), marginBottom: verticalScale(8) },
  successSubtitle: { fontSize: moderateScale(15), color: '#64748b', textAlign: 'center', marginBottom: verticalScale(30) }
});
