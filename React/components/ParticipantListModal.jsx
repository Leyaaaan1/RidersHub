import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    ScrollView,
    Image,
    Share
} from 'react-native';
import { fetchMyRides } from '../services/rideService';
import { joinService } from '../services/joinService';
import { inviteService } from '../services/inviteService';
import { styles } from '../styles/ParticipantListModalStyles';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ParticipantListModal = ({
                                  visible,
                                  onClose,
                                  participants,
                                  generatedRidesId,
                                  token,
                                  username,
                                  currentUsername
                              }) => {
    const [rides, setRides] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('participants');

    // QR Code state
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [qrCodeBase64, setQrCodeBase64] = useState('');
    const [inviteLink, setInviteLink] = useState('');
    const [loadingQr, setLoadingQr] = useState(false);

    const isOwner = username === currentUsername;



    useEffect(() => {
        if (visible) {
            if (activeTab === 'rides') {
                loadMyRides();
            } else if (activeTab === 'requests' && generatedRidesId && isOwner) {
                loadJoinRequests();
            }

            // Load QR code if user is owner
            if (isOwner && generatedRidesId) {
                loadQrCode();
            }
        }
    }, [visible, activeTab, generatedRidesId, isOwner]);

    /**
     * Load QR code and invite information
     * Uses inviteService to fetch all invite data
     */
    const loadQrCode = async () => {
        setLoadingQr(true);
        try {
            // Fetch all invite data at once using the new service
            const inviteData = await inviteService.getAllInviteData(generatedRidesId, token);

            setQrCodeUrl(inviteData.qrUrl || '');
            setQrCodeBase64(inviteData.qrBase64 || '');
            setInviteLink(inviteData.inviteLink || '');
        } catch (err) {
            console.error('Error loading QR code:', err);
        } finally {
            setLoadingQr(false);
        }
    };

    /**
     * Share QR code and invite link
     */
    const handleShareQrCode = async () => {
        try {
            if (inviteLink) {
                await Share.share({
                    message: `Join my ride!\n\nUse this link to join:\n${inviteLink}`,
                    title: 'Join My Ride',
                });
            }
        } catch (err) {
            console.error('Error sharing QR code:', err);
        }
    };

    /**
     * Refresh QR code
     */
    const handleRefreshQr = () => {
        loadQrCode();
    };

    /**
     * Load user's rides
     */
    const loadMyRides = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await fetchMyRides(token);
            setRides(result);
        } catch (err) {
            setError(err.message || 'Failed to load your rides');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load join requests for the ride
     * Uses joinService to fetch joiners with status
     */
    const loadJoinRequests = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch all joiners (you can also filter by status)
            const data = await joinService.getJoinersByRide(generatedRidesId, token);
            setJoinRequests(data || []);

            // Alternative: Get only pending requests
            // const data = await joinService.getPendingJoiners(generatedRidesId, token);
        } catch (err) {
            setError('Failed to load join requests');
            console.error('Error loading join requests:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Approve a join request
     * @param {number} joinId - The join request ID
     * @param {string} username - The username for display
     */
    const handleApproveRequest = async (joinId, username) => {
        try {
            await joinService.approveJoinRequest(joinId, token);
            Alert.alert('Success', `${username}'s request has been approved`);
            loadJoinRequests(); // Refresh the list
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to approve join request');
            console.error('Error approving request:', err);
        }
    };

    /**
     * Reject a join request
     * @param {number} joinId - The join request ID
     * @param {string} username - The username for display
     */
    const handleRejectRequest = async (joinId, username) => {
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
                            loadJoinRequests(); // Refresh the list
                        } catch (err) {
                            Alert.alert('Error', err.message || 'Failed to reject join request');
                            console.error('Error rejecting request:', err);
                        }
                    }
                }
            ]
        );
    };



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

    /**
     * Format date string
     */
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch {
            return dateString;
        }
    };

    /**
     * Render a join request item
     */
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

    /**
     * Render a participant item
     */
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

    // Count pending requests
    const pendingCount = joinRequests.filter(req => req.status === 'PENDING').length;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle}>Ride Details</Text>
                            <Text style={styles.modalSubtitle}>
                                {isOwner ? 'Manage riders and requests' : 'View ride participants'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="times" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* QR Code Section (Only for Owner) */}
                    {isOwner && (
                        <View style={styles.qrCodeSection}>
                            <Text style={styles.qrCodeTitle}>Share Your Ride</Text>

                            {loadingQr ? (
                                <View style={styles.qrCodePlaceholder}>
                                    <ActivityIndicator size="small" color="#8c2323" />
                                    <Text style={styles.qrCodePlaceholderText}>Loading QR...</Text>
                                </View>
                            ) : qrCodeUrl ? (
                                <View style={styles.qrCodeContainer}>
                                    <Image
                                        source={{ uri: qrCodeUrl }}
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
                                    disabled={!inviteLink}
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

                    {/* Tab Navigation */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'participants' && styles.tabActive]}
                            onPress={() => setActiveTab('participants')}
                        >
                            <FontAwesome
                                name="users"
                                size={16}
                                color={activeTab === 'participants' ? '#8c2323' : '#666'}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[styles.tabText, activeTab === 'participants' && styles.tabTextActive]}>
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
                                style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                                onPress={() => setActiveTab('requests')}
                            >
                                <FontAwesome
                                    name="clock-o"
                                    size={16}
                                    color={activeTab === 'requests' ? '#8c2323' : '#666'}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
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

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {activeTab === 'participants' && (
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

                        {activeTab === 'requests' && isOwner && (
                            <>
                                {/* Approve All Button */}
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

                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#8c2323" />
                                        <Text style={styles.loadingText}>Loading requests...</Text>
                                    </View>
                                ) : error ? (
                                    <View style={styles.errorContainer}>
                                        <FontAwesome name="exclamation-circle" size={32} color="#8c2323" />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : (
                                    <FlatList
                                        data={joinRequests}
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