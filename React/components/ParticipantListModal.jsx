import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { fetchMyRides } from '../services/rideService';
import { joinService } from '../services/joinService';
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ParticipantListModal = ({ visible, onClose, participants, generatedRidesId, token, onRideSelect, username, currentUsername }) => {
    const [rides, setRides] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('participants');

    useEffect(() => {
        if (visible && activeTab === 'rides') {
            loadMyRides();
        }
    }, [visible, activeTab]);

    useEffect(() => {
        if (visible && activeTab === 'requests' && generatedRidesId) {
            loadJoinRequests();
        }
    }, [visible, activeTab, generatedRidesId]);

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

    const loadJoinRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await joinService.getJoinRequestsByRideId(generatedRidesId, token);
            setJoinRequests(data.requests || []);
        } catch (err) {
            setError('Failed to load join requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (username) => {
        try {
            await joinService.acceptJoinRequest(generatedRidesId, username, token);
            Alert.alert('Success', 'Join request accepted');
            loadJoinRequests();
        } catch (err) {
            Alert.alert('Error', 'Failed to accept join request');
            console.error(err);
        }
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestCard}>
            <View style={styles.requestCardContent}>
                <View style={styles.requestUserInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <FontAwesome name="user" size={16} color="#666" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.requestUsername}>{item.username}</Text>
                        <Text style={styles.requestDate}>Pending approval</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(item.username)}
                >
                    <FontAwesome name="check" size={14} color="#fff" />
                    <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderParticipantItem = (participant, index) => {
        const participantName = typeof participant === 'object' ? participant.username : participant;
        const isOwner = participantName === username;

        return (
            <View key={index} style={styles.participantCard}>
                <View style={styles.participantNumber}>
                    <Text style={styles.participantNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participantName}</Text>
                    {isOwner && (
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

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modalTitle}>Ride Details</Text>
                            <Text style={styles.modalSubtitle}>Manage riders and requests</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="times" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

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

                        {username === currentUsername && (
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
                                {joinRequests.length > 0 && (
                                    <View style={[styles.tabBadge, { backgroundColor: '#8c2323' }]}>
                                        <Text style={styles.tabBadgeText}>{joinRequests.length}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8c2323" />
                                <Text style={styles.loadingText}>Loading...</Text>
                            </View>
                        ) : error ? (
                            <View style={styles.errorContainer}>
                                <FontAwesome name="exclamation-circle" size={32} color="#8c2323" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : (
                            <>
                                {activeTab === 'participants' && (
                                    <View style={styles.participantsContainer}>
                                        {Array.isArray(participants) && participants.length > 0 ? (
                                            <View style={styles.participantsList}>
                                                {participants.map((participant, index) =>
                                                    renderParticipantItem(participant, index)
                                                )}
                                            </View>
                                        ) : (
                                            <View style={styles.emptyState}>
                                                <FontAwesome name="users" size={48} color="#333" />
                                                <Text style={styles.emptyStateText}>No riders yet</Text>
                                                <Text style={styles.emptyStateSubtext}>
                                                    Be the first to join this ride
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {activeTab === 'requests' && (
                                    <FlatList
                                        data={joinRequests}
                                        renderItem={renderRequestItem}
                                        keyExtractor={(item) => `${item.username}-${item.requestDate}`}
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

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#0a0a0a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '85%',
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    modalSubtitle: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222',
    },
    tabActive: {
        backgroundColor: 'rgba(140, 35, 35, 0.1)',
        borderColor: '#8c2323',
    },
    tabText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#8c2323',
    },
    tabBadge: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    tabBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    participantsContainer: {
        flex: 1,
    },
    participantsList: {
        gap: 8,
    },
    participantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    participantNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#8c2323',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    participantNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    participantInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    participantName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    ownerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
    },
    ownerBadgeText: {
        color: '#fbbf24',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    requestCard: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#222',
    },
    requestCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    requestUserInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requestUsername: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    requestDate: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
    },
    acceptButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8c2323',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default ParticipantListModal;