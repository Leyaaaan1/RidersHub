import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { getJoinRequestsByOwner, acceptJoinRequest } from '../services/joinService';
import colors from "../styles/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinRequestsModal = ({ visible, onClose, rideId }) => {
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedRideId, setSelectedRideId] = useState(rideId);

    useEffect(() => {
        if (visible) {
            fetchJoinRequests();
        }
    }, [visible, rideId]);

    useEffect(() => {
        // Update selectedRideId when rideId prop changes
        if (rideId) {
            setSelectedRideId(rideId);
        }
    }, [rideId]);

    const fetchJoinRequests = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');

            // If no rideId is provided, we'll need to get the current ride ID
            // from the context or fetch it from the API
            if (!selectedRideId) {
                Alert.alert('Error', 'No ride selected');
                setLoading(false);
                return;
            }

            const requests = await getJoinRequestsByOwner(token, selectedRideId);
            setJoinRequests(requests);
        } catch (error) {
            console.error('Error fetching join requests:', error);
            Alert.alert('Error', 'Failed to load join requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (username) => {
        try {
            if (!selectedRideId) {
                Alert.alert('Error', 'No ride selected');
                return;
            }

            setProcessing(true);
            const token = await AsyncStorage.getItem('userToken');
            await acceptJoinRequest(token, selectedRideId, username);

            // Remove the accepted request from the list
            setJoinRequests(joinRequests.filter(req => req.username !== username));
            Alert.alert('Success', `${username} has been added to the ride`);
        } catch (error) {
            console.error('Error accepting join request:', error);
            Alert.alert('Error', 'Failed to accept join request');
        } finally {
            setProcessing(false);
        }
    };

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
                    <Text style={{ color: colors.white, fontSize: 18, marginBottom: 10 }}>Join Requests</Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : joinRequests.length > 0 ? (
                        <View style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 6, overflow: 'hidden' }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.10)', padding: 8 }}>
                                <Text style={{ flex: 0.6, color: '#fff', fontWeight: 'bold' }}>Username</Text>
                                <Text style={{ flex: 0.4, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Action</Text>
                            </View>
                            {joinRequests.map((request, index) => (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    padding: 8,
                                    alignItems: 'center',
                                    borderBottomWidth: index < joinRequests.length - 1 ? 1 : 0,
                                    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
                                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                }}>
                                    <Text style={{ flex: 0.6, color: '#fff' }}>{request.username}</Text>
                                    <View style={{ flex: 0.4, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={() => handleAccept(request.username)}
                                            disabled={processing}
                                            style={{
                                                backgroundColor: '#2a9d8f',
                                                paddingVertical: 6,
                                                paddingHorizontal: 12,
                                                borderRadius: 4
                                            }}
                                        >
                                            <Text style={{ color: '#fff' }}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: '#fff', textAlign: 'center' }}>No pending join requests</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default JoinRequestsModal;