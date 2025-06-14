import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { joinService } from '../services/joinService';
import Icon from 'react-native-vector-icons/MaterialIcons';

const JoinRequestsModal = ({ visible, onClose, generatedRidesId, token }) => {
    const [joinRequests, setJoinRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && generatedRidesId) {
            loadJoinRequests();
        }
    }, [visible, generatedRidesId]);

    const loadJoinRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await joinService.getJoinRequestsByRideId(generatedRidesId, token);
            // Extract the requests array from the response
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
            // Refresh the list
            loadJoinRequests();
        } catch (err) {
            Alert.alert('Error', 'Failed to accept join request');
            console.error(err);
        }
    };

    const renderRequestItem = ({ item }) => (
        <View style={styles.requestItem}>
            <View style={styles.requestInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.requestDate}>
                    Requested: {new Date(item.requestDate).toLocaleString()}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptRequest(item.username)}
            >
                <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Icon name="inbox" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No join requests yet</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Join Requests</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={loadJoinRequests}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={joinRequests}
                        renderItem={renderRequestItem}
                        keyExtractor={(item) => `${item.username}-${item.requestDate}`}
                        ListEmptyComponent={loading ? null : renderEmpty}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#0066cc" />
                            </View>
                        ) : null}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    listContainer: {
        padding: 15,
        flexGrow: 1,
    },
    requestItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    requestInfo: {
        flex: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    requestDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    acceptButton: {
        backgroundColor: '#0066cc',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#0066cc',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
});

export default JoinRequestsModal;