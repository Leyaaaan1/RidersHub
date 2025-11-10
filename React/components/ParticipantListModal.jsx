import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { fetchMyRides } from '../services/rideService';
import { joinService } from '../services/joinService';
import { styles } from '../styles/ParticipantListModalStyles';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ParticipantListModal = ({ visible, onClose, participants, generatedRidesId, token, username, currentUsername }) => {
    const [rides, setRides] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('participants');

    console.log('Current Username:', participants, generatedRidesId, token, username, currentUsername);
    console.log('Current participants:', participants);

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
    console.log('Generated Rides ID:', rides);

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

    const renderParticipantItem = ({ item, index }) => {
        const participantName = typeof item === 'object' ? item.username : item;
        const isOwner = participantName === username;

        return (
            <View style={styles.participantCard}>
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
                                            Be the first to join this ride
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {activeTab === 'requests' && (
                            <>
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

export default ParticipantListModal;