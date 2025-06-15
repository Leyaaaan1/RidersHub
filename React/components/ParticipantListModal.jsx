import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { fetchMyRides } from '../services/rideService';
import { joinService } from '../services/joinService';
import colors from "../styles/colors";

const ParticipantListModal = ({ visible, onClose, participants, generatedRidesId, token, onRideSelect }) => {
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
        <View style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            marginBottom: 5,
            borderRadius: 4
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>{item.username}</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        borderRadius: 4
                    }}
                    onPress={() => handleAcceptRequest(item.username)}
                >
                    <Text style={{ color: '#fff', fontSize: 12 }}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{
                    backgroundColor: '#222',
                    borderRadius: 12,
                    padding: 20,
                    width: '90%',
                    maxHeight: '80%'
                }}>
                    <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                        <Text style={{ color: colors.white, fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>

                    {/* Tab Navigation */}
                    <View style={{ flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 8,
                                alignItems: 'center',
                                borderBottomWidth: 2,
                                borderBottomColor: activeTab === 'participants' ? colors.primary : 'transparent'
                            }}
                            onPress={() => setActiveTab('participants')}
                        >
                            <Text style={{ color: activeTab === 'participants' ? colors.primary : '#ddd', fontSize: 14 }}>Riders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 8,
                                alignItems: 'center',
                                borderBottomWidth: 2,
                                borderBottomColor: activeTab === 'requests' ? colors.primary : 'transparent'
                            }}
                            onPress={() => setActiveTab('requests')}
                        >
                            <Text style={{ color: activeTab === 'requests' ? colors.primary : '#ddd', fontSize: 14 }}>Joiners</Text>
                        </TouchableOpacity>

                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={{ padding: 20 }} />
                    ) : error ? (
                        <Text style={{ color: 'red', padding: 10, textAlign: 'center' }}>{error}</Text>
                    ) : (
                        <>
                            {activeTab === 'participants' && (
                                <View>
                                    {Array.isArray(participants) ? (
                                        <View style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden' }}>
                                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.10)', padding: 8 }}>
                                                <Text style={{ flex: 0.2, color: '#fff', fontWeight: 'bold', textAlign: 'left', paddingLeft: 5 }}>#</Text>
                                                <Text style={{ flex: 0.8, color: '#fff', fontWeight: 'bold', textAlign: 'left' }}>Username</Text>
                                            </View>
                                            {participants.map((participant, index) => (
                                                <View key={index} style={{
                                                    flexDirection: 'row',
                                                    padding: 8,
                                                    borderBottomWidth: index < participants.length - 1 ? 1 : 0,
                                                    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
                                                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                                }}>
                                                    <Text style={{ flex: 0.2, color: '#fff', textAlign: 'left', paddingLeft: 5 }}>{index + 1}</Text>
                                                    <Text style={{ flex: 0.8, color: '#fff', textAlign: 'left' }}>{typeof participant === 'object' ? participant.username : participant}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>No participants yet</Text>
                                    )}
                                </View>
                            )}

                            {activeTab === 'requests' && (
                                <FlatList
                                    data={joinRequests}
                                    renderItem={renderRequestItem}
                                    keyExtractor={(item) => `${item.username}-${item.requestDate}`}
                                    ListEmptyComponent={
                                        <Text style={{ color: '#ddd', textAlign: 'center', padding: 20 }}>No join requests yet</Text>
                                    }
                                    style={{ maxHeight: 300 }}
                                />
                            )}

                            {activeTab === 'rides' && (
                                <FlatList
                                    data={rides}
                                    renderItem={renderRideItem}
                                    keyExtractor={(item) => item.generatedRidesId.toString()}
                                    ListEmptyComponent={
                                        <Text style={{ color: '#ddd', textAlign: 'center', padding: 20 }}>You haven't created any rides yet</Text>
                                    }
                                    style={{ maxHeight: 300 }}
                                />
                            )}
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ParticipantListModal;