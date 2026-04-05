import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Send, MapPin, AlignLeft, Target, CheckCircle } from 'lucide-react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function SubmitScreen() {
  const [formData, setFormData] = useState({ title: '', description: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitRequest = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(API_URL, formData);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle color="#10b981" size={80} />
        <Text style={styles.successTitle}>Request Submitted!</Text>
        <Text style={styles.successSubtitle}>Our AI Agent has received your request and is triaging it.</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => { setIsSuccess(false); setFormData({ title: '', description: '', location: '' }); }}
        >
          <Text style={styles.primaryButtonText}>Submit Another Request</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Get IT Help</Text>
          <Text style={styles.headerSubtitle}>Describe your issue. Our AI will automatically assign and prioritize it.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Target color="#4f46e5" size={16} />
              <Text style={styles.label}>Subject</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="E.g., Complete Network Outage"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <AlignLeft color="#4f46e5" size={16} />
              <Text style={styles.label}>Detailed Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What specifically is happening?"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <MapPin color="#4f46e5" size={16} />
              <Text style={styles.label}>Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="E.g., 2nd Floor, Room 204"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            onPress={submitRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Send to AI Agent</Text>
                <Send color="#fff" size={18} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 32, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#475569', textAlign: 'center', lineHeight: 24 },
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputGroup: { marginBottom: 20 },
  labelContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginLeft: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  successContainer: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginTop: 24, marginBottom: 8 },
  successSubtitle: { fontSize: 16, color: '#475569', textAlign: 'center', marginBottom: 32 }
});
