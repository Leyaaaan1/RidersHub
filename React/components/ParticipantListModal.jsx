import React, { useState, useEffect, useCallback } from 'react';

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Share,
} from 'react-native';
import { fetchMyRides } from '../services/rideService';
import { joinService } from '../services/joinService';
import { inviteService } from '../services/inviteService';
import { styles } from '../styles/ParticipantListModalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ParticipantListModal = ({
                                visible,
                                onClose,
                                participants,
                                generatedRidesId,
                                token,
                                username,
                                currentUsername,
                              }) => {
  const [state, setState] = useState({
    rides: [],
    joinRequests: [],
    loading: false,
    error: '',
    activeTab: 'participants',
    qrCodeUrl: '',
    qrCodeBase64: '',
    inviteLink: '',
    loadingQr: false,
  });

  const isOwner = username === currentUsername;


  const handleShareQrCode = async () => {
    try {
      if (state.inviteLink) {
        await Share.share({
          message: `Join my ride!\n\nUse this link to join:\n${state.inviteLink}`,
          title: 'Join My Ride',
        });
      }
    } catch (err) {
      console.error('Error sharing QR code:', err);
    }
  };

  const handleRefreshQr = () => {
    loadQrCode();
  };

  const loadQrCode = useCallback(async () => {
    setState(prev => ({ ...prev, loadingQr: true }));
    try {
      const inviteData = await inviteService.getAllInviteData(generatedRidesId, token);
      setState(prev => ({
        ...prev,
        qrCodeUrl: inviteData.qrUrl || '',
        qrCodeBase64: inviteData.qrBase64 || '',
        inviteLink: inviteData.inviteLink || '',
      }));
    } catch (err) {
      console.error('Error loading QR code:', err);
    } finally {
      setState(prev => ({ ...prev, loadingQr: false }));
    }
  }, [generatedRidesId, token]);

  const loadMyRides = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: '' }));
      const result = await fetchMyRides(token);
      setState(prev => ({ ...prev, rides: result }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message || 'Failed to load your rides' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [token]);

  const loadJoinRequests = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await joinService.getJoinersByRide(generatedRidesId, token);
      setState(prev => ({ ...prev, joinRequests: data || [] }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load join requests' }));
      console.error('Error loading join requests:', err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [generatedRidesId, token]);
  const handleApproveRequest = async (joinId) => {
    try {
      await joinService.approveJoinRequest(joinId, token);
      Alert.alert('Success', `${username}'s request has been approved`);
      loadJoinRequests();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to approve join request');
      console.error('Error approving request:', err);
    }
  };

  const handleRejectRequest = async (joinId) => {
    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject ${username}'s request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await joinService.rejectJoinRequest(joinId, token);
              Alert.alert('Success', `${username}'s request has been rejected`);
              loadJoinRequests();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to reject join request');
              console.error('Error rejecting request:', err);
            }
          },
        },
      ]
    );
  };

  const handleApproveAll = async () => {
    const pendingRequests = state.joinRequests.filter(req => req.status === 'PENDING');

    if (pendingRequests.length === 0)     {return;}

    Alert.alert(
      'Approve All Requests',
      `Are you sure you want to approve all ${pendingRequests.length} pending requests?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve All',
          onPress: async () => {
            try {
              await Promise.all(
                pendingRequests.map(req =>
                  joinService.approveJoinRequest(req.joinId, token)
                )
              );
              Alert.alert('Success', 'All requests have been approved');
              await loadJoinRequests();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to approve all requests');
              console.error('Error approving all requests:', err);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!visible) {return;}

    if (state.activeTab === 'rides') {
      loadMyRides();
    } else if (state.activeTab === 'requests' && generatedRidesId && isOwner) {
      loadJoinRequests();
    }

    if (isOwner && generatedRidesId) {
      loadQrCode();
    }
  }, [visible, state.activeTab, isOwner, loadMyRides, loadJoinRequests, loadQrCode, generatedRidesId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return styles.statusPending;
      case 'APPROVED':
        return styles.statusApproved;
      case 'REJECTED':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const renderRequestItem = ({ item }) => {
    const isPending = item.status === 'PENDING';

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestCardContent}>
          <View style={styles.requestUserInfo}>
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={16} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requestUsername}>{item.username}</Text>
              <Text style={[styles.requestStatus, getStatusColor(item.status)]}>
                {item.status}
              </Text>
              {item.requestedAt && (
                <Text style={styles.requestDate}>
                  {formatDate(item.requestedAt)}
                </Text>
              )}
            </View>
          </View>

          {isPending && (
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApproveRequest(item.joinId, item.username)}
              >
                <FontAwesome name="check" size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRejectRequest(item.joinId, item.username)}
              >
                <FontAwesome name="times" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderParticipantItem = ({ item, index }) => {
    const participantName = typeof item === 'object' ? item.username : item;
    const isRideOwner = participantName === username;

    return (
      <View style={styles.participantCard}>
        <View style={styles.participantNumber}>
          <Text style={styles.participantNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{participantName}</Text>
          {isRideOwner && (
            <View style={styles.ownerBadge}>
              <FontAwesome name="star" size={10} color="#fbbf24" />
              <Text style={styles.ownerBadgeText}>Owner</Text>
            </View>
          )}
        </View>
        <FontAwesome name="motorcycle" size={16} color="#666" />
      </View>
    );
  };

  const pendingCount = state.joinRequests.filter(req => req.status === 'PENDING').length;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {isOwner && (
            <View style={styles.qrCodeSection}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.qrCodeTitle}>Share Your Ride</Text>

              {state.loadingQr ? (
                <View style={styles.qrCodePlaceholder}>
                  <ActivityIndicator size="small" color="#8c2323" />
                  <Text style={styles.qrCodePlaceholderText}>Loading QR...</Text>
                </View>
              ) : state.qrCodeUrl ? (
                <View style={styles.qrCodeContainer}>
                  <Image
                    source={{ uri: state.qrCodeUrl }}
                    style={styles.qrCodeImage}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View style={styles.qrCodePlaceholder}>
                  <FontAwesome name="qrcode" size={60} color="#cbd5e1" />
                  <Text style={styles.qrCodePlaceholderText}>
                    QR Code Unavailable
                  </Text>
                </View>
              )}

              <View style={styles.qrCodeActions}>
                <TouchableOpacity
                  style={styles.qrActionButton}
                  onPress={handleShareQrCode}
                  disabled={!state.inviteLink}
                >
                  <FontAwesome name="share-alt" size={16} color="#fff" />
                  <Text style={styles.qrActionButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.qrActionButton, styles.qrActionButtonSecondary]}
                  onPress={handleRefreshQr}
                >
                  <FontAwesome name="refresh" size={16} color="#fff" />
                  <Text style={styles.qrActionButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, state.activeTab === 'participants' && styles.tabActive]}
              onPress={() => setState(prev => ({ ...prev, activeTab: 'participants' }))}
            >
              <FontAwesome
                name="users"
                size={16}
                color={state.activeTab === 'participants' ? '#8c2323' : '#666'}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.tabText, state.activeTab === 'participants' && styles.tabTextActive]}>
                Riders
              </Text>
              {Array.isArray(participants) && participants.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{participants.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {isOwner && (
              <TouchableOpacity
                style={[styles.tab, state.activeTab === 'requests' && styles.tabActive]}
                onPress={() => setState(prev => ({ ...prev, activeTab: 'requests' }))}
              >
                <FontAwesome
                  name="clock-o"
                  size={16}
                  color={state.activeTab === 'requests' ? '#8c2323' : '#666'}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.tabText, state.activeTab === 'requests' && styles.tabTextActive]}>
                  Requests
                </Text>
                {pendingCount > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: '#8c2323' }]}>
                    <Text style={styles.tabBadgeText}>{pendingCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.contentContainer}>
            {state.activeTab === 'participants' && (
              <View style={styles.participantsContainer}>
                {Array.isArray(participants) && participants.length > 0 ? (
                  <FlatList
                    data={participants}
                    renderItem={renderParticipantItem}
                    keyExtractor={(item, index) => `participant-${index}`}
                    contentContainerStyle={styles.participantsList}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <FontAwesome name="users" size={48} color="#333" />
                    <Text style={styles.emptyStateText}>No riders yet</Text>
                    <Text style={styles.emptyStateSubtext}>
                      Share your QR code to invite riders
                    </Text>
                  </View>
                )}
              </View>
            )}

            {state.activeTab === 'requests' && isOwner && (
              <>
                {pendingCount > 0 && (
                  <TouchableOpacity
                    style={[styles.acceptButton, { marginBottom: 16 }]}
                    onPress={handleApproveAll}
                  >
                    <FontAwesome name="check-circle" size={16} color="#fff" />
                    <Text style={styles.acceptButtonText}>
                      Approve All ({pendingCount})
                    </Text>
                  </TouchableOpacity>
                )}

                {state.loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8c2323" />
                    <Text style={styles.loadingText}>Loading requests...</Text>
                  </View>
                ) : state.error ? (
                  <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={32} color="#8c2323" />
                    <Text style={styles.errorText}>{state.error}</Text>
                  </View>
                ) : (
                  <FlatList
                    data={state.joinRequests}
                    renderItem={renderRequestItem}
                    keyExtractor={(item, index) => `request-${item.joinId || index}`}
                    ListEmptyComponent={
                      <View style={styles.emptyState}>
                        <FontAwesome name="inbox" size={48} color="#333" />
                        <Text style={styles.emptyStateText}>No join requests</Text>
                        <Text style={styles.emptyStateSubtext}>
                          Requests will appear here when riders want to join
                        </Text>
                      </View>
                    }
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ParticipantListModal;
