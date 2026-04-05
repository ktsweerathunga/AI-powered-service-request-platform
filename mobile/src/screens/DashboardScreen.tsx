import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Clock, Zap, CheckCircle2, Package, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import axios from 'axios';
import { io } from 'socket.io-client';
import * as Haptics from 'expo-haptics';
import { API_URL, SOCKET_URL } from '../config';
import { scale, verticalScale, moderateScale } from '../utils/scaling';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ServiceRequest {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  ai_summary: string;
  ai_suggested_resolution: string;
  createdAt: string;
}

export default function DashboardScreen() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const socket = io(SOCKET_URL);
    socket.on("requestUpdated", (updatedRequest: ServiceRequest) => {
      setRequests((prev) => {
        const exists = prev.find((r) => r._id === updatedRequest._id);
        if (exists) {
          return prev.map((r) => (r._id === updatedRequest._id ? updatedRequest : r));
        }
        return [updatedRequest, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchRequests();
  }, []);

  const completeRequest = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: "COMPLETED" });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
    Haptics.selectionAsync();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#e11d48';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#64748b';
    }
  };

  const renderItem = ({ item }: { item: ServiceRequest }) => {
    const isExpanded = expandedId === item._id;
    const prioColor = getPriorityColor(item.priority);

    return (
      <View style={styles.card}>
        <View style={[styles.priorityLine, { backgroundColor: prioColor }]} />
        
        <TouchableOpacity style={styles.cardInner} onPress={() => toggleExpand(item._id)} activeOpacity={0.8}>
          <View style={styles.cardHeader}>
            <View style={styles.tagsContainer}>
              <Text style={[styles.tag, { color: prioColor, backgroundColor: prioColor + '15' }]}>
                {item.priority}
              </Text>
              <Text style={styles.categoryTag}>{item.category}</Text>
            </View>
            <View style={[styles.statusWrapper, item.status === 'COMPLETED' ? styles.statusCompletedBg : styles.statusActiveBg]}>
              <Text style={[styles.statusTag, item.status === 'COMPLETED' ? styles.statusCompletedTxt : styles.statusActiveTxt]}>
                {item.status.replace("_", " ")}
              </Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={isExpanded ? undefined : 2}>{item.description}</Text>

          <View style={styles.metaData}>
            <View style={styles.metaItem}>
              <AlertCircle color="#64748b" size={14} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
               <Clock color="#64748b" size={14} />
               <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>

          {/* AI Banner Summary (Always Visible if collpased but AI has responded) */}
          {!isExpanded && item.status !== 'COMPLETED' && item.ai_summary && (
            <View style={styles.collapsedAIBanner}>
              <Zap color="#8b5cf6" size={14} fill="#8b5cf6" />
              <Text style={styles.collapsedAIText}>AI Triage Complete • Tap to view</Text>
            </View>
          )}
          {!isExpanded && !item.ai_summary && (
            <View style={styles.collapsedAIBannerLoading}>
               <ActivityIndicator color="#4f46e5" size="small" />
               <Text style={styles.collapsedAITextLoading}>Agent is triaging...</Text>
            </View>
          )}

          <View style={styles.expandIconWrapper}>
            {isExpanded ? <ChevronUp color="#94a3b8" size={20} /> : <ChevronDown color="#94a3b8" size={20} />}
          </View>
        </TouchableOpacity>

        {/* Collapsible AI Panel */}
        {isExpanded && (
          <View style={styles.aiPanel}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconWrapper}>
                 <Zap color="#fff" size={14} fill="#fff" />
              </View>
              <Text style={styles.aiTitle}>Agent Analysis</Text>
            </View>

            {item.ai_summary ? (
              <View>
                <View style={styles.aiBlock}>
                  <Text style={styles.aiBlockLabel}>ROOT CAUSE SUMMARY</Text>
                  <Text style={styles.aiBlockValue}>{item.ai_summary}</Text>
                </View>
                <View style={styles.aiBlock}>
                  <Text style={styles.aiBlockLabelResolved}>AUTO-RESOLUTION STEPS</Text>
                  <Text style={styles.aiBlockValue}>{item.ai_suggested_resolution}</Text>
                </View>

                {item.status !== 'COMPLETED' && (
                  <TouchableOpacity 
                    style={styles.confirmBtn} 
                    onPress={() => completeRequest(item._id)}
                    activeOpacity={0.8}
                  >
                    <CheckCircle color="#fff" size={18} />
                    <Text style={styles.confirmBtnText}>Confirm Resolution</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.aiLoading}>
                <ActivityIndicator color="#4f46e5" size="large" />
                <Text style={styles.aiLoadingText}>Processing context & priority...</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Zap color="#d97706" size={28} fill="#d97706" />
        <Text style={styles.screenTitle}>Active Requests</Text>
      </View>

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#4f46e5"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Package color="#cbd5e1" size={verticalScale(60)} />
              <Text style={styles.emptyTitle}>No requests found</Text>
              <Text style={styles.emptySub}>The AI has nothing to automate... yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  screenTitle: { fontSize: moderateScale(24), fontWeight: '900', color: '#0f172a', marginLeft: scale(8) },
  listContainer: { padding: scale(16), paddingBottom: verticalScale(120) }, // Prevent cutoff from absolute tab bar
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden'
  },
  priorityLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: scale(4) },
  cardInner: { padding: moderateScale(20), paddingLeft: moderateScale(24) },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: verticalScale(12) },
  tagsContainer: { flexDirection: 'row', gap: scale(8), flexWrap: 'wrap', flex: 1 },
  tag: { fontSize: moderateScale(10), fontWeight: '800', paddingHorizontal: scale(10), paddingVertical: verticalScale(4), borderRadius: moderateScale(12), overflow: 'hidden' },
  categoryTag: { fontSize: moderateScale(10), fontWeight: '800', color: '#475569', backgroundColor: '#f1f5f9', paddingHorizontal: scale(10), paddingVertical: verticalScale(4), borderRadius: moderateScale(12), overflow: 'hidden' },
  statusWrapper: { borderRadius: moderateScale(12), overflow: 'hidden', paddingHorizontal: scale(10), paddingVertical: verticalScale(4) },
  statusActiveBg: { backgroundColor: '#dbeafe' },
  statusCompletedBg: { backgroundColor: '#d1fae5' },
  statusTag: { fontSize: moderateScale(10), fontWeight: '800' },
  statusActiveTxt: { color: '#1d4ed8' },
  statusCompletedTxt: { color: '#047857' },
  cardTitle: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#0f172a', marginBottom: verticalScale(6) },
  cardDesc: { fontSize: moderateScale(14), color: '#475569', marginBottom: verticalScale(16), lineHeight: moderateScale(20) },
  metaData: { flexDirection: 'row', gap: scale(16), marginBottom: verticalScale(8) },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: moderateScale(12), color: '#64748b', marginLeft: scale(4), fontWeight: '500' },
  collapsedAIBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f3ff',
    paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderRadius: moderateScale(8), marginTop: verticalScale(8)
  },
  collapsedAIText: { fontSize: moderateScale(11), color: '#8b5cf6', fontWeight: '700', marginLeft: scale(6) },
  collapsedAIBannerLoading: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff',
    paddingHorizontal: scale(12), paddingVertical: verticalScale(8), borderRadius: moderateScale(8), marginTop: verticalScale(8)
  },
  collapsedAITextLoading: { fontSize: moderateScale(11), color: '#4f46e5', fontWeight: '700', marginLeft: scale(6) },
  expandIconWrapper: { position: 'absolute', bottom: moderateScale(12), right: moderateScale(16) },
  aiPanel: { backgroundColor: '#faf5ff', padding: moderateScale(20), paddingLeft: moderateScale(24), borderTopWidth: 1, borderTopColor: '#f3e8ff' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(16) },
  aiIconWrapper: { width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(8), backgroundColor: '#8b5cf6', justifyContent: 'center', alignItems: 'center', marginRight: scale(10) },
  aiTitle: { fontWeight: '800', color: '#581c87', fontSize: moderateScale(15) },
  aiBlock: { backgroundColor: '#fff', borderRadius: moderateScale(12), padding: moderateScale(14), marginBottom: verticalScale(10), shadowColor: '#c084fc', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  aiBlockLabel: { fontSize: moderateScale(10), fontWeight: '900', color: '#6366f1', marginBottom: verticalScale(6) },
  aiBlockLabelResolved: { fontSize: moderateScale(10), fontWeight: '900', color: '#8b5cf6', marginBottom: verticalScale(6) },
  aiBlockValue: { fontSize: moderateScale(14), color: '#334155', lineHeight: moderateScale(20) },
  aiLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(20) },
  aiLoadingText: { fontSize: moderateScale(13), color: '#6d28d9', marginTop: verticalScale(12), fontWeight: '600' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10b981', padding: moderateScale(14), borderRadius: moderateScale(16), marginTop: verticalScale(12), shadowColor: '#10b981', shadowOffset: {width:0,height:4}, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  confirmBtnText: { color: '#fff', fontWeight: '800', marginLeft: scale(8), fontSize: moderateScale(15) },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(100) },
  emptyTitle: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#334155', marginTop: verticalScale(16) },
  emptySub: { fontSize: moderateScale(15), color: '#94a3b8', marginTop: verticalScale(8) }
});
