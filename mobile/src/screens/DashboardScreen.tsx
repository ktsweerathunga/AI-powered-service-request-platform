import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { AlertCircle, Clock, Zap, CheckCircle2, Package, CheckCircle } from 'lucide-react-native';
import axios from 'axios';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config';

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const completeRequest = async (id: string) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: "COMPLETED" });
    } catch (error) {
      console.error(error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#64748b';
    }
  };

  const renderItem = ({ item }: { item: ServiceRequest }) => (
    <View style={styles.card}>
      <View style={[styles.priorityLine, { backgroundColor: getPriorityColor(item.priority) }]} />
      
      <View style={styles.cardHeader}>
        <View style={styles.tagsContainer}>
          <Text style={[styles.tag, { color: getPriorityColor(item.priority), backgroundColor: getPriorityColor(item.priority) + '20' }]}>
            {item.priority}
          </Text>
          <Text style={styles.categoryTag}>{item.category}</Text>
        </View>
        <Text style={[styles.statusTag, item.status === 'COMPLETED' ? styles.statusCompleted : styles.statusActive]}>
          {item.status.replace("_", " ")}
        </Text>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      <View style={styles.metaData}>
        <View style={styles.metaItem}>
          <AlertCircle color="#6366f1" size={14} />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        <View style={styles.metaItem}>
           <Clock color="#6366f1" size={14} />
           <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.aiPanel}>
        <View style={styles.aiHeader}>
          <View style={styles.aiIconWrapper}>
             <Zap color="#fff" size={12} fill="#fff" />
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
              <TouchableOpacity style={styles.confirmBtn} onPress={() => completeRequest(item._id)}>
                <CheckCircle color="#10b981" size={16} />
                <Text style={styles.confirmBtnText}>Confirm Resolution</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.aiLoading}>
            <ActivityIndicator color="#4f46e5" size="small" />
            <Text style={styles.aiLoadingText}>Agent is triaging...</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap color="#d97706" size={28} fill="#d97706" />
        <Text style={styles.screenTitle}>Active Requests</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Package color="#cbd5e1" size={48} />
              <Text style={styles.emptyTitle}>No requests found</Text>
              <Text style={styles.emptySub}>The AI has nothing to automate... yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  screenTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginLeft: 8 },
  listContainer: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  priorityLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  tagsContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', flex: 1 },
  tag: { fontSize: 10, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  categoryTag: { fontSize: 10, fontWeight: '800', color: '#475569', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  statusTag: { fontSize: 10, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden' },
  statusActive: { color: '#1d4ed8', backgroundColor: '#dbeafe' },
  statusCompleted: { color: '#047857', backgroundColor: '#d1fae5' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#475569', marginBottom: 16 },
  metaData: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  metaText: { fontSize: 12, color: '#64748b', marginLeft: 4, fontWeight: '500' },
  aiPanel: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#ede9fe' },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#ede9fe', paddingBottom: 8 },
  aiIconWrapper: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#8b5cf6', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  aiTitle: { fontWeight: '700', color: '#4c1d95', fontSize: 14 },
  aiBlock: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 },
  aiBlockLabel: { fontSize: 9, fontWeight: '900', color: '#6366f1', marginBottom: 4 },
  aiBlockLabelResolved: { fontSize: 9, fontWeight: '900', color: '#8b5cf6', marginBottom: 4 },
  aiBlockValue: { fontSize: 13, color: '#334155' },
  aiLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  aiLoadingText: { fontSize: 12, color: '#4f46e5', marginTop: 8, fontWeight: '600' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',borderWidth: 1, borderColor: '#a7f3d0', padding: 12, borderRadius: 8, marginTop: 8 },
  confirmBtnText: { color: '#10b981', fontWeight: 'bold', marginLeft: 8 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#94a3b8', marginTop: 8 }
});
