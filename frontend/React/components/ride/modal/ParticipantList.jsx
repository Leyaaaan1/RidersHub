
import React, {useState, useEffect, useCallback, useContext, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {fetchMyRides} from '../../../services/rideService';
import {joinService} from '../../../services/joinService';
import {inviteService} from '../../../services/inviteService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import modal from '../../../styles/components/modal';
import feedback from '../../../styles/base/feedback';
import badges from '../../../styles/base/badges';
import {RideContext} from '../../../context/RideContext';
import Share from 'react-native-share';
import RNShare from 'react-native-fs';
import {getRideDetails} from '../../../services/rideService';

const ParticipantList = ({
                           visible,
                           onClose,
                           generatedRidesId,
                           username,
                           currentUsername,
                           navigation,
                           participants: propParticipants = [], //
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
    participants: [], //
  });

  const {activeRide, updateRideParticipants} = useContext(RideContext);
  const pendingApprovedRef = useRef(new Set());
  const participants = state.participants.length > 0
    ? state.participants
    : (activeRide?.participants || propParticipants || []);

  const isOwner = username === currentUsername;



  const handleShareQrCode = async () => {
    try {
      if (!state.inviteLink) return;

      if (state.qrCodeBase64) {
        // Strip any data URI prefix if your backend already includes one
        const base64Data = state.qrCodeBase64.includes('base64,')
          ? state.qrCodeBase64.split('base64,').pop()
          : state.qrCodeBase64;

        const filePath = `${RNShare.CachesDirectoryPath}/ride-qr-${generatedRidesId}.png`;
        await RNShare.writeFile(filePath, base64Data, 'base64');

        await Share.open({
          title: 'Join My Ride',
          message: `Join my ride!\n\nUse this link to join:\n${state.inviteLink}`,
          url: `file://${filePath}`, // this is the image attachment
          type: 'image/png',
          failOnCancel: false,
        });
      } else {
        // fallback: text-only share if QR image isn't available
        await Share.open({
          title: 'Join My Ride',
          message: `Join my ride!\n\nUse this link to join:\n${state.inviteLink}`,
          failOnCancel: false,
        });
      }
    } catch (err) {
      // user cancel also lands here when failOnCancel is true; we set it false above
    }
  };
  const refreshParticipants = useCallback(async () => {
    if (!generatedRidesId) return;
    try {
      const rideDetails = await getRideDetails(generatedRidesId);
      const fetched = rideDetails.participants || [];

      const fetchedNames = new Set(
        fetched.map(p => (typeof p === 'object' ? p.username : p)),
      );

      // Keep anyone we optimistically approved that the server hasn't
      // caught up on yet; drop them once they actually appear in the
      // fresh list (avoids duplicates).
      const stillPending = [];
      pendingApprovedRef.current.forEach(name => {
        if (fetchedNames.has(name)) {
          pendingApprovedRef.current.delete(name);
        } else {
          stillPending.push(name);
        }
      });

      const merged = [...fetched, ...stillPending];
      setState(prev => ({...prev, participants: merged}));
      updateRideParticipants(merged);
    } catch (err) {}
  }, [generatedRidesId, updateRideParticipants]);

  const loadQrCode = useCallback(async () => {
    setState(prev => ({...prev, loadingQr: true}));
    try {
      const inviteData = await inviteService.getAllInviteData(generatedRidesId);
      setState(prev => ({
        ...prev,
        qrCodeUrl: inviteData.qrUrl || '',
        qrCodeBase64: inviteData.qrBase64 || '',
        inviteLink: inviteData.inviteLink || '',
      }));
    } catch (err) {
    } finally {
      setState(prev => ({...prev, loadingQr: false}));
    }
  }, [generatedRidesId]);

  const loadMyRides = useCallback(async () => {
    try {
      setState(prev => ({...prev, loading: true, error: ''}));
      const result = await fetchMyRides();
      setState(prev => ({...prev, rides: result}));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.message || 'Failed to load your rides',
      }));
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  }, []);

  const loadJoinRequests = useCallback(async () => {
    setState(prev => ({...prev, loading: true, error: ''}));
    try {
      const data = await joinService.getJoinersByRide(generatedRidesId);
      setState(prev => ({...prev, joinRequests: data || []}));
    } catch (err) {
      setState(prev => ({...prev, error: 'Failed to load join requests'}));
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  }, [generatedRidesId]);

  const handleApproveRequest = async joinId => {
    try {
      await joinService.approveJoinRequest(joinId);
      Alert.alert('Success', 'Request has been approved');

      const approvedUser = state.joinRequests.find(r => r.joinId === joinId);
      if (approvedUser) {
        pendingApprovedRef.current.add(approvedUser.username);
        setState(prev => {
          const already = prev.participants.some(
            p =>
              (typeof p === 'object' ? p.username : p) ===
              approvedUser.username,
          );
          return already
            ? prev
            : {
                ...prev,
                participants: [...prev.participants, approvedUser.username],
              };
        });
        refreshParticipants(); // reconcile in background, no need to await
      }

      setState(prev => ({
        ...prev,
        joinRequests: prev.joinRequests.filter(r => r.joinId !== joinId),
      }));
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to approve join request');
    }
  };

  const handleApproveAll = async () => {
    const pending = state.joinRequests.filter(r => r.status === 'PENDING');
    if (!pending.length) return;
    Alert.alert(
      'Approve All',
      `Approve all ${pending.length} pending requests?`,
      [
        {
          text: 'Approve All',
          onPress: async () => {
            try {
              await Promise.all(
                pending.map(r => joinService.approveJoinRequest(r.joinId)),
              );
              Alert.alert('Success', 'All requests approved');

              setState(prev => {
                const existingNames = new Set(
                  prev.participants.map(p =>
                    typeof p === 'object' ? p.username : p,
                  ),
                );
                const toAdd = pending
                  .map(r => r.username)
                  .filter(name => !existingNames.has(name));
                toAdd.forEach(name => pendingApprovedRef.current.add(name));
                return {
                  ...prev,
                  participants: [...prev.participants, ...toAdd],
                };
              });

              refreshParticipants();

              setState(prev => ({
                ...prev,
                joinRequests: prev.joinRequests.filter(
                  r => !pending.some(p => p.joinId === r.joinId),
                ),
              }));
            } catch (err) {
              Alert.alert(
                'Error',
                err.message || 'Failed to approve all requests',
              );
            }
          },
        },

      ],
    );
  };

  const handleRejectRequest = async joinId => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await joinService.rejectJoinRequest(joinId);
              Alert.alert('Success', 'Request has been rejected');

              setState(prev => ({
                ...prev,
                joinRequests: prev.joinRequests.filter(
                  r => r.joinId !== joinId,
                ),
              }));
            } catch (err) {
              Alert.alert(
                'Error',
                err.message || 'Failed to reject join request',
              );
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (!visible) return;

    // Paint instantly from whatever we already have (fast, no flash of empty state)...
    if (activeRide?.participants && activeRide.participants.length > 0) {
      setState(prev => ({...prev, participants: activeRide.participants}));
    } else if (propParticipants && propParticipants.length > 0) {
      setState(prev => ({...prev, participants: propParticipants}));
    }
    // ...but always follow up with a real fetch, since prop/context data
    // is a frozen snapshot from whenever this screen was first opened.
    refreshParticipants();

    if (state.activeTab === 'rides') loadMyRides();
    else if (state.activeTab === 'requests' && generatedRidesId)
      loadJoinRequests();
    if (generatedRidesId) loadQrCode();
  }, [visible, state.activeTab, generatedRidesId]);;

  const getStatusStyle = status => {
    switch (status) {
      case 'PENDING':
        return modal.statusPending;
      case 'APPROVED':
        return modal.statusApproved;
      case 'REJECTED':
        return modal.statusRejected;
      default:
        return modal.statusPending;
    }
  };

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const renderRequestItem = ({item}) => {
    const isPending = item.status === 'PENDING';
    return (
      <View style={modal.requestCard}>
        <View style={modal.requestContent}>
          <View style={modal.requestUserInfo}>
            <View style={modal.requestAvatar}>
              <FontAwesome name="user" size={16} color="#666" />
            </View>
            <View style={{flex: 1}}>
              <Text style={modal.requestUsername}>{item.username}</Text>
              <Text style={getStatusStyle(item.status)}>{item.status}</Text>
              {item.requestedAt && (
                <Text style={modal.requestDate}>
                  {formatDate(item.requestedAt)}
                </Text>
              )}
            </View>
          </View>
          {isPending && isOwner && (
            <View style={modal.requestActions}>
              <TouchableOpacity
                style={[modal.actionButton, modal.approveButton]}
                onPress={() => handleApproveRequest(item.joinId)}>
                <FontAwesome name="check" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[modal.actionButton, modal.rejectButton]}
                onPress={() => handleRejectRequest(item.joinId)}>
                <FontAwesome name="times" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderParticipantItem = ({item, index}) => {
    const participantName = typeof item === 'object' ? item.username : item;
    const isRideOwner = participantName === username;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('RiderProfile', {username: participantName});
          onClose();
        }}
        style={modal.participantCard}
        activeOpacity={0.7}>
        <View style={modal.participantNumber}>
          <Text style={modal.participantNumberText}>{index + 1}</Text>
        </View>
        <View style={modal.participantInfo}>
          <Text
            style={[
              modal.participantName,
              {textDecorationLine: 'underline'},
            ]}>
            {participantName}
          </Text>
          {isRideOwner && (
            <View style={badges.owner}>
              <FontAwesome name="star" size={10} color="#fbbf24" />
              <Text style={badges.ownerText}>Owner</Text>
            </View>
          )}
        </View>
        <FontAwesome name="motorcycle" size={16} color="#666" />
      </TouchableOpacity>
    );
  };

  const pendingCount = state.joinRequests.filter(
    r => r.status === 'PENDING',
  ).length;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modal.overlay}>
        <View style={modal.container}>
          <View style={modal.qrSection}>
            <TouchableOpacity onPress={onClose} style={modal.closeButton}>
              <FontAwesome name="times" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={modal.qrTitle}>Share Your Ride</Text>
            {state.loadingQr ? (
              <View style={feedback.loadingInline}>
                <ActivityIndicator size="small" color="#8c2323" />
                <Text style={feedback.loadingText}>Loading QR...</Text>
              </View>
            ) : state.qrCodeUrl ? (
              <View style={modal.qrContainer}>
                <Image
                  source={{uri: state.qrCodeUrl}}
                  style={modal.qrImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={feedback.imagePlaceholder}>
                <FontAwesome name="qrcode" size={60} color="#cbd5e1" />
                <Text style={feedback.imagePlaceholderText}>
                  QR Code Unavailable
                </Text>
              </View>
            )}
            <View style={modal.qrActions}>
              {isOwner && (
                <TouchableOpacity
                  style={modal.qrActionButton}
                  onPress={handleShareQrCode}
                  disabled={!state.inviteLink}>
                  <FontAwesome name="share-alt" size={16} color="#fff" />
                  <Text style={modal.qrActionButtonText}>Share</Text>
                </TouchableOpacity>
              )}
              {isOwner && (
                <TouchableOpacity
                  style={[modal.qrActionButton, modal.qrActionButtonSecondary]}
                  onPress={loadQrCode}>
                  <FontAwesome name="refresh" size={16} color="#fff" />
                  <Text style={modal.qrActionButtonText}>Refresh</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={modal.tabContainer}>
            <TouchableOpacity
              style={[
                modal.tab,
                state.activeTab === 'participants' && modal.tabActive,
              ]}
              onPress={() =>
                setState(prev => ({...prev, activeTab: 'participants'}))
              }>
              <FontAwesome
                name="users"
                size={16}
                color={state.activeTab === 'participants' ? '#8c2323' : '#666'}
                style={{marginRight: 8}}
              />
              <Text
                style={[
                  modal.tabText,
                  state.activeTab === 'participants' && modal.tabTextActive,
                ]}>
                Riders
              </Text>
              {Array.isArray(participants) && participants.length > 0 && (
                <View style={modal.tabBadge}>
                  <Text style={modal.tabBadgeText}>{participants.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modal.tab,
                state.activeTab === 'requests' && modal.tabActive,
              ]}
              onPress={() =>
                setState(prev => ({...prev, activeTab: 'requests'}))
              }>
              <FontAwesome
                name="clock-o"
                size={16}
                color={state.activeTab === 'requests' ? '#8c2323' : '#666'}
                style={{marginRight: 8}}
              />
              <Text
                style={[
                  modal.tabText,
                  state.activeTab === 'requests' && modal.tabTextActive,
                ]}>
                Requests
              </Text>
              {pendingCount > 0 && (
                <View style={[modal.tabBadge, {backgroundColor: '#8c2323'}]}>
                  <Text style={modal.tabBadgeText}>{pendingCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={modal.content}>
            {!isOwner && (
              <TouchableOpacity onPress={onClose} style={modal.closeButton}>
                <FontAwesome name="times" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            {state.activeTab === 'participants' && (
              <View style={{flex: 1}}>
                {Array.isArray(participants) && participants.length > 0 ? (
                  <FlatList
                    data={participants}
                    renderItem={renderParticipantItem}
                    keyExtractor={(item, index) => `participant-${index}`}
                    contentContainerStyle={{paddingBottom: 8}}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={feedback.emptyContainer}>
                    <FontAwesome name="users" size={48} color="#333" />
                    <Text style={feedback.emptyText}>No riders yet</Text>
                    <Text style={feedback.emptySubtext}>
                      Share your QR code to invite riders
                    </Text>
                  </View>
                )}
              </View>
            )}
            {state.activeTab === 'requests' && (
              <View style={{flex: 1}}>
                {pendingCount > 0 && isOwner && (
                  <TouchableOpacity
                    style={[modal.qrActionButton, {marginBottom: 16}]}
                    onPress={handleApproveAll}>
                    <FontAwesome name="check-circle" size={16} color="#fff" />
                    <Text style={modal.qrActionButtonText}>
                      Approve All ({pendingCount})
                    </Text>
                  </TouchableOpacity>
                )}
                {state.loading ? (
                  <View style={feedback.loadingContainer}>
                    <ActivityIndicator size="large" color="#8c2323" />
                    <Text style={feedback.loadingText}>
                      Loading requests...
                    </Text>
                  </View>
                ) : state.error ? (
                  <View style={feedback.errorContainer}>
                    <FontAwesome
                      name="exclamation-circle"
                      size={32}
                      color="#8c2323"
                    />
                    <Text style={feedback.errorTextPrimary}>{state.error}</Text>
                  </View>
                ) : (
                  <FlatList
                    data={state.joinRequests}
                    renderItem={renderRequestItem}
                    keyExtractor={(item, index) =>
                      `request-${item.joinId || index}`
                    }
                    contentContainerStyle={{paddingBottom: 8}}
                    ListEmptyComponent={
                      <View style={feedback.emptyContainer}>
                        <FontAwesome name="inbox" size={48} color="#333" />
                        <Text style={feedback.emptyText}>No join requests</Text>
                        <Text style={feedback.emptySubtext}>
                          Requests will appear here when riders want to join
                        </Text>
                      </View>
                    }
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ParticipantList;